import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stock: [],
    loading: false,
    error: null,
    selectedItem: null,
  };
  
  const stockSlice = createSlice({
    name: 'stock',
    initialState,
    reducers: {
      fetchstockRequest(state) {
        state.loading = true;
        state.error = null;
      },
      fetchstockSuccess(state, action) {
        state.loading = false;
        state.stock = action.payload;
      },
      fetchstockFailure(state, action) {
        state.loading = false;
        state.error = action.payload;
      },
      selectStockItem(state, action) {
        console.log(action.payload);
        console.log(state.stock)
        state.selectedItem = state.stock.coincidencias.find(item => item.Id === action.payload);
      },
    }
  });
  
  export const { fetchstockRequest, fetchstockSuccess, fetchstockFailure,selectStockItem, } = stockSlice.actions;
  export default stockSlice.reducer;