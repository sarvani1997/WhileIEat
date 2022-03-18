import { useState, useEffect } from 'react';
import axios from 'axios';

function DiscoverMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(async () => {
    async function get() {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/discover/movie?api_key=&sort_by=popularity.desc&page=1&with_watch_monetization_types=flatrate'
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    get();
  }, []);

  return <div></div>;
}

export default DiscoverMovies;
