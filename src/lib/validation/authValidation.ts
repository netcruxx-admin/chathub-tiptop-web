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

export const createOTPValidation = (t: TranslationFunction) => yup.object().shape({
	otp: yup
		.string()
		.required(t('otp.otpRequired'))
		.length(6, t('otp.otpInvalid'))
		.matches(/^\d{6}$/, t('otp.otpInvalid')),
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