import {useState, useEffect, useContext} from 'react'
import {UndoOutlined, UploadOutlined} from '@ant-design/icons';
import {
  Select,
  Col,
  Button,
  Form,
  Input,
  Typography,
  Row,
  InputNumber,
  Divider,
  Upload,
  Space,
  Table,
  Layout,
  Tooltip
} from 'antd';

import swal from "sweetalert2";
import {
  createProcessos,
  deleteProcessos,
  editProcessos,
  getProcessosById, getProcessosVinculados,
  getTiposProcessos, uploadProcessos, uploadProcessosRemove
} from "../router/processos";
import {getClientVinculados} from "../router/clients";
import AuthContext from "../context/AuthContext";
import {useHistory} from "react-router-dom";
// import {getDiarioOficial} from "../router/diario";

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

const { Title } = Typography;
const { Content } = Layout;
const { Column } = Table;

function Processos() {
  const history = useHistory();
  const {user} = useContext(AuthContext)

  const [form] = Form.useForm();

  const [reload, setReload] = useState()
  const [status, setStatus] = useState(true)
  const [edit, setEdit] = useState([false, null])

  const [processos, setProcessos] = useState([])
  const [processo, setProcesso] = useState([])
  const [processoFiles, setProcessoFiles] = useState([])
  
  const [diario, setDiario] = useState([])
  
  const [client, setClient] = useState([])
  const [tipos, setTipos] = useState([])

  const [fileList, setFileList] = useState([]);
  const [fileListRemove] = useState([]);

  const props = {
    listType: 'picture',
    onRemove: (file) => {
      fileListRemove.push(file);

      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
  };

  const handleSubmit = async value => {
    if (edit[0]) {
      await editProcessos(edit[1], value)

      await uploadProcessos(edit[1], fileList)

      await uploadProcessosRemove(edit[1], fileListRemove)

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
    const processo = await getProcessosById(id);
    
    setProcesso(processo)
    
    const files = []
    
    for (const item of processo.files) {
      item.key = item.id
      item.uid = item.id
      files.push(item)
    }
    
    setProcessoFiles(files)

    setStatus(false)
    setEdit([true, id])
  }

  const onCreate = async ( ) => {
    form.resetFields();
    setProcesso([])
    setProcessoFiles([])

    setStatus(false)
    setEdit([false, null])
  }
  
  const processoPdf = () => {
    // const [diario, setDiario] = useState([])
    // const getDiario = getDiarioOficial();
    // console.log(getDiario)
    // setDiario(getDiario)
    // console.log(processo, diario)
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    
    const reportTitle = [
      {
        text: 'Referencias',
        fontSize: 15,
        bold: true,
        margin: [15, 20, 0, 45] // left, top, right, bottom
      }
    ];
    
    // const dados = clientes.map((cliente) => {
    //   return [
    //     {text: cliente.id, fontSize: 9, margin: [0, 2, 0, 2]},
    //     {text: cliente.nome, fontSize: 9, margin: [0, 2, 0, 2]},
    //     {text: cliente.email, fontSize: 9, margin: [0, 2, 0, 2]},
    //     {text: cliente.fone, fontSize: 9, margin: [0, 2, 0, 2]}
    //   ]
    // });
    
    const details = [
      {
        table:{
          headerRows: 1,
          widths: ['*', '*', '*', '*'],
          body: [
            [
              {text: 'Código', style: 'tableHeader', fontSize: 10},
              {text: 'Nome', style: 'tableHeader', fontSize: 10},
              {text: 'E-mail', style: 'tableHeader', fontSize: 10},
              {text: 'Telefone', style: 'tableHeader', fontSize: 10}
            ],
            // ...dados
          ]
        },
        layout: 'lightHorizontalLines' // headerLineOnly
      }
    ];
    
    function Rodape(currentPage, pageCount){
      return [
        {
          text: currentPage + ' / ' + pageCount,
          alignment: 'right',
          fontSize: 9,
          margin: [0, 10, 20, 0] // left, top, right, bottom
        }
      ]
    }
    
    const docDefinitios = {
      pageSize: 'A4',
      pageMargins: [15, 50, 15, 40],
      
      header: [reportTitle],
      content: [details],
      footer: Rodape
    }
    
    pdfMake.createPdf(docDefinitios).download();
  }

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
        
        const processos = []
        
        for (const item of await getProcessosVinculados(user.id)) {
          item.key = item.id
          processos.push(item)
        }
        
        setProcessos(processos)
      } catch (error) {
        localStorage.removeItem("authTokens")
        history.push('/');
      }
    })()
  }, [reload])
  
  return (
    <Content
      style={{
        padding: '0 20rem',
      }}
    >
      {status && <>
        <Space size="middle">
          <Button type="primary" onClick={() => onCreate()}>Cadastrar</Button>
        </Space>
        <Divider />
        <Table dataSource={processos}>
          <Column title="Número" dataIndex="numero" key="numero" />
          <Column title="Tipo" dataIndex="tipo" key="tipo" />
          <Column title="Comanda" dataIndex="comanda" key="comanda" />
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
          <Space align="start" size="middle">
            <Title level={3}>Dados Gerais</Title>
            <Tooltip title="Sincronizar com Diario Oficial">
              <Button type="primary" onClick={() => onCreate()} icon={<UndoOutlined />}>Sincronizar</Button>
            </Tooltip>
          </Space>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col span={4}>
              <Form.Item
                name="numero"
                label="Número"
                rules={[
                  {
                    required: true,
                    message: 'Número requerido',
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
                    message: 'Comanda requerido',
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
                    message: 'Tipo requerido',
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
                    message: 'Cliente requerido',
                  },
                ]}
                initialValue={processo.cliente}
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
            <Col span={24}>
              <Upload defaultFileList={[...processoFiles]} {...props}>
                <Button icon={<UploadOutlined />}>Arquivos</Button>
              </Upload>
            </Col>

            <Col span={24}>
              <Space size="middle">
                <Button type="primary" htmlType="submit">Salvar</Button>
                <Button type="primary" danger onClick={() => setStatus(true)}>Cancelar</Button>
                <Button block onClick={() => processoPdf()}>Relátorio</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </>}
    </Content>
  )
}

export default Processos
