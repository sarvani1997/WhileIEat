import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Watchlist from './Watchlist';

const SERVER_URL = import.meta.env.VITE_SERVER;

export default function Users() {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [tab, setTab] = useState('Watchlist');

  useEffect(async () => {
    async function get() {
      const res = await axios.get(`${SERVER_URL}/users/${userId}`);
      setUser(res.data);
    }
    get();
  }, []);

  console.log(tab);

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
                onClick={() => setTab('EditProfile')}
              >
                Edit Profile
              </button>
            </li>
          </ul>
        </div>
      </nav>
      {tab === 'Watchlist' && <Watchlist user={user} />}
    </div>
  );
}
