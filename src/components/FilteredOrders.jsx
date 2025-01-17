import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../redux/ordersTodasThunks';
import { fetchOrderssap } from '../redux/ordersapThunks';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

const FilteredOrders = ({ marca }) => {
  const dispatch = useDispatch();
  const ord1 = useSelector((state) => state.ordersall.ordersall);
  const orsap = useSelector((state) => state.ordersap.ordersap);
  const loading = useSelector((state) => state.ordersall.loading);
  const error = useSelector((state) => state.ordersall.error);
  const [filter, setFilter] = useState('all');
  const date = new Date();
  const ayer = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  const toSearch = ayer.toISOString().split("T")[0];
const [startDate, setStartDate] = useState(toSearch);
  const [endDate, setEndDate] = useState(toSearch);
const data = `${startDate} al ${endDate}`;

  useEffect(() => {
    dispatch(fetchAllOrders(marca,data));
  }, [dispatch, marca]);

  useEffect(() => {
    if (ord1.length > 0) {
      const uniqueOrderIds = [...new Set(ord1.flat().map(order => order.increment_id))];
      dispatch(fetchOrderssap(uniqueOrderIds));
    }
  }, [dispatch, ord1]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const getFilteredOrders = () => {
    if (!ord1 || ord1.length === 0) return [];

    let filteredOrders = ord1.flat(); // Aplanar el array

    if (filter === 'noDoc') {
      filteredOrders = filteredOrders.filter(order => !order.DocEntry && !order.DocNum);
    }

    return filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const filteredOrders = getFilteredOrders();

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateGMT0 = new Date(dateString); // Fecha en GMT 0
    const dateGMTMinus3 = new Date(dateGMT0.getTime() - 3 * 60 * 60 * 1000); // Restar 3 horas en milisegundos
    return dateGMTMinus3.toLocaleString('es-AR', options);
  };

  return (
    <Box>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && ord1 && (
        <>
          <FormControl variant="outlined" style={{ marginBottom: '20px' }}>
            <InputLabel>Filtro</InputLabel>
            <Select value={filter} onChange={handleFilterChange} label="Filtro">
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="noDoc">Sin DocEntry y DocNum</MenuItem>
            </Select>
          </FormControl>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Creacion</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Store</TableCell>
                  <TableCell>Actualizada El</TableCell>
                  <TableCell>Detalle Pago</TableCell>
                  <TableCell>Pago Creado El</TableCell>
                  <TableCell>Pago Estado</TableCell>
                  <TableCell>DocEntry</TableCell>
                  <TableCell>DocNum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.increment_id}>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>{order.increment_id}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.store_name}</TableCell>
                    <TableCell>{formatDate(order.updated_at)}</TableCell>
                    <TableCell>{order.status_histories[0]?.comment}</TableCell>
                    <TableCell>{order.status_histories[0] ? formatDate(order.status_histories[0].created_at) : null}</TableCell>
                    <TableCell>{order.status_histories[0]?.status}</TableCell>
                    <TableCell>{order.DocEntries ? order.DocEntries.join(', ') : null}</TableCell>
                    <TableCell>{order.DocNums ? order.DocNums.join(', ') : null}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default FilteredOrders;