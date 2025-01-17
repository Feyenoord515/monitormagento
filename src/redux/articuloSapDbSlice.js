import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    articulosapdb: [],
  loading: false,
  error: null,
 
};

const articuloSapDbSlice = createSlice({
  name: 'articulosapdb',
  initialState,
  reducers: {
    fetcharticulosapdbRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetcharticulosapdbSuccess(state, action) {
      state.loading = false;
      state.articulosapdb = action.payload;
    },
    fetcharticulosapdbFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
   
   
  },
});

export const {
    fetcharticulosapdbRequest,
    fetcharticulosapdbSuccess,
    fetcharticulosapdbFailure,
  
} = articuloSapDbSlice.actions;
export default articuloSapDbSlice.reducer;