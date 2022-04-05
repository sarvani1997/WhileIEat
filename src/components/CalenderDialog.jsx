import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import _ from 'lodash';
import './CalenderDialog.css';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER;

export default function Calender({
  type,
  id,
  showName,
  imagePath,
  onCloseCalender,
}) {
  const [date, setDate] = useState(DateTime.now());
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [dateSelected, setDateSelected] = useState(DateTime.now());
  const [list, setList] = useState([]);

  useEffect(async () => {
    async function get() {
      const res = await axios.get(`${SERVER_URL}/users`);
      setUsers(res.data);
      setUserId(res.data[0].id);
    }
    get();
  }, []);

  useEffect(async () => {
    async function get() {
      const res = await axios.get(`${SERVER_URL}/watchlist/user/${userId}`);
      setList(res.data);
    }
    get();
  }, [userId]);

  let isToday = (day) => {
    if (day.day === DateTime.now().day && day.month === DateTime.now().month) {
      return true;
    } else {
      return false;
    }
  };

  let monthFirstDate = date.startOf('month');
  let monthLastDate = date.endOf('month');
  let monthDates = [];

  for (let i = monthFirstDate; i <= monthLastDate; i = i.plus({ days: 1 })) {
    monthDates = monthDates.concat([i]);
  }

  let weekNumbers = _.groupBy(monthDates, 'weekNumber');

  let month = Object.values(weekNumbers);
  month = _.sortBy(month, (d) => d[0].day); // Here groupby groups days according to weeknumber. This cause an
  // error in jan and dec months as last weeknumber in dec extends to
  // jan (next year). So we use sortby to sort 1st date in a week in
  // ascending order.

  let weekDays = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

  function onClickNext() {
    let nextMonthDate = date.plus({ months: 1 });
    setDate(nextMonthDate);
  }

  function onClickToday() {
    setDate(DateTime.now());
  }

  function onClickPrev() {
    let prevMonthDate = date.plus({ months: -1 });
    setDate(prevMonthDate);
  }

  const createCalender = async () => {
    const res = await axios.put(`${SERVER_URL}/watchlist/${id}`, {
      userId,
      type,
      showId: id,
      showName,
      imagePath,
      date: dateSelected.toISO(),
    });
  };

  const onSubmit = (e) => {
    createCalender();
    onCloseCalender();
  };

  return (
    <div className="container body">
      <div className="calender">
        <h2>Watch Calender</h2>
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
        </div>
        <div className="calender-header mt-5">
          <h5>{date.toFormat('MMMM yyyy')}</h5>
          <div>
            <button
              type="button"
              className="btn btn-dark btn-sm m-1"
              onClick={onClickPrev}
            >
              Prev
            </button>
            <button
              type="button"
              className="btn btn-dark btn-sm m-1"
              onClick={onClickNext}
            >
              Next
            </button>
          </div>
        </div>
        <div className="week_days">
          {weekDays.map((weekDay) => {
            return (
              <div key={weekDay} className="weekDay">
                {weekDay}
              </div>
            );
          })}
        </div>
        <div>
          {month.map((week, i) => {
            let alignment = i === 0 ? 'flex-end' : 'flex-start';

            return (
              <div
                key={i}
                className="day"
                style={{ justifyContent: alignment }}
              >
                {week.map((day) => {
                  const selected = () => {
                    setDateSelected(day);
                  };
                  let bookedDates = list.filter((l) => l.date !== null);
                  let color = bookedDates.find(
                    (date) => date.date === day.toFormat('yyyy-MM-dd')
                  )
                    ? 'red-color'
                    : 'green-color';
                  return (
                    <button
                      key={day.day}
                      type="button"
                      onClick={selected}
                      className={`dateButton ${
                        day.day === dateSelected.day ? 'blue-color' : color
                      }`}
                    >
                      {day.day}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div>
          <div className="row mt-5">
            <div className="available col-1"></div>
            <div className="col">Available</div>
          </div>
          <div className="row mt-3">
            <div className="selected col-1"></div>
            <div className="col">Selected</div>
          </div>
          <div className="row mt-3">
            <div className="booked col-1"></div>
            <div className="col">Booked</div>
            <button
              type="button"
              onClick={onSubmit}
              className="btn btn-danger mt-3"
            >
              Add to Calender
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
