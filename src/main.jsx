import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Discover from './Discover';
import Movie from './Movie';
import Tv from './Tv';
import TvSeason from './TvSeason';
import Signup from './Signup';
import ExistingUsers from './ExistingUsers';
import Users from './Users';

const navTabs = [
  {
    tab: Discover,
    link: '/',
    name: 'Movies/TV Shows',
  },
  {
    tab: ExistingUsers,
    link: '/existingUsers',
    name: 'Existing Users',
  },
  {
    tab: Signup,
    link: '/signup',
    name: 'Sign Up',
  },
];

const hiddenRoutes = [
  { tab: Movie, link: '/movie/:id' },
  { tab: Tv, link: '/tv/:id' },
  { tab: TvSeason, link: '/tv/:id/season/:season_number' },
  { tab: Users, link: '/user/:userId' },
];

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-danger">
      <div className="container-fluid">
        <a className="navbar-brand color" href="/">
          While I Eat
        </a>
        <ul className="nav justify-content-end">
          {navTabs.map((tab, i) => {
            return (
              <li key={i} className="nav-item">
                <a
                  className="nav-link color"
                  aria-current="page"
                  href={tab.link}
                >
                  {tab.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <StrictMode>
      <Navbar />
      <Switch>
        {navTabs.map((tab, i) => {
          return (
            <Route exact key={i} path={tab.link}>
              <tab.tab />
            </Route>
          );
        })}

        {hiddenRoutes.map((tab, i) => {
          return (
            <Route exact key={i} path={tab.link}>
              <tab.tab />
            </Route>
          );
        })}
      </Switch>
    </StrictMode>
  );
};

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
