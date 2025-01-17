import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './ordersSlice';
import stockReducer from './stockSlice';
import ordersapReducer from './ordersapSlice';
import orderCruzadasReducer from './ordersCruzadasSlice'
import articulosapReducer from './articuloSapSlice'
import articuloSapDbReducer from './articuloSapDbSlice';
import buscarartsapReducer from './buscararticuloSlice';
import orderxidvtexReducer from './orderxidSlice'; 
import ordersaexcelReducer from './ordersaexcelSlice'; 
import ordersallReducer from './ordersTodasSlice';
import deliveryNotesReducer from './deliveryNotesSlice';


export const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: { warnAfter: 5400 },
        serializableCheck: { warnAfter: 5400 },
      }),

    reducer: {
        orders: ordersReducer,
        stock: stockReducer,
        ordersap: ordersapReducer,
        ordercruzadas: orderCruzadasReducer,
        articulosap: articulosapReducer,
        articulosapdb: articuloSapDbReducer,
        buscarartsap: buscarartsapReducer,
        orderxidvtex: orderxidvtexReducer,
        ordersaexcel: ordersaexcelReducer,
        ordersall: ordersallReducer,
        deliveryNotes: deliveryNotesReducer,
    }

})


// import { configureStore } from '@reduxjs/toolkit';
// import ordersReducer from './ordersSlice';
// import stockReducer from './stockSlice';
// import ordersapReducer from './ordersapSlice';
// import orderCruzadasReducer from './ordersCruzadasSlice';
// import articulosapReducer from './articuloSapSlice';
// import articuloSapDbReducer from './articuloSapDbSlice';

// export const store = configureStore({
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
//     immutableCheck: { warnAfter: 128 },
//     serializableCheck: { warnAfter: 128 },
//   }),
//   reducer: {
//     orders: ordersReducer,
//     stock: stockReducer,
//     ordersap: ordersapReducer,
//     ordercruzadas: orderCruzadasReducer,
//     articulosap: articulosapReducer,
//     articulosapdb: articuloSapDbReducer,
//   },
//   devTools: process.env.NODE_ENV !== 'production' && {
//     actionsBlacklist: ['fetchstockSuccess'], // Excluye acciones que pueden ser grandes
//     stateSanitizer: (state) => {
//       const sanitizedState = { ...state };
//       if (sanitizedState.stock) {
//         sanitizedState.stock.stockSap = '<<EXCLUDED>>'; // Excluye grandes porciones de datos
//       }
//       return sanitizedState;
//     },
//     maxAge: 50, // Número máximo de acciones a retener
//     trace: true, // Habilitar trazas para depuración
//     traceLimit: 25, // Límite de trazas
//   },
// });

// export default store;