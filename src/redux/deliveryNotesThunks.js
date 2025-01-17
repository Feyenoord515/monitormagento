import { fetchDeliveryNotesFailure, fetchDeliveryNotesRequest, fetchDeliveryNotesSuccess } from './deliveryNotesSlice';

export const fetchDeliveryNotes = (entries) => async (dispatch) => {
  dispatch(fetchDeliveryNotesRequest());
  

  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entries }), // Enviar array de increment_id
    };
console.log(requestOptions.body)
    const response = await fetch(`https://mcdistri.distrinando.com.ar/deliveryNotes`, requestOptions);
    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      throw new Error(result.message || 'Error fetching delivery notes');
    }

    dispatch(fetchDeliveryNotesSuccess(result)); // Despachar todas las delivery notes juntas
  } catch (error) {
    dispatch(fetchDeliveryNotesFailure(error.message));
  }
};

