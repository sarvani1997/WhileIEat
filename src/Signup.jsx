import { useState, useEffect } from 'react';
import axios from 'axios';
import './signup.css';
import { Link, useHistory } from 'react-router-dom';

const SERVER_URL = import.meta.env.VITE_SERVER;

export default function Signup() {
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  let history = useHistory();

  const createUser = async () => {
    const res = await axios.post(`${SERVER_URL}/users`, {
      name,
      phonenumber,
    });
    history.push('/existingUsers');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createUser();
  };

  return (
    <div className="container mt-5">
      <div className="header">
        <h2>Sign Up</h2>
        <Link to={`/existingUsers`} className="btn btn-primary mb-3">
          Existing Users
        </Link>
      </div>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label for="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label for="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            value={phonenumber}
            onChange={(e) => setPhonenumber(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
