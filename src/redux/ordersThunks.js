import { fetchOrdersFailure, fetchOrdersRequest, fetchOrdersSuccess } from "./ordersSlice";

export const fetchOrders = (dateRange) => async (dispatch) => {
  dispatch(fetchOrdersRequest());

 

  try {

    const storedData = localStorage.getItem('data');
    const storedDateRange = localStorage.getItem('dateRange');

    // Si tenemos datos y el rango coincide, usamos los datos almacenados
    if (storedData && storedDateRange === JSON.stringify(dateRange)) {
      console.log('Usando datos del localStorage');
      dispatch(fetchOrdersSuccess(JSON.parse(storedData)));
      return;
    }
    
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dateRange),
      redirect: "follow"
    };

    const response = await fetch(`https://mcdistri.distrinando.com.ar/orders3`, requestOptions)
    const result = await response.json()
    const resultString = JSON.stringify(result);
    const resultSize = new Blob([resultString]).size;
console.log('tamaño de elemento',resultSize)
    if (resultSize <= 5 * 1024 * 1024) { // 5 MiB en bytes
      localStorage.setItem('data', resultString);
      localStorage.setItem('dateRange', JSON.stringify(dateRange));
    } else {
      console.warn('La respuesta supera el límite de 5 MiB y no se almacenará en localStorage.');
    }
console.log(result)
    if(!response.ok) {
        console.log(result)
        throw new Error(result.message)
    }

    dispatch(fetchOrdersSuccess(result))

} catch (error) {
    dispatch(fetchOrdersFailure(error.Error))
}

}