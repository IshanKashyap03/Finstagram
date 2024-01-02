import React from 'react';
import {BrowserRouter as Router,Route, Redirect, Switch} from 'react-router-dom';
import Users from './user/pages/users'
import NewPlace from './places/pages/newplace'
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';

function App() {
  return (
  <Router>
    <MainNavigation/>
    {/* this switch statement makes sure that we are not 
    redirected to "/" if we find a valid path. */}
    <main>
      <Switch>
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path="/places/new" exact>
          <NewPlace/>
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace/>
        </Route>
        <Redirect to="/"/>
      </Switch>
    </main>
  </Router>
  );
}

export default App;
