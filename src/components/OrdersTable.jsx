import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/ordersThunks';
import { fetchDeliveryNotes } from '../redux/deliveryNotesThunks';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { CheckCircle, ErrorOutline } from '@mui/icons-material'; 

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
});
const OrdersTable = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const orders = useSelector((state) => state.orders.orders.details);
  const { deliveryNotes, loading1, error1 } = useSelector((state) => state.deliveryNotes);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('last2days');
  const [isFetching, setIsFetching] = useState(false);
  const fetchData = async () => {
    if (!isFetching) {
      setIsFetching(true);
      await dispatch(fetchOrders(getDateRange(dateRange)));
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 900000);

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

  const getDateRange = (range) => {
    const today = new Date();
    let startDate, endDate;
  
     switch (range) {
      case 'last2days':
        startDate = new Date(today);
        startDate.setUTCDate(today.getUTCDate() - 2);
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
        startDate.setUTCDate(today.getUTCDate() - 7);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
    }
  
    const startDateUTC = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
    const endDateUTC = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
  
    const fechaInicio = startDateUTC.toISOString().split('T')[0];
    const fechaFin = endDateUTC.toISOString().split('T')[0];
    return {
      fechas: `${fechaInicio} al ${fechaFin}`
    };
  };

  const getFilteredOrders = () => {
    if (!orders || orders.length === 0) return [];

    let filteredOrders = [...orders]; // Crear una copia del array

    if (filter === 'noDoc') {
      console.log('en filter === noDoc', filteredOrders);
      filteredOrders = filteredOrders.filter(order => 
        (!order.DocEntries || order.DocEntries.length === 0) && 
        (!order.DocNums || order.DocNums.length === 0)
      );
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
          <FormControl variant="outlined" className={classes.filterControl}>
            <InputLabel>Filtro</InputLabel>
            <Select value={filter} onChange={handleFilterChange} label="Filtro">
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="noDoc">Sin DocEntry y DocNum</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.filterControl}>
            <InputLabel>Rango de Fechas</InputLabel>
            <Select value={dateRange} onChange={handleDateRangeChange} label="Rango de Fechas">
              <MenuItem value="last15days">Últimos 7 días</MenuItem>
              <MenuItem value="last2days">Últimos 2 días</MenuItem>
              <MenuItem value="all">Todas las órdenes</MenuItem>
            </Select>
          </FormControl>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  <TableCell className={classes.tableCellHeader}>Creacion</TableCell>
                  <TableCell className={classes.tableCellHeader}>ID</TableCell>
                  <TableCell className={classes.tableCellHeader}>Status</TableCell>
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