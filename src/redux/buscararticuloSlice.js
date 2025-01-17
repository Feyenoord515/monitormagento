import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  buscarartsap: [],
  loading: false,
  error: null,
 
};

const buscarartsapSlice = createSlice({
  name: 'buscarartsap',
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.buscarartsap = [];
    },
    fetchbuscarartsapRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchbuscarartsapSuccess(state, action) {
      state.loading = false;
      state.buscarartsap = action.payload;
    },
    fetchbuscarartsapFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
   
   
  },
});

export const {
  fetchbuscarartsapRequest,
  fetchbuscarartsapSuccess,
  fetchbuscarartsapFailure,
  clearSearchResults 
  
} = buscarartsapSlice.actions;
export default buscarartsapSlice.reducer;