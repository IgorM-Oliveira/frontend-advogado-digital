import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

function Loginpage() {

  const {loginUser} = useContext(AuthContext)
  const handleSubmit = e => {
    e.preventDefault()
    const user = e.target.user.value
    const password = e.target.password.value

    user.length > 0 && loginUser(user, password)
  }

  return (
    <div>
      <>
        <section className="vh-100" style={{ backgroundColor: "#646262" }}>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-xl-6">
                <div className="card" style={{ borderRadius: "1rem" }}>
                  <div className="g-0">
                    <div className="d-flex align-items-center">
                      <div className="card-body p-4 p-lg-5 text-black">
                        <form onSubmit={handleSubmit}>
                          <div className="d-flex align-items-center mb-3 pb-1">
                            <i
                                className="fas fa-cubes fa-2x me-3"
                                style={{ color: "#ff6219" }}
                            />
                            <div className="d-flex align-items-center mb-3 pb-1">
                              <i
                                  className="fas fa-cubes fa-2x me-3"
                                  style={{ color: "#ff6219" }}
                              />
                              <span className="h2 fw-bold mb-0">Welcome back 👋</span>
                            </div>
                          </div>
                          <h5
                              className="fw-normal mb-3 pb-3"
                              style={{ letterSpacing: 1 }}
                          >
                            Sign into your account
                          </h5>
                          <div className="form-outline mb-4">
                            <input
                                type="text"
                                id="form_user"
                                className="form-control form-control-lg"
                                name='user'
                            />
                            <label className="form-label" htmlFor="form_user">
                              Number
                            </label>
                          </div>
                          <div className="form-outline mb-4">
                            <input
                                type="password"
                                id="form_password"
                                className="form-control form-control-lg"
                                name='password'
                            />
                            <label className="form-label" htmlFor="form_password">
                              Password
                            </label>
                          </div>
                          <div className="pt-1 mb-4">
                            <button
                                className="btn btn-dark btn-lg btn-block"
                                type="submit"
                            >
                              Login
                            </button>
                          </div>
                          {/*<a className="small text-muted" href="#!">
                            Forgot password?
                          </a>*/}
                          <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                            <Link to="/login_client" style={{ color: "#393f81" }}>
                              {/*Login Client*/}
                            </Link>
                          </p>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-light text-center text-lg-start">
          <div
              className="text-center p-3"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          >
            © 2023 - Adivogado Digital
          </div>
        </footer>
      </>
    </div>
  )
}

export default Loginpage