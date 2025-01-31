import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/ordersThunks';
import { fetchDeliveryNotes } from '../redux/deliveryNotesThunks';
import { Button,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';
import { CheckCircle, ErrorOutline } from '@mui/icons-material'; 
import * as XLSX from 'xlsx';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f9f9f9',
    },
  },
  tableCell: {
    color: '#333',
  },
  tableCellHeader: {
    fontWeight: 'bold',
    color: '#555',
  },
  filterControl: {
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: '20px',
  },
  downloadButton: {
    alignSelf: 'flex-end',
    marginBottom: '20px',
    marginTop: '10px',
  },
});
const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(2),
}));

const FilterGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

const UpdateGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));


const OrdersTable = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const orders = useSelector((state) => state.orders.orders.details);
  const { deliveryNotes, loading1, error1 } = useSelector((state) => state.deliveryNotes);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('last7days');
  const [isFetching, setIsFetching] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;

  const fetchData = async () => {
    if (!isFetching) {
      setIsFetching(true);
      await dispatch(fetchOrders(getDateRange(dateRange)));
      setIsFetching(false);
    }
  };
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
  
    return () => clearInterval(countdown);
  }, []);
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      // Al actualizar, forzamos una nueva solicitud limpiando el dateRange
      localStorage.removeItem('dateRange');
      fetchData();
      setTimeLeft(300); // Reiniciar el temporizador a 5 minutos
    }, 300000); // 5 minutos

    return () => clearInterval(intervalId);
  }, [dispatch, dateRange]);

  

  useEffect(() => {
    if (orders && orders.length > 0) {
      const incrementIds = orders.map((order) => order.increment_id);
      dispatch(fetchDeliveryNotes(incrementIds)); // Llamada única con el array
    }
  }, [dispatch,orders]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleManualFetch = () => {
    fetchData();
    setTimeLeft(300); // Reiniciar 5 minutos
  };


  const getDateRange = (range) => {
    const today = new Date();
    let startDate, endDate;
  
     switch (range) {
      case 'last2days':
        startDate = new Date(today);
        startDate.setUTCDate(today.getUTCDate() - 5);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
      case 'all':
        startDate = new Date(Date.UTC(2024, 11, 24, 0, 0, 0, 0));
        endDate = new Date(today);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
      case 'last7days':
      default:
        startDate = new Date(today);
        startDate.setUTCDate(today.getUTCDate() - 15);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
    }
  
    const startDateUTC = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
    const endDateUTC = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
  
    const fechaInicio = startDateUTC.toISOString().split('T')[0];
    const fechaFin = endDateUTC.toISOString().split('T')[0];
    console.log(`${fechaInicio} al ${fechaFin}`)
    return {
      fechas: `${fechaInicio} al ${fechaFin}`
    };
  };

  const getFilteredOrders = () => {
    if (!orders || orders.length === 0) return [];
  
    let filteredOrders = [...orders]; // Crear una copia del array
  
    if (filter === 'noDoc') {
      filteredOrders = filteredOrders.filter(order => 
        (!order.DocEntries || order.DocEntries.length === 0) && 
        (!order.DocNums || order.DocNums.length === 0)
      );
    } else if (filter === 'processing') {
      filteredOrders = filteredOrders.filter(order => order.status === 'processing');
    }
  
    return filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };
  const filteredOrders = getFilteredOrders();
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateGMT0 = new Date(dateString); // Fecha en GMT 0
    const dateGMTMinus3 = new Date(dateGMT0.getTime() - 3 * 60 * 60 * 1000); // Restar 3 horas en milisegundos
    return dateGMTMinus3.toLocaleString('es-AR', options)
  };
  const extractBrContent = (str) => {
    const regex = /<br\/>([^<]*)/g;
    let match;
    const results = [];
    while ((match = regex.exec(str)) !== null) {
        results.push(match[1].trim());
    }
    return results;
};

