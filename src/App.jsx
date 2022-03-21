import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import './App.css';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function Filters({ close, filters, setFilters }) {
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
  const [filters, setFilters] = useState({
    language: '',
    genre: '',
    watchProvider: '',
  });
  const [showDialog, setShowDialog] = useState(false);

  const open = () => setShowDialog(true);
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
      } catch (error) {
        console.error(error);
      }
    }
    get();
  }, [page, filters]);

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search" />
      </div>
      <button type="button" className="btn btn-secondary mb-3" onClick={open}>
        + Add Filters
      </button>

      <Dialog aria-label="dialog" isOpen={showDialog} onDismiss={close}>
        <Filters close={close} filters={filters} setFilters={setFilters} />
      </Dialog>

      <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
        {movies.map((movie, i) => {
          return (
            <div key={i} className="col">
              <button className="thumbnail">
                <img
                  src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                  className="img-thumbnail"
                  alt="..."
                />
                <p>{movie.title}</p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
