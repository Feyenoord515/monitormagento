import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../redux/ordersTodasThunks";
import { fetchOrderssap } from "../redux/ordersapThunks";
import { fetchordersaexcel } from "../redux/ordersaexcelThunks";
import { fetchOrdersCruzadas } from "../redux/ordersCruzadasThunks";
import { resetOrderCruzadas } from "../redux/ordersCruzadasSlice";
import { resetOrdersap } from "../redux/ordersapSlice";
import FadeLoader from "react-spinners/FadeLoader";
import DotLoader from "react-spinners/DotLoader";
import { Backdrop, CircularProgress ,Box, Typography, TextField, FormGroup, FormControlLabel, Checkbox, Modal, Grid, List, ListItem, ListItemText, Card, CardContent, Divider, Button, Paper, Select, MenuItem, Alert} from '@mui/material';


function AllOrders({ marca }) {
  const dispatch = useDispatch();
  const ord1 = useSelector((state) => state.ordersall.ordersall);
  const orsap = useSelector((state) => state.ordersap.ordersap);
  const sapvtx = useSelector((state)=> state.ordercruzadas.OrderCruzadas);
  const lod = useSelector((state) => state.ordersap.loading);
  const loading = useSelector((state) => state.ordersall.loading);
  const error = useSelector((state) => state.ordersall.error);
  const errbus = useSelector((state) => state.ordercruzadas.loading);

  const [statusFilters, setStatusFilters] = useState({
    "pending": true,
    "processing": true,
    "complete": true,
    "canceled": true,
    "on Hold": true,
    "payment Review": true,
    "closed": true
  });

  const date = new Date();
  const ayer = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  const toSearch = ayer.toISOString().split("T")[0];
const [porBuscar, setPorBuscar] = useState('');
  const [startDate, setStartDate] = useState(toSearch);
  const [endDate, setEndDate] = useState(toSearch);
  const [shouldFetch, setShouldFetch] = useState(false);
  
  const [sapLoaded, setSapLoaded] = useState(false);
  const [aBuscar, setaBuscar] = useState(false);
  const [searchResults, setSearchResults] = useState();
const [showResults, setShowResults] = useState(false);
const [openModal, setOpenModal] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
const [ls1, setLs1] = useState(false);
const [sortCriterio, setSortCriterion] = useState('fecha');
const [sortedOrders, setSortedOrders] = useState([])
const [ord1Length, setOrd1Length] = useState('');
const ellem = ord1.map(el=>el.length).reduce((a, b) => a + b, 0);
const today = new Date().toISOString().split("T")[0]
const [verifiedOrderIds, setVerifiedOrderIds] = useState();
const [errFecha, setErrFecha] = useState('')


  const data = `${startDate} al ${endDate}`;
  // const handleSeleOrdersToExcel = () => {
  //   dispatch(fetchordersaexcel(marca, prb1));
  // };
console.log(ord1)
  useEffect(() =>{
if(orsap.length > ellem){
  dispatch(resetOrdersap())
}
  }, [dispatch, ellem, orsap])
//efecto que se usa para consultas en tiempo real
  useEffect(() => {
    if ((endDate === today) && shouldFetch ) {
      
        setOrd1Length('true');
    }else if((endDate !== today) && shouldFetch)
      setOrd1Length('')
  }, [endDate, today, shouldFetch]);
 
  // Despacho inicial
  useEffect(() => {
    if(ord1.length < 2){
    dispatch(fetchAllOrders(marca, data));
    }
  }, [dispatch, marca, data, ord1]);

  // Despacho en caso de búsqueda por fechas
  useEffect(() => {
    if (shouldFetch === true) {
      if(startDate <= endDate){
      dispatch(fetchAllOrders(marca, data));
      setShouldFetch(false);
      setaBuscar(true);
      setSapLoaded(false);
      setOrd1Length('true');
      dispatch(resetOrdersap());
      }
    }
  }, [shouldFetch, dispatch, marca, data, startDate, endDate]);

//efecto que se usa para despachar las consultas a vtex en tiempo real
useEffect(() => {
 
  
  if ((ord1Length === 'true') && (endDate === today) && (!loading && !lod)) {
   
    const interval = setInterval(() => {
      dispatch(fetchAllOrders(marca, data));
      setSapLoaded(false);
      setOrd1Length('false');
    }, 60000); // Actualiza cada minuto

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }
}, [ord1Length, endDate, dispatch, ellem, today, marca, data, loading,lod]);

// Ejecuta la función de chequeo
useEffect(() => {
  if(orsap.length < 30 && !lod){
   
  if (ord1.length > 0 && (!sapLoaded && !loading && !lod)) {
   
    checkOrderInSap();
    
  }
}else if((ord1Length === 'false') && (ord1.length > 0) && (endDate === today) ){
  
  checkOrderInSap();
}
}, [ sapLoaded, ord1, orsap, loading, lod, today, ord1Length]);



useEffect(() => {
  if (orsap && ord1 && endDate === today) {
    let elensap = orsap
      .filter(elem => elem !== null)
      .map(el => el.U_WESAP_BaseSysUID)
      

    let element = [...new Set(ord1.flat().map(order => order.increment_id))];

    const coinci = element.filter(el => {
      const numPart = el.split('-')[0]; // Extrae la parte numérica
      return !elensap.includes(numPart);
    });

    setVerifiedOrderIds(coinci)
    
  }
}, [orsap, ord1, endDate, today]);

// console.log(verifiedOrderIds)

  // Chequea que orders están en SAP y se guardan en el estado orsap
  const checkOrderInSap = useCallback(() => {
    if (ord1.length > 0 && orsap.length < 2) {
     
      const uniqueOrderIds = [...new Set(ord1.flat().map(order => order.increment_id))];
      console.log(uniqueOrderIds)
      dispatch(fetchOrderssap(uniqueOrderIds)).then(() => setSapLoaded(true));
    }else if(ord1Length === 'false' && (ellem !== ord1.length) ){
      console.log(2)
      const uniqueOrderIds = [...new Set(ord1.flat().map(order => order.orderId))];
      
      const ordersToCheck = uniqueOrderIds.filter(orderId => verifiedOrderIds.includes(orderId));
      
      dispatch(fetchOrderssap(uniqueOrderIds)).then(() => setSapLoaded(true),
      setOrd1Length('true')
    );
      
    }else if(ellem === ord1.length) {
      
      setOrd1Length('true')
    }else if (ord1Length === 'false' && ellem !== ord1.length && verifiedOrderIds) {
      const uniqueOrderIds = [...new Set(ord1.flat().map(order => order.orderId))];
      const ordersToCheck = uniqueOrderIds.filter(orderId => !verifiedOrderIds.includes(orderId));
      console.log(ordersToCheck);
    }
  }, [dispatch, ord1, orsap, verifiedOrderIds]);
 
  
 


//maneja la busqueda de ids
  const handleSearchChange = (event) => {
    setPorBuscar(event.target.value)
  }
// //funcion que recibe un order id y despacha la accion de buscar en sap y vtex
  const searchNumVtex = async(orderId) => {
    if (!lod && !loading && !errbus && porBuscar) {
      console.log(porBuscar.toUpperCase())
      dispatch(fetchOrdersCruzadas(porBuscar.toUpperCase()));
      setLs1(true)
      
    } else if(!lod && !loading && !errbus && orderId){
      
      dispatch(fetchOrdersCruzadas(orderId));
      setPorBuscar(orderId)
      setLs1(true)
     
    }
  };
  
 //efecto que setea los resultados de busqueda de searchNumVtex si hay resultados los muestra y si no carga el elemento de vtex
  useEffect(() => {
    if (sapvtx && sapvtx.length === 3 && sapvtx[0] && (sapvtx[1] || sapvtx[2]) && typeof sapvtx[0] !== 'string'  ) {
      // Si la búsqueda en SAP-VTEX tiene éxito
      
      setSearchResults(sapvtx);
      setShowResults(true);
      if (sapvtx.length > 0) {
       
        handleOpenModal(sapvtx);
      }
    } else if(sapvtx && sapvtx.length === 3 && sapvtx[0] && (sapvtx[1] || sapvtx[2]) && typeof sapvtx[0] === 'string'  ){
      
      const lsd = ord1.flatMap(ord => ord.filter(el => el.orderId === porBuscar.toUpperCase()));
      
      if (lsd.length > 0) {
        handleOpenModal(lsd);
      } 
    }
  }, [sapvtx, porBuscar, ord1]);
//maneja criterio de busqueda
 const handleSortCriterio = (event) => {
  setSortCriterion(event.target.value);
 }

  // Cambia la fecha desde
  const handleDateChange = (event) => {
    setStartDate(event.target.value);
  };

  // Cambia la fecha hasta
  const handleDateChangeB = (event) => {
    setEndDate(event.target.value);
  };

  // Filtro por estado de las órdenes
  const handleStatusFilterChange = (status) => {
    setStatusFilters((prevFilters) => ({
      ...prevFilters,
      [status]: !prevFilters[status],
    }));
  };
//filtra las ordenes por su estado
  const filteredOrders = ord1.map((el) => el.filter((order) => {
    
    return statusFilters[order.status];
  }));
  console.log(filteredOrders);
//marcas disponibles
const marcas = ord1.flatMap((marcaArray) => {
  return marcaArray.map((marca) => {
    if (marca.store_name) { // Verifica que store_name no sea undefined
      console.log(marca.store_name); // Verifica el valor de store_name
      const marca1 = marca.store_name.split(' ');
      return marca1[0].toLowerCase();
    }
    return null; // Retorna null si store_name es undefined
  }).filter(marca => marca !== null); // Filtra los valores null
});

const arraySinRepetidos = [...new Set(marcas)];

console.log(arraySinRepetidos);


  // Función que debería chequear cuáles están en SAP de las que se están mostrando al usuario
  const isOrderInSap = (orderId) => {
    
    
   
   
    // Chequear en orsap si la orden está en SAP
    const inSap = orsap.filter(order => order !== null).some(order => {
      return order.U_WESAP_BaseSysUID === orderId;
    });
    
    return inSap;
  
  };
  const getBrandFromNumAtCard = (numAtCard) => {
    const parts = numAtCard.split('_');
    
    if (parts.length > 1) {
      return parts[1];
    }
    return null;
  };
  const test = ord1?ord1.flat().filter(order=>order.status === "canceled" || order.status === 'cancellation-requested'||order.status === 'waiting-ffmt-authorization').map(el=>el.increment_id):null
  const test1 = orsap?orsap.filter(el=> el !== null).map(el=>el.U_WESAP_BaseSysUID):null

 const test2 = test.filter(el=>{
   
  return test1.includes(el)
 }) 



  const groupedOrdersByBrand = orsap.filter(el=>el !== null).reduce((acc, order) => {
   
    const brand = getBrandFromNumAtCard(order.NumAtCard);
    
    if (brand) {
      if (!acc[brand]) {
        acc[brand] = [];
      }
      acc[brand].push(order);
    }
    
    return acc;
  }, {});
  
  // console.log(groupedOrdersByBrand.KAPPA)
  // console.log(ord1?ord1[1].filter(el => el.status !== 'canceled' && el.status !== 'waiting-ffmt-authorization'):null)
  // console.log(ord1?ord1[1].filter(el => el.status === 'waiting-ffmt-authorization'):null)
  const brandOrderCounts = Object.keys(groupedOrdersByBrand).map((brand) => ({
    brand,
    count: groupedOrdersByBrand[brand].length,
  }));

  

  const startDateObj = new Date(startDate);

  // Calcular la fecha final restando 7 días (1 semana)
  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(startDateObj.getDate() + 7);
  
  // const isOrderInSap = (orderId) => {
  //   return verifiedOrderIds.has(orderId) || orsap.filter(order => order !== null).some(order => order.U_WESAP_BaseSysUID === orderId);
  // };
  
  const handleSearchFecha = () => {
    
    setErrFecha()
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const today = new Date();

    // Validación de fechas
    if (endDateObj < startDateObj || endDateObj > today) {
        // Mostrar un mensaje de error o realizar otra acción
        setErrFecha("El rango de fechas no es válido.");
        return;
    }

    // Calcular si la diferencia entre fechas es menor o igual a 7 días
    const timeDiff = Math.abs(endDateObj.getTime() - startDateObj.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convertir a días

    if (diffDays <= 7) {
        setShouldFetch(true);
    } else {
        // Mostrar un mensaje de error o realizar otra acción
        setErrFecha("El rango de fechas supera una semana.");
        return;
    }
};
  
  //maneja modal abre
  const handleOpenModal = (result) => {
    
    setSelectedOrder(result);
    setOpenModal(true);
  };
  //maneja modal cierra
  const handleCloseModal = () => {
    setLs1(false);
    setOpenModal(false);
    setSelectedOrder(null);
    dispatch(resetOrderCruzadas());
    setPorBuscar('')
  };
//ordenar por valor
  const ordenarPorValor = (orders) => {
    return orders.map(subArray => subArray.sort((a, b) => b.totalValue - a.totalValue));
  };
  //ordenar por valor
  const ordenarPorValorDesc = (orders) => {
    return orders.map(subArray => subArray.sort((a, b) => a.totalValue - b.totalValue));
  };
  //ordenar por fecha
  const ordenarPorFecha = (orders) => {
    return orders.map(subArray => subArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  };
//ordenar por fecha
  const ordenarPorFechaAsc = (orders) => {
    return orders.map(subArray => subArray.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
  };
 
  //efecto con switch para criterio de orden
  useEffect(() => {
    if (sortCriterio && filteredOrders) {
      let sorted = [];
      switch (sortCriterio) {
        case 'valor':
          sorted = ordenarPorValor(filteredOrders);
          break;
        case 'fecha':
          sorted = ordenarPorFecha(filteredOrders);
          break;
        case 'FechaAsc':
          sorted = ordenarPorFechaAsc(filteredOrders);
          break;
        case 'valorDesc':
          sorted = ordenarPorValorDesc(filteredOrders);
          break;
        default:
          sorted = filteredOrders; // Por si acaso el criterio no coincide
      }
  
      // Solo actualiza si sorted ha cambiado
      if (JSON.stringify(sortedOrders) !== JSON.stringify(sorted)) {
        setSortedOrders(sorted);
      }
    }
  }, [sortCriterio, filteredOrders]);


//funcion para cambiar formato de fecha
function formatearFecha(fechaString) {
  const fechaOriginal = new Date(fechaString);
  fechaOriginal.setUTCHours(fechaOriginal.getUTCHours());

  const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

  const fechaFormateada = fechaOriginal.toLocaleDateString('es-AR',   
 opcionesFecha) + ' ' +
                           fechaOriginal.toLocaleTimeString('es-AR', opcionesHora);

  return fechaFormateada;
}
//forma de datos moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value / 100);
};
 
const hostnameToBrand = {
  "piccadillyarg": 'PICCADILLY',
  "crocsarg": 'CROCS',
  "reebokarg": 'REEBOK',
  "kappaarg": 'KAPPA',
};
const [articulosMasVendidos, setArticulosMasVendidos] = useState([]);

useEffect(() => {
  if (orsap) {
    // Agrupar los artículos y contar las ventas
    const ventasPorArticulo = orsap
      .filter(el => el !== null)
      .flatMap(ele => ele.DocumentLines)
      .filter(el1 => el1.ItemCode !== 'Z-GASTOS DE ENVIO')
      .reduce((acc, item) => {
        acc[item.ItemCode] = (acc[item.ItemCode] || 0) + 1;
        return acc;
      }, {});

    // Convertir el objeto en un array de objetos para facilitar el ordenamiento
    const articulosArray = Object.entries(ventasPorArticulo).map(([itemCode, cantidad]) => ({
      itemCode,
      cantidad,
    }));

    // Ordenar los artículos por cantidad de ventas
    const ordenados = articulosArray.sort((a, b) => b.cantidad - a.cantidad);

    // Categorizar por marca
    const categorias = {
      crocs: [],
      kappa: [],
      reebok: [],
      piccadilly: [],
      superga: [],
    };

    ordenados.forEach(item => {
      if (item.itemCode.startsWith('C')) categorias.crocs.push(item);
      else if (item.itemCode.startsWith('K')) categorias.kappa.push(item);
      else if (item.itemCode.startsWith('R')) categorias.reebok.push(item);
      else if (item.itemCode.startsWith('P')) categorias.piccadilly.push(item);
      else if (item.itemCode.startsWith('S')) categorias.superga.push(item);
    });

    setArticulosMasVendidos(categorias);
  }
}, [orsap]);


//manejo de error al iniciar
const [secondsLeft, setSecondsLeft] = useState(15);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 15000);

      // Actualizar el contador cada segundo
      const intervalId = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(intervalId);
      };
    }
  }, [error]);
