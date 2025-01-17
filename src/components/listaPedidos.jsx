import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectOrder } from "../redux/orderSlice";
import { fetchOrders } from "../redux/ordersThunks";
import { fetchordersaexcel } from "../redux/ordersaexcelThunks";
import { fetchAllOrders } from "../redux/ordersTodasThunks";
import FadeLoader from "react-spinners/FadeLoader";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

function OrderList(marca1) {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);
  const loading1 = useSelector((state) => state.ordersaexcel.loading);
  const ord1 = useSelector((state) => state.ordersall.ordersall);
  
  const marca = marca1.marca;
  const [statusFilters, setStatusFilters] = useState({
    "Aguardando autorização para despachar": true,
    "Pronto para o manuseio":true,
    "Faturado":true,
    "Pagamento Pendente":true,
    "Preparando Entrega": true,
    Cancelado: true,
    "Cancelamento Solicitado": true,
  });
 
  const date = new Date();
  const ayer = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 1
  );
 
 
// const st1 = orders ?  orders.map(el=> st1.push(el.status)):[]
// const st2 = orders ?  orders.map(el=> st2.push(el.statusDescription)):[]

  

  const toSearch = ayer.toISOString();
  const nm = toSearch.split("T")[0];

  const [data, setData] = useState(nm);

  useEffect(() => {
    if (data) {
      dispatch(fetchOrders(marca, data));
      // dispatch(fetchAllOrders(marca, data));
    }
  }, [dispatch, marca, data]);

  const handleDateChange = (event) => {
    setData(event.target.value);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilters((prevFilters) => ({
      ...prevFilters,
      [status]: !prevFilters[status],
    }));
  };

  const prb1 = orders
    ? orders.filter((item) => statusFilters[item.statusDescription])
    : [];
 
    const itl = ord1?.map(item => item.ord) || [];

   const mrk = Array.from({ length: 5 }, (_, i) => itl.slice(i, i + 1));
   console.log(mrk)

   for (let i = 0; i < mrk.length; i++) {
    console.log(mrk[i])
     
    
   }


  const handleSeleOrdersToExcel = () => {
    dispatch(fetchordersaexcel(marca, prb1));
  };
  if (loading)
    return (
      <div className="flex flex-col w-full h-full object-center place-items-center mt-56">
        <FadeLoader
          color="#1e5878"
          width={20}
          heigth={150}
          radius={50}
          margin={50}
        />
      </div>
    );
  if (error)
    return <div className="text-center mt-4 text-red-600">Error: {error}</div>;

  return (


    <Box className="flex-1 p-3 overflow-y-auto">
      <Typography variant="h6">Mostrando datos para: {marca1.marca}</Typography>
      <Box className="mb-4">
        <TextField
          type="date"
          value={data}
          onChange={handleDateChange}
          variant="outlined"
          size="small"
          className="mb-4"
        />
        <Button
          variant="contained"
          color="primary"
          className="mb-4"
          onClick={handleSeleOrdersToExcel}
          disabled={loading1}
          startIcon={loading1 && <CircularProgress size={20} />}
        >
          {loading1 ? "Exportando..." : "Exportar a Excel"}
        </Button>
      </Box>
      <FormGroup row className="mb-4">
        <FormControlLabel
          control={
            <Checkbox
              checked={statusFilters["Aguardando autorização para despachar"]}
              onChange={() =>
                handleStatusFilterChange("Aguardando autorização para despachar")
              }
            />
          }
          label="Aguardando autorización"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={statusFilters["Preparando Entrega"]}
              onChange={() => handleStatusFilterChange("Preparando Entrega")}
            />
          }
          label="Preparando Entrega"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={statusFilters["Cancelado"]}
              onChange={() => handleStatusFilterChange("Cancelado")}
            />
          }
          label="Cancelado"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={statusFilters["Cancelamento Solicitado"]}
              onChange={() => handleStatusFilterChange("Cancelamento Solicitado")}
            />
          }
          label="Cancelamento Solicitado"
        />
      </FormGroup>
      <Typography variant="h6" className="mb-4">
        Pedidos en VTEX
        <Typography variant="body2">Total: {prb1.length}</Typography>
      </Typography>
      <List>
        {prb1 &&
          prb1.map((order) => (
            <ListItem key={order.orderId} divider>
              <ListItemText
                primary={
                  <>
                    <strong>ID:</strong> {order.orderId}
                  </>
                }
                secondary={
                  <>
                    <Typography variant="body2">
                      <strong>Cliente:</strong> {order.clientProfileData.firstName} {order.clientProfileData.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Estado:</strong> {order.statusDescription}
                    </Typography>
                  </>
                }
              />
              <Button
                onClick={() => dispatch(selectOrder(order.orderId))}
                color="primary"
              >
                Ver Detalles
              </Button>
            </ListItem>
          ))}
      </List>
    </Box>
    // <div className="flex-1 p-3 overflow-y-auto">
    //   <h2>Mostrando datos para: {marca1.marca}</h2>
    //   <div className="mb-4">
    //     <input
    //       type="date"
    //       value={data}
    //       onChange={handleDateChange}
    //       className="mb-4 p-2 border border-gray-300 rounded"
    //     />
    //     <button
    //       className="mb-4 rounded border-2 border-sky-500 p-1 text-sm flex justify-center bg-sky-500 text-white"
    //       onClick={handleSeleOrdersToExcel}
    //       disabled={loading1}
    //     >
    //       {loading1 ? "Exportando..." : "Exportar a Excel"}
    //     </button>
    //   </div>
    //   <div className="flex  w-full items-start justify-center gap-4  mb-4">
    //     <label className="">
    //       <input
    //         type="checkbox"
    //         className="bg-sky-500 border-red-300 text-red-500 focus:ring-red-200"
    //         checked={statusFilters["Aguardando autorização para despachar"]}
    //         onChange={() =>
    //           handleStatusFilterChange("Aguardando autorização para despachar")
    //         }
    //       />
    //       Aguardando autorizaci
    //     </label>
    //     <label>
    //       <input
    //         type="checkbox"
    //         checked={statusFilters["Preparando Entrega"]}
    //         onChange={() => handleStatusFilterChange("Preparando Entrega")}
    //       />
    //       Preparando Entrega
    //     </label>
    //     <label>
    //       <input
    //         type="checkbox"
    //         checked={statusFilters["Cancelado"]}
    //         onChange={() => handleStatusFilterChange("Cancelado")}
    //       />
    //       Cancelado
    //     </label>
    //     <label>
    //       <input
    //         type="checkbox"
    //         checked={statusFilters["Cancelamento Solicitado"]}
    //         onChange={() => handleStatusFilterChange("Cancelamento Solicitado")}
    //       />
    //       Cancelamiento Solicitado
    //     </label>
    //   </div>
    //   <h2 className="text-xl mb-4">
    //     Pedidos en VTEX
    //     <p>Total: {prb1.length}</p>
    //   </h2>
    //   <ul>
    //     {prb1 &&
    //       prb1.map((order) => (
    //         <li key={order.orderId} className="border p-4 mb-4">
    //           <div className="flex justify-between">
    //             <div>
    //               <p>
    //                 <strong>ID:</strong> {order.orderId}
    //               </p>
    //               <p>
    //                 <strong>Cliente:</strong>{" "}
    //                 {order.clientProfileData.firstName}{" "}
    //                 {order.clientProfileData.lastName}
    //               </p>
    //               <p>
    //                 <strong>Estado:</strong> {order.statusDescription}
    //               </p>
    //             </div>
    //             <button
    //               onClick={() => dispatch(selectOrder(order.orderId))}
    //               className="text-blue-500"
    //             >
    //               Ver Detalles
    //             </button>
    //           </div>
    //         </li>
    //       ))}
    //   </ul>
    // </div>
  );
}

export default OrderList;
