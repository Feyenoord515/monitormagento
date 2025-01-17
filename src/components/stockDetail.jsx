import React from 'react';
import { useSelector } from 'react-redux';

const OrderSapDetails = () => {
  const selectedStockItem = useSelector((state) => state.ordersap.selectedItem);
console.log(selectedStockItem?selectedStockItem:null)
  if (!selectedStockItem) return <div>Select a stock item to see details.</div>;

  return (
    <div className="flex-1 p-4 border-l overflow-y-auto">
      <h2 className="text-xl mb-4">Detalles de Articulo</h2>
      <p><strong>Id:</strong> {selectedStockItem.Id}</p>
      <p><strong>Modelo: </strong>{selectedStockItem.RefId}</p>
      <p><strong>Numero:</strong> {selectedStockItem.Name}</p>
      <p><strong>Ubicacion:</strong> {selectedStockItem.warehouseId}</p>
      <p><strong>Total:</strong> {selectedStockItem.totalQuantity}</p>
      <p><strong>Disponible:</strong> {selectedStockItem.availableQuantity}</p>
      <p><strong>Reservado: </strong>{selectedStockItem.reservedQuantity}</p>
    </div>
  );
};

export default OrderSapDetails;

