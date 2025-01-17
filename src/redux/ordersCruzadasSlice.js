import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  OrderCruzadas: [],
  loading: false,
  error: null,
 
};

const orderCruzadasSlice = createSlice({
  name: 'ordercruzadas',
  initialState,
  reducers: {
    fetchOrderCruzadasRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOrderCruzadasSuccess(state, action) {
      state.loading = false;
      state.OrderCruzadas = action.payload;
    },
    fetchOrderCruzadasFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    selectOrder(state, action) {
      state.selectedOrder = state.OrderCruzadas.find(order => order.sap === action.payload);
    },
    resetOrderCruzadas(state) {
      return initialState;
    },
  },
});

export const {
  fetchOrderCruzadasRequest,
  fetchOrderCruzadasSuccess,
  fetchOrderCruzadasFailure,
  selectOrder,
  resetOrderCruzadas,
} = orderCruzadasSlice.actions;
export default orderCruzadasSlice.reducer;