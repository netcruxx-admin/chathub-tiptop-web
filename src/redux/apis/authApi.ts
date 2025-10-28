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

export const authApi = createApi({
	reducerPath: 'authApi',
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
	endpoints: builder => ({
		signup: builder.mutation({
			query: data => ({
				url: '/AhaltsSMS/UserRegistration',
				method: 'POST',
				body: [data],
			}),
			transformErrorResponse: (response: FetchBaseQueryError) =>
				response.data as ErrorResponse,
		}),
		login: builder.mutation({
			query: data => ({
				url: 'https://gateway.ahalts.com/oauth/token',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					Client_Id: data.Client_Id,
					Client_Secret: data.Client_Secret,
					grant_type: data.grant_type,
					IsOtpLogin: data.IsOtpLogin,
					MobileNo: data.MobileNo,
					OTP: data.OTP,
					senderId: data.senderId,
					...(data.CompanyID ? { CompanyID: data.CompanyID } : {}),
				}),
			}),
			transformResponse: response => response,
			transformErrorResponse: response => response.data,
		}),
		sendVerificationCode: builder.mutation({
			query: data => ({
				url: `/AhaltsSMS/OTPRequest/${data.phoneNumber}`,
				method: 'POST',
			}),
			transformErrorResponse: (response: FetchBaseQueryError) =>
				response.data as ErrorResponse,
		}),
		verifyCode: builder.mutation({
			query: data => ({
				url: '/AhaltsSMS/OTPVerify',
				method: 'POST',
				body: data,
			}),
			transformErrorResponse: (response: FetchBaseQueryError) =>
				response.data as ErrorResponse,
		}),
	}),
})

export const {
	useSignupMutation,
	useLoginMutation,
	useSendVerificationCodeMutation,
	useVerifyCodeMutation,
} = authApi
