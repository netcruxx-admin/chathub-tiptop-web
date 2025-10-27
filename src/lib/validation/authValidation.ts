import * as yup from 'yup'
import type { TranslationFunction } from '@/types'

export const createNumberValidation = (t: TranslationFunction) => yup.object().shape({
	phoneNumber: yup
		.string()
		.required(t('phone.phoneRequired'))
		.transform(value => {
			const onlyDigits = value.replace(/\D/g, '')
			return onlyDigits.slice(-10)
		})
		.matches(/^\d{10}$/, t('phone.phoneInvalid')),
})

export const createEmployerLoginValidation = (t: TranslationFunction) => yup.object().shape({
	email: yup.string()
		.trim()
		.required(t('employerLoginVal.reqEmail'))
		.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('employerLoginVal.validEmail')),
	password: yup.string()
		.required(t('employerLoginVal.reqPassword'))
		.min(6, t('employerLoginVal.validPassword')),
})

export const createEmployeeLoginValidation = (t: TranslationFunction) => yup.object().shape({
	email: yup.string()
		.trim()
		.required(t('employeeLoginVal.reqEmail'))
		.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('employeeLoginVal.validEmail')),
	password: yup.string()
		.required(t('employeeLoginVal.reqPassword'))
		.min(6, t('employeeLoginVal.validPassword')),
})

export const createNameCollectionValidation = (t: TranslationFunction) => yup.object().shape({
	firstName: yup.string()
		.trim()
		.required(t('nameCollection.firstNameRequired'))
		.min(2, t('nameCollection.firstNameMin')),
	middleName: yup.string().trim(),
	lastName: yup.string()
		.trim()
		.required(t('nameCollection.lastNameRequired'))
		.min(2, t('nameCollection.lastNameMin')),
	username: yup.string()
		.trim()
		.required(t('nameCollection.usernameRequired'))
		.min(3, t('nameCollection.usernameMin'))
		.matches(/^[a-zA-Z0-9_]+$/, t('nameCollection.usernameInvalid')),
	email: yup.string()
		.trim()
		.required(t('nameCollection.emailRequired'))
		.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('nameCollection.emailInvalid')),
})

export const createFormBasedProfileValidation = (t: TranslationFunction) => yup.object().shape({
	firstName: yup.string()
		.trim()
		.required(t('profileForm.firstNameRequired'))
		.min(2, t('profileForm.firstNameMin')),
	lastName: yup.string()
		.trim()
		.required(t('profileForm.lastNameRequired'))
		.min(2, t('profileForm.lastNameMin')),
	dateOfBirth: yup.date()
		.required(t('profileForm.dobRequired'))
		.max(new Date(), t('profileForm.dobInvalid'))
		.test('age', t('profileForm.dobAge'), function(value) {
			if (!value) return false
			const today = new Date()
			const birthDate = new Date(value)
			const age = today.getFullYear() - birthDate.getFullYear()
			const monthDiff = today.getMonth() - birthDate.getMonth()
			if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
				return age - 1 >= 16
			}
			return age >= 16
		}),
	aadhaarNumber: yup.string()
		.trim()
		.matches(/^\d{12}$/, t('profileForm.aadhaarInvalid'))
		.optional(),
})

export const createLocationSelectionValidation = (t: TranslationFunction) => yup.object().shape({
	addressLine1: yup.string().trim(),
	addressLine2: yup.string().trim(),
	area: yup.string()
		.trim()
		.required(t('location.areaRequired')),
	city: yup.string()
		.trim()
		.required(t('location.cityRequired')),
	state: yup.string().trim(),
	pincode: yup.string()
		.trim()
		.matches(/^\d{6}$/, t('location.pincodeInvalid'))
		.optional(),
})

export const createDistanceSelectionValidation = (t: TranslationFunction) => yup.object().shape({
	jobRadius: yup.number()
		.required(t('distance.radiusRequired'))
		.min(5, t('distance.radiusMin'))
		.max(50, t('distance.radiusMax')),
})

export const createSkillsSelectionValidation = (t: TranslationFunction) => yup.object().shape({
	selectedSkills: yup.array()
		.of(yup.string())
		.when('openToAnyWork', {
			is: false,
			then: (schema) => schema.min(1, t('skills.skillsRequired')),
			otherwise: (schema) => schema,
		}),
	openToAnyWork: yup.boolean(),
})

export const createResumeReviewValidation = (t: TranslationFunction) => yup.object().shape({
	firstName: yup.string()
		.trim()
		.required(t('resumeReview.firstNameRequired'))
		.min(2, t('resumeReview.firstNameMin')),
	lastName: yup.string()
		.trim()
		.required(t('resumeReview.lastNameRequired'))
		.min(2, t('resumeReview.lastNameMin')),
	dateOfBirth: yup.date()
		.required(t('resumeReview.dobRequired'))
		.max(new Date(), t('resumeReview.dobInvalid')),
	email: yup.string()
		.trim()
		.required(t('resumeReview.emailRequired'))
		.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('resumeReview.emailInvalid')),
})

export const createAadhaarReviewValidation = (t: TranslationFunction) => yup.object().shape({
	gender: yup.string()
		.required(t('aadhaarReview.genderRequired')),
})

// Legacy exports for backward compatibility (default to English messages)
export const NumberValidation = yup.object().shape({
	phoneNumber: yup
		.string()
		.required('Phone Number is required')
		.transform(value => {
			const onlyDigits = value.replace(/\D/g, '')
			return onlyDigits.slice(-10)
		})
		.matches(/^\d{10}$/, 'Please enter a valid 10-digit phone number'),
})

export const EmployerLoginValidation = yup.object().shape({
	email: yup.string()
		.trim()
		.required("Email is required")
		.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email."),
	password: yup.string()
		.required("Password is required")
		.min(6, "Password must be at least 6 characters"),
})