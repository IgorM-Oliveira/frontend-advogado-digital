import React from 'react'

import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import { AuthProvider } from './context/AuthContext'

import Homepage from './views/Homepage'

import Loginpage from './views/Loginpage'
import ClienteLoginpage from './views/ClienteLoginpage'

import Profile from './views/Profile'
import Clients from './views/Clients'
import Advogado from './views/Advogado'
import Processos from './views/Processos'

import Header from './views/Header'
import Footer from './views/Footer'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ minHeight: "8vh" }}>
          <Header />
        </div>
        <div style={{ minHeight: "90vh" }}>
          <Switch>
            <Route component={Clients} path="/clients" exact />
            <Route component={Advogado} path="/advogados" exact />
            <Route component={Processos} path="/processos" exact />
            <Route component={Profile} path="/profile" exact />

            <Route component={Loginpage} path="/login" />
            <Route component={ClienteLoginpage} path="/login_client" />
            <Route component={Homepage} path="/" exact />
          </Switch>
        </div>
        <div style={{ minHeight: "2vh" }}>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App