import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ordersall: [],
  loading: false,
  error: null,
  selectedOrder: null,
};

const orderallSlice = createSlice({
  name: 'ordersall',
  initialState,
  reducers: {
    fetchOrdersallRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersallSuccess(state, action) {
      state.loading = false;
      state.ordersall = action.payload;
    },
    fetchOrdersallFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    selectOrder(state, action) {
      state.selectedOrder = state.orders.find(order => order.orderId === action.payload);
    },
  },
});

export const {
  fetchOrdersallRequest,
  fetchOrdersallSuccess,
  fetchOrdersallFailure,
  selectOrder,
} = orderallSlice.actions;
export default orderallSlice.reducer;