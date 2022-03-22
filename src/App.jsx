import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import './App.css';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function Filters({ close, filters, setFilters, setPage }) {
  const [laguages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);

  useEffect(async () => {
    async function get() {
      try {
        const laguages = await axios.get(
          `${BASE_URL}/configuration/languages?api_key=${API_KEY}`
        );
        const genres = await axios.get(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
        );
        const watchProviders = await axios.get(
          `${BASE_URL}/watch/providers/movie?api_key=${API_KEY}`
        );
        setLanguages(laguages.data);
        setGenres(genres.data.genres);
        setWatchProviders(watchProviders.data.results);
      } catch (error) {
        console.error(error);
      }
    }

    get();
  }, []);

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Language
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
        >
          <option value="">None</option>
          {laguages.map((lag) => {
            return (
              <option key={lag.iso_639_1} value={lag.iso_639_1}>
                {lag.english_name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Genre
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
        >
          <option value="">None</option>
          {genres.map((g) => {
            return (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Watch Provider
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          value={filters.watchProvider}
          onChange={(e) =>
            setFilters({ ...filters, watchProvider: e.target.value })
          }
        >
          <option value="">None</option>
          {watchProviders.map((w) => {
            return (
              <option key={w.provider_id} value={w.provider_id}>
                {w.provider_name}
              </option>
            );
          })}
        </select>
      </div>
      <button
        className="btn btn-primary m-2"
        onClick={() =>
          setFilters({ language: '', genre: '', watchProvider: '' })
        }
      >
        Reset
      </button>
      <button className="btn btn-danger m-2" onClick={close}>
        Save/Close
      </button>
    </form>
  );
}

export default function DiscoverMovies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState();
  const [searchPages, setSearchPages] = useState();
  const [searchPage, setSearchPage] = useState(1);
  const [search, setSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    language: '',
    genre: '',
    watchProvider: '',
  });
  const [showDialog, setShowDialog] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const open = () => {
    setShowDialog(true);
    setPage(1);
  };
  const close = () => setShowDialog(false);

  useEffect(async () => {
    async function get() {
      try {
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
          params: {
            api_key: API_KEY,
            page: page,
            with_original_language: filters.language,
            with_genres: filters.genre,
            with_watch_providers: filters.watchProvider,
            sort_by: 'popularity.desc',
            watch_region: 'IN',
            with_watch_monetization_types: 'flatrate',
          },
        });
        setMovies(response.data.results);
        setPages(response.data.total_pages);
      } catch (error) {
        console.error(error);
      }
    }
    get();
  }, [page, filters]);

  useEffect(async () => {
    async function get() {
      try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
          params: {
            api_key: API_KEY,
            query: searchValue,
            page: searchPage,
          },
        });
        setSearchResults(response.data.results);
        setSearchPages(response.data.total_pages);
        if (search == true) {
          setMovies(response.data.results);
        }
      } catch (error) {
        console.error(error);
      }
    }
    get();
  }, [searchPage, searchValue]);

  const onNextPage = async () => {
    window.scrollTo(0, 0);
    if (search == false) {
      if (page < pages) {
        setPage(page + 1);
      }
    } else {
      if (searchPage < searchPages) {
        setSearchPage(searchPage + 1);
      }
    }
  };

  const onPrevPage = async () => {
    window.scrollTo(0, 0);
    if (search === false) {
      if (page > 1) {
        setPage(page - 1);
      }
    } else {
      if (searchPage < 1) {
        setSearchPage(searchPage - 1);
      }
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    setSearch(true);
    setMovies(searchResults);
  };

  const reset = () => {
    setFilters({ language: '', genre: '', watchProvider: '' });
    setPage(1);
    setSearch(false);
    setSearchPage(1);
  };

  return (
    <div className="container mt-5">
      <form className="row g-3" onSubmit={onSearch}>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary mb-3">
            Search
          </button>
        </div>
      </form>
      <button type="button" className="btn btn-secondary m-3" onClick={open}>
        + Add Filters
      </button>
      <button type="button" className="btn btn-secondary m-3" onClick={reset}>
        RESET
      </button>

      <Dialog aria-label="dialog" isOpen={showDialog} onDismiss={close}>
        <Filters close={close} filters={filters} setFilters={setFilters} />
      </Dialog>

      <div className="d-flex justify-content-between mb-5 mt-5">
        <button
          onClick={onPrevPage}
          className="btn btn-outline-secondary btn-sm"
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <span>Page: {search === false ? page : searchPage}</span>
        <button
          onClick={onNextPage}
          className="btn btn-outline-secondary btn-sm "
          type="button"
        >
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>

      <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
        {movies.map((movie, i) => {
          return (
            <div key={i} className="col">
              <button className="thumbnail">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  className="img-thumbnail"
                  alt="..."
                />
                <h5>{movie.title}</h5>
              </button>
            </div>
          );
        })}
      </div>
      <div className="d-flex justify-content-between mb-5 mt-5">
        <button
          onClick={onPrevPage}
          className="btn btn-outline-secondary btn-sm"
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <span>Page: {search === false ? page : searchPage}</span>
        <button
          onClick={onNextPage}
          className="btn btn-outline-secondary btn-sm "
          type="button"
        >
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
