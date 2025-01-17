import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Card, CardContent, Typography } from "@mui/material";
import 'chart.js/auto';

const OrderStatistics = () => {
  const orders = useSelector((state) => state.orders.orders);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalCanceled: 0,
    totalCompleted: 0,
    topProducts: [],
  });

  useEffect(() => {
    if (orders && orders.length > 0) {
      
      const totalOrders = orders.length;
      const totalCompleted = orders.filter(
        (order) => order.isCompleted && order.status !== "canceled"
      ).length;
      const totalComp = orders.filter(
        (order) => order.isCompleted && order.status !== "canceled"
      );
      console.log(totalComp);
      const totalSales = totalComp.reduce((sum, order) => sum + order.value, 0);
      const totalCanceled = orders.filter(
        (order) => order.status === "canceled"
      ).length;
      console.log(totalSales)
      console.log(totalComp.length)
const avgTicket = totalSales / totalComp.length;
console.log(avgTicket)
      
      const productSales = {};
      totalComp.forEach((order) => {
        order.items.forEach((item) => {
          if (productSales[item.refId]) {
            productSales[item.refId] += item.quantity;
          } else {
            productSales[item.refId] = item.quantity;
          }
        });
      });

      const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, quantity]) => ({ name, quantity }));
      console.log(topProducts);

      setStats({
        totalOrders,
        totalSales,
        totalCanceled,
        totalCompleted,
        avgTicket,
        topProducts,
      });
    }
  }, [orders]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value / 100);
  };

  const barData = {
    labels: stats.topProducts.map(product => product.name),
    datasets: [{
      label: 'Cantidad Vendida',
      data: stats.topProducts.map(product => product.quantity),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const lineData = {
    labels: ["Total de Órdenes", "Órdenes Canceladas", "Órdenes Completadas"],
    datasets: [{
      label: 'Órdenes',
      data: [stats.totalOrders, stats.totalCanceled, stats.totalCompleted],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }],
  };

  const pieData = {
    labels: ["Total de Ventas", "Ticket Promedio"],
    datasets: [{
      label: 'Ventas',
      data: [stats.totalSales, stats.avgTicket],
      backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(255, 205, 86, 0.6)'],
      borderColor: ['rgba(255, 159, 64, 1)', 'rgba(255, 205, 86, 1)'],
      borderWidth: 1,
    }],
  };

  return (
    <div className="bg-white h-full w-full dark:bg-gray-700 mb-5 flex flex-col overflow-auto items-center">
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:py-2 lg:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
          Estadísticas de Ventas del Día
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mt-3 overflow-auto">
          <Card>
            <CardContent>
              <Typography className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                Total de Órdenes
              </Typography>
              <Typography className="mt-1 text-2xl leading-9 font-semibold text-blue-500 dark:text-indigo-400">
                {stats.totalOrders}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                Órdenes Canceladas
              </Typography>
              <Typography className="mt-1 text-2xl leading-9 font-semibold text-blue-500 dark:text-indigo-400">
                {stats.totalCanceled}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                Órdenes Completadas
              </Typography>
              <Typography className="mt-1 text-2xl leading-9 font-semibold text-blue-500 dark:text-indigo-400">
                {stats.totalCompleted}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                Total de Ventas
              </Typography>
              <Typography className="mt-1 text-2xl leading-9 font-semibold text-blue-500 dark:text-indigo-400">
                {formatCurrency(stats.totalSales)}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                Ticket Promedio
              </Typography>
              <Typography className="mt-1 text-2xl leading-9 font-semibold text-blue-500 dark:text-indigo-400">
                {formatCurrency(stats.avgTicket)}
              </Typography>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mt-4">
          <Card>
            <CardContent>
              <Typography className="text-lg leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                Productos Más Vendidos
              </Typography>
              <Bar data={barData} width={600} height={400} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography className="text-lg leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                Estado de Órdenes
              </Typography>
              <Line data={lineData} width={600} height={400} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography className="text-lg leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                Ventas
              </Typography>
              <Pie data={pieData} width={600} height={400} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderStatistics;
