import { fetcharticulosapdbFailure, fetcharticulosapdbRequest, fetcharticulosapdbSuccess } from "./articuloSapDbSlice"  ;

export const fetcharticulosapdb = (marca, page, pageSize, ord ) => async (dispatch) => {
  dispatch(fetcharticulosapdbRequest());
  const apiUrl = process.env.REACT_APP_API_BASE_URL
  console.log(apiUrl)
  try {
   

    const requestOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
     
      redirect: "follow"
    };

  console.log(page)
    console.log(marca);
    console.log(requestOptions);

    const response = await fetch(`${apiUrl}:4000/stockdb/${marca}?page=${page}&pageSize=${pageSize}&ord=${ord}`, requestOptions);
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      console.log(result);
      throw new Error(result.message);
    }


    dispatch(fetcharticulosapdbSuccess(result));

  } catch (error) {
    dispatch(fetcharticulosapdbFailure(error.message));
  }
}