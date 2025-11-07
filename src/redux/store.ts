import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { authApi } from './apis/authApi'
import { jobBoardApi } from './apis/jobBoardApi'
import { voiceApi } from './apis/voiceApi'
import authReducer from './slices/authSlice'
import formReducer from './slices/formSlice'
import languageReducer from './slices/languageSlice'
import jobsReducer from './slices/jobsSlice'
import { ocrApi } from './apis/ocrApi'

const rootReducer = combineReducers({
	auth: authReducer,
	form: formReducer,
	language: languageReducer,
	jobs: jobsReducer,
	[authApi.reducerPath]: authApi.reducer,
	[jobBoardApi.reducerPath]: jobBoardApi.reducer,
	[voiceApi.reducerPath]: voiceApi.reducer,
	[ocrApi.reducerPath]: ocrApi.reducer,
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
		}).concat(authApi.middleware, jobBoardApi.middleware, voiceApi.middleware, ocrApi.middleware),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(store as any).__persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
