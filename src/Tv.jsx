import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import WatchlistDialog from './components/WatchlistDialog';
import CalenderDialog from './components/CalenderDialog';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import './Movie.css';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function Tv() {
  const { id } = useParams();
  const [tv, setTv] = useState({});
  const [providers, setProviders] = useState({});
  const [showWatchlistDialog, setShowWatchlistDialog] = useState(false);
  const [showCalenderDialog, setCalenderDialog] = useState(false);

  useEffect(async () => {
    async function get() {
      const details = await axios.get(`${BASE_URL}/tv/${id}`, {
        params: {
          api_key: API_KEY,
        },
      });
      const providers = await axios.get(
        `${BASE_URL}/tv/${id}/watch/providers`,
        {
          params: {
            api_key: API_KEY,
          },
        }
      );
      setTv(details.data);
      setProviders(providers.data);
    }

    get();
  }, []);

  const onOpenWatchlist = () => {
    setShowWatchlistDialog(true);
  };
  const onCloseWatchlist = () => setShowWatchlistDialog(false);
  const onOpenCalender = () => {
    setCalenderDialog(true);
  };
  const onCloseCalender = () => setCalenderDialog(false);

  if (tv.genres === undefined) {
    return null;
  }

  let genres = '';
  tv.genres.forEach((g) => {
    genres = genres + g.name + ',' + ' ';
    return genres;
  });

  console.log(providers.results);
  if (providers.results === undefined) {
    return null;
  }

  return (
    <div
      className="pb-5 background"
      style={{
        backgroundImage: `linear-gradient(rgba(31.5, 10.5, 10.5, 0.84), rgba(31.5, 10.5, 10.5, 0.84)),url(${`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${tv.backdrop_path}`})`,
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="container pt-5">
        <div className="movie">
          <img
            src={`https://image.tmdb.org/t/p/w342${tv.poster_path}`}
            className="img-thumbnail"
          />
          <div className="details">
            <h3>
              {tv.name}({tv.original_language})
            </h3>
            <p>{tv.tagline}</p>
            <h6>Overview</h6>
            <p>{tv.overview}</p>
            <h6>Genre</h6>
            <p>{genres}</p>
            <h6>Seasons</h6>
            <p>{tv.number_of_seasons} seasons</p>
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
              onClick={onOpenWatchlist}
            >
              Add to Watchlist
            </button>
            <button
              type="button"
              className="btn btn-danger m-2"
              onClick={onOpenCalender}
            >
              Add to Calender
            </button>
            <Dialog
              aria-label="dialog"
              isOpen={showWatchlistDialog}
              onDismiss={onCloseWatchlist}
            >
              <WatchlistDialog
                type="tv"
                id={id}
                showName={tv.name}
                imagePath={tv.poster_path}
                onCloseWatchlist={onCloseWatchlist}
              />
            </Dialog>
            <Dialog
              aria-label="dialog"
              isOpen={showCalenderDialog}
              onDismiss={onCloseCalender}
            >
              <CalenderDialog
                type="tv"
                id={id}
                showName={tv.name}
                imagePath={tv.poster_path}
                onCloseCalender={onCloseCalender}
              />
            </Dialog>
          </div>
        </div>
        <div className="seasons">
          <h4>Seasons</h4>

          {tv.seasons.map((season) => {
            return (
              <div key={season.id} className="movie mb-3">
                <img
                  src={`https://image.tmdb.org/t/p/w185${season.poster_path}`}
                  className="img-thumbnail"
                />
                <div className="details">
                  <h3>{season.name}</h3>
                  <p>Season: {season.season_number}</p>
                  <p>{season.overview.slice(0, 350) + '...'}</p>
                  <p>Aired on: {season.air_date}</p>
                  <p>Episodes: {season.episode_count}</p>
                  <a
                    className="btn btn-outline-light"
                    href={`/tv/${tv.id}/season/${season.season_number}`}
                  >
                    View More
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
