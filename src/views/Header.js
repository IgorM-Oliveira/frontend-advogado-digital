import React from 'react';
import { FileOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Col, Row } from 'antd';

import {useContext} from 'react'
import AuthContext from '../context/AuthContext'

export default function Header() {
  const { user, logoutUser } = useContext(AuthContext)
  const token = localStorage.getItem("authTokens")

  return (
    <>
      <Row>
        <Col flex="1 1 200px">
          <Menu mode="horizontal">
            <Menu.Item icon={<HomeOutlined />} key="home"><a href="/" style={{ textDecoration: "none" }}>Home</a></Menu.Item>
            {(user?.function === 'advogado' || user?.adm === true) &&
              <>
                <Menu.Item icon={<FileOutlined />} key="processos"><a href="/processos" style={{ textDecoration: "none" }}>Processos</a></Menu.Item>
              </>
            }
          </Menu>
        </Col>
        <Col flex="0 1 300px">
          <Menu mode="horizontal">
            {token === null &&
                <Menu.Item icon={<SettingOutlined />} key="login"><a href="/login" style={{ textDecoration: "none" }}>Login</a></Menu.Item>
            }
            {token !== null &&
              <Menu.SubMenu icon={<SettingOutlined />} title={user?.nome} key="config">
                <Menu.Item key="profile"><a href="/profile" style={{ textDecoration: "none" }}>Perfil</a></Menu.Item>
                {user?.adm === true &&
                  <Menu.Item key="advogados"><a href="/advogados" style={{ textDecoration: "none" }}>Advogados</a></Menu.Item>
                }
                {(user?.function === 'advogado' || user?.adm === true) &&
                  <Menu.Item key="cliente"><a href="/clients" style={{ textDecoration: "none" }}>Clientes</a></Menu.Item>
                }
                <Menu.Item key="sair"><a href="/#" onClick={logoutUser} style={{ textDecoration: "none" }}>Sair</a></Menu.Item>
              </Menu.SubMenu>
            }
          </Menu>
        </Col>
      </Row>
    </>
  )
}