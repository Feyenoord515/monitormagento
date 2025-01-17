import {fetchOrderCruzadasFailure, fetchOrderCruzadasSuccess,fetchOrderCruzadasRequest } from "./ordersCruzadasSlice";


export const fetchOrdersCruzadas = (id) => async (dispatch)=> {
    dispatch(fetchOrderCruzadasRequest())
    const apiUrl = process.env.REACT_APP_API_BASE_URL
   

    try {
          
    
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          },
         
          redirect: "follow"
        };
    
        
       
        console.log(requestOptions);
    
        const response = await fetch(`${apiUrl}:4000/ordersapvtex/${id}`, requestOptions);
        const result = await response.json();
        console.log(response);
    //hasta aca funciona
        if (!response.ok) {
          console.log(result);
          throw new Error(result.message);
        }
    
        dispatch(fetchOrderCruzadasSuccess(result));
    
      } catch (error) {
        console.log(error);
        dispatch(fetchOrderCruzadasFailure(error.message + id));
      }
} 