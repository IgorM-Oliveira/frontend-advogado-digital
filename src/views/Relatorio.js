import {useEffect, useState} from 'react'

import {} from "../router/diario";

function ProcessoPdf() {
  // const [diario, setDiario] = useState([])
  
  useEffect(() => {
    (async () => {
      const getDiario = await ();
      console.log(getDiario)
      // setDiario(getDiario)
    })()
  }, [])
  
  // console.log(processo, diario)
}

export default ProcessoPdf