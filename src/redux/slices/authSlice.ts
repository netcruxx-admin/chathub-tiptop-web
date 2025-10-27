import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProfileFormData {
	firstName?: string
	lastName?: string
	dateOfBirth?: string
	aadhaarNumber?: string
	username?: string
	email?: string
}

interface EmployeeData {
	email?: string
	username?: string
	accessToken?: string
	refreshToken?: string
	tokenType?: string
	expiresIn?: number
}

interface UserIdentity {
	userId?: string
	userName?: string
	email?: string
	fullName?: string
	roles?: string[]
	// Add other fields based on actual API response
}

interface UserSession {
	sessionId?: string
	accessToken?: string
	issueDate?: string
	expiration?: string
	// Add other fields based on actual API response
}

interface AuthState {
	phoneNumber: string | null
	senderId: string | null
	isAuthenticated: boolean
	userToken: string | null
	profileFormData: ProfileFormData | null
	employeeData: EmployeeData | null
	userIdentity: UserIdentity | null
	userSession: UserSession | null
}

const initialState: AuthState = {
	phoneNumber: null,
	senderId: null,
	isAuthenticated: false,
	userToken: null,
	profileFormData: null,
	employeeData: null,
	userIdentity: null,
	userSession: null,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setPhoneNumber: (state, action: PayloadAction<string>) => {
			state.phoneNumber = action.payload
		},
		setSenderId: (state, action: PayloadAction<string>) => {
			state.senderId = action.payload
		},
		setUserToken: (state, action: PayloadAction<string>) => {
			state.userToken = action.payload
			state.isAuthenticated = true
		},
		setProfileFormData: (state, action: PayloadAction<ProfileFormData>) => {
			state.profileFormData = action.payload
		},
		setEmployeeData: (state, action: PayloadAction<EmployeeData>) => {
			state.employeeData = action.payload
			state.isAuthenticated = true
			state.userToken = action.payload.accessToken || null
		},
		setUserIdentity: (state, action: PayloadAction<UserIdentity>) => {
			state.userIdentity = action.payload
		},
		setUserSession: (state, action: PayloadAction<UserSession>) => {
			state.userSession = action.payload
		},
		clearAuth: state => {
			state.phoneNumber = null
			state.senderId = null
			state.isAuthenticated = false
			state.userToken = null
			state.profileFormData = null
			state.employeeData = null
			state.userIdentity = null
			state.userSession = null
		},
	},
})

export const {
	setPhoneNumber,
	setSenderId,
	setUserToken,
	setProfileFormData,
	setEmployeeData,
	setUserIdentity,
	setUserSession,
	clearAuth
} = authSlice.actions
export default authSlice.reducer
