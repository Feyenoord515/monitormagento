import React from 'react';
import { useSelector } from 'react-redux';

const StockCruzadoDetails = () => {
  const selectedStockItem = useSelector((state) => state.ordersap.selectedOrder);
console.log(selectedStockItem)
  if (!selectedStockItem) return <div>Seleccione un pedido para ver mas detalles</div>;

  return (
    <div className="flex-1 p-4 border-l overflow-y-auto">
      <h2 className="text-xl mb-4">Detalles de Pedido</h2>
      <p><strong>CardName:</strong> {selectedStockItem.CardName}</p>
      <p><strong>DocEntry:</strong> {selectedStockItem.DocEntry}</p>
      <p><strong>DocNum:</strong> {selectedStockItem.DocNum}</p>
      <p><strong>DocDate: </strong>{selectedStockItem.DocDate}</p>
      <p><strong>UpdateDate: </strong>{selectedStockItem.UpdateDate}</p>
      <p><strong>NumAtCard:</strong> {selectedStockItem.NumAtCard}</p>
      <p><strong>BaseSysUID:</strong> {selectedStockItem.U_WESAP_BaseSysUID}</p>
    </div>
  );
};

export default StockCruzadoDetails;