const extractTienda = (str) => {
 
  const results = str.split(' ')[0];
 
  return results;
}
const getRelevantStatus = (statusHistories) => {
  // Filtrar los elementos que no son notificaciones de correo
  const relevantStatus = statusHistories.find(
    (status) => status.comment.includes('Notificación automática de Mercado Pago')
  );
  return relevantStatus ? relevantStatus : 'N/A';
};

const getRelevantStatusAndreani = (statusHistories) => {
  const relevantStatus = statusHistories.find(
    (status) => status.comment.includes('Andreani actualizacion de estado')
  );
  return relevantStatus ? relevantStatus : 'N/A';

}
const getAndreaniHistory = (statusHistories) => {
  // Filtrar los estados relacionados con Andreani
  const andreaniStatuses = statusHistories
    .filter((status) => status.comment.includes('Andreani actualizacion de estado'))
    .map((status) => {
      const stateMatch = status.comment.match(/Andreani actualizacion de estado: (.+)/);
      return {
        state: stateMatch ? stateMatch[1] : 'Estado desconocido',
        date: status.created_at,
      };
    });

  return andreaniStatuses;
};

function getLocalStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += key.length + localStorage.getItem(key).length;
    }
  }
  return total;
}

console.log(`Espacio utilizado en localStorage: ${getLocalStorageSize()} bytes`);
const handleDownloadReport = () => {
  const data = filteredOrders.map(order => ({
    Creacion: formatDate(order.created_at),
    ID: order.increment_id,
    Status: order.status,
    Store: extractTienda(order.store_name),
    Actualizada_El: formatDate(order.updated_at),
    Detalle_Pago: extractBrContent(getRelevantStatus(order.status_histories).comment)[0],
    Pago_Creado_El: getRelevantStatus(order.status_histories) ? formatDate(getRelevantStatus(order.status_histories).created_at) : null,
    Pago_Estado: getRelevantStatus(order.status_histories).status,
    DocEntry: order.DocEntries ? order.DocEntries.join(', ') : null,
    DocNum: order.DocNums ? order.DocNums.join(', ') : null,
    Andreani: order.shipping_description.includes("Andreani - Retiro en sucursal")
      ? order.shipping_description
      : (
        getAndreaniHistory(order.status_histories).length > 0
          ? getAndreaniHistory(order.status_histories).map((state, index) => (
            `${state.state} - ${formatDate(state.date)}`
          )).join(', ')
          : "Sin actualizaciones de envío"
      ),
    Delivery_Note: deliveryNotes.some(note => note.U_WESAP_BaseSysUID === order.increment_id) ? 'Sí' : 'No'
  }));

  // Crear un nuevo libro de Excel
  const workbook = XLSX.utils.book_new();

  // Convertir los datos a una hoja de cálculo
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Agregar la hoja de cálculo al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Ventas');

  // Generar el archivo Excel y descargarlo
  XLSX.writeFile(workbook, 'reporte_ventas.xlsx');
};

  return (
    <Box>
      {!orders&&loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="h6" color="error">
                Error al cargar las órdenes
              </Typography>
      ) : (
        <>
       <StyledBox>
            <FilterGroup>
              <FormControl variant="outlined" sx={{ marginBottom: 2 }}>
                <InputLabel>Filtro</InputLabel>
                <Select value={filter} onChange={handleFilterChange} label="Filtro">
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="noDoc">Sin DocEntry y DocNum</MenuItem>
                  <MenuItem value="processing">En Proceso</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ marginBottom: 2 }}>
                <InputLabel>Rango de Fechas</InputLabel>
                <Select value={dateRange} onChange={handleDateRangeChange} label="Rango de Fechas">
                  <MenuItem value="last7days">Últimos 15 días</MenuItem>
                  <MenuItem value="last2days">Últimos 5 días</MenuItem>
                  <MenuItem value="all">Todas las órdenes</MenuItem>
                </Select>
              </FormControl>
            </FilterGroup>
            <UpdateGroup>
              <Typography variant="h5" className="font-bold" sx={{ color: '#007bff', marginBottom: 2 }}>
                Las órdenes se actualizarán en {minutes}:{seconds < 10 ? `0${seconds}` : seconds} minutos
              </Typography>
              <Button variant="contained" color="primary" onClick={handleManualFetch} disabled={isFetching}>
                {isFetching ? 'Actualizando...' : 'Actualizar Ahora'}
              </Button>
            </UpdateGroup>
            <Button variant="contained" color="primary" sx={{ alignSelf: 'flex-end' }} onClick={handleDownloadReport}>
              Descargar Reporte de Ventas
            </Button>
          </StyledBox>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  <TableCell className={classes.tableCellHeader}>Creacion</TableCell>
                  <TableCell className={classes.tableCellHeader}>ID</TableCell>
                  <TableCell className={classes.tableCellHeader}>Status</TableCell>
                  <TableCell className={classes.tableCellHeader}>State</TableCell>
                  <TableCell className={classes.tableCellHeader}>Store</TableCell>
                  <TableCell className={classes.tableCellHeader}>Actualizada El</TableCell>
                  <TableCell className={classes.tableCellHeader}>Detalle Pago</TableCell>
                  <TableCell className={classes.tableCellHeader}>Pago Creado El</TableCell>
                  <TableCell className={classes.tableCellHeader}>Pago Estado</TableCell>
                  <TableCell className={classes.tableCellHeader}>DocEntry</TableCell>
                  <TableCell className={classes.tableCellHeader}>DocNum</TableCell>
                  <TableCell className={classes.tableCellHeader}>Andreani</TableCell>
                  <TableCell className={classes.tableCellHeader}>Delivery Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {filteredOrders.map((order) => {
                const statuses = getRelevantStatus(order.status_histories);
                const statusAndreani = getRelevantStatusAndreani(order.status_histories)
                const andreaniHistory = getAndreaniHistory(order.status_histories);
                const hasDeliveryNote = deliveryNotes.some(
                  (note) => note.U_WESAP_BaseSysUID === order.increment_id
                );
                return (
                  <TableRow key={order.increment_id} className={classes.tableRow}>
                    <TableCell className={classes.tableCell}>{formatDate(order.created_at)}</TableCell>
                    <TableCell className={classes.tableCell}>{order.increment_id}</TableCell>
                    <TableCell className={classes.tableCell}>{order.status}</TableCell>
                    <TableCell className={classes.tableCell}>{order.state}</TableCell>
                    <TableCell className={classes.tableCell}>{extractTienda(order.store_name)}</TableCell>
                    <TableCell className={classes.tableCell}>{formatDate(order.updated_at)}</TableCell>
                    <TableCell className={classes.tableCell}>{extractBrContent(statuses.comment)[0]}</TableCell>
                    <TableCell className={classes.tableCell}>{statuses ? formatDate(statuses.created_at) : null}</TableCell>
                    <TableCell className={classes.tableCell}>{statuses.status}</TableCell>
                    <TableCell className={classes.tableCell}>{order.DocEntries ? order.DocEntries.join(', ') : null}</TableCell>
                    <TableCell className={classes.tableCell}>{order.DocNums ? order.DocNums.join(', ') : null}</TableCell>
                    <TableCell className={classes.tableCell}>
  {order.shipping_description.includes("Andreani - Retiro en sucursal") 
    ? order.shipping_description 
    : (
      andreaniHistory.length > 0 
        ? andreaniHistory.map((state, index) => (
            <Typography key={index}>
              {state.state} - {formatDate(state.date)}
            </Typography>
          ))
        : "Sin actualizaciones de envío"
    )}
</TableCell>
<TableCell className={classes.tableCell}>
        {hasDeliveryNote ? (
          <CheckCircle style={{ color: 'green' }} />
        ) : (
          // <ErrorOutline style={{ color: 'red' }} />
          <CheckCircle style={{ color: 'red' }} />
        )}
      </TableCell>
                    {/* <TableCell className={classes.tableCell}>{order.shipping_description.includes("Andreani - Retiro en sucursal") ? order.shipping_description : statusAndreani ? statusAndreani.comment : null}</TableCell> */}
                  </TableRow>
                );
              })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default OrdersTable;