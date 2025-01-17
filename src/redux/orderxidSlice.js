import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderxidvtex: [],
  loading: false,
  error: null,
 
};

const orderxidvtexSlice = createSlice({
  name: 'orderxidvtex',
  initialState,
  reducers: {
    clearSearchResultsOrd(state) {
      state.orderxidvtex = [];
    },
    fetchorderxidvtexRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchorderxidvtexSuccess(state, action) {
      state.loading = false;
      state.orderxidvtex = action.payload;
    },
    fetchorderxidvtexFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
   
   
  },
});

export const {
  fetchorderxidvtexRequest,
  fetchorderxidvtexSuccess,
  fetchorderxidvtexFailure,
  clearSearchResultsOrd 
  
} = orderxidvtexSlice.actions;
export default orderxidvtexSlice.reducer;