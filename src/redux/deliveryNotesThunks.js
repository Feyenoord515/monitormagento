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

    const response = await fetch(`https://mcdistri.distrinando.com.ar/deliveryNotes`, requestOptions);
    const result = await response.json();
    const resultString = JSON.stringify(result);
    const resultSize = new Blob([resultString]).size;
    console.log('tamaño de elemento delivery',resultSize)
    if (resultSize <= 5 * 1024 * 1024) { // 5 MiB en bytes
      localStorage.setItem('delivery', JSON.stringify(result));
    } else {
         console.warn('La respuesta supera el límite de 5 MiB y no se almacenará en localStorage.');
       }
    
    if (!response.ok) {
      console.error(result);
      throw new Error(result.message || 'Error fetching delivery notes');
    }

    dispatch(fetchDeliveryNotesSuccess(result)); // Despachar todas las delivery notes juntas
  } catch (error) {
    console.log(error)
    dispatch(fetchDeliveryNotesFailure(error.message));
  }
};

