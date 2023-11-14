import {useState, useEffect, useContext} from 'react'
import dayjs from "dayjs";
import {Col, Button, Form, Input, Typography, Row, Divider, DatePicker, Space, Table, Layout} from 'antd';

import swal from "sweetalert2";
import {createClient, deleteClient, editClient, getClientById, getClientVinculados} from "../router/clients";
import AuthContext from "../context/AuthContext";
import {useHistory} from "react-router-dom";

const { Title } = Typography;
const { Content } = Layout;
const { Column } = Table;

function Clients() {
  const history = useHistory();
  const {user} = useContext(AuthContext)

  const [form] = Form.useForm();

  const [reload, setReload] = useState()
  const [status, setStatus] = useState(true)
  const [edit, setEdit] = useState([false, null])

  const [clients, setClients] = useState([])
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

  const handleSubmit = async (value) => {
    // if (value.new_senha === value.repeat_senha) {
      if (edit[0]) {
        await editClient(edit[1], value)
            .then(async () => {
              setEdit([false, null])
              setStatus(true)
              setReload(new Date())

              await swal.fire({
                title: "Cliente editado",
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
                title: "Error ao editar cliente",
                icon: "error",
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
              })
            })
      } else {
        await createClient(value)
            .then(async () => {
              setEdit([false, null])
              setStatus(true)
              setReload(new Date())

              await swal.fire({
                title: "Cliente criado",
                icon: "",
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
              })
            })
            .catch(async () => {
              await swal.fire({
                title: "Error ao cadastrar cliente",
                icon: "error",
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
              })
            })
      }

      setReload(new Date())
    // }
  }

  useEffect(() => {
    (async () => {
      try{
        const clients = []

        for (const item of await getClientVinculados(user.id)) {
          item.key = item.id
          clients.push(item)
        }

        setClients(clients)
      } catch (error) {
        localStorage.removeItem("authTokens")
        history.push('/');
      }
    })()
  }, [reload])

  const onRemove = ( id ) => {
    deleteClient(id)
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
    const client = await getClientById(id);
    client.data_nasc = client.data_nasc.split('T')[0]
    setClient(client)

    setStatus(false)
    setEdit([true, id])
  }

  const onCreate = async ( ) => {
    setStatus(false)
    setEdit([false, null])
  }

  return (
    <Content
        style={{
          padding: '0 20rem',
        }}
    >
      {status && <>
        <Button type="primary" onClick={() => onCreate()}>Cadastrar</Button>
        <Divider />
        <Table dataSource={clients}>
          <Column title="Nome" dataIndex="nome" key="nome" />
          <Column title="CPF" dataIndex="cpf" key="cpf" />
          <Column
              title="Data Nascimento"
              key="data_nasc"
              render={(_, record) => {
                console.log(record)
                return (
                  new Date(record.data_nasc).toISOString().split('T')[0].split('-').reverse().join('/')
                )
              }}
          />
          <Column title="Contato" dataIndex="contato" key="contato" />
          <Column
              title="Ações"
              key="action"
              render={(_, record) => (
                  <Space size="middle">
                    <Button type="primary" onClick={() => onEdit(record.id)}>Editar</Button>
                    <Button type="primary" onClick={() => onRemove(record.id)} danger>Remover</Button>
                  </Space>
              )}
          />
        </Table>
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
            <Col span={20}>
              <Form.Item
                  name="nome"
                  label="Nome"
                  rules={[
                    {
                      required: true,
                      message: 'Nome requerido',
                    },
                  ]}
                  initialValue={client.nome}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="contato"
                  label="Contato Principal"
                  rules={[
                    {
                      required: true,
                      message: 'Contato requerido',
                    },
                  ]}
                  initialValue={client.contato}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                  name="emial"
                  label="E-Mail"
                  rules={[
                    {
                      required: true,
                      message: 'E-Mail requerido',
                    },
                  ]}
                  initialValue={client.emial}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="cpf"
                  label="CPF"
                  rules={[
                    {
                      required: true,
                      message: 'CPF requerido',
                    },
                  ]}
                  initialValue={client.cpf}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="sexo"
                  label="Sexo"
                  initialValue={client.sexo}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="data_nasc"
                  label="Data de Nascimento"
                  initialValue={dayjs(client.data_nasc, "YYYY-MM-DD")}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={3}>Endereço</Title>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item
                  name="cep"
                  label="CEP"
                  initialValue={client.cep}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item
                  name="endereco"
                  label="Endereço"
                  initialValue={client.endereco}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="numberende"
                  label="Número"
                  initialValue={client.numberende}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                  name="bairro"
                  label="Bairro"
                  initialValue={client.bairro}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="logradouro"
                  label="Logradouro"
                  initialValue={client.logradouro}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="complemento"
                  label="Complemento"
                  initialValue={client.complemento}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                  name="cidade"
                  label="Cidade"
                  initialValue={client.cidade}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={3}>Senha</Title>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                  name="old_senha"
                  label="Senha Atual"
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                  name="new_senha"
                  label="Nova Senha"
                  onChange={handlePasswordChange}
                  help={passwordStrength}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                  name="repeat_senha"
                  label="Repetir Senha"
                  onChange={handlePasswordChangeRepeat}
                  help={passwordStrengthRepeat}
              >
                <Input.Password />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Space size="middle">
                <Button type="primary" htmlType="submit">Salvar</Button>
                <Button type="primary" danger onClick={() => setStatus(true)}>Cancelar</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </>}
    </Content>
  )
}

export default Clients