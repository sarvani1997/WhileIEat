import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function DiscoverMovies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(2);
  const [laguages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [language, setLanguage] = useState('te');
  const [genre, setGenre] = useState('');
  const [watchProvider, setWatchProvider] = useState('');

  useEffect(async () => {
    async function getLanguages() {
      try {
        const laguages = await axios.get(
          `${BASE_URL}/configuration/languages?api_key=${API_KEY}`
        );
        setLanguages(laguages.data);
      } catch (error) {
        console.error(error);
      }
    }
    async function getGenres() {
      try {
        const genres = await axios.get(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
        );
        setGenres(genres.data);
      } catch (error) {
        console.error(error);
      }
    }
    async function getWatchProviders() {
      try {
        const watchProviders = await axios.get(
          `${BASE_URL}/watch/providers/movie?api_key=${API_KEY}`
        );
        setWatchProviders(watchProviders.data);
      } catch (error) {
        console.error(error);
      }
    }
    getLanguages();
    getGenres();
    getWatchProviders();
  }, []);

  useEffect(async () => {
    async function get() {
      try {
        const response = await axios.get(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&with_original_language=${language}&with_genres=${genre}&with_watch_providers=${watchProvider}&sort_by=popularity.desc&watch_region=IN&with_watch_monetization_types=flatrate`
        );
        setMovies(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    get();
  }, [page, language, genre, watchProvider]);

  return <div>data</div>;
}

export default DiscoverMovies;