//

//loader de inicio
  if (ord1.length < 2 && loading) {
    return (
      <div className="flex flex-col w-full h-full object-center place-items-center mt-56 bg-transparent">
        <FadeLoader
          color="#1e5878"
          width={20}
          height={150}
          radius={50}
          margin={50}
        />
      </div>
    );
  }
  if (error) {
    return <div className="bg-black w-screen">
    {error && (
        <Alert variant="filled" severity="warning" className="mt-40">
          <p>Error: Es Probable que haya problemas de conectividad</p>
          <p> {error}</p> 
          La página se recargará en {secondsLeft} segundos.
        </Alert>
      )}
   
</div>;
  }
  
  
  
  
  
  
  const tst12 = orsap?orsap.filter(el => el!== null):null;

 const sapOrderIds = new Set(
  orsap ? tst12.map(el => el.NumAtCard.replace('VTEX_CROCS-', '')) : []
);

const ordersByBrand = tst12.reduce((acc, el) => {
  // Extraemos la marca a partir del campo NumAtCard
  const brand = el.NumAtCard.split('-')[0].split('_')[1].toLowerCase();
  if (!acc[brand]) {
    acc[brand] = new Set();
  }
  
  // Añadimos el orderId a la marca correspondiente
  acc[brand].add(el.NumAtCard.replace('VTEX_CROCS-', ''));
  return acc;
}, {});


