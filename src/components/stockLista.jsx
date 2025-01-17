import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import { fetcharticulosapdb } from "../redux/articuloSapDbThunks";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem
} from '@mui/material';


function StockList({ marca }) {
  const dispatch = useDispatch();
  
  const artdb = useSelector((state) => state.articulosapdb.articulosapdb);
  const artsap = useSelector((state) => state.articulosap.articulosap);
   const loading = useSelector((state) => state.stock.loading);
   const loading2 = useSelector((state) => state.articulosapdb.loading);
  const error = useSelector((state) => state.stock.error);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [messageIndex, setMessageIndex] = useState(0);
  const [ord, setOrd] = useState('mayor');

 

  const messages = [
    "Actualizando Datos",
    "Esto puede tardar...",
    "Cargando información...",
    "Nos vamos a demorar...",
    "Tiempo estimado de espera, 8 minutos...",
    "Procesando datos...",
  ];
  console.log(messages.length)
  console.log(messageIndex)
  
  useEffect(() => {
    if (loading) {
      const intervalId = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 30000);
      return () => clearInterval(intervalId);
    }
  }, [loading]);

  useEffect(() => {
    
    dispatch(fetcharticulosapdb(marca, page, pageSize, ord));
  }, [dispatch, marca, page, pageSize, ord]);

  const getStockCoincidencias = (refId) => {
    const item = artdb.tnt?.find((item) => item.sku === refId);
    
    return item
      ? {
          totalQuantity: item.totalQuantity,
          reservedQuantity: item.reservedQuantity,
          availableQuantity: item.availableQuantity,
        }
      : {
          totalQuantity: "N/A",
          reservedQuantity: "N/A",
          availableQuantity: "N/A",
        };
  };

  const getStockSap = (itemCode) => {
    const item = artdb.stockSap?.find((item) => item.ItemCode === itemCode);
    
    const item1 = artsap?.find((item) => item.ItemCode === itemCode) || {};
    
    return item
      ? {
          ordered: item.Ordered,
          committed: item.Committed,
          inStock: item.InStock,
        }
      : {
          ordered: item1.Ordered || "N/A",
          committed: item1.Committed || "N/A",
          inStock: item1.InStock || "N/A",
        };
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
    console.log(page)
   
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    console.log(page)
   
  };

  const order = () => {
    setOrd('mayor');
  }

  // useEffect(() => {
  //   if (page > 1 || pageSize !== 100) {
  //     dispatch(fetcharticulosapdb(marca, page, pageSize, ord));
    
  //   }
  // }, [page, pageSize, marca, ord, dispatch]);
  if (loading2)
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
  // if (loading2)
  //   return (
  //     <div className="flex flex-col w-full h-full object-center place-items-center mt-40">
  //       <FadeLoader color="#1e5878" width={20} height={150} radius={50} margin={50} />
  //     </div>
  //   );
  if (error) return <div>Error: {error}</div>;

  return (

    <Box className="w-full overflow-x-auto">
    <Box className="mt-4 mb-4">
      {loading ? (
        <Box className="flex justify-center items-center">
          <Typography variant="h6" className="mr-4">Cargando...</Typography>
          <Typography variant="h6" color="error">
            {messages[messageIndex]}
          </Typography>
          <CircularProgress className="ml-4" />
        </Box>
      ) : (
        ""
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="border-2 border-solid border-sky-500">
              <TableCell>ID Artículo</TableCell>
              <TableCell align="center" colSpan={3}>Stock en SAP</TableCell>
              <TableCell align="center" colSpan={3}>Stock en VTEX</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="center">In Stock</TableCell>
              <TableCell align="center">Committed</TableCell>
              <TableCell align="center">Ordered</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Reserved</TableCell>
              <TableCell align="center">Available</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artdb?.tnt &&
              artdb.tnt.map((producto) => {
                const sapData = getStockSap(producto.sku);
                const coincidenciasData = getStockCoincidencias(producto.sku);
                return (
                  <TableRow key={producto.sku}>
                    <TableCell>{producto.sku}</TableCell>
                    <TableCell align="center">{sapData.inStock}</TableCell>
                    <TableCell align="center">{sapData.committed}</TableCell>
                    <TableCell align="center">{sapData.ordered}</TableCell>
                    <TableCell align="center">{coincidenciasData.totalQuantity}</TableCell>
                    <TableCell align="center">{coincidenciasData.reservedQuantity}</TableCell>
                    <TableCell align="center">{coincidenciasData.availableQuantity}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    <Box className="flex justify-between mt-4">
      <Button
        onClick={handlePreviousPage}
        disabled={page === 1}
        variant="contained"
        color="primary"
        className="mr-2"
      >
        Página Anterior
      </Button>
      <Select
        value={pageSize}
        onChange={handlePageSizeChange}
        variant="outlined"
        className="mr-2"
      >
        <MenuItem value={100}>100</MenuItem>
        <MenuItem value={200}>200</MenuItem>
        <MenuItem value={300}>300</MenuItem>
      </Select>
      <Box className="px-2 py-1 bg-gray-300 text-gray-700 rounded mr-2">
        <Typography variant="body1">Actual</Typography>
        <Typography variant="h6" className="flex items-center justify-center">
          {page}
        </Typography>
      </Box>
      <Box className="px-2 py-1 bg-gray-300 text-gray-700 rounded mr-2">
        <Typography variant="body1">Total</Typography>
        <Typography variant="h6" className="flex items-center justify-center">
          {artdb ? artdb.totalPages : null}
        </Typography>
      </Box>
      <Button
        onClick={handleNextPage}
        variant="contained"
        color="primary"
        className="ml-2"
      >
        Siguiente Página
      </Button>
    </Box>
  </Box>
    // <div className="w-full overflow-x-auto">
    //   <div className="mt-4 mb-4">
    //     {loading ? (
    //       <div className="flex justify-center items-center">
    //         <span className="text-lg mr-4">Cargando...</span>
    //         <span className="text-lg text-red-500">
    //           {messages[messageIndex]}
    //         </span>
    //       </div>
    //     ) : (
    //       ""
    //     )}
    //     <table className="min-w-full divide-y divide-gray-200">
    //       <thead className="bg-gray-50">
    //       {/* <button
    //       onClick={order}
    //       className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
    //     >
    //      oder
    //     </button> */}
    //         <tr>
    //           <th
    //             scope="col"
    //             className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    //           >
    //             ID Artículo
    //           </th>
    //           <th
    //             colSpan={3}
    //             scope="col"
    //             className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
    //           >
    //             Stock en SAP
    //           </th>
    //           <th
    //             colSpan={3}
    //             scope="col"
    //             className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
    //           >
    //             Stock en vtex
    //           </th>
    //         </tr>
    //         <tr className="divide-y divide-gray-200">
    //           <th className="w-1"></th>
    //           <th className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //             In Stock
    //           </th>
    //           <th className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //             Committed
    //           </th>
    //           <th className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //             Ordered
    //           </th>
    //           <th className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //             Total
    //           </th>
    //           <th className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //             Reserved
    //           </th>
    //           <th className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //             Available
    //           </th>
    //         </tr>
    //       </thead>
    //       <tbody className="bg-white divide-y divide-gray-200">
    //         {artdb?.tnt &&
    //           artdb.tnt.map((producto) => {
    //             const sapData = getStockSap(producto.sku);
    //             const coincidenciasData = getStockCoincidencias(producto.sku);
    //             return (
    //               <tr key={producto.sku}>
    //                 <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
    //                   {producto.sku}
    //                 </td>
    //                 <td className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //                   {sapData.inStock}
    //                 </td>
    //                 <td className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //                   {sapData.committed}
    //                 </td>
    //                 <td className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //                   {sapData.ordered}
    //                 </td>
    //                 <td className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //                   {coincidenciasData.totalQuantity}
    //                 </td>
    //                 <td className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //                   {coincidenciasData.reservedQuantity}
    //                 </td>
    //                 <td className="px-3 py-2 text-center text-xs font-thin text-gray-500 uppercase">
    //                   {coincidenciasData.availableQuantity}
    //                 </td>
    //               </tr>
    //             );
    //           })}
    //       </tbody>
    //     </table>
    //   </div>
    //   <div className="flex justify-between mt-4">
    //     <button
    //       onClick={handlePreviousPage}
    //       disabled={page === 1}
    //       className="px-2 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
    //     >
    //       Página Anterior
    //     </button>
    //     <select
    //       value={pageSize}
    //       onChange={handlePageSizeChange}
    //       className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
    //     >
    //       <option value={100}>100</option>
    //       <option value={200}>200</option>
    //       <option value={300}>300</option>
    //     </select>
    //     <div className="px-2 py-1 bg-gray-300 text-gray-700 rounded">
    //       Actual
    //       <p className="items-center justify-center flex">
    //         {page}
    //       </p>
    //     </div>
    //     <div className="px-2 py-1 bg-gray-300 text-gray-700 rounded">
    //       Total
    //       <p className="items-center justify-center flex">
    //         {artdb ? artdb.totalPages : null}
    //       </p>
    //     </div>
    //     <button
    //       onClick={handleNextPage}
    //       className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
    //     >
    //       Siguiente Página
    //     </button>
    //   </div>
    // </div>
  );
}

export default StockList;
