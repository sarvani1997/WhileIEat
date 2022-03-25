import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function Tvseasons() {
  const { id, season_number } = useParams();
  const [season, setSeason] = useState({});

  useEffect(async () => {
    async function get() {
      const res = await axios.get(
        `${BASE_URL}/tv/${id}/season/${season_number}`,
        {
          params: {
            api_key: API_KEY,
          },
        }
      );
      setSeason(res.data);
    }

    get();
  }, []);

  if (season.episodes === undefined) {
    return null;
  }

  return (
    <div
      className="pb-5"
      style={{
        background:
          'linear-gradient(rgba(31.5, 10.5, 10.5, 0.84), rgba(31.5, 10.5, 10.5, 0.84))',
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
            <p>{season.overview}</p>
            <h6>Air Date</h6>
            <p>{season.air_date}</p>

            <h6>Episodes</h6>
            <p>{season.episodes.length} Episodes</p>
          </div>
        </div>
        <div className="seasons">
          <h4>Episodes</h4>

          {season.episodes.map((episode) => {
            return (
              <div key={episode.id} className="movie mb-3">
                <img
                  src={`https://image.tmdb.org/t/p/w154${season.poster_path}`}
                  className="img-thumbnail"
                />
                <div className="details">
                  <h3>{episode.name}</h3>
                  <p>Episode: {episode.episode_number}</p>
                  <p>{episode.overview.slice(0, 350) + '...'}</p>
                  <p>Aired on: {episode.air_date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
