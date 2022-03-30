import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER;

export default function UserSettings({ user }) {
  const history = useHistory();
  const [name, setName] = useState(user.name);
  const [phonenumber, setPhonenumber] = useState(user.phonenumber);

  const update = async () => {
    const res = await axios.put(`${SERVER_URL}/users/${user.id}`, {
      name,
      phonenumber,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    update();
  };

  const onDelete = async () => {
    const res = await axios.delete(`${SERVER_URL}/users/${user.id}`);
    history.push('/existingUsers');
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Phone Number"
            value={phonenumber}
            onChange={(e) => setPhonenumber(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary m-2">
          Update
        </button>
        <button type="button" onClick={onDelete} className="btn btn-danger m-2">
          Delete Account
        </button>
      </form>
    </div>
  );
}
