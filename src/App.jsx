import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
// import AllOrders from './components/allOrders';
import SimpleOrders from './components/SimpleOrders';
import OrdersTable from './components/OrdersTable';
import FilteredOrders from './components/FilteredOrders';
import { useAuth } from './AuthContext';
import Login from './components/Login';
import LogoutButton from './components/LogoutButton';

function App() {
  const { user } = useAuth();

  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  if (!user) {
    return <Login />;
  }
  return (
    <Box>
      <LogoutButton />
      <Tabs value={selectedTab} onChange={handleChange} aria-label="simple tabs example">
        {/* <Tab label="All Orders" /> */}
        <Tab label="Orders Table" />
        <Tab label="Simple Orders" />
       
        {/* Puedes agregar más pestañas aquí */}
      </Tabs>
      <Box p={3}>
        {/* {selectedTab === 0 && <FilteredOrders />} */}
        {selectedTab === 0 && <OrdersTable />}
        {selectedTab === 1 && <SimpleOrders />}
        {/* Puedes agregar más componentes aquí */}
      </Box>
    </Box>
  );
}

export default App;

