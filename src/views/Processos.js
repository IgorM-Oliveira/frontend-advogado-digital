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
  Divider,
  Upload,
  Space,
  Table,
  Layout,
  Tooltip, DatePicker
} from 'antd';

import swal from "sweetalert2";
import {
  createProcessos,
  deleteProcessos,
  editProcessos,
  getProcessosById, getProcessosVinculados,
  getTiposProcessos, uploadProcessos, uploadProcessosRemove,
  getDiarioOficial, uploadProcessosInsert, getProcessosClienteVinculados
} from "../router/processos";
import {getClientVinculados} from "../router/clients";
import AuthContext from "../context/AuthContext";
import {useHistory} from "react-router-dom";

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import dayjs from "dayjs";

const { Title } = Typography;
const { Content } = Layout;
const { Column } = Table;

function Processos() {
  const history = useHistory();
  const {user} = useContext(AuthContext)

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false)

  const [reload, setReload] = useState()
  const [status, setStatus] = useState(true)
  const [edit, setEdit] = useState([false, null])
  
  const [diarioOficial, setDiarioOficial] = useState([])

  const [processos, setProcessos] = useState([])
  const [processo, setProcesso] = useState([])
  const [processoFiles, setProcessoFiles] = useState([])
  
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
      value.advogado = user.id
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
    const files = []
    
    for (const item of processo.files) {
      item.key = item.id
      item.uid = item.id
      item.thumbUrl = item.thumbUrl+'.pdf'

      files.push(item)
    }
    
    setProcesso(processo)
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
  
  const sincronizar = async () => {
    setLoading(true)
    const diario = []
    const inicio = processo.inicio.split("T")[0].split('-').reverse().join('/')
    const data = new Date();
    data.setDate(data.getDate() - 1);
    
    const fim = processo.fim
      ? processo.fim.split("T")[0].split('-').reverse().join('/')
      : data.toISOString().split('T')[0].split('-').reverse().join('/')
    
    const form = {
      "Filter.Numero": '',
      "Filter.DataInicial": inicio,
      "Filter.DataFinal": fim,
      "Filter.Texto": processo.numero,
      "Filter.TipoBuscaEnum": 1,
    }
    const getDiario = await getDiarioOficial(form);
    
    for (const item of getDiario.dataElastic) {
      diarioOficial.push(item)
      diario.push({
        'id_processo': processo.id,
        'caminho_pdf': 'https://www.spdo.ms.gov.br/diariodoe/Index/Download/'+item.Source.NomeArquivo.replace('.pdf', ''),
        'filename': item.Source.NomeArquivo.replace('.pdf', '')
      })
    }
    
    await uploadProcessosInsert(diario)
    setLoading(false)
    setEdit([false, null])
    setStatus(true)
  }
  
  const processoPdf = async () => {
    const list = []
    await sincronizar()
    
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    
    const reportTitle = [
      {
        text: 'Referencias',
        fontSize: 15,
        bold: true,
        margin: [15, 20, 0, 45] // left, top, right, bottom
      }
    ];
    
    const dados = diarioOficial.map((item) => {
      console.log(item.Source)
      return [
        {
          text: item.Source.NomeArquivo,
          style: 'subheader',
          fontSize: 12,
          bold: true,
          margin: [10, 5, 0, 5]
        },
        {
          text: item.Source.Texto,
          alignment: 'justify',
          fontSize: 9,
          margin: [50, 10, 10, 0] // left, top, right, bottom
        },
        {
          text: 'Link: https://www.spdo.ms.gov.br/diariodoe/Index/Download/'+item.Source.NomeArquivo.replace('.pdf', ''),
          link: 'https://www.spdo.ms.gov.br/diariodoe/Index/Download/'+item.Source.NomeArquivo.replace('.pdf', ''),
          fontSize: 9,
          bold: true,
            margin: [10, 5, 0, 0]
        },
        {
          text: 'Página: '+item.Source.Pagina,
          fontSize: 9,
          bold: true,
          margin: [10, 5, 0, 5],
          pageBreak: 'after'
        }
      ]
    });
    
    const details = {
      content: [
        ...dados
      ]
    };
    
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
      content: [details.content],
      footer: Rodape
    }
    
    setDiarioOficial([])

    const pdf = pdfMake.createPdf(docDefinitios);
    pdf.getBlob((blod) => {
      const url = URL.createObjectURL(blod)
      window.open(url, '_blank')
    })
  }

  useEffect(() => {
    (async () => {
      try{
        console.log(user)
        if (user.function === 'advogado') {
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
        } else {
          const getTipos = await getTiposProcessos()
          
          const tipos_array= []
          const clientes_array= []
          
          getTipos.forEach((item) => {
            tipos_array.push({value: item.id, label: item.nome_completo})
          })
          
          setTipos(tipos_array)
          setClient(clientes_array)
          
          const processos = []
          
          for (const item of await getProcessosClienteVinculados(user.id)) {
            item.key = item.id
            processos.push(item)
          }
          
          setProcessos(processos)
        }
      } catch (error) {
        /*localStorage.removeItem("authTokens")
        history.push('/');*/
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
              <Button type="primary" onClick={async () => await sincronizar()} icon={<UndoOutlined />} loading={loading}>Sincronizar</Button>
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
                <Input />
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
            {(user.function === 'advogado') && <>
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
            </>}
            <Col span={12}>
              <Form.Item
                name="resumo"
                label="Resumo"
                initialValue={processo.resumo}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="inicio"
                label="Data de Inicio"
                initialValue={processo.inicio ? dayjs(processo.inicio, "YYYY-MM-DD") : null}
                rules={[
                  {
                    required: true,
                    message: 'Data Inicial',
                  },
                ]}
              >
                <DatePicker placeholder="Início" format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="fim"
                label="Data de Fim"
                initialValue={processo.fim ? dayjs(processo.fim, "YYYY-MM-DD") : null}
              >
                <DatePicker placeholder="Fim"  format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Upload defaultFileList={[...processoFiles]} {...props}>
                <Button icon={<UploadOutlined />}>Arquivos</Button>
              </Upload>
            </Col>

            <Col span={24}>
              <Space size="middle">
                {(user.function === 'advogado') && <>
                  <Button type="primary" htmlType="submit">Salvar</Button>
                  <Button type="primary" danger onClick={() => window.location.reload()}>Cancelar</Button>
                </>}
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
