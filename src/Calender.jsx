import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import _ from 'lodash';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

export default function Calender({ watchlist, onDelete }) {
  const [date, setDate] = useState(new Date());

  let monthFirstDate = DateTime.fromJSDate(date).startOf('month');
  let monthLastDate = DateTime.fromJSDate(date).endOf('month');
  let monthDates = [];

  for (let i = monthFirstDate; i <= monthLastDate; i = i.plus({ days: 1 })) {
    monthDates = monthDates.concat([i]);
  }

  const scheduledShows = watchlist.filter(
    (list) =>
      list.date !== null &&
      DateTime.fromFormat(list.date, 'yyyy-MM-dd') >= monthFirstDate &&
      DateTime.fromFormat(list.date, 'yyyy-MM-dd') <= monthLastDate
  );

  return (
    <div className="container">
      <div>
        <DatePicker
          selected={date}
          className="form-select "
          onChange={(date) => setDate(date)}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          showFullMonthYearPicker
          showTwoColumnMonthYearPicker
        />
      </div>
      <ul className="list-group mt-3">
        {scheduledShows[0] === undefined ? (
          <div>No Movies Scheduled for this month</div>
        ) : (
          monthDates.map((day, i) => {
            let show = scheduledShows.find(
              (show) =>
                DateTime.fromFormat(show.date, 'yyyy-MM-dd').day === day.day
            );
            return (
              <li key={i} className="list-group-item">
                <div className="row">
                  <div className="col-2">
                    <div>{day.toFormat('MMMM')}</div>
                    <h3>{day.day}</h3>
                  </div>
                  <div className="col-6">
                    {show === undefined ? (
                      <div>Not Scheduled</div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex' }}>
                          <img
                            src={`https://image.tmdb.org/t/p/w92${show.imagePath}`}
                            className="img-thumbnail"
                          />
                          <div style={{ paddingLeft: '15px' }}>
                            <h5>{show.showName}</h5>

                            <a
                              className="btn btn-dark btn-sm mb-1"
                              href={`/movie/${show.showId}`}
                              style={{ marginRight: '5px' }}
                            >
                              More
                            </a>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => onDelete(show.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
