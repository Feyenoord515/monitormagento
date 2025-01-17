import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchbuscarartsap } from "../redux/buscararticuloThunks";
import { clearSearchResults } from "../redux/buscararticuloSlice";
import { fetchorderxidvtex } from "../redux/orderxidThunks";
import { clearSearchResultsOrd } from "../redux/orderxidSlice";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
 
} from '@mui/material';


function Sidebar({ open, toggleSidebar, marca, setMarca }) {
  const dispatch = useDispatch();
  const arti = useSelector((state) => state.buscarartsap.buscarartsap);
  const ord = useSelector((state) => state.orderxidvtex.orderxidvtex);
  const [searchOrd, setSearchOrd] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
console.log(typeof ord)
  console.log(arti.length)
  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(clearSearchResults());
  };

  


  const handleClearSearchOrd = () => {
    setSearchOrd("");
    dispatch(clearSearchResultsOrd());
  };

  const handleSearchChangeOrder = (e) => {
    setSearchOrd(e.target.value);
  };

  const handleSearchSubmitOrd = (e) => {
    e.preventDefault();
    dispatch(fetchorderxidvtex(searchOrd, marca));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchbuscarartsap(searchTerm, marca));
  };

  

  return (

    <Box className="w-1/4 bg-gray-100 p-4 overflow-auto">
      <IconButton onClick={toggleSidebar} className="text-black mb-4">
       
      </IconButton>
      
      <Box className="mb-4">
        <FormControl fullWidth className="mb-4">
        
          <Select
            labelId="marca-label"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="mb-6"
          >
            <MenuItem value="crocs">Crocs</MenuItem>
            <MenuItem value="superga">Superga</MenuItem>
            <MenuItem value="kappa">Kappa</MenuItem>
            <MenuItem value="piccadilly">Piccadilly</MenuItem>
            <MenuItem value="reebok">Reebok</MenuItem>
          </Select>
        </FormControl>
        <form onSubmit={handleSearchSubmit} className="flex w-full mb-4">
          <TextField
            type="search"
            placeholder="Buscar Artículo"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            className="mr-2"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Buscar
          </Button>
        </form>
        <Box className="mt-4">
          {arti && arti.length > 0 && (
            <Button
              onClick={handleClearSearch}
              variant="contained"
              color="error"
              fullWidth
              className="mb-4"
            >
              Limpiar
            </Button>
          )}
          {arti && arti.length > 0 ? (
            arti.map((item, index) => (
              <Box key={index} className="p-2 rounded border-2 border-sky-500 bg-white mb-2">
                <Typography>- {item.ItemCode}</Typography>
                <Typography>- {item.ItemName}</Typography>
                <Typography>-Stock {item.InStock}</Typography>
                <Typography>-Committed {item.Committed}</Typography>
                <Typography>-Ordered {item.Ordered}</Typography>
              </Box>
            ))
          ) : (
            <Box></Box>
          )}
        </Box>
        <Typography variant="subtitle1" className="mt-4 mb-2">Buscar Orden</Typography>
        <form onSubmit={handleSearchSubmitOrd} className="flex w-full mb-4">
          <TextField
            type="search"
            placeholder="1437710983859-01"
            value={searchOrd}
            onChange={handleSearchChangeOrder}
            variant="outlined"
            fullWidth
            className="mr-2"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Buscar
          </Button>
        </form>
        <Box className="mt-4">
          {ord && ord.orderId && ord.orderId.length > 0 && (
            <Button
              onClick={handleClearSearchOrd}
              variant="contained"
              color="error"
              fullWidth
              className="mb-4"
            >
              Limpiar
            </Button>
          )}
          {ord && ord.orderId && ord.orderId.length > 0 ? (
            <Box className="p-2 rounded border-2 border-sky-500 bg-white">
              <Typography className="text-sm">Estado: {ord.statusDescription}</Typography>
              <Typography className="text-sm">Creación: {new Date(ord.creationDate).toString().split('GMT')[0]}</Typography>
              <Typography className="text-sm">Items: {ord.items.map(el => '||'.concat(el.refId))} </Typography>
              <Typography className="text-sm">Último Cambio: {new Date(ord.lastChange).toString().split('GMT')[0]}</Typography>
              <Typography className="text-sm">Autorización: {ord.authorizedDate ? new Date(ord.authorizedDate).toString().split('GMT')[0] : 'Sin Fecha'}</Typography>
              <Typography className="text-sm">Factura: {ord.invoicedDate ? ord.invoicedDate : 'Sin Fecha'}</Typography>
            </Box>
          ) : (
            <Box></Box>
          )}
        </Box>
      </Box>
    </Box>
    
    // <aside className="w-1/4 bg-gray-100 p-4 overflow-auto">
    //    <button onClick={toggleSidebar} className="text-white mb-4">
    //     ✕
    //   </button>
    //   <h2 className="text-xl mb-4">Filtros</h2>
    //   <div className="mb-4">
    //     <label className="block mb-2">Marca</label>
    //     <div className="flex w-full">
    //       <select
    //         value={marca}
    //         onChange={(e) => setMarca(e.target.value)}
    //         className="w-full p-2 rounded border-2 mb-6 border-sky-500 focus:outline-none focus:border-sky-500"
    //       >
    //         <option value="crocs">Crocs</option>
    //         <option value="superga">Superga</option>
    //         <option value="kappa">Kappa</option>
    //         <option value="piccadilly">Piccadilly</option>
    //         <option value="reebok">Reebok</option>
    //       </select>
    //     </div>
    //     <label className="block mb-2">Buscar Articulo</label>
    //     <form onSubmit={handleSearchSubmit} className="flex w-full">
    //       <input
    //         type="search"
    //         placeholder="Buscar Articulo"
    //         value={searchTerm}
    //         onChange={handleSearchChange}
    //         className="w-full md:w-auto p-2 h-10 rounded border-2 border-sky-500 focus:outline-none focus:border-sky-500"
    //       />
    //       <button
    //         type="submit"
    //         className="bg-sky-500 text-white w-full rounded p-2 md:p-2 py-0 md:py-1"
    //       >
    //         Buscar
    //       </button>
    //     </form>
    //     <div className="mt-4">
    //       {arti && arti.length > 0 && (
    //         <button
    //           onClick={handleClearSearch}
    //           className="bg-red-500 text-white w-full rounded p-2 mb-4"
    //         >
    //           Limpiar
    //         </button>
    //       )}

    //       {arti && arti.length > 0 ? (
    //         arti.map((item, index) => (
    //           <div
    //             key={index}
    //             className="p-2 rounded border-2 border-sky-500 bg-white"
    //           >
    //             <p className="">- {item.ItemCode}</p>
    //             <p>- {item.ItemName}</p>
    //             <p>-Stock {item.InStock}</p>
    //             <p>-Committed {item.Committed}</p>
    //             <p>-Ordered {item.Ordered}</p>
    //           </div>
    //         ))
    //       ) : (
    //         <div></div>
    //       )}
    //     </div>
    //     <label className="block mb-2 mt-4">Buscar Orden</label>
    //     <form onSubmit={handleSearchSubmitOrd} className="flex w-full">
    //       <input
    //         type="search"
    //         placeholder="1437710983859-01"
    //         value={searchOrd}
    //         onChange={handleSearchChangeOrder}
    //         className="w-full md:w-auto p-2 h-10 rounded border-2 border-sky-500 focus:outline-none focus:border-sky-500"
    //       />
    //       <button
    //         type="submit"
    //         className="bg-sky-500 text-white w-full rounded p-2 md:p-2 py-0 md:py-1"
    //       >
    //         Buscar
    //       </button>
    //     </form>
    //     <div className="mt-4">
    //       {ord && ord.orderId && ord.orderId.length > 0 && (
    //         <button
    //           onClick={handleClearSearchOrd}
    //           className="bg-red-500 text-white w-full rounded p-2 mb-4"
    //         >
    //           Limpiar
    //         </button>
    //       )}

    //       {ord && ord.orderId && ord.orderId.length > 0 ? (
            
    //           <div
               
    //             className="p-2 rounded border-2 border-sky-500 bg-white"
    //           >
    //             <p className="text-sm">Estado: {ord.statusDescription}</p>
    //             <p className="text-sm">Creacion:{new Date(ord.creationDate).toString().split('GMT')[0]}</p>
    //             <p className="text-sm">Items:{ord.items.map(el => '||'.concat(el.refId))} </p>
    //             <p className="text-sm">Ultimo Cambio {new Date(ord.lastChange).toString().split('GMT')[0]}</p>
    //             <p className="text-sm">Autorizacion: {ord.authorizedDate ? new Date(ord.authorizedDate).toString().split('GMT')[0] : 'Sin Fecha'}</p>
    //             <p className="text-sm">Factura: {ord.invoicedDate ? ord.invoicedDate : 'Sin Fecha'}</p>
    //           </div>
         
    //       ) : (
    //         <div></div>
    //       )}
    //     </div>
    //   </div>
    // </aside>
  
  );
}


export default Sidebar;
