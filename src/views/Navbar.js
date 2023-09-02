import {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Navbar() {
  const {user, logoutUser} = useContext(AuthContext)
  const token = localStorage.getItem("authTokens")

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ">
              <li className="nav-item"><a className="nav-link active" aria-current="page" href="/">Home</a></li>

              {token !== null &&
                  <li className="nav-item"><a className="nav-link" href="/dashboard">Dashboard</a></li>
              }

              {(user?.function === 'advogado' || user?.adm === true) &&
                  <li className="nav-item"><a className="nav-link" href="/processos">Processos</a></li>
              }
            </ul>

            <ul className="navbar-nav ms-auto ">
              {token === null &&
                  <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              }

              {token !== null &&
                <>
                  <li className="nav-item dropdown justify-content-end">
                    <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {user?.nome}
                    </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="/profile">Perfil</a></li>
                      {user?.adm === true &&
                          <li><a className="dropdown-item" href="/advogados">Advogados</a></li>
                      }
                      {(user?.function === 'advogado' || user?.adm === true) &&
                          <li><a className="dropdown-item" href="/clients">Clientes</a></li>
                      }
                      <li><a className="dropdown-item" onClick={logoutUser}>Sair</a></li>
                    </ul>
                  </li>
                </>
              }
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar