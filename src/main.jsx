import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from 'react-router-dom';

import Discover from './Discover';
import Movie from './Movie';

const navTabs = [
  {
    tab: Discover,
    link: '/discover',
    name: 'Movies/TV Shows',
  },
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
  let { id } = useParams();
  return (
    <StrictMode>
      <Navbar />
      <Switch>
        {navTabs.map((tab, i) => {
          return (
            <Route key={i} path={tab.link}>
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
