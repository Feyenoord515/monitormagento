import { fetchbuscarartsapFailure, fetchbuscarartsapRequest, fetchbuscarartsapSuccess } from "./buscararticuloSlice"  ;

export const fetchbuscarartsap = (art, marca ) => async (dispatch) => {
  dispatch(fetchbuscarartsapRequest());
  const apiUrl = process.env.REACT_APP_API_BASE_URL
  console.log(apiUrl)

let raw;
  try {
    if (typeof art === "string") {
     raw = JSON.stringify({para: `${art}`});
    } else {
      raw = JSON.stringify({para: art});
    }
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: raw,
      redirect: "follow"
    };

    console.log(art);
    console.log(marca);
    console.log(requestOptions);

    const response = await fetch(`${apiUrl}:4000/buscarsap/${marca}`, requestOptions);
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      console.log(result);
      throw new Error(result.message);
    }


    dispatch(fetchbuscarartsapSuccess(result));

  } catch (error) {
    dispatch(fetchbuscarartsapFailure(error.message));
  }
};
