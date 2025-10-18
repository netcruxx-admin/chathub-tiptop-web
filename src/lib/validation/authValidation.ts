import * as yup from 'yup'

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