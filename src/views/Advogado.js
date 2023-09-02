import {useState, useEffect} from 'react'

import swal from "sweetalert2";
import {createAdvogado, deleteAdvogado, editAdvogado, getAdvogado, getAdvogadoById} from "../router/advogado";
import {getClientById} from "../router/clients";

function Advogado() {
  const [reload, setReload] = useState()
  const [status, setStatus] = useState(true)
  const [edit, setEdit] = useState([false, null])

  const [client, setClient] = useState([])

  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordStrengthRepeat, setPasswordStrengthRepeat] = useState('');

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handlePasswordChangeRepeat = (event) => {
    const newPasswordRepeat = event.target.value;
    if (newPasswordRepeat === password) {
      setPasswordStrengthRepeat('Igual');
    } else {
      setPasswordStrengthRepeat('Senha não corresponde');
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 8) {
      return <span style={{ color: "red" }}>Fraca</span>;
    } else if (password.match(/[a-zA-Z]/) && password.match(/[0-9]/)) {
      return <span style={{ color: "green" }}>Forte</span>;
    } else {
      return <span style={{ color: "yellow" }}>Média</span>;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault()

    const data = []

    data.push({nome: e.target.nome.value,
      contato: e.target.contato.value,
      cpf: e.target.cpf.value,
      data_nasc: e.target.data_nasc.value,
      sexo: e.target.sexo.value,
      logradouro: e.target.logradouro.value,
      endereco: e.target.endereco.value,
      cep: e.target.cep.value,
      numberEnde: e.target.numberEnde.value,
      complemento: e.target.complemento.value,
      cidade: e.target.cidade.value,
      bairro: e.target.bairro.value,
      emial: e.target.emial.value,
      senha: e.target.new_senha.value})

    if (e.target.new_senha.value === e.target.repeat_senha.value) {
      if (edit[0]) {
        await editAdvogado(edit[1], ...data)

        setEdit([false, null])

        swal.fire({
          title: "Cliente editado",
          icon: "success",
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        })
      } else {
        await createAdvogado(...data)
        setEdit([false, null])
        setStatus(true)

        swal.fire({
          title: "Cliente criado",
          icon: "success",
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        })
      }

      setReload(new Date())
    } else {
      swal.fire({
        title: "Login bem-sucedido!",
        icon: "success",
        toast: true,
        timer: 3000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }
  }

  useEffect(() => {
    (async () => {
      try{
        setClient(await getAdvogado())
      } catch (error) {
        // localStorage.removeItem("authTokens")
        // history.push('/');
      }
    })()
  }, [reload])

  const onRemove = ( id ) => {
    deleteAdvogado(id)
        .then(async () => {
          setReload(new Date())
          swal.fire({
            title: "Você removeu o cliente!",
            icon: "success",
            toast: true,
            timer: 3000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
          })
        })
        .catch(() => {
          swal.fire({
            title: "Algo deu errado ao remover o cliente!",
            icon: "error",
            toast: true,
            timer: 3000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
          })
        })
  }

  const onEdit = async ( id ) => {
    setStatus(false)
    setEdit([true, id])
    const clients = await getAdvogadoById(id);

    document.getElementById('nome').value = clients.nome
    document.getElementById('contato').value = clients.contato
    document.getElementById('cpf').value = clients.cpf
    document.getElementById('data_nasc').value = new Date(clients.data_nasc).toISOString().split('T')[0]
    document.getElementById('sexo').value = clients.sexo
    document.getElementById('logradouro').value = clients.logradouro
    document.getElementById('endereco').value = clients.endereco
    document.getElementById('cep').value = clients.cep
    document.getElementById('numberEnde').value = clients.numberende
    document.getElementById('complemento').value = clients.complemento
    document.getElementById('cidade').value = clients.cidade
    document.getElementById('bairro').value = clients.bairro
    document.getElementById('emial').value = clients.emial

    document.getElementById('old_senha').value = ''
    document.getElementById('new_senha').value = ''
    document.getElementById('repeat_senha').value = ''
  }

  const onCreate = async ( ) => {
    setStatus(false)
    setEdit([false, null])
  }

  return (
      <div>
        <>
          <div className="container-fluid" style={{ paddingTop: "100px" }}>
            <div className="row">
              <nav className="col-md-2 d-none d-md-block bg-light sidebar mt-4">
                <div className="sidebar-sticky">
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <a className="nav-link active" href="/dashboard">
                        <span data-feather="home" />
                        Dashboard
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
              <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
                {status && <>
                  <div className="pt-4 col-12">
                    <button className="btn btn-primary" type="button" onClick={() => onCreate()}>Cadastrar</button>
                  </div>
                  <div className="col-12">
                    <table className="table table-bordered">
                      <thead>
                      <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">CPF</th>
                        <th scope="col">Data Nascimento</th>
                        <th scope="col">Contato</th>
                        <th scope="col"></th>
                      </tr>
                      </thead>
                      <tbody>
                      {client.map((item) => {
                        return (
                            <tr key={item.id}>
                              <td>{item.nome}</td>
                              <td>{item.cpf}</td>
                              <td>{new Date(item.data_nasc).toISOString().split('T')[0].split('-').reverse().join('/')}</td>
                              <td>{item.contato}</td>
                              <td>
                                <button type="button" onClick={() => onEdit(item.id)} className="btn btn-primary">Editar<i className="fas fa-edit"></i></button>
                                <button type="button" onClick={() => onRemove(item.id)} className="btn btn-danger">Remover<i className="far fa-trash-alt"></i></button>
                              </td>
                            </tr>
                        )
                      })}
                      </tbody>
                    </table>
                  </div>
                </>}

                {!status && <>
                  <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                      <h1 className="h3">Dados Gerais</h1>
                    </div>

                    <div className="table-responsive" style={{ overflowX: "visible" }}>
                      <div className="row g-3 needs-validation">
                        <div className="col-md-10">
                          <label htmlFor="nome" className="form-label">Nome Completo</label>
                          <input type="text" className="form-control" id="nome"/>
                        </div>
                        <div className="col-md-2">
                          <label htmlFor="contato" className="form-label">Contato Principal</label>
                          <input type="number" className="form-control" id="contato"/>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="emial" className="form-label">E-Mail</label>
                          <input type="text" className="form-control" id="emial"/>
                        </div>
                        <div className="col-md-2">
                          <label htmlFor="cpf" className="form-label">CPF</label>
                          <input type="text" className="form-control" id="cpf"/>
                        </div>
                        <div className="col-md-2">
                          <label htmlFor="sexo" className="form-label">Sexo</label>
                          <input type="text" className="form-control" id="sexo"/>
                        </div>
                        <div className="col-md-2">
                          <label htmlFor="data_nasc" className="form-label">Data de Nascimento</label>
                          <input type="date" className="form-control" id="data_nasc"/>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                      <h1 className="h3">Endereço</h1>
                    </div>

                    <div className="table-responsive" style={{ overflowX: "visible" }}>
                      <div className="row g-3 needs-validation">
                        <div className="col-md-3">
                          <label htmlFor="cep" className="form-label">CEP</label>
                          <input type="text" className="form-control" id="cep"/>
                        </div>
                        <div className="col-md-7">
                          <label htmlFor="endereco" className="form-label">Endereço</label>
                          <input type="text" className="form-control" id="endereco"/>
                        </div>
                        <div className="col-md-2">
                          <label htmlFor="numberEnde" className="form-label">Número</label>
                          <input type="text" className="form-control" id="numberEnde"/>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="bairro" className="form-label">Bairro</label>
                          <input type="text" className="form-control" id="bairro"/>
                        </div>
                        <div className="col-md-2">
                          <label htmlFor="logradouro" className="form-label">Logradouro</label>
                          <input type="text" className="form-control" id="logradouro"/>
                        </div>
                        <div className="col-md-2">
                          <label htmlFor="complemento" className="form-label">Complemento</label>
                          <input type="text" className="form-control" id="complemento"/>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="cidade" className="form-label">Cidade</label>
                          <input type="text" className="form-control" id="cidade"/>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                      <h1 className="h3">Endereço</h1>
                    </div>

                    <div className="table-responsive" style={{ overflowX: "visible" }}>
                      <div className="row g-3 needs-validation">
                        <div className="col-md-4">
                          <label htmlFor="old_senha" className="form-label">Senha Atual</label>
                          <input type="password" className="form-control" id="old_senha"/>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="new_senha" className="form-label">Nova Senha</label>
                          <input type="password" value={password} onChange={handlePasswordChange} className="form-control" id="new_senha"/>
                          <p>{passwordStrength}</p>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="repeat_senha" className="form-label">Repetir Senha</label>
                          <input type="password" onChange={handlePasswordChangeRepeat} className="form-control" id="repeat_senha"/>
                          <p>{passwordStrengthRepeat}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 col-12">
                      <button className="btn btn-primary" type="submit">Salvar</button>
                      <button className="btn btn-danger" type="button" onClick={() => setStatus(true)}>Cancelar</button>
                    </div>
                  </form>
                </>}
              </main>
            </div>
          </div>
        </>

      </div>
  )
}

export default Advogado