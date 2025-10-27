// Form Validation Types

export interface PhoneNumberValidationValues {
	phoneNumber: string
}

export interface EmployerLoginValidationValues {
	email: string
	password: string
}

export interface NameCollectionValidationValues {
	firstName: string
	middleName?: string
	lastName: string
	username: string
	email: string
}

export interface FormBasedProfileValidationValues {
	firstName: string
	lastName: string
	dateOfBirth: string
	aadhaarNumber?: string
}

export interface LocationSelectionValidationValues {
	addressLine1?: string
	addressLine2?: string
	area: string
	city: string
	state?: string
	pincode?: string
}

export interface DistanceSelectionValidationValues {
	jobRadius: number
}

export interface SkillsSelectionValidationValues {
	selectedSkills: string[]
	openToAnyWork: boolean
}

export interface ResumeReviewValidationValues {
	firstName: string
	lastName: string
	dateOfBirth: string
	email: string
}

export interface AadhaarReviewValidationValues {
	gender: string
}

export interface FormError {
	[key: string]: string | undefined
}

export interface FormTouched {
	[key: string]: boolean | undefined
}
