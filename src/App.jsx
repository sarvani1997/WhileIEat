import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function DiscoverMovies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(2);

  useEffect(async () => {
    async function get() {
      try {
        const response = await axios.get(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}&watch_region=IN&with_watch_monetization_types=flatrate`
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    get();
  }, [page]);

  return <div>data</div>;
}

export default DiscoverMovies;
