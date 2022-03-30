import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserDialog from './components/UserDialog';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import './Movie.css';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState({});
  const [providers, setProviders] = useState({});
  const [showDialog, setShowDialog] = useState(false);

  useEffect(async () => {
    async function get() {
      const details = await axios.get(`${BASE_URL}/movie/${id}`, {
        params: {
          api_key: API_KEY,
        },
      });
      const providers = await axios.get(
        `${BASE_URL}/movie/${id}/watch/providers`,
        {
          params: {
            api_key: API_KEY,
          },
        }
      );
      setMovie(details.data);
      setProviders(providers.data);
    }

    get();
  }, []);

  const onOpen = () => {
    setShowDialog(true);
  };
  const onClose = () => setShowDialog(false);

  if (movie.genres === undefined) {
    return null;
  }

  let genres = '';
  movie.genres.forEach((g) => {
    genres = genres + g.name + ',' + ' ';
    return genres;
  });

  if (providers.results === undefined) {
    return null;
  }

  return (
    <div
      className="pb-5"
      style={{
        backgroundImage: `linear-gradient(rgba(31.5, 10.5, 10.5, 0.84), rgba(31.5, 10.5, 10.5, 0.84)),url(${`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop_path}`})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right top',
        minHeight: '100vh',
      }}
    >
      <div className="container pt-5">
        <div className="movie">
          <img
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            className="img-thumbnail"
          />
          <div className="details">
            <h3>
              {movie.title}({movie.original_language})
            </h3>
            <p>{movie.tagline}</p>
            <h6>Overview</h6>
            <p>{movie.overview}</p>
            <h6>Genre</h6>
            <p>{genres}</p>
            <h6>Runtime</h6>
            <p>{movie.runtime} min</p>
            <h6>Providers</h6>
            <div>
              {providers.results.IN === undefined ||
              providers.results.IN.flatrate === undefined ? (
                <p>-</p>
              ) : (
                providers.results.IN.flatrate.map((p) => {
                  return (
                    <a key={p.provider_id}>
                      <img
                        className="m-2"
                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                      />
                    </a>
                  );
                })
              )}
            </div>
            <button
              type="button"
              className="btn btn-danger m-2"
              onClick={onOpen}
            >
              Add to Watchlist
            </button>
            <button type="button" className="btn btn-danger m-2">
              Add to Calender
            </button>
            <Dialog aria-label="dialog" isOpen={showDialog} onDismiss={onClose}>
              <UserDialog
                type="movie"
                id={id}
                showName={movie.title}
                imagePath={movie.poster_path}
                onClose={onClose}
              />
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
