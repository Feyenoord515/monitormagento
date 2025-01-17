import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OrdersChart = ({ chartData }) => {
  // Agrupar los datos por marca
  const brands = [...new Set(chartData.map(data => data.brand))];
  const dataByDate = {};

  chartData.forEach(data => {
    if (!dataByDate[data.date]) {
      dataByDate[data.date] = { date: data.date };
    }
    dataByDate[data.date][data.brand] = data.totalOrders;
  });

  const formattedData = Object.values(dataByDate);

  
  const colors = [
    '#FF5733', // Rojo 
    '#33FF57', // Verde 
    '#3357FF', // Azul 
    '#FF33A1', // Rosa 
    '#FF8C33', // Naranja 
    '#8C33FF', // Púrpura 
    '#33FFF5', // Cian 
    '#FFD700', // Amarillo 
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {brands.map((brand, index) => (
          <Line key={index} type="monotone" dataKey={brand} stroke={colors[index % colors.length]} name={brand} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OrdersChart;