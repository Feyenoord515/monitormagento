import { fetchOrdersFailure, fetchOrdersRequest, fetchOrdersSuccess } from "./ordersSlice";

export const fetchOrders = (dateRange) => async (dispatch) => {
  dispatch(fetchOrdersRequest());

 
console.log(dateRange)
  try {
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