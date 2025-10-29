import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface EmployeeData {
	email: string
	accessToken: string
	refreshToken: string
	tokenType: string
	expiresIn: number
}

interface EmployerData {
	email: string
	accessToken: string
	refreshToken: string
	tokenType: string
	expiresIn: number
}

interface UserIdentity {
	[key: string]: any
}

interface UserSession {
	accessToken: string
	issueDate: string
	expiration: string
	[key: string]: any
}

interface AuthState {
	phoneNumber: string | null
	senderId: string | null
	isAuthenticated: boolean
	userToken: string | null
	userName: string | null
	employeeData: EmployeeData | null
	employerData: EmployerData | null
	userIdentity: UserIdentity | null
	userSession: UserSession | null
	user: {
		Email: string
		FirstName: string
		LastName: string
		UserName: string
		AadharNumber: string
		Address1: string
		Address2: string
		Area: string
		AlternateEmail: string
		BirthPlace: string
		BloodGroup: string
		City: string
		Country: string
		CountryID: number
		DOB: string
		EmergencyPhone: string
		FatherName: string
		GovtID: string
		ID: string
		ImagePath: string
		IsAdditionalInfoAvailable: number
		IsExperienceInfoAvailable: number
		IsFamilyInfoAvailable: number
		IsPersonalInfoAvailable: number
		IsQualificationInfoAvailable: number
		IsReferenceInfoAvailable: number
		Marital: number
		MiddleName: string
		MotherName: string
		PanNumber: string
		PermanetAddress1: string
		PermanetAddress2: string
		PermanetCity: string
		PermanetCountryID: number
		PermanetStateID: number
		PermanetZip: string
		Phone: string
		PoliceStation: string
		PrimaryContact: boolean
		PublicProfile: boolean
		SecretAnswer: string
		SecretQuestion: string
		Sex: number
		State: string
		StateID: number
		TimeZone: string
		Title: string
		VoterID: string
		Zip: string
	}
	profile: {
		job_role: string[],
		job_distance: string
	}
}

const initialState: AuthState = {
	phoneNumber: null,
	senderId: null,
	isAuthenticated: false,
	userToken: null,
	userName: null,
	employeeData: null,
	employerData: null,
	userIdentity: null,
	userSession: null,
	user: {
		Email: '',
		FirstName: '',
		LastName: '',
		UserName: '',
		AadharNumber: '',
		Address1: '',
		Address2: '',
		Area: '',
		AlternateEmail: '',
		BirthPlace: '',
		BloodGroup: '',
		City: '',
		Country: '',
		CountryID: 0,
		DOB: '',
		EmergencyPhone: '',
		FatherName: '',
		GovtID: '',
		ID: '',
		ImagePath: '',
		IsAdditionalInfoAvailable: 0,
		IsExperienceInfoAvailable: 0,
		IsFamilyInfoAvailable: 0,
		IsPersonalInfoAvailable: 0,
		IsQualificationInfoAvailable: 0,
		IsReferenceInfoAvailable: 0,
		Marital: 0,
		MiddleName: '',
		MotherName: '',
		PanNumber: '',
		PermanetAddress1: '',
		PermanetAddress2: '',
		PermanetCity: '',
		PermanetCountryID: 0,
		PermanetStateID: 0,
		PermanetZip: '',
		Phone: '',
		PoliceStation: '',
		PrimaryContact: false,
		PublicProfile: false,
		SecretAnswer: '',
		SecretQuestion: '',
		Sex: 0,
		State: '',
		StateID: 0,
		TimeZone: '',
		Title: '',
		VoterID: '',
		Zip: '',
	},
	profile: {
		job_role: [],
		job_distance: ''
	}
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
		setUserName: (state, action: PayloadAction<string>) => {
			state.userName = action.payload
		},
		updateUser: (state, action: PayloadAction<Partial<AuthState['user']>>) => {
			state.user = {
				...state.user,
				...action.payload,
			}
		},
		setJobRole: (state, action: PayloadAction<string[]>) => {
			state.profile.job_role = action.payload
		},
		setJobDistance: (state, action: PayloadAction<string>) => {
			state.profile.job_distance = action.payload
		},
		setEmployeeData: (state, action: PayloadAction<EmployeeData>) => {
			state.employeeData = action.payload
			state.isAuthenticated = true
		},
		setEmployerData: (state, action: PayloadAction<EmployerData>) => {
			state.employerData = action.payload
			state.isAuthenticated = true
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
			state.employeeData = null
			state.employerData = null
			state.userIdentity = null
			state.userSession = null
		},
	},
})

export const {
	setPhoneNumber,
	setSenderId,
	setUserToken,
	setUserName,
	updateUser,
	clearAuth,
	setJobRole,
	setJobDistance,
	setEmployeeData,
	setEmployerData,
	setUserIdentity,
	setUserSession,
} = authSlice.actions
export default authSlice.reducer
