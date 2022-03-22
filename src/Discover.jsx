import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import './App.css';
import Pagination from './components/Pagination';
import Filters from './components/Filters';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function Discover() {
  const [select, setSelect] = useState('movie');
  const [lists, setLists] = useState([]);
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

  useEffect(async () => {
    async function get() {
      try {
        const response = await axios.get(`${BASE_URL}/discover/${select}`, {
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
        setLists(response.data.results);
        setPages(response.data.total_pages);
      } catch (error) {
        console.error(error);
      }
    }
    get();
  }, [page, filters, select]);

  useEffect(async () => {
    async function get() {
      try {
        const response = await axios.get(`${BASE_URL}/search/${select}`, {
          params: {
            api_key: API_KEY,
            query: searchValue,
            page: searchPage,
          },
        });
        setSearchResults(response.data.results);
        setSearchPages(response.data.total_pages);
        if (search == true) {
          setLists(response.data.results);
        }
      } catch (error) {
        console.error(error);
      }
    }
    get();
  }, [searchPage, searchValue, select]);

  const open = () => {
    setShowDialog(true);
    setPage(1);
  };
  const close = () => setShowDialog(false);

  const onSearch = (e) => {
    e.preventDefault();
    setSearch(true);
    setLists(searchResults);
  };

  const reset = () => {
    setFilters({ language: '', genre: '', watchProvider: '' });
    setPage(1);
    setSearch(false);
    setSearchPage(1);
    setSearchValue('');
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
      <div className="row g-3">
        <button
          type="button"
          className="btn btn-secondary m-3 col-auto"
          onClick={open}
        >
          + Add Filters
        </button>
        <button
          type="button"
          className="btn btn-secondary m-3 col-auto"
          onClick={reset}
        >
          RESET
        </button>
        <div className="col-auto">
          <select
            className="form-select "
            aria-label="Default select example"
            value={select}
            onChange={(e) => setSelect(e.target.value)}
          >
            <option disabled value="">
              Select
            </option>

            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>
      </div>

      <Dialog aria-label="dialog" isOpen={showDialog} onDismiss={close}>
        <Filters
          close={close}
          filters={filters}
          setFilters={setFilters}
          select={select}
        />
      </Dialog>

      <Pagination
        search={search}
        pages={pages}
        searchPages={searchPages}
        searchPage={searchPage}
        setSearchPage={setSearchPage}
        page={page}
        setPage={setPage}
      />

      <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
        {lists.map((list, i) => {
          return (
            <div key={i} className="col">
              <button className="thumbnail">
                <img
                  src={`https://image.tmdb.org/t/p/w300${list.poster_path}`}
                  className="img-thumbnail"
                />
                <h5>{select === 'movie' ? list.title : list.name}</h5>
              </button>
            </div>
          );
        })}
      </div>
      <Pagination
        search={search}
        pages={pages}
        searchPages={searchPages}
        searchPage={searchPage}
        setSearchPage={setSearchPage}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}
