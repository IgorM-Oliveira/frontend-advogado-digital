import {useState, useEffect} from 'react'
import dayjs from "dayjs";
import {Col, Button, Form, Input, Typography, Row, Divider, DatePicker, Space, Table, Layout} from 'antd';

import swal from "sweetalert2";
import {createAdvogado, deleteAdvogado, editAdvogado, getAdvogado, getAdvogadoById} from "../router/advogado";

const { Title } = Typography;
const { Content } = Layout;
const { Column } = Table;

function Advogado() {
  const [form] = Form.useForm();

  const [reload, setReload] = useState()
  const [status, setStatus] = useState(true)
  const [edit, setEdit] = useState([false, null])

  const [attorney, setAttorney] = useState([])
  const [attorneys, setAttorneys] = useState([])

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
        const attorneys = []

        for (const item of await getAdvogado()) {
          item.key = item.id
          attorneys.push(item)
        }

        setAttorneys(attorneys)
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
            title: "Você removeu o advogado!",
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
            title: "Algo deu errado ao remover o advogado!",
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
    form.resetFields();
    const attorney = await getAdvogadoById(id);
    attorney.data_nasc = attorney.data_nasc.split('T')[0]
    setAttorney(attorney)

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
        <Table dataSource={attorneys}>
          <Column title="Nome" dataIndex="nome" key="nome" />
          <Column title="CPF" dataIndex="cpf" key="cpf" />
          <Column
              title="Data Nascimento"
              key="data_nasc"
              render={(_, record) => (
                  new Date(record.data_nasc).toISOString().split('T')[0].split('-').reverse().join('/')
              )}
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
                  initialValue={attorney.nome}
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
                  initialValue={attorney.contato}
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
                  initialValue={attorney.emial}
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
                  initialValue={attorney.cpf}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="sexo"
                  label="Sexo"
                  initialValue={attorney.sexo}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="data_nasc"
                  label="Data de Nascimento"
                  initialValue={dayjs(attorney.data_nasc, "YYYY-MM-DD")}
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
                  initialValue={attorney.cep}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item
                  name="endereco"
                  label="Endereço"
                  initialValue={attorney.endereco}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="numberende"
                  label="Número"
                  initialValue={attorney.numberende}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                  name="bairro"
                  label="Bairro"
                  initialValue={attorney.bairro}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="logradouro"
                  label="Logradouro"
                  initialValue={attorney.logradouro}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                  name="complemento"
                  label="Complemento"
                  initialValue={attorney.complemento}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                  name="cidade"
                  label="Cidade"
                  initialValue={attorney.cidade}
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

export default Advogado