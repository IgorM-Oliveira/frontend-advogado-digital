import { UserOutlined, LockOutlined } from '@ant-design/icons';
import React, {useContext} from 'react'

import AuthContext from '../context/AuthContext'

import {Card, Form, Input, Button, Typography, Flex} from 'antd';
const { Paragraph, Title } = Typography;

function LoginAdc() {
  const {loginUser} = useContext(AuthContext)

  const handleSubmit = (values) => {
    const user = values.username
    const password = values.password

    user.length > 0 && loginUser(user, password)
  }

  return (
    <>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
        autoComplete="off"
        layout="vertical"
        style={{
            height: '100vh',
          }}
        >
          <Flex
            style={{
              width: '100%',
              height: '80vh',
              borderRadius: 6,
            }}
            justify='center'
            align='center'
          >
            <Card
              size="small"
              actions={[
                <Button type="link" htmlType="submit">
                  Login
                </Button>,
                <a href="/login_client" style={{ textDecoration: "none" }}>Cliente</a>,
              ]}
              style={{
                width: 500,
              }}
            >
              <Title level={2}>Advogado Digital</Title>

              <Paragraph>Faça login em sua conta</Paragraph>

              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Informe o CPF!',
                  },
                ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Informe a Senha!',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
            </Card>
          </Flex>
        </Form>
    </>
  )
}

export default LoginAdc