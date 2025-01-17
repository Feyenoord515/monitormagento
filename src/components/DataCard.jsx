import React from "react";

export default function DataCard({ data, type }) {

    function DateToGmt(fecha){
        const fechaGMT = new Date(fecha);
        const diferenciaHoras = fechaGMT.getTimezoneOffset() / 60;
        fechaGMT.setHours(fechaGMT.getHours() - diferenciaHoras);
        const fechaGMT3 = fechaGMT.toISOString().replace('T', ' ').replace('Z', ' ');

return fechaGMT3
    }

  return (
    <div className="bg-white p-4 mb-4 shadow-md rounded border border-gray-200">
      {type === "sap" ? (
        <>
          <p className="text-sm">UID: <span className="font-semibold">{data.U_WESAP_BaseSysUID}</span></p>
          <p className="text-sm">CardName: <span className="font-semibold">{data.CardName}</span></p>
          <p className="text-sm">DocEntry: <span className="font-semibold">{data.DocEntry}</span></p>
          <p className="text-sm">DocNum: <span className="font-semibold">{data.DocNum}</span></p>
          <p className="text-sm">DocDate: <span className="font-semibold">{data.DocDate}</span></p>
         
        </>
      ) : (
        <>
          <p className="text-sm">Order ID: <span className="font-semibold">{data.orderId}</span></p>
          <p className="text-sm">Cliente: <span className="font-semibold">{data.clientProfileData.firstName} {data.clientProfileData.lastName}</span></p>
          <p className="text-sm">Fecha de Creación: <span className="font-semibold">{DateToGmt(data.creationDate)}</span></p>
          <p className="text-sm">Ultimo Cambio: <span className="font-semibold">{DateToGmt(data.lastChange)}</span></p>
          <p className="text-sm">Estado: <span className="font-semibold">{data.statusDescription}</span></p>
         
        </>
      )}
      {/* <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Ver Detalles</button> */}
    </div>
  );
}
  
  