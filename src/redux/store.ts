import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { authApi } from './apis/authApi'
import authReducer from './slices/authSlice'
import formReducer from './slices/formSlice'

const rootReducer = combineReducers({
	auth: authReducer,
	form: formReducer,
	[authApi.reducerPath]: authApi.reducer,
})

const persistConfig = {
	key: 'root',
	storage,
	version: 2,
	whitelist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		}).concat(authApi.middleware),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(store as any).__persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
