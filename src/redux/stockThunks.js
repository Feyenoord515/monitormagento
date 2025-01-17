import { fetchstockFailure, fetchstockRequest, fetchstockSuccess } from "./stockSlice";

export const fetchstock = (marca,page, pageSize) => async (dispatch) => {
dispatch(fetchstockRequest())
const apiUrl = process.env.REACT_APP_API_BASE_URL
  console.log(apiUrl)
try {

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
    };
console.log(marca.marca)
    const response = await fetch(`${apiUrl}:4000/stock/${marca.marca}?page=1&pageSize=30000`, requestOptions)
    const result = await response.json()
console.log(result)
    if(!response.ok) {
        console.log(result)
        throw new Error(result.message)
    }
    
    localStorage.setItem(marca.marca, JSON.stringify(result));
    dispatch(fetchstockSuccess(result))

} catch (error) {
    console.log(error)
    dispatch(fetchstockFailure(error.Error))
}

}