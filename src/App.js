import React from 'react';
import {BrowserRouter as Router,Route, Redirect, Switch} from 'react-router-dom';
import Users from './user/pages/users'
import NewPlace from './places/pages/newplace'
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/auth';
import { AuthContext } from './shared/context/auth-context';
import { useCallback, useState } from 'react';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  //uid is passed when the login function is called in auth.js
  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;
  if(isLoggedIn){
    routes = (
      <Switch>
      <Route path="/" exact>
            <Users/>
      </Route>
      <Route path="/places/new" exact>
          <NewPlace/>
      </Route>
      <Route path="/places/:placeId" exact>
          <UpdatePlace/>
      </Route>
      <Route path="/:userId/places" exact>
      <UserPlaces/>
    </Route>
    <Redirect to="/"/>
    </Switch>
    );
  }else{
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
        <UserPlaces/>
      </Route>
      <Route path="/auth" exact>
          <Auth/>
      </Route>
      <Redirect to="/auth"/>
    </Switch>
    );
  }

  return (
    //we pass all these parameters globally so that any file can use it. Used in auth.js mainly.
    <AuthContext.Provider value={{isLoggedIn: isLoggedIn, userId: userId,login: login, logout: logout}}>
      <Router>
      <MainNavigation/>
      {
      /* this switch statement makes sure that we are not 
      redirected to "/" if we find a valid path. */}
      <main>
        <Switch>
          {routes}
        </Switch>
      </main>
    </Router>
  </AuthContext.Provider>
  );
}

export default App;
