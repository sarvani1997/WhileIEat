import { useState, useEffect } from 'react';
import axios from 'axios';
import './signup.css';

const SERVER_URL = import.meta.env.VITE_SERVER;

export default function Signup() {
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');

  const createUser = async () => {
    const res = await axios.post(`${SERVER_URL}/users`, {
      name,
      phonenumber,
    });
  };

  const onSubmit = (e) => {
    console.log('submit');
    e.preventDefault();
    createUser();
    console.log('submitted');
  };

  return (
    <div className="container card">
      <h2>Sign Up</h2>
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
