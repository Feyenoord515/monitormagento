import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchOrdersCruzadas } from "../redux/ordersCruzadasThunks";
import FadeLoader from "react-spinners/FadeLoader";
import DataCard from "./DataCard";
import { TextField, Checkbox, FormControlLabel, Button, Typography, Box, Grid } from '@mui/material';
import { fetchOrders } from "../redux/ordersThunks";

function StockCruzado(marca1) {
  const history = useHistory();
  console.log(history);
  const dispatch = useDispatch();
  const cruzadas = useSelector((state) => state.ordercruzadas.OrderCruzadas);
  const marca = marca1.marca || "crocs";
  const loading = useSelector((state) => state.ordercruzadas.loading);
  const error = useSelector((state) => state.ordercruzadas.error);
  const [sortedVtexData, setSortedVtexData] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [statusFilters, setStatusFilters] = useState({
    "Aguardando autorização para despachar": true,
    "Preparando Entrega": true,
    Cancelado: true,
    "Cancelamento Solicitado": true,
  });

  const [dataEnd, setdataEnd] = useState();
  const date = new Date();
  const ayer = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 1
  );

  const toSearch = ayer.toISOString();
  const nm = toSearch.split("T")[0];

  const [data, setData] = useState(nm);
  console.log(data);
  console.log(dataEnd);
  useEffect(() => {
    if (data && dataEnd) {
      const dateRange = `${data} al ${dataEnd}`;
      console.log(dateRange);
      dispatch(fetchOrdersCruzadas(marca, dateRange));
    } else if (data) {
      dispatch(fetchOrdersCruzadas(marca, data));
    }
  }, [dispatch, marca, data, dataEnd]);
  //  useEffect(() => {
  //   if (data) {
  //     dispatch(fetchOrdersCruzadas(marca, data));
  //   } else if(data && dataEnd){
  //     const tre = data.concat('al',dataEnd);
  //     console.log(tre)
  //     dispatch(fetchOrdersCruzadas(marca, tre))
  //   }
  // }, [dispatch, marca, data]);

  useEffect(() => {
    if (cruzadas) {
      setSortedVtexData(cruzadas.vtex);
    }
  }, [cruzadas]);

  const sortVtexData = (order) => {
    const sortedData = [...cruzadas.vtex].sort((a, b) => {
      switch (order) {
        case "fechaAsc":
          return new Date(a.creationDate) - new Date(b.creationDate);
        case "fechaDesc":
          return new Date(b.creationDate) - new Date(a.creationDate);
        case "lastNameAsc":
          return a.clientProfileData.lastName.localeCompare(
            b.clientProfileData.lastName
          );
        case "lastNameDesc":
          return b.clientProfileData.lastName.localeCompare(
            a.clientProfileData.lastName
          );
        default:
          return 0;
      }
    });
    setSortedVtexData(sortedData);
    setSortOrder(order);
  };

  const handleDateChange = (event) => {
    setData(event.target.value);
  };
  const handleDateChangehasta = (event) => {
    setdataEnd(event.target.value);
  };
  const handleStatusFilterChange = (status) => {
    setStatusFilters((prevFilters) => ({
      ...prevFilters,
      [status]: !prevFilters[status],
    }));
  };

  const filteredSapData = Array.isArray(cruzadas?.sap) ? cruzadas.sap : [];
  const filteredVtexData = Array.isArray(cruzadas?.vtex)
    ? cruzadas.vtex.filter((item) => statusFilters[item.statusDescription])
    : [];
  const prb1 = sortedVtexData
    ? sortedVtexData.filter((item) => statusFilters[item.statusDescription])
    : [];
  console.log(prb1);
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

    <Box className="flex flex-col items-center p-4 overflow-auto w-full">
      {data ? (
        <>
          <Typography variant="h5" gutterBottom>
            Orders fecha: <span className="font-semibold">{data}</span>
          </Typography>
          <Grid container spacing={3} className="mb-4 w-3/4 justify-around items-center">
            <Grid item>
              <Typography variant="body1">Desde</Typography>
              <TextField
                type="date"
                value={data}
                onChange={handleDateChange}
                variant="outlined"
                size="small"
                className="mb-2"
              />
            </Grid>
            <Grid item>
              <Typography variant="body1">Hasta</Typography>
              <TextField
                type="date"
                value={dataEnd}
                onChange={handleDateChangehasta}
                variant="outlined"
                size="small"
                className="mb-2"
              />
            </Grid>
          </Grid>
          <Typography variant="h6" className="justify-center font-semibold uppercase mb-2">
            {marca}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Total de Orders
            <span className="font-semibold ml-2">SAP: {cruzadas?.sap?.length}</span>
            <span className="font-semibold ml-2">VTEX: {cruzadas?.vtex?.length}</span>
          </Typography>
          <Box className="flex w-full justify-center mb-4">
            <Button
              onClick={() => sortVtexData('fechaAsc')}
              variant={sortOrder === 'fechaAsc' ? 'contained' : 'outlined'}
              color="primary"
            >
              Ordenar por Fecha Ascendente
            </Button>
            <Button
              onClick={() => sortVtexData('fechaDesc')}
              variant={sortOrder === 'fechaDesc' ? 'contained' : 'outlined'}
              color="primary"
            >
              Ordenar por Fecha Descendente
            </Button>
            <Button
              onClick={() => sortVtexData('lastNameAsc')}
              variant={sortOrder === 'lastNameAsc' ? 'contained' : 'outlined'}
              color="primary"
            >
              Ordenar por Apellido Ascendente
            </Button>
            <Button
              onClick={() => sortVtexData('lastNameDesc')}
              variant={sortOrder === 'lastNameDesc' ? 'contained' : 'outlined'}
              color="primary"
            >
              Ordenar por Apellido Descendente
            </Button>
          </Box>
          <Box className="flex w-full items-center justify-center gap-3 mb-4">
            <FormControlLabel
              control={
                <Checkbox
                  checked={statusFilters['Aguardando autorização para despachar']}
                  onChange={() => handleStatusFilterChange('Aguardando autorização para despachar')}
                  color="primary"
                />
              }
              label="Aguardando autorização para despachar"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={statusFilters['Preparando Entrega']}
                  onChange={() => handleStatusFilterChange('Preparando Entrega')}
                  color="primary"
                />
              }
              label="Preparando Entrega"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={statusFilters['Cancelado']}
                  onChange={() => handleStatusFilterChange('Cancelado')}
                  color="primary"
                />
              }
              label="Cancelado"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={statusFilters['Cancelamento Solicitado']}
                  onChange={() => handleStatusFilterChange('Cancelamento Solicitado')}
                  color="primary"
                />
              }
              label="Cancelamento Solicitado"
            />
          </Box>
          <Grid container spacing={3} className="w-full">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                SAP <Typography variant="caption">({filteredSapData.length})</Typography>
              </Typography>
              {filteredSapData.length > 0 ? (
                filteredSapData.map((item) => (
                  <DataCard key={item.DocEntry} data={item} type="sap" />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">No hay data</Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                VTEX <Typography variant="caption">({prb1.length})</Typography>
              </Typography>
              {prb1 && prb1.length > 0 ? (
                prb1.map((item) => (
                  <DataCard key={item.orderId} data={item} type="vtex" />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">No hay data</Typography>
              )}
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>Ingrese Una Fecha</Typography>
          <TextField
            type="date"
            value={data}
            onChange={handleDateChange}
            variant="outlined"
            size="small"
            className="mb-4"
          />
        </>
      )}
    </Box>
    // <div className="flex flex-col items-center p-4 overflow-auto w-full">
    //   {data ? (
    //     <>
    //       <h2 className=" text-xl mb-4">
    //         Orders fecha: <span className="font-semibold">{data}</span>
    //       </h2>
    //       <div className="mb-2 columns-2 w-3/4 justify-around items-center ">
    //        <p> Desde{"  "}</p>
    //         <input
    //           type="date"
    //           value={data}
    //           onChange={handleDateChange}
    //           className="mb-2 p-1 border mr-3 border-gray-300 rounded"
    //         />
    //        <p> {"     "}Hasta{"     "}</p>
    //         <input
    //           type="date"
    //           value={dataEnd}
    //           onChange={handleDateChangehasta}
    //           className="mb-2 p-2 border border-gray-300 rounded"
    //         />
    //       </div>
    //       <h2 className="justify-center font-semibold uppercase mb-2 text-lg">
    //         {marca}
    //       </h2>
    //       <h2 className="text-xl mb-4">
    //         Total de Orders
    //         <span className="font-semibold ml-2">
    //           SAP: {cruzadas?.sap?.length}
    //         </span>
    //         <span className="font-semibold ml-2">
    //           VTEX: {cruzadas?.vtex?.length}
    //         </span>
    //       </h2>
    //       <div className="flex w-full justify-center mb-4">
    //         <button
    //           onClick={() => sortVtexData("fechaAsc")}
    //           className={`px-4 py-2 border rounded-l ${
    //             sortOrder === "fechaAsc"
    //               ? "bg-blue-500 text-white"
    //               : "bg-white text-blue-500"
    //           }`}
    //         >
    //           Ordenar por Fecha Ascendente
    //         </button>
    //         <button
    //           onClick={() => sortVtexData("fechaDesc")}
    //           className={`px-4 py-2 border-t border-b border-r ${
    //             sortOrder === "fechaDesc"
    //               ? "bg-blue-500 text-white"
    //               : "bg-white text-blue-500"
    //           }`}
    //         >
    //           Ordenar por Fecha Descendente
    //         </button>
    //         <button
    //           onClick={() => sortVtexData("lastNameAsc")}
    //           className={`px-4 py-2 border rounded-l ${
    //             sortOrder === "lastNameAsc"
    //               ? "bg-blue-500 text-white"
    //               : "bg-white text-blue-500"
    //           }`}
    //         >
    //           Ordenar por Apellido Ascendente
    //         </button>
    //         <button
    //           onClick={() => sortVtexData("lastNameDesc")}
    //           className={`px-4 py-2 border-t border-b border-r ${
    //             sortOrder === "lastNameDesc"
    //               ? "bg-blue-500 text-white"
    //               : "bg-white text-blue-500"
    //           }`}
    //         >
    //           Ordenar por Apellido Descendente
    //         </button>
    //       </div>
    //       <div className="flex w-full items-center justify-center gap-3  mb-4">
    //         <label>
    //           <input
    //             type="checkbox"
    //             checked={statusFilters["Aguardando autorização para despachar"]}
    //             onChange={() =>
    //               handleStatusFilterChange(
    //                 "Aguardando autorização para despachar"
    //               )
    //             }
    //           />
    //           Aguardando autorização para despachar
    //         </label>
    //         <label>
    //           <input
    //             type="checkbox"
    //             checked={statusFilters["Preparando Entrega"]}
    //             onChange={() => handleStatusFilterChange("Preparando Entrega")}
    //           />
    //           Preparando Entrega
    //         </label>
    //         <label>
    //           <input
    //             type="checkbox"
    //             checked={statusFilters["Cancelado"]}
    //             onChange={() => handleStatusFilterChange("Cancelado")}
    //           />
    //           Cancelado
    //         </label>
    //         <label>
    //           <input
    //             type="checkbox"
    //             checked={statusFilters["Cancelamento Solicitado"]}
    //             onChange={() =>
    //               handleStatusFilterChange("Cancelamento Solicitado")
    //             }
    //           />
    //           Cancelamento Solicitado
    //         </label>
    //       </div>

    //       <div className="flex w-full">
    //         <div className="w-1/2 p-2">
    //           <h3 className="text-lg font-semibold mb-1">
    //             SAP<p className="text-xs">{filteredSapData.length}</p>
    //           </h3>
    //           {filteredSapData.length > 0 ? (
    //             filteredSapData.map((item) => (
    //               <DataCard key={item.DocEntry} data={item} type="sap" />
    //             ))
    //           ) : (
    //             <p className="text-gray-500">No hay data</p>
    //           )}
    //         </div>
    //         <div className="w-1/2 p-2">
    //           <h3 className="text-lg font-semibold mb-1">
    //             VTEX<p className="text-xs">{prb1.length}</p>
    //           </h3>
    //           {prb1 && prb1.length > 0 ? (
    //             prb1.map((item) => (
    //               <DataCard key={item.orderId} data={item} type="vtex" />
    //             ))
    //           ) : (
    //             <p className="text-gray-500">No hay data</p>
    //           )}
    //         </div>
    //       </div>
    //     </>
    //   ) : (
    //     <>
    //       <h2 className="text-xl mb-4">Ingrese Una Fecha</h2>
    //       <div className="mb-4">
    //         <input
    //           type="date"
    //           value={data}
    //           onChange={handleDateChange}
    //           className="mb-4 p-2 border border-gray-300 rounded"
    //         />
    //       </div>
    //     </>
    //   )}
    // </div>
  );
}

export default StockCruzado;
