import {useState, useEffect, useContext} from 'react'
import {useHistory} from "react-router-dom";
import {Col, Button, Form, Input, Typography, Row, Divider, DatePicker, Space, Layout} from 'antd';

import useAxios from "../utils/useAxios"

import swal from "sweetalert2";
import AuthContext from "../context/AuthContext";
import dayjs from "dayjs";

const { Title } = Typography;
const { Content } = Layout;

function Profile() {
  const history = useHistory();
  const {user} = useContext(AuthContext)

  const [form] = Form.useForm();

  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordStrengthRepeat, setPasswordStrengthRepeat] = useState('');

  const [client, setClient] = useState([])

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
      if (user.function === 'advogado') {
        await api.put(`/advogados/${user?.id}`, value)
            .then(() => {
              history.push('/');
            })
            .catch(function (error) {
              console.error(error);
            });
      } else {
        await api.get(`/clientes/${user?.id}`)
      }
  }

  const api = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try{
        const {data} = user.function === 'advogado' ? await api.get(`/advogados/${user?.id}`) : await api.get(`/clientes/${user?.id}`)

        data.data_nasc = dayjs(data.data_nasc, "YYYY-MM-DD")
        form.setFieldsValue(data);
        setClient(data)
      } catch (error) {
        console.error(error)
        localStorage.removeItem("authTokens")
        history.push('/');
      }
    }
    fetchData().then(r => '')
  }, [])

  return (
    <Content
        style={{
          padding: '0 20rem',
        }}
    >
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
                    message: 'Contato requerido',
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
            </Space>
          </Col>
        </Row>
      </Form>
    </Content>
  )
}

export default Profile