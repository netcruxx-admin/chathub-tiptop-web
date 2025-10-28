// Form Validation Types

export interface PhoneNumberValidationValues {
	phoneNumber: string
}

export interface EmployerLoginValidationValues {
	email: string
	password: string
}

export interface FormError {
	[key: string]: string | undefined
}

export interface FormTouched {
	[key: string]: boolean | undefined
}
