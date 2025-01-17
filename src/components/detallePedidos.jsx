import React from 'react';
import { useSelector } from 'react-redux';
import FadeLoader from "react-spinners/FadeLoader";

function OrderDetails() {
  const selectedOrder = useSelector(state => state.orders.selectedOrder);
  const loading = useSelector((state) => state.orders.loading);

  if (loading) return<div className="flex flex-col w-full h-full object-center place-items-center mt-56"><FadeLoader color='#1e5878' width={20}  heigth={150} radius={50} margin={50} /></div>
  if (!selectedOrder) {
    return (
      <div className="flex-1 p-4">
        <p>Seleccione un pedido para ver los detalles</p>
      </div>
    );
  }

  const { orderId, clientProfileData, items, shippingData, statusDescription, creationDate, value } = selectedOrder;

  return (
    <div className="flex-1 p-4 border-l overflow-y-auto">
      <h2 className="text-xl mb-4">Detalles del Pedido</h2>
      <p><strong>ID:</strong> {orderId}</p>
      <p><strong>Cliente:</strong> {clientProfileData.firstName} {clientProfileData.lastName}</p>
      <p><strong>Email:</strong> {clientProfileData.email}</p>
      <p><strong>Estado:</strong> {statusDescription}</p>
      <p><strong>Fecha de Creación:</strong> {new Date(creationDate).toLocaleString()}</p>
      <p><strong>Valor:</strong> ${value / 100}</p>
      <h3 className="text-lg mt-4 mb-2">Items</h3>
      <ul>
        {items.map(item => (
          <li key={item.id} className="border p-2 mb-2">
            <p><strong>Producto:</strong> {item.name}</p>
            <p><strong>Id:</strong> {item.refId}</p>
            <p><strong>Cantidad:</strong> {item.quantity}</p>
            <p><strong>Precio Real:</strong> ${item.price / 100}</p>
            <p><strong>Precio con descuento:</strong> ${item.priceDefinition.calculatedSellingPrice / 100}</p>
          </li>
        ))}
      </ul>
      <h3 className="text-lg mt-4 mb-2">Envío</h3>
      <p><strong>Dirección:</strong> {shippingData.address.street}, {shippingData.address.city}, {shippingData.address.state}</p>
    </div>
  );
}

export default OrderDetails;