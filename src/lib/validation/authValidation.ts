import * as yup from 'yup'

export const NumberValidation = yup.object().shape({
	phoneNumber: yup
		.string()
		.required('Please enter your Phone Number')
		.transform(value => {
			const onlyDigits = value.replace(/\D/g, '')
			return onlyDigits.slice(-10)
		})
		.matches(/^\d{10}$/, 'Please enter a valid 10-digit phone number'),
})
