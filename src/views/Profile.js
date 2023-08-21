import {useState, useEffect} from 'react'
import useAxios from "../utils/useAxios"
import jwtDecode from 'jwt-decode'
function Dashboard() {
  const handleSubmit = e => {
    e.preventDefault()
    // console.log(e)
  }

  (() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
  })()

  const api = useAxios();
  const token = localStorage.getItem("authTokens")

  useEffect(() => {
    const fetchData = async () => {
      try{
        const decode = jwtDecode(token)
        const response = await api.get(`/advogados/${decode?.id}`)
        console.log(response)
        // setRes(response.data.response)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
  }, [])

  return (
      <div>
        <>
          <div className="container-fluid" style={{ paddingTop: "100px" }}>
            <div className="row">
              <nav className="col-md-2 d-none d-md-block bg-light sidebar mt-4">
                <div className="sidebar-sticky">
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <a className="nav-link active" href="#">
                        <span data-feather="home" />
                        Dashboard <span className="sr-only">(current)</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="file" />
                        Orders
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="shopping-cart" />
                        Products
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="users" />
                        Customers
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="bar-chart-2" />
                        Reports
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="layers" />
                        Integrations
                      </a>
                    </li>
                  </ul>
                  <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                    <span>Saved reports</span>
                    <a className="d-flex align-items-center text-muted" href="#">
                      <span data-feather="plus-circle" />
                    </a>
                  </h6>
                  <ul className="nav flex-column mb-2">
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="file-text" />
                        Current month
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="file-text" />
                        Last quarter
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="file-text" />
                        Social engagement
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="file-text" />
                        Year-end sale
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
              <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                  <h1 className="h2">Meu Perfil</h1>
                </div>
                <h2>Dados Gerais</h2>
                <div className="table-responsive" style={{ overflowX: "visible" }}>
                  <form className="row g-3 needs-validation" onSubmit={handleSubmit}>

                    <div className="col-md-6">
                      <label htmlFor="validationCustom01" className="form-label">Nome Completo</label>
                      <input type="text" className="form-control" id="validationCustom01"/>
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="validationCustom02" className="form-label">CPF</label>
                      <input type="text" className="form-control" id="validationCustom02"/>
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="validationCustomUsername" className="form-label">Sexo</label>
                      <input type="text" className="form-control" id="validationCustom03"/>
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="validationCustomUsername" className="form-label">Data de Nascimento</label>
                      <input type="date" className="form-control" id="validationCustom03"/>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="validationCustom03" className="form-label">E-Mail</label>
                      <input type="text" className="form-control" id="validationCustom04"/>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="validationCustom05" className="form-label">Zip</label>
                      <input type="text" className="form-control" id="validationCustom05"/>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary" type="submit">Submit form</button>
                    </div>
                  </form>
                </div>
              </main>
            </div>
          </div>
        </>

      </div>
  )
}

export default Dashboard