import {
	createApi,
	fetchBaseQuery,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { getCookie } from '../../lib/cookies'
import {
	TIPTOP_USER_TOKEN,
	REACT_APP_API_BASE_URL,
	REACT_APP_CLIENT_IP_ADDRESS,
	REACT_APP_CLIENT_TOKEN,
	REACT_APP_MACHINE_KEY,
	REACT_APP_TENANT_ID,
	REACT_APP_TENANT_UID,
} from '../../lib/constants'

interface ErrorResponse {
	message: string
}

export const profileApi = createApi({
	reducerPath: 'profileApi',
	baseQuery: fetchBaseQuery({
		baseUrl: REACT_APP_API_BASE_URL,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		prepareHeaders: (headers: any) => {
			headers.set('Content-Type', 'application/json')
			headers.set('Accept', 'application/json')
			//   headers.set(
			//     "user-token",
			//     getCookie(TIPTOP_USER_TOKEN) ||
			//     "NO-TOKEN-AVAILABLE"
			//   )
			headers.set('ClientIpAddress', REACT_APP_CLIENT_IP_ADDRESS)
			headers.set('clienttoken', REACT_APP_CLIENT_TOKEN)
			headers.set('MachineKey', REACT_APP_MACHINE_KEY)
			headers.set('TenantOuId', REACT_APP_TENANT_UID)
			headers.set('TenantId', REACT_APP_TENANT_ID)
			return headers
		},
	}),
	// https://gateway.ahalts.com/doc/profile/upload
	endpoints: builder => ({
		uploadResume: builder.mutation<
			any,
			{ file: File; id: string; name: string; phone: string }
		>({
			query: ({ file, id, name, phone }) => {
				const formData = new FormData()
				formData.append('file', file)
				formData.append('id', id)
				formData.append('name', name)
				formData.append('phone', phone)

				return {
					url: 'https://gateway.ahalts.com/doc/profile/upload',
					method: 'POST',
					body: formData,
				}
			},
		}),
	}),
})

export const { useUploadResumeMutation } = profileApi
