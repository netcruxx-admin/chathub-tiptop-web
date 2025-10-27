'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store } from '@/redux/store'

interface ReduxProviderProps {
	children: React.ReactNode
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
	// Access the persistor from the store
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const persistor = (store as any).__persistor

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	)
}
