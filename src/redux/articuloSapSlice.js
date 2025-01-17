import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 articulosap: [],
  loading: false,
  error: null,
 
};

const articulosapSlice = createSlice({
  name: 'articulosap',
  initialState,
  reducers: {
    fetcharticulosapRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetcharticulosapSuccess(state, action) {
      state.loading = false;
      state.articulosap = action.payload;
    },
    fetcharticulosapFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
   
   
  },
});

export const {
  fetcharticulosapRequest,
  fetcharticulosapSuccess,
  fetcharticulosapFailure,
  
} = articulosapSlice.actions;
export default articulosapSlice.reducer;