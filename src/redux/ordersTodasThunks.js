import { fetchOrdersallFailure, fetchOrdersallRequest, fetchOrdersallSuccess } from "./ordersTodasSlice";
import axios from "axios";

export const fetchAllOrders = (marca, data) => async (dispatch) => {
  dispatch(fetchOrdersallRequest());
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  
  try {
    
    let raw;
    if (data.length < 13) {
      raw = JSON.stringify({ fecha: `${data}` });
    } else {
      raw = JSON.stringify({ fechas: `${data}` });
    }

    const mrcas = ["crocs", "kappa", "superga", "reebok", "piccadilly"];
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };

    const fetchOrdersForMarca = async (marca) => {
      const response = await axios.post(`${apiUrl}:4000/orders2/${marca}`, raw, requestOptions);
      
      return response.data.items;
    };

    const allOrders = await Promise.all(mrcas.map(fetchOrdersForMarca));
    
    dispatch(fetchOrdersallSuccess(allOrders));

  } catch (error) {
    console.log(error);
    dispatch(fetchOrdersallFailure(error.message));
  }
};



