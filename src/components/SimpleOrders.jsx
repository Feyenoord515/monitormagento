import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/ordersThunks";
import { Backdrop, CircularProgress, Box, Typography, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import OrdersChart from './OrdersChart';

const SimpleOrders = ({ marca }) => {
  const dispatch = useDispatch();
  const ordersData = useSelector((state) => state.orders.orders);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);
  const [dateRange, setDateRange] = useState('last2days');
  const [isFetching, setIsFetching] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);
  const minutes = Math.floor(timeLeft / 60);
 const seconds = timeLeft % 60;
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
       setTimeLeft(900);
     }, 900000);
 
     return () => clearInterval(intervalId);
   }, [dispatch, dateRange]);

  const fetchData = async () => {
    if (!isFetching) {
      setIsFetching(true);
      await dispatch(fetchOrders(getDateRange(dateRange)));
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, dateRange]);

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

  
  const groupOrdersByBrandAndDate = (orders) => {
    const groupedOrders = {};
  
    orders.forEach((order) => {
      if (order.status === 'processing' || order.status === 'complete') { 
        const brand = order.store_name.split(' ')[0].toLowerCase();
        const date = new Date(order.created_at).toISOString().split('T')[0]; 
        if (!groupedOrders[brand]) {
          groupedOrders[brand] = {};
        }
  
        if (!groupedOrders[brand][date]) {
          groupedOrders[brand][date] = {
            totalOrders: 0,
            totalItemsSold: 0,
            totalRevenue: 0,
            totalShippingCost: 0,
            skus: {},
          };
        }
  
        groupedOrders[brand][date].totalOrders += 1;
        groupedOrders[brand][date].totalItemsSold += order.items.filter(el => el.base_price_incl_tax !== 'N/A').length;
        groupedOrders[brand][date].totalRevenue += parseFloat(order.base_subtotal);
        if (order.base_shipping_amount !== 'N/A') {
          groupedOrders[brand][date].totalShippingCost += parseFloat(order.base_shipping_amount);
        }
        order.items.forEach(item => {
          if(item.base_price_incl_tax !== 'N/A'){
            if (groupedOrders[brand][date].skus[item.sku]) {
              groupedOrders[brand][date].skus[item.sku] += 1;
            } else {
              groupedOrders[brand][date].skus[item.sku] = 1;
            }
          }
        });
      }
    });
  
    return groupedOrders;
  };

  const groupedOrders = ordersData.details ? groupOrdersByBrandAndDate(ordersData.details) : {};

