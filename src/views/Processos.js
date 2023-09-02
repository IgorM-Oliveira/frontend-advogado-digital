import {useState, useEffect, useContext} from 'react'
import {Select, Col, Button, Form, Input, Typography, Row, InputNumber, Divider} from 'antd';

import swal from "sweetalert2";
import {
  createProcessos,
  deleteProcessos,
  editProcessos,
  getProcessosById, getProcessosVinculados,
  getTiposProcessos
} from "../router/processos";
import {getClientVinculados} from "../router/clients";
import AuthContext from "../context/AuthContext";
import {useHistory} from "react-router-dom";

const { Title } = Typography;

function Processos() {
  const history = useHistory();
  const {user} = useContext(AuthContext)

  const [form] = Form.useForm();

  const [reload, setReload] = useState()
  const [status, setStatus] = useState(true)
  const [edit, setEdit] = useState([false, null])

  const [processos, setProcessos] = useState([])
  const [processo, setProcesso] = useState([])
  const [client, setClient] = useState([])
  const [tipos, setTipos] = useState([])

  const handleSubmit = async value => {
    if (edit[0]) {
      await editProcessos(edit[1], value)

      setEdit([false, null])

      await swal.fire({
        title: "Processo editado",
        icon: "success",
        toast: true,
        timer: 3000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      })
    } else {
      await createProcessos(value)
      setEdit([false, null])
      setStatus(true)

      await swal.fire({
        title: "Processo criado",
        icon: "success",
        toast: true,
        timer: 3000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }

    setReload(new Date())
  }

  const onRemove = ( id ) => {
    deleteProcessos(id)
        .then(async () => {
          setReload(new Date())
          await swal.fire({
            title: "Você removeu o cliente!",
            icon: "success",
            toast: true,
            timer: 3000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
          })
        })
        .catch(async () => {
          await swal.fire({
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
    const processo = await getProcessosById(id);

    setProcesso(processo)
  }

  const onCreate = async ( ) => {
    setStatus(false)
    setEdit([false, null])
  }

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    (async () => {
      try{
        const getTipos = await getTiposProcessos()
        const getClientesVinculados = await getClientVinculados(user.id)

        const tipos_array= []
        const clientes_array= []

        getTipos.forEach((item) => {
          tipos_array.push({value: item.id, label: item.nome_completo})
        })

        getClientesVinculados.forEach((item) => {
          clientes_array.push({value: item.id, label: item.nome})
        })

        setTipos(tipos_array)
        setClient(clientes_array)
        setProcessos(await getProcessosVinculados(user.id))
      } catch (error) {
        localStorage.removeItem("authTokens")
        history.push('/');
      }
    })()
  }, [reload])

  return (
      <div>
        <>
          <div className="container-fluid" style={{ paddingTop: "100px" }}>
            <div className="row">
              <main role="main" className="col-12 ml-sm-auto pt-3 px-4">
                {status && <>
                  <div className="pt-4 col-12">
                    <button className="btn btn-primary" type="button" onClick={() => onCreate()}>Cadastrar</button>
                  </div>
                  <div className="col-12">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">Número</th>
                          <th scope="col">Tipo</th>
                          <th scope="col">Comanda</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {processos.map((item) => {
                          return (
                              <tr key={item.id}>
                                <td>{item.numero}</td>
                                <td>{item.tipo}</td>
                                <td>{item.comanda}</td>
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
                  <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSubmit}
                  >
                    <Title level={3}>Dados Gerais</Title>

                    <Divider />

                    <Row gutter={[16, 16]}>
                      <Col span={4}>
                        <Form.Item
                            name="numero"
                            label="Número"
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                            initialValue={processo.numero}
                        >
                          <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                            name="comanda"
                            label="Comanda"
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                            initialValue={processo.comanda}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                            name="tipo"
                            label="Tipo do Processo"
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                            initialValue={processo.tipo}
                        >
                          <Select
                              allowClear
                              style={{
                                width: '100%',
                              }}
                              options={tipos}
                              placeholder="Selecione o Tipo"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                            name="clientes_vinculados"
                            label="Cliente do Processo"
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                        >
                          <Select
                              mode="multiple"
                              allowClear
                              style={{
                                width: '100%',
                              }}
                              options={client}
                              placeholder="Selecione o cliente"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                      <Button type="primary" htmlType="submit">Salvar</Button>
                      <Button htmlType="button" onClick={onReset}>Limpar</Button>
                      <Button type="primary" danger onClick={() => setStatus(true)}>Cancelar</Button>
                    </Row>
                  </Form>
                </>}
              </main>
            </div>
          </div>
        </>
      </div>
  )
}

export default Processos
