import { createSlice } from '@reduxjs/toolkit';
import { fetchOrders } from './ordersThunks';

const initialState = {
  orders: [],
  selectedOrder: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    selectOrder(state, action) {
      state.selectedOrder = state.orders.find(order => order.orderId === action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
  },
});

export const { selectOrder } = orderSlice.actions;
export default orderSlice.reducer;