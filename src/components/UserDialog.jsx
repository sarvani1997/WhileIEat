import { useState, useEffect } from 'react';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER;

export default function UserDialog({ type, id, showName, imagePath }) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('1');

  useEffect(async () => {
    async function get() {
      const res = await axios.get(`${SERVER_URL}/users`);
      setUsers(res.data);
    }
    get();
  }, []);

  const createWatchlist = async () => {
    const res = await axios.post(`${SERVER_URL}/watchlist`, {
      userId,
      type,
      showId: id,
      showName,
      imagePath,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createWatchlist();
  };
  return (
    <form style={{ color: 'black' }} onSubmit={onSubmit}>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Select User
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          {users.map((user) => {
            return (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            );
          })}
        </select>
        <button type="submit" className="btn btn-danger mt-3">
          Add to Watchlist
        </button>
      </div>
    </form>
  );
}
