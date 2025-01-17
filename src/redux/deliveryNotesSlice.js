import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deliveryNotes: [],
  loading: false,
  error: null,
};

const deliveryNotesSlice = createSlice({
  name: 'deliveryNotes',
  initialState,
  reducers: {
    fetchDeliveryNotesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDeliveryNotesSuccess: (state, action) => {
      state.loading = false;
      state.deliveryNotes = action.payload; // Almacena todas las delivery notes
    },
    fetchDeliveryNotesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDeliveryNotesRequest,
  fetchDeliveryNotesSuccess,
  fetchDeliveryNotesFailure,
} = deliveryNotesSlice.actions;

export default deliveryNotesSlice.reducer;
