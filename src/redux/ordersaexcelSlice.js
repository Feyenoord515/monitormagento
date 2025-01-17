import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ordersaexcel: [],
  loading: false,
  error: null,
  selectedOrder: null,
};

const ordersaexcelSlice = createSlice({
  name: 'ordersaexcel',
  initialState,
  reducers: {
    fetchordersaexcelRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchordersaexcelSuccess(state, action) {
      state.loading = false;
      state.ordersaexcel = action.payload;
    },
    fetchordersaexcelFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  },
});

export const {
  fetchordersaexcelRequest,
  fetchordersaexcelSuccess,
  fetchordersaexcelFailure,
 
} = ordersaexcelSlice.actions;
export default ordersaexcelSlice.reducer;