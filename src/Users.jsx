import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Watchlist from './Watchlist';
import UserSettings from './UserSettings';
import Calender from './Calender';
import { DateTime } from 'luxon';

const BASE_URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const SERVER_URL = import.meta.env.VITE_SERVER;

export default function Users() {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [tab, setTab] = useState('Watchlist');
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

  useEffect(async () => {
    async function get() {
      const res = await axios.get(`${SERVER_URL}/users/${userId}`);
      setUser(res.data);
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
      <nav className="navbar navbar-expand-lg mt-3  ">
        <div className="container-fluid">
          <div>Hello {user.name} !</div>
          <ul className="nav justify-content-end">
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-danger m-1"
                onClick={() => setTab('Watchlist')}
              >
                Watchlist
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-danger m-1"
                onClick={() => setTab('Calender')}
              >
                Calender
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-danger m-1"
                onClick={() => setTab('Settings')}
              >
                Settings
              </button>
            </li>
          </ul>
        </div>
      </nav>
      {tab === 'Watchlist' && (
        <Watchlist
          user={user}
          watchlist={watchlist}
          movies={movies}
          tv={tv}
          onDelete={onDelete}
        />
      )}
      {tab === 'Settings' && <UserSettings user={user} />}
      {tab === 'Calender' && (
        <Calender user={user} watchlist={watchlist} onDelete={onDelete} />
      )}
    </div>
  );
}
