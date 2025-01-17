import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Header({ toggleSidebar }) {
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // console.log(sidebarOpen)
  // const togglesidebar = () => {
  //   if (sidebarOpen === true) {
  //   setSidebarOpen(false);
  //   } else {
  //     setSidebarOpen(true);
  //   }
  // };
  return (

    <AppBar position="static" className="bg-gray-800">
      <Toolbar className="flex justify-around">
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Box className="flex justify-between ">
        <Button color="inherit" component={Link} to="/allorders">
          Pedidos
          </Button>
          <Button color="inherit" component={Link} to="/orders">
            Gestión de Pedidos
          </Button>
          <Button color="inherit" component={Link} to="/stock">
            Consultar Stock
          </Button>
          <Button color="inherit" component={Link} to="/compar">
            Pedidos cruzados
          </Button>
          <Button color="inherit" component={Link} to="/statistics">
            Estadísticas
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
    // <header className="bg-gray-800 text-white p-4 flex justify-around">
    //   <nav>
    //     <ul className="flex space-x-4">
    //     <button onClick={toggleSidebar} className="text-white">
    //     ☰
    //   </button>
    //       <li><Link to="/orders">Gestión de Pedidos</Link></li>
    //       <li><Link to="/stock">Consultar Stock</Link></li>
    //       <li><Link to="/compar"> Pedidos cruzados</Link></li>
    //       <li><Link to="/statistics">Estadisticas</Link></li>
    //     </ul>
    //   </nav>
    // </header>
  );
}

export default Header;




// import React from 'react';

// function Header({ setView }) {
//   return (
//     <header className="bg-gray-800 text-white p-4 flex justify-between">
//       <div>
//         <button className="text-2xl px-4" onClick={() => setView('orders')}>
//           Gestión de Pedidos
//         </button>
//         <button className="text-2xl px-4" onClick={() => setView('stock')}>
//           Consultar Stock
//         </button>
//         <button className="text-2xl px-4" onClick={() => setView('compar')}>
//           Pedidos cruzados
//         </button>
//       </div>
   
//     </header>
//   );
// }

// export default Header;
  