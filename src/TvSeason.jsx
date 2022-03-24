import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Movie.css';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function TVSeason() {
  const { id, season_number } = useParams();
  const [season, setSeason] = useState({});

  useEffect(async () => {
    async function get() {
      const details = await axios.get(
        `${BASE_URL}/tv/${id}/season/${season_number}`,
        {
          params: {
            api_key: API_KEY,
          },
        }
      );

      setSeason(details.data);
    }

    get();
  }, []);

  return (
    <div
      className="pb-5"
      style={{
        backgroundImage: `linear-gradient(rgba(31.5, 10.5, 10.5, 0.84), rgba(31.5, 10.5, 10.5, 0.84)),url(${`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${tv.backdrop_path}`})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right top',
        minHeight: '100vh',
      }}
    >
      <div className="container pt-5">
        <div className="movie">
          <img
            src={`https://image.tmdb.org/t/p/w342${season.poster_path}`}
            className="img-thumbnail"
          />
          <div className="details">
            <h3>{season.name}</h3>
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
          </div>
        </div>
        <div className="mt-5">
          <h4 className="mt-5">Seasons</h4>

          {tv.seasons.map((season) => {
            return (
              <div className="movie mb-3">
                <img
                  src={`https://image.tmdb.org/t/p/w154${season.poster_path}`}
                  className="img-thumbnail"
                />
                <div className="details">
                  <h3>{season.name}</h3>
                  <p>Season: {season.season_number}</p>
                  <p>{season.overview}</p>
                  <p>Aired on: {season.air_date}</p>
                  <p>Episodes: {season.episode_count}</p>
                  <button>View More</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