const chartData = Object.keys(groupedOrders).map(brand => {
  return Object.keys(groupedOrders[brand]).map(date => ({
    brand: brand.charAt(0).toUpperCase() + brand.slice(1),
    date,
    totalOrders: groupedOrders[brand][date].totalOrders,
    totalItemsSold: groupedOrders[brand][date].totalItemsSold,
    totalRevenue: groupedOrders[brand][date].totalRevenue,
    totalShippingCost: groupedOrders[brand][date].totalShippingCost,
  }));
}).flat();
console.log(chartData)
return (
  <Box>
    {!ordersData&&loading ? (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    ) : error ? (
      <Typography variant="h6" color="error">
        Error al cargar las órdenes
      </Typography>
    ) : (
      <>
        <FormControl variant="outlined" style={{ marginBottom: '20px' }}>
          <InputLabel>Rango de Fechas</InputLabel>
          <Select value={dateRange} onChange={handleDateRangeChange} label="Rango de Fechas">
            <MenuItem value="last7days">Últimos 7 días</MenuItem>
            <MenuItem value="last2days">Últimos 2 días</MenuItem>
            <MenuItem value="all">Todas las órdenes</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="h5" className="font-bold" style={{ color: '#007bff', marginBottom: '20px' }}>
                      Las órdenes se actualizarán en {minutes}:{seconds < 10 ? `0${seconds}` : seconds} minutos
                            </Typography>
        <Typography variant="h5" className="font-bold" style={{ color: '#007bff', marginBottom: '20px' }}>
          Total de Órdenes: {ordersData.totalOrders}
        </Typography>
        <Typography variant="h5" className="font-bold" style={{ color: '#007bff', marginBottom: '20px' }}>
           Órdenes Canceladas: {ordersData.canceledOrders}
        </Typography>
        <Typography variant="h6" className="font-bold" style={{ color: '#007bff', marginBottom: '20px' }}>
          Órdenes en estado "processing" y "complete": {ordersData.twoStates}
        </Typography>
        <Typography variant="h6" className="font-bold" style={{ color: '#007bff', marginBottom: '20px' }}>
          Órdenes en SAP: {ordersData.processingOrdersInSap}
        </Typography>
        <Typography variant="h6" className="font-bold" style={{ color: '#007bff', marginBottom: '20px' }}>
          Faltan cargar a SAP: {ordersData.processingOrdersNotInSap}
        </Typography>
        <Grid container spacing={2}>
            {Object.keys(groupedOrders).map((brand, brandIndex) => (
              <Grid item key={brandIndex} xs={12} sm={6} md={3}>
                <Card style={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" className="font-bold" style={{ color: '#007bff' }}>
                      {brand.charAt(0).toUpperCase() + brand.slice(1)}
                    </Typography>
                    {Object.keys(groupedOrders[brand]).map((date, dateIndex) => (
                      <Box key={dateIndex} style={{ marginBottom: '10px' }}>
                        <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
                          Fecha: {date}
                        </Typography>
                        <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
                          Total de Órdenes: {groupedOrders[brand][date].totalOrders}
                        </Typography>
                        <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
                          Total de Artículos Vendidos: {groupedOrders[brand][date].totalItemsSold}
                        </Typography>
                        <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
                          Total de Ingresos: ${groupedOrders[brand][date].totalRevenue.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        <OrdersChart className="w-full" chartData={chartData} />
      </>
    )}
  </Box>
);
};
//   return (
//     <Box>
//       {loading ? (
//         <Backdrop open={true}>
//           <CircularProgress color="inherit" />
//         </Backdrop>
//       ) : error ? (
//         <Typography variant="h6" color="error">
//           Error al cargar las órdenes
//         </Typography>
//       ) : (
//         <>
//           <FormControl variant="outlined" style={{ marginBottom: '20px' }}>
//             <InputLabel>Rango de Fechas</InputLabel>
//             <Select value={dateRange} onChange={handleDateRangeChange} label="Rango de Fechas">
//               <MenuItem value="last15days">Últimos 15 días</MenuItem>
//               <MenuItem value="last2days">Últimos 2 días</MenuItem>
//               <MenuItem value="all">Todas las órdenes</MenuItem>
//             </Select>
//           </FormControl>
//           <Typography variant="h5" className="font-bold" style={{ color: '#007bff', marginBottom: '20px' }}>
//             Total de Órdenes: {ordersData.totalOrders}
//           </Typography>
//           <Typography variant="h6" className="font-bold" style={{ color: '#007bff', marginBottom: '20px' }}>
//             Órdenes en estado "processing": {ordersData.processingOrders}
//           </Typography>
//           <Grid container spacing={2}>
//             {Object.keys(groupedOrders).map((brand, brandIndex) => (
//               <Grid item key={brandIndex} xs={12} sm={6} md={4}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6" className="font-bold" style={{ color: '#007bff' }}>
//                       {brand.charAt(0).toUpperCase() + brand.slice(1)}
//                     </Typography>
//                     {Object.keys(groupedOrders[brand]).map((date, dateIndex) => (
//                       <Box key={dateIndex} style={{ marginBottom: '20px' }}>
//                         <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
//                           Fecha: {date}
//                         </Typography>
//                         <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
//                           Total de Órdenes: {groupedOrders[brand][date].totalOrders}
//                         </Typography>
//                         <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
//                           Total de Artículos Vendidos: {groupedOrders[brand][date].totalItemsSold}
//                         </Typography>
//                         <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
//                           Total de Ingresos: ${groupedOrders[brand][date].totalRevenue.toFixed(2)}
//                         </Typography>
//                         <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
//                           Total de Costos de Envío: ${groupedOrders[brand][date].totalShippingCost.toFixed(2)}
//                         </Typography>
//                         <Typography className="text-sm leading-5 font-medium" style={{ color: '#555555' }}>
//                           SKUs Vendidos:
//                         </Typography>
//                         <ul>
//                           {Object.keys(groupedOrders[brand][date].skus).map((sku, skuIndex) => (
//                             <li key={skuIndex} style={{ color: '#555555' }}>
//                               {sku}: {groupedOrders[brand][date].skus[sku]}
//                             </li>
//                           ))}
//                         </ul>
//                       </Box>
//                     ))}
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </>
//       )}
//     </Box>
//   );
// };

export default SimpleOrders;