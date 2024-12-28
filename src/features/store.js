// src/store.js
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice'
// import { encryptTransform } from 'redux-persist-transform-encrypt';

// const encryptor = encryptTransform({
//   secretKey: 'secret1234', // Store secret key in environment variables
//   onError: function (error) {
//     console.error("Encryption error:", error);
//   },
// });


const persistConfig = {
  key: 'root',
  storage,
  // transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer, // Persist user slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

const persistor = persistStore(store);

export { store, persistor };
