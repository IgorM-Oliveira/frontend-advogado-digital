import React from 'react';
import { Col, Row, Typography, Divider } from 'antd';

const { Paragraph } = Typography;

function NavFooter() {
  return (
    <>
      <Divider />
      <Row justify="center">
        <Col>
          <Paragraph>© 2023 - Adivogado Digital</Paragraph>
        </Col>
      </Row>
    </>
  )
}

export default NavFooter