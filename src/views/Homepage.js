import React from 'react'
import { Col, Row, Typography, Divider } from 'antd';

const { Paragraph, Title } = Typography;

function Homepage() {
  return (
    <>
      <Row justify="center">
        <Col>
          <Title>Advogado Digital</Title>
        </Col>
      </Row>

      <Row justify="center">
        <Col>
          <Paragraph>
            Um sistema que trata principalmente dos processos de um advogado para facilitar a gestão no seu dia a dia corrido
          </Paragraph>
        </Col>
      </Row>

      <Row>
        <Col span={8} offset={4}>
          <Title>Controles</Title>
          <Divider />

          <Paragraph style={{ textAlign: "justify" }}>Gestão de Casos: Permite a criação de perfis individuais para cada caso, incluindo detalhes do cliente, documentos relacionados, datas importantes e notas do advogado.</Paragraph>
          <Divider />

          <Paragraph style={{ textAlign: "justify" }}>Agenda e Calendário: Oferece uma visão geral dos compromissos, prazos e audiências, ajudando os profissionais a gerenciar seus horários de maneira eficaz.</Paragraph>
          <Divider />

          <Paragraph style={{ textAlign: "justify" }}>Controle de Documentos: Facilita o armazenamento seguro e organizado de documentos relacionados a casos, permitindo o acesso rápido quando necessário.</Paragraph>
          <Divider />

          <Paragraph style={{ textAlign: "justify" }}>Gestão de Tarefas: Permite a atribuição e acompanhamento de tarefas específicas a membros da equipe, garantindo que cada etapa do processo seja concluída dentro do prazo.</Paragraph>
          <Divider />

          <Paragraph style={{ textAlign: "justify" }}>Acompanhamento de Prazos: Alertas automáticos sobre prazos importantes, como datas de audiência e datas de entrega de documentos, ajudam a evitar atrasos e garantir a conformidade.</Paragraph>
          <Divider />

          <Paragraph style={{ textAlign: "justify" }}>Relatórios Simplificados: Oferece relatórios resumidos sobre o status dos casos, atividades da equipe e desempenho geral do escritório, fornecendo insights valiosos para a tomada de decisões.</Paragraph>
          <Divider />

          <Paragraph style={{ textAlign: "justify" }}>Segurança: Garante a segurança dos dados do cliente e informações confidenciais por meio de medidas de segurança robustas, como criptografia e controle de acesso.</Paragraph>
          <Divider />

          <Paragraph style={{ textAlign: "justify" }}>Integração: Pode ser integrado a outros sistemas, como e-mails e calendários, para uma experiência de usuário mais suave e eficiente.</Paragraph>
        </Col>

        <Divider type="vertical" />

        <Col span={8}>
          <Title>Informe</Title>
          <Divider />

          <Paragraph style={{ textAlign: "justify" }}>Um sistema de controle de processos jurídicos é uma ferramenta digital que ajuda advogados a gerenciar casos de forma eficiente. Ele permite cadastrar casos e clientes, gerenciar documentos, controlar prazos, atribuir tarefas, agendar compromissos e facilitar a comunicação interna. Além disso, oferece relatórios para análises e insights. É seguro, fácil de usar e centraliza todas as atividades relacionadas aos processos legais.</Paragraph>
        </Col>
      </Row>
    </>
  )
}

export default Homepage