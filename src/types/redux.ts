// Redux & RTK Types

import type { RootState, AppDispatch } from '@/redux/store'

// Re-export store types
export type { RootState, AppDispatch }

// Auth Types
export interface SignUpData {
	email?: string
	full_name?: string
	password?: string
	phone_number?: string
	company_name?: string
	designation?: string
	department?: string
}

export interface LoginData {
	email: string
	password: string
}

export interface AuthState {
	email: string
	fullName: string
	designation: string
	token: string
	isUserVerified: boolean
	days: number
	signUpData: SignUpData | null
	phoneNumber: string
	selectedVenueName: string
	selectedVenueId: string
	selectedVenueLogo: string
}

// API Error Response
export interface ErrorResponse {
	message: string
	statusCode?: number
}

// API Mutation Types
export interface VerificationCodeData {
	email: string
}

export interface VerifyCodeData {
	email: string
	otp: string
}

export interface PasswordManagerData {
	action: 'change' | 'reset'
	password: string
	token?: string
}

export interface PasswordResetEmailData {
	email: string
}
