import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const SERVER_URL = import.meta.env.VITE_SERVER;

export default function Watchlist({ user }) {
  const { userId } = useParams();
  const [type, setType] = useState('movie');
  const [watchlist, setWatchlist] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tv, setTv] = useState([]);

  useEffect(async () => {
    async function get() {
      const res = await axios.get(`${SERVER_URL}/watchlist/user/${userId}`);
      setWatchlist(res.data);
      res.data.sort((a, b) => {
        if (a.date !== null && b.date !== null) {
          if (
            DateTime.fromFormat(a.date, 'yyyy-MM-dd') >
            DateTime.fromFormat(b.date, 'yyyy-MM-dd')
          ) {
            return 1;
          } else {
            return -1;
          }
        } else if (a.date === null && b.date !== null) {
          return 1;
        } else {
          return -1;
        }
      });
      let movies = res.data.filter((show) => show.type === 'movie');

      setMovies(movies);
      const tv_shows = res.data.filter((show) => show.type === 'tv');
      setTv(tv_shows);
    }
    get();
  }, []);

  const onDelete = async (watchlistId) => {
    const res = await axios.delete(`${SERVER_URL}/watchlist/${watchlistId}`);
    if (res.status === 204) {
      const res = await axios.get(`${SERVER_URL}/watchlist/user/${userId}`);
      setWatchlist(res.data);
      const movies = res.data.filter((show) => show.type === 'movie');
      setMovies(movies);
      const tv_shows = res.data.filter((show) => show.type === 'tv');
      setTv(tv_shows);
    }
  };

  return (
    <div className="container">
      <div>
        <select
          className="form-select "
          aria-label="Default select example"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option disabled value="">
            Select
          </option>

          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
      </div>
      <ul className="list-group mt-3">
        {type === 'movie' &&
          movies.map((movie) => {
            return (
              <li key={movie.id} className="list-group-item">
                <div style={{ display: 'flex' }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.imagePath}`}
                    className="img-thumbnail"
                  />
                  <div style={{ paddingLeft: '15px' }}>
                    <h5>{movie.showName}</h5>
                    <p>
                      {movie.date === null
                        ? 'Not yet scheduled'
                        : `Date: ${movie.date}`}
                    </p>
                    <a
                      className="btn btn-dark btn-sm"
                      href={`/movie/${movie.showId}`}
                    >
                      View More
                    </a>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ marginLeft: '5px' }}
                      onClick={() => onDelete(movie.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        {type === 'tv' &&
          tv.map((movie) => {
            return (
              <li key={movie.id} className="list-group-item">
                <div style={{ display: 'flex' }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.imagePath}`}
                    className="img-thumbnail"
                  />
                  <div style={{ paddingLeft: '15px' }}>
                    <h5>{movie.showName}</h5>
                    <p>
                      {movie.date === null
                        ? 'Not yet scheduled'
                        : `Date: ${movie.date}`}
                    </p>
                    <a
                      className="btn btn-dark btn-sm"
                      href={`/tv/${movie.showId}`}
                    >
                      View More
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