// Filtrar las órdenes canceladas en VTEX y presentes en SAP
const canceledOrdersInSap = sortedOrders.flat().filter(order => {
  return (order.status === "canceled" || order.status === 'cancellation-requested'||order.status === 'waiting-ffmt-authorization') && sapOrderIds.has(order.orderId);
});
 
  return (
    <div className="overflow-auto" style={{ backgroundColor: '#F0F0F0' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress size={80} color="inherit" />
      </Backdrop>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={errbus}
      >
        <CircularProgress size={80} color="inherit" />
      </Backdrop>
  
  
      <Box flex={1} p={3} overflow="auto">
        <Typography variant="h6" style={{ color: '#212529' }}>Buscar</Typography>
        <Box mb={2} display="flex" gap={2}>
          <TextField
            type="search"
            label="N° de pedido VTEX"
            variant="outlined"
            size="large"
            fullWidth
            style={{ backgroundColor: '#ffffff' }}
            value={porBuscar}
            onChange={handleSearchChange}
            placeholder="1447940996774-01 o RVS-836754 "
          />
        </Box>
        {/* <Button mb={2} variant="contained" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => searchNumVtex()}>
          Buscar
        </Button> */}
  
        <Modal open={openModal} onClose={handleCloseModal} className="flex items-center justify-center">
          <Paper className="w-11/12 h-4/5 overflow-y-auto p-5">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="h6" className="mb-2" style={{ color: '#212529' }}>Order SAP</Typography>
                <Card>
                  <CardContent>
                    <Typography variant="body1" component="div" style={{ color: '#212529' }}>
                      {selectedOrder && selectedOrder.length > 1 && typeof selectedOrder[0] !== 'string' ? (
                        <>
                          <div>DocEntry: {selectedOrder[0].DocEntry}</div>
                          <div>DocNum: {selectedOrder[0].DocNum}</div>
                          <div>CardCode: {selectedOrder[0].CardCode}</div>
                          <div>CardName: {selectedOrder[0].CardName}</div>
                          <div>FederalTaxID: {selectedOrder[0].FederalTaxID}</div>
                          <div>CreationDate: {selectedOrder[0].CreationDate}</div>
                          <div>DocDate: {selectedOrder[0].DocDate}</div>
                          <div>DocTotal: {selectedOrder[0].DocTotal}</div>
                          <div>DocumentStatus: {selectedOrder[0].DocumentStatus}</div>
                        </>
                      ) : (
                        <div>Sin Datos en SAP</div>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" className="mb-2" style={{ color: '#212529' }}>Invoice SAP</Typography>
                <Card>
                  <CardContent>
                    <Typography variant="body1" component="div" style={{ color: '#212529' }}>
                      {selectedOrder && selectedOrder.length > 1 && typeof selectedOrder[1] !== 'string' ? (
                        <>
                          <div>DocEntry: {selectedOrder[1].DocEntry}</div>
                          <div>DocNum: {selectedOrder[1].DocNum}</div>
                          <div>CardCode: {selectedOrder[1].CardCode}</div>
                          <div>CardName: {selectedOrder[1].CardName}</div>
                          <div>CreationDate: {selectedOrder[1].CreationDate}</div>
                          <div>DocDate: {selectedOrder[1].DocDate}</div>
                          <div>DocTotal: {selectedOrder[1].DocTotal}</div>
                          <div>DocumentStatus: {selectedOrder[1].DocumentStatus}</div>
                        </>
                      ) : (
                        <div>Sin Datos en SAP</div>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" className="mb-2" style={{ color: '#212529' }}>VTEX</Typography>
                <Card>
                  <CardContent>
                    <Typography variant="body1" component="div" style={{ color: '#212529' }}>
                      {selectedOrder && selectedOrder.length > 1 && typeof selectedOrder[2] !== 'string' ? (
                        <>
                          <div>OrderId: {selectedOrder[2].orderId}</div>
                          <div>Items: {selectedOrder[2].items.length}</div>
                          <div>
                            Detalle:
                            <ul>
                              {selectedOrder[2].items.map((el, index) => (
                                <li key={index} className="mt-2">
                                  <div>refid: {el.refId}</div>
                                  <div>name: {el.name}</div>
                                  <div>ean: {el.ean}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      ) : (
                        selectedOrder && selectedOrder.length === 1 && selectedOrder[0] && (
                          <>
                            <div>OrderId: {selectedOrder[0].orderId}</div>
                            <div>clientName: {selectedOrder[0].clientName}</div>
                            <div>hostname: {selectedOrder[0].hostname}</div>
                            <div>status: {selectedOrder[0].status}</div>
                            <div>statusDescription: {selectedOrder[0].statusDescription}</div>
                            <div>marketPlaceOrderId: {selectedOrder[0].marketPlaceOrderId}</div>
                            <div>sequence: {selectedOrder[0].sequence}</div>
                            <div>totalItems: {selectedOrder[0].totalItems}</div>
                            <div>totalValue: {selectedOrder[0].totalValue}</div>
                            <div>creationDate: {selectedOrder[0].creationDate.split('T')[0]}</div>
                            <div>lastChange: {selectedOrder[0].lastChange.split('T')[0]}</div>
                          </>
                        )
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Divider className="mt-5" />
            <Button onClick={handleCloseModal} style={{ color: '#007bff' }} className="mt-5">
              Cerrar
            </Button>
          </Paper>
        </Modal>
  
        <Typography variant="h6" style={{ color: '#212529' }}>Fecha</Typography>
        <Box mb={2} display="flex" gap={2}>
          <TextField
            type="date"
            value={startDate}
            onChange={handleDateChange}
            label="Fecha de inicio"
            variant="outlined"
            size="small"
            fullWidth
            style={{ backgroundColor: '#ffffff' }}
          />
          <TextField
            type="date"
            value={endDate}
            onChange={handleDateChangeB}
            label="Fecha de fin"
            variant="outlined"
            size="small"
            fullWidth
            style={{ backgroundColor: '#ffffff' }}
          />
        </Box>
        <Button mb={2} variant="contained" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => handleSearchFecha()}>
          Buscar
        </Button>
        <Typography variant="p" style={{ color: '#FFC107' }}>{errFecha}</Typography>
  
        <Typography variant="h6" style={{ color: '#212529' }}>Ordenar por</Typography>
        <Box mb={2} display="flex" gap={2}>
          <Select
            value={sortCriterio}
            onChange={handleSortCriterio}
            variant="outlined"
            size="small"
            fullWidth
            style={{ backgroundColor: '#ffffff' }}
          >
            <MenuItem value="fecha">Fecha Descendente</MenuItem>
            <MenuItem value="FechaAsc">Fecha Ascendente</MenuItem>
            <MenuItem value="valor">Valor Descendente</MenuItem>
            <MenuItem value="valorDesc">Valor Ascendente</MenuItem>
          </Select>
        </Box>
  
        <FormGroup row className="mb-2">
          {Object.keys(statusFilters).map((status) => (
            <FormControlLabel
              key={status}
              control={
                <Checkbox
                  checked={statusFilters[status]}
                  onChange={() => handleStatusFilterChange(status)}
                  style={{ color: '#007bff' }}
                />
              }
              label={status}
              style={{ color: '#555555' }}
            />
          ))}
        </FormGroup>
        {lod || errbus ? <><Typography variant="h6" style={{ color: '#FFC107' }} className="mb-4">Buscando orders en sap<DotLoader size={30} /></Typography></> : <br />}
        <Typography variant="h6" className="mb-4" style={{ color: '#212529' }}>
          Pedidos desde {startDate} hasta {endDate}
        </Typography>
        <Grid container spacing={2}>
        {sortedOrders && sortedOrders.filter(elsub => elsub.length > 0).map((elsub, index) => {
            
            const brand = arraySinRepetidos[index];
         
            const filteredElsub = elsub.filter(el => test2.includes(el.increment_id));
            
            return (
              elsub.length > 0 &&(
              <Grid item key={index} xs>
                <Card p={1} style={{ backgroundColor: '#ffffff' }}>
                  <CardContent>
                    <Typography variant="h6" className="font-bold" style={{ color: '#007bff' }}>{brand ? brand : 'Marca no disponible'}</Typography>
                    <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
                      Total de Órdenes
                    </Typography>
                    <Typography className="mt-1 text-2xl leading-9 font-semibold" style={{ color: '#007bff' }}>
                      {elsub.length}
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: '#ffffff' }}>
                  <CardContent>
                    <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
                      Órdenes en SAP
                    </Typography>
                    <Typography className="mt-1 text-2xl leading-9 font-semibold" style={{ color: '#007bff' }}>
                      {brandOrderCounts?.find(el => el.brand.toLowerCase() === arraySinRepetidos[index])?.count ?? "buscando..."}
                    </Typography>
                    
                  </CardContent>
                </Card>
                 
                <Card style={{ backgroundColor: '#ffffff' }}>
                  <CardContent>
                    <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
                      Órdenes Canceladas
                    </Typography>
                    <Typography className="mt-1 text-2xl leading-9 font-semibold" style={{ color: '#007bff' }}>
                      {elsub.filter(order => order.status === "canceled"|| order.status === 'waiting-ffmt-authorization'||order.status ==='cancellation-requested').length}
                    </Typography>
                  </CardContent>
                </Card>
                {filteredElsub.length > 0 && ( // Only render if there are matching orders
            <Card style={{ color: '#ef9a9a' }}>
              <CardContent>
                <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
                  Órdenes Canceladas y en SAP:
                </Typography>
                {filteredElsub.map(el => (
                  <Typography key={el.increment_id} className="mt-1 text-2xl leading-9 font-semibold" style={{ color: '#007bff' }}>
                    {el.increment_id}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          )}
                <Card style={{ backgroundColor: '#ffffff' }}>
                  <CardContent>
                    <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
                      Total Ventas
                    </Typography>
                    <Typography className="mt-1 text-2xl leading-9 font-semibold" style={{ color: '#007bff' }}>
                      {formatCurrency(
                        elsub
                          .filter((order) => order.orderIsComplete && order.statusDescription !== "Cancelado" && order.statusDescription !== "Cancelamento Solicitado" && order.statusDescription !== "Aguardando autorização para despachar")
                          .reduce((sum, order) => sum + order.totalValue, 0)
                      )}
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: '#ffffff' }}>
                  <CardContent>
                    <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
                      Ticket Promedio
                    </Typography>
                    <Typography className="mt-1 text-2xl leading-9 font-semibold" style={{ color: '#007bff' }}>
                      {formatCurrency(
                        (elsub
                          .filter((order) => order.orderIsComplete && order.statusDescription !== "Cancelado" && order.statusDescription !== "Cancelamento Solicitado")
                          .reduce((sum, order) => sum + order.totalValue, 0)) /
                        elsub.filter((order) => order.orderIsComplete && order.statusDescription !== "Cancelado" && order.statusDescription !== "Cancelamento Solicitado").length
                      )}
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: '#ffffff' }}>
                  <CardContent>
                    <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
                      Productos más Vendidos
                    </Typography>
                    <Typography component={"div"} className="mt-1 text-xl leading-9 font-semibold" style={{ color: '#007bff' }}>
                      {articulosMasVendidos[marcas[index]]?.length ? (
                        <div>
                          {articulosMasVendidos[marcas[index]].slice(0, 5).map(({ itemCode, cantidad }, itemIndex) => (
                            <ul key={itemIndex}>
                              <span>{itemCode}: {cantidad} uds.</span>
                            </ul>
                          ))}
                        </div>
                      ) : (
                        <span>Cargando..</span>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
               
                
                <Card className="shadow-lg mt-2" style={{ backgroundColor: '#ffffff' }}>
                  <CardContent p={1}>
                    <Typography variant="h6" className="font-bold" style={{ color: '#007bff' }}>{brand}</Typography>
                    <Divider className="my-2" />
                    <List>
                      <>
                        {elsub.length > 0 && elsub.map((el) => (
                          <React.Fragment key={el.increment_id}>
                            <><ListItem key={el.increment_id} onClick={() => searchNumVtex(el.increment_id)} className="px-0 cursor-pointer" style={{ backgroundColor: sapLoaded && isOrderInSap(el.increment_id) ? '#A2F90A' : '#ffffff' }}>
                              <ListItemText
                                primary={<Typography component="span" className="font-medium" style={{ color: '#212529' }}><strong>ID:</strong> {el.increment_id}</Typography>}
                                secondary={<>
                                  <Typography component="span" variant="body2" className="block" style={{ color: '#555555' }}>
                                    <strong>Cliente:</strong> {el.customer_firstname.concat(' ',el.customer_lastname)}
                                  </Typography>
                                  <Typography component="span" variant="body2" className="block" style={{ color: '#555555' }}>
                                    <strong>Estado:</strong> {el.status}
                                  </Typography>
                                  <Typography component="span" variant="body2" className="block" style={{ color: '#555555' }}>
                                    <strong>Valor:</strong> ${(el.base_grand_total).toFixed(2)}
                                  </Typography>
                                  <Typography component="span" variant="body2" className="block" style={{ color: '#555555' }}>
                                    <strong>Fecha:</strong> {formatearFecha(el.created_at)}
                                  </Typography>
                                </>} />
                            </ListItem>
                              <br />
                            </>
                          </React.Fragment>
                        ))
                        }
                      </>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))
          })}
        </Grid>
      </Box>
    </div>
  

//   return (
//     <div className="overflow-auto">
//        <Backdrop
//         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//         open={loading}
//       >
//         <CircularProgress size={80} color="inherit" />
//       </Backdrop>
   
//     <Box flex={1} p={3} overflow="auto" className="bg-gray-600">
//       <Typography variant="h6" className="text-white">Buscar</Typography>
//       <Box mb={2} display="flex" gap={2}>
//       <TextField
//       type="search"
//       label="N° de pedido VTEX"
//       variant="outlined"
//       size="large"
//        fullWidth
//       className="bg-white"
//        value={porBuscar}
//        onChange={handleSearchChange}
//        placeholder="1447940996774-01 o RVS-836754 "
//        />
      
//       </Box>
//       <Button mb={2} variant="contained" color="primary" onClick={() => searchNumVtex()}>
//         Buscar
//       </Button>
     
//       <Modal open={openModal} onClose={handleCloseModal} className="flex items-center justify-center">
//     <Paper className="w-11/12 h-4/5 overflow-y-auto p-5">
//       <Grid container spacing={2}>
//         <Grid item xs={4}>
//           <Typography variant="h6" className="mb-2">Order SAP</Typography>
//           <Card>
//             <CardContent>
//               <Typography variant="body1" component="div">
//                 {selectedOrder && selectedOrder.length > 1 && typeof selectedOrder[0] !== 'string' ? (
//                   <>
//                     <div>DocEntry: {selectedOrder[0].DocEntry}</div>
//                     <div>DocNum: {selectedOrder[0].DocNum}</div>
//                     <div>CardCode: {selectedOrder[0].CardCode}</div>
//                     <div>CardName: {selectedOrder[0].CardName}</div>
//                     <div>FederalTaxID: {selectedOrder[0].FederalTaxID}</div>
//                     <div>CreationDate: {selectedOrder[0].CreationDate}</div>
//                     <div>DocDate: {selectedOrder[0].DocDate}</div>
//                     <div>DocTotal: {selectedOrder[0].DocTotal}</div>
//                     <div>DocumentStatus: {selectedOrder[0].DocumentStatus}</div>
//                   </>
//                 ) : (
//                   <div>Sin Datos en SAP</div>
//                 )}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={4}>
//           <Typography variant="h6" className="mb-2">Invoice SAP</Typography>
//           <Card>
//             <CardContent>
//               <Typography variant="body1" component="div">
//                 {selectedOrder && selectedOrder.length > 1 && typeof selectedOrder[1] !== 'string' ? (
//                   <>
//                     <div>DocEntry: {selectedOrder[1].DocEntry}</div>
//                     <div>DocNum: {selectedOrder[1].DocNum}</div>
//                     <div>CardCode: {selectedOrder[1].CardCode}</div>
//                     <div>CardName: {selectedOrder[1].CardName}</div>
//                     <div>CreationDate: {selectedOrder[1].CreationDate}</div>
//                     <div>DocDate: {selectedOrder[1].DocDate}</div>
//                     <div>DocTotal: {selectedOrder[1].DocTotal}</div>
//                     <div>DocumentStatus: {selectedOrder[1].DocumentStatus}</div>
//                   </>
//                 ) : (
//                   <div>Sin Datos en SAP</div>
//                 )}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={4}>
//           <Typography variant="h6" className="mb-2">VTEX</Typography>
//           <Card>
//             <CardContent>
//               <Typography variant="body1" component="div">
//                 {selectedOrder && selectedOrder.length > 1 && typeof selectedOrder[2] !== 'string' ? (
//                   <>
//                     <div>OrderId: {selectedOrder[2].orderId}</div>
//                     <div>Items: {selectedOrder[2].items.length}</div>
//                     <div>
//                       Detalle:
//                       <ul>
//                         {selectedOrder[2].items.map((el, index) => (
//                           <li key={index} className="mt-2">
//                             <div>refid: {el.refId}</div>
//                             <div>name: {el.name}</div>
//                             <div>ean: {el.ean}</div>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </>
//                 ) : (
//                   selectedOrder && selectedOrder.length === 1 && selectedOrder[0] && (
//                     <>
//                       <div>OrderId: {selectedOrder[0].orderId}</div>
//                       <div>clientName: {selectedOrder[0].clientName}</div>
//                       <div>hostname: {selectedOrder[0].hostname}</div>
//                       <div>status: {selectedOrder[0].status}</div>
//                       <div>statusDescription: {selectedOrder[0].statusDescription}</div>
//                       <div>marketPlaceOrderId: {selectedOrder[0].marketPlaceOrderId}</div>
//                       <div>sequence: {selectedOrder[0].sequence}</div>
//                       <div>totalItems: {selectedOrder[0].totalItems}</div>
//                       <div>totalValue: {selectedOrder[0].totalValue}</div>
//                       <div>creationDate: {selectedOrder[0].creationDate.split('T')[0]}</div>
//                       <div>lastChange: {selectedOrder[0].lastChange.split('T')[0]}</div>
//                     </>
//                   )
//                 )}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//       <Divider className="mt-5" />
//       <Button onClick={handleCloseModal} color="primary" className="mt-5">
//         Cerrar
//       </Button>
//     </Paper>
//   </Modal>
     
//       <Typography variant="h6" className="text-white">Fecha</Typography>
//       <Box mb={2} display="flex" gap={2}>
//         <TextField
//           type="date"
//           value={startDate}
//           onChange={handleDateChange}
//           label="Fecha de inicio"
//           variant="outlined"
//           size="small"
//           fullWidth
//           className="bg-white"
//         />
//         <TextField
//           type="date"
//           value={endDate}
//           onChange={handleDateChangeB}
//           label="Fecha de fin"
//           variant="outlined"
//           size="small"
//           fullWidth
//           className="bg-white"
//         />
//       </Box>
//       <Button mb={2} variant="contained" color="primary" onClick={() => handleSearchFecha()}>
//         Buscar
//       </Button>
//       <Typography variant="p" className="text-red-600">{errFecha}</Typography>

      
//       <Typography variant="h6" className="text-white">Ordenar por</Typography>
// <Box mb={2} display="flex" gap={2}>
//   <Select
//     value={sortCriterio}
//     onChange={handleSortCriterio}
//     variant="outlined"
//     size="small"
//     fullWidth
//     className="bg-white"
//   >
//     <MenuItem value="fecha">Fecha Descendente</MenuItem>
//     <MenuItem value="FechaAsc">Fecha Ascendente</MenuItem>
//     <MenuItem value="valor">Valor Descendente</MenuItem>
//     <MenuItem value="valorDesc">Valor Ascendente</MenuItem>
//   </Select>
// </Box>

//       <FormGroup row className="mb-2">
//         {Object.keys(statusFilters).map((status) => (
//           <FormControlLabel
//             key={status}
//             control={
//               <Checkbox
//                 checked={statusFilters[status]}
//                 onChange={() => handleStatusFilterChange(status)}
//                 className="text-red-300"
//               />
//             }
//             label={status}
//             className="text-white"
//           />
//         ))}
//       </FormGroup>
//       {lod?<><Typography variant="h6" className="text-red-600 mb-4">Buscando orders en sap<DotLoader size={30} /></Typography></>:<br />}
//       <Typography variant="h6" className="mb-4 text-white">
//         Pedidos desde {startDate} hasta {endDate}
//       </Typography>
//       <Grid container spacing={2}>
//         {sortedOrders && sortedOrders.map((elsub, index) => (
//          elsub.length > 0 && (
//           // <Grid item xs={2.4} sm={2.4} md={2.4} lg={2.4} key={index}>
//           <Grid item key={index} xs>
//           <Card p={1}>
//             <CardContent>
//           <Typography variant="h6" className="font-bold text-white">{marcas[index]}</Typography>
//               <Typography className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
//                 Total de Órdenes
//               </Typography>
//               <Typography className="mt-1 text-2xl leading-9 font-semibold text-blue-500 dark:text-indigo-400">
               
//               {elsub.filter(order => order.status !== "canceled" && order.statusDescription !== "Cancelamento Solicitado" && order.statusDescription !== "Aguardando autorização para despachar" ).length}
//               </Typography>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent>
//               <Typography className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
//                 Órdenes en SAP
//               </Typography>
//               <Typography className="mt-1 text-2xl leading-9 font-semibold text-blue-500 dark:text-indigo-400">
//   {
//     brandOrderCounts?.find(el => el.brand.toLowerCase() === marcas[index])?.count ?? "buscando..."
//   }
// </Typography>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent>
//               <Typography className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
//                 Órdenes Canceladas
//               </Typography>
//               <Typography className="mt-1 text-2xl leading-9 font-semibold text-blue-500 dark:text-indigo-400">
//                 {elsub.filter(order=>order.status === "canceled"|| order.statusDescription === "Cancelamento Solicitado" || order.statusDescription === "Aguardando autorização para despachar").length}
//               </Typography>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent>
//               <Typography className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
//                 Total Ventas
//               </Typography>
//               <Typography className="mt-1 text-2xl leading-9 font-semibold text-blue-500 dark:text-indigo-400">
//   {formatCurrency(
//     elsub
//       .filter((order) => order.orderIsComplete && order.statusDescription !== "Cancelado" && order.statusDescription !== "Cancelamento Solicitado" && order.statusDescription !== "Aguardando autorização para despachar")
//       .reduce((sum, order) => sum + order.totalValue, 0)
//   )}
// </Typography>
//             </CardContent>
//             </Card>
//             <Card>
//             <CardContent>
//               <Typography className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
//                 Ticket Promedio
//               </Typography>
//               <Typography className="mt-1 text-2xl leading-9 font-semibold text-blue-500 dark:text-indigo-400">
//   {formatCurrency(
//     (elsub
//       .filter((order) => order.orderIsComplete && order.statusDescription !== "Cancelado" && order.statusDescription !== "Cancelamento Solicitado")
//       .reduce((sum, order) => sum + order.totalValue, 0)) /
//     elsub.filter((order) => order.orderIsComplete && order.statusDescription !== "Cancelado" && order.statusDescription !== "Cancelamento Solicitado").length
//   )}
// </Typography>
// </CardContent>
// </Card>
// <Card>
//             <CardContent>
// <Typography className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
//   Productos más Vendidos
// </Typography>
// <Typography component={"div"} className="mt-1 text-xl leading-9 font-semibold text-blue-500 dark:text-indigo-400">
//                   {articulosMasVendidos[marcas[index].toLowerCase()]?.length ? (
//                     <div>
//                       {articulosMasVendidos[marcas[index].toLowerCase()].slice(0, 5).map(({ itemCode, cantidad }, itemIndex) => (
//                         <ul key={itemIndex}>
//                           <span>{itemCode}: {cantidad} uds.</span>
//                         </ul>
//                       ))}
//                     </div>
//                   ) : (
//                     <span>Cargando..</span>
//                   )}
//                 </Typography>
//             </CardContent>
//           </Card>
//             <Card className="bg-white shadow-lg mt-2 ">
//               <CardContent p={1} >
//                 <Typography variant="h6" className="font-bold text-blue-600">{marcas[index]}</Typography>
//                 <Divider className="my-2" />
//                 {/* <Typography variant="subtitle1" className="font-medium"><strong>Tickets:</strong> {elsub.length}</Typography> */}
//                 <List>
//                   <>
//                   {elsub.length > 0 && elsub.map((el) => (
//                     <React.Fragment key={el.orderId}>
//                     <><ListItem  key={el.orderId} onClick={() => searchNumVtex(el.orderId)} className="px-0 cursor-pointer" style={{ backgroundColor: sapLoaded && isOrderInSap(el.orderId) ? '#A2F90A' : 'white' }}>
//                       <ListItemText
//                         primary={<Typography component="span" className="font-medium text-gray-800"><strong>ID:</strong> {el.orderId}</Typography>}
//                         secondary={<>
//                           <Typography component="span" variant="body2" className="block text-gray-700">
//                             <strong>Cliente:</strong> {el.clientName}
//                           </Typography>
//                           <Typography component="span" variant="body2" className="block text-gray-700">
//                             <strong>Estado:</strong> {el.statusDescription}
//                           </Typography>
//                           <Typography component="span" variant="body2" className="block text-gray-700">
//                             <strong>Valor:</strong> ${(el.totalValue / 100).toFixed(2)}
//                           </Typography>
//                           <Typography component="span" variant="body2" className="block text-gray-700">
//                             <strong>Fecha:</strong> ${formatearFecha(el.creationDate)}
//                           </Typography>
//                         </>} />
//                     </ListItem>
//                     <br />
//                     </>
//                     </React.Fragment>
//                   ))
//                   }
//                   </>
//                 </List>
//               </CardContent>
//             </Card>
//           </Grid>
//         )))}
//       </Grid>
//     </Box>
    
//     </div>
  );
}

export default AllOrders;



