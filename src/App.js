import React from 'react'

import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from './context/AuthContext'

import Homepage from './views/Homepage'
import Registerpage from './views/Registerpage'
import Loginpage from './views/Loginpage'
import ClienteLoginpage from './views/ClienteLoginpage'
import Dashboard from './views/Dashboard'
import Profile from './views/Profile'
import Navbar from './views/Navbar'

function App() {
  return (
    <Router>
      <AuthProvider>
        < Navbar/>
        <Switch>
          <PrivateRoute component={Dashboard} path="/dashboard" exact />
          <PrivateRoute component={Profile} path="/profile" exact />
          <Route component={Loginpage} path="/login" />
          <Route component={ClienteLoginpage} path="/login_client" />
          <Route component={Registerpage} path="/register" exact />
          <Route component={Homepage} path="/" exact />
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App