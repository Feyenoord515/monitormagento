import { fetchorderxidvtexFailure, fetchorderxidvtexRequest, fetchorderxidvtexSuccess } from "./orderxidSlice"  ;

export const fetchorderxidvtex = (art, marca ) => async (dispatch) => {
  dispatch(fetchorderxidvtexRequest());
  const apiUrl = process.env.REACT_APP_API_BASE_URL
  console.log(apiUrl)
  try {
   
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
     
      redirect: "follow"
    };

    console.log(art);
    console.log(marca);
    console.log(requestOptions);

    const response = await fetch(`${apiUrl}:4000/ordersxid/${marca}?id=${art}`, requestOptions);
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      console.log(result);
      throw new Error(result.message);
    }


    dispatch(fetchorderxidvtexSuccess(result));

  } catch (error) {
    dispatch(fetchorderxidvtexFailure(error.message));
  }
};
