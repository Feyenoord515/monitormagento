import axios from 'axios';
import { fetchOrdersapFailure, fetchOrdersapRequest, fetchOrdersapSuccess } from "./ordersapSlice";

export const fetchOrderssap = (orderIds) => async (dispatch) => {
  dispatch(fetchOrdersapRequest());
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  
  
  
  try {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${apiUrl}:4000/orderssapid/`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : orderIds,
    };
    
    const response = await axios.request(config)
  
    const rsp = await response
   

    dispatch(fetchOrdersapSuccess(rsp.data));
  } catch (error) {
    
    dispatch(fetchOrdersapFailure(error.message));
  }
};

// import { fetchOrdersapFailure, fetchOrdersapRequest, fetchOrdersapSuccess } from "./ordersapSlice";

// export const fetchOrderssap = (marca) => async (dispatch) => {
//   dispatch(fetchOrdersapRequest());
//   const apiUrl = process.env.REACT_APP_API_BASE_URL
 
//   try {
//     // const raw = JSON.stringify({hasta: `${data}`});

//     const requestOptions = {
//       method: "POST",
//       headers: {
//         'Content-Type': 'application/json'
//       },
     
//       redirect: "follow"
//     };

//     // console.log(data);
   

//     const response = await fetch(`${apiUrl}:4000/orderssapid/${marca}`, requestOptions);
//     const result = await response.json();
   
// //hasta aca funciona
//     if (!response.ok) {
     
//       throw new Error(result.message);
//     }

//     dispatch(fetchOrdersapSuccess(result.NumAtCard));

//   } catch (error) {
    
//     dispatch(fetchOrdersapFailure(error.message));
//   }
// };
