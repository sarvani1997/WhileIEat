import { useState, useEffect } from 'react';

export default function Watchlist({ watchlist, movies, tv, onDelete }) {
  const [type, setType] = useState('movie');

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
      </ul>
    </div>
  );
}
