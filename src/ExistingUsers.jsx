import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './existingUsers.css';

const SERVER_URL = import.meta.env.VITE_SERVER;

export default function ExistingUsers() {
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    async function get() {
      const res = await axios.get(`${SERVER_URL}/users`);
      setUsers(res.data);
    }
    get();
  }, []);

  return (
    <div className="container card">
      <div className="header">
        <h2>Users List</h2>
        <Link role="button" className="btn btn-primary mb-3" to={`/signup`}>
          Sign up
        </Link>
      </div>
      <ul className="list-group">
        {users.map((user) => {
          return (
            <li className="list-group-item">
              <h5>
                <Link className="link">{user.name}</Link>
              </h5>
              <p>Phone: {user.phonenumber}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
