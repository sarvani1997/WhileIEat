import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function Filters({ close, filters, setFilters, select }) {
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
          `${BASE_URL}/genre/${select}/list?api_key=${API_KEY}`
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
  }, [select]);

  return (
    <div style={{ color: 'black' }}>
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
    </div>
  );
}
