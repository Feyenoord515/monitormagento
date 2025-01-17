import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ordersap: [],
  loading: false,
  error: null,
 
};

const ordersapSlice = createSlice({
  name: 'ordersap',
  initialState,
  reducers: {
    fetchOrdersapRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersapSuccess(state, action) {
      state.loading = false;
      state.ordersap = action.payload;
    },
    fetchOrdersapFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    selectOrder(state, action) {
      state.selectedOrder = state.ordersap.find(order => order.U_WESAP_BaseSysUID === action.payload);
    },
    resetOrdersap(state) {
      return initialState;
    },
   
  },
});

export const {
  fetchOrdersapRequest,
  fetchOrdersapSuccess,
  fetchOrdersapFailure,
  resetOrdersap,
  selectOrder,
} = ordersapSlice.actions;
export default ordersapSlice.reducer;