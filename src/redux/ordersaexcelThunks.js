import { fetchordersaexcelFailure, fetchordersaexcelRequest, fetchordersaexcelSuccess } from "./ordersaexcelSlice";

export const fetchordersaexcel = (marca, data) => async (dispatch) => {
dispatch(fetchordersaexcelRequest())

const apiUrl = process.env.REACT_APP_API_BASE_URL
  console.log(apiUrl)

try {
       
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ords: data }), 
      redirect: "follow"
    };

    const response = await fetch(`${apiUrl}:4000/orderstoexcel/${marca}`, requestOptions)
   
    if (!response.ok) {
        const result = await response.json();
        console.log(result);
        throw new Error(result.message);
      }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders${marca}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    dispatch(fetchordersaexcelSuccess())

} catch (error) {
    dispatch(fetchordersaexcelFailure(error.Error))
}

}