import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { artifactApi } from "./api/artifactApi"
import searchReducer from "./slice/searchSlice"
import authReducer from "./slice/authSlice" 
import mindReducer from "./slice/mindSlice" 
import { mindApi } from "./api/mindApi"

export const store = configureStore({
  reducer: {
    [artifactApi.reducerPath]: artifactApi.reducer,
    [mindApi.reducerPath]: mindApi.reducer,
    search: searchReducer,
    auth: authReducer,
    mind: mindReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(artifactApi.middleware,mindApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
