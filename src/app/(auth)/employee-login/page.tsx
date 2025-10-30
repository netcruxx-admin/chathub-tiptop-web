'use client'

import BackBtn from '@/components/backBtn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'
// import { createEmployeeLoginValidation } from '@/lib/validation/authValidation'
import { Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
// import {
// 	useEmployeeLoginMutation,
// 	useLazyGetUserIdentityQuery,
// 	useCreateUserSessionMutation
// } from '@/redux/apis/authApi'
import { useAppDispatch } from '@/redux/hooks'
import {
	setEmployeeData,
	setUserIdentity,
	setUserSession
} from '@/redux/slices/authSlice'
import { toast } from 'sonner'

export default function EmployeeLogin() {
	const router = useRouter()
	const t = useTranslations()
	const dispatch = useAppDispatch()
	// const [employeeLogin, { isLoading }] = useEmployeeLoginMutation()
	// const [getUserIdentity] = useLazyGetUserIdentityQuery()
	// const [createUserSession] = useCreateUserSessionMutation()

	const initialValues = {
		email: '',
		password: '',
	}

	const handleSubmit = async (values: typeof initialValues) => {
		try {
			// Step 1: Login to get access token
			// const loginResult = await employeeLogin({
			// 	email: values.email,
			// 	password: values.password,
			// }).unwrap()

			// const accessToken = loginResult.access_token

			// Store employee data in Redux
			// dispatch(setEmployeeData({
			// 	email: values.email,
			// 	accessToken: accessToken,
			// 	refreshToken: loginResult.refresh_token,
			// 	tokenType: loginResult.token_type,
			// 	expiresIn: loginResult.expires_in,
			// }))

			// Step 2: Get user identity
			// try {
			// 	const identityResult = await getUserIdentity(accessToken).unwrap()
			// 	dispatch(setUserIdentity(identityResult))
			// } catch (identityError) {
			// 	console.error('Failed to fetch user identity:', identityError)
			// 	Continue even if identity fetch fails
			// }

			// Step 3: Create user session
			// try {
			// 	const issueDate = new Date().toISOString()
			// 	const expiration = new Date(Date.now() + (loginResult.expires_in * 1000)).toISOString()

			// 	const sessionResult = await createUserSession({
			// 		accessToken: accessToken,
			// 		issueDate: issueDate,
			// 		expiration: expiration,
			// 	}).unwrap()

			// 	dispatch(setUserSession({
			// 		...sessionResult,
			// 		accessToken: accessToken,
			// 		issueDate: issueDate,
			// 		expiration: expiration,
			// 	}))
			// } catch (sessionError) {
			// 	console.error('Failed to create user session:', sessionError)
				// Continue even if session creation fails
			// }

			toast.success('Login successful!')
			router.push('/dashboard')
		} catch (error: any) {
			console.error('Login error:', error)
			toast.error(error?.error_description || error?.message || 'Login failed. Please check your credentials.')
		}
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b flex items-center justify-between'>
				<BackBtn />
				<h1 className='text-lg font-semibold'>{t('employeeLogin.header')}</h1>
			</div>

			<div className='flex-1 flex flex-col justify-center p-6'>
				<div className='max-w-md mx-auto w-full space-y-6'>
					<div className='text-center'>
						<h2 className='text-2xl font-bold mb-2'>
							{t('employeeLogin.title')}
						</h2>
						<p className='text-muted-foreground'>
							{t('employeeLogin.subtitle')}
						</p>
					</div>

					<Formik
						initialValues={initialValues}
						// validationSchema={createEmployeeLoginValidation(t)}
						validateOnMount={true}
						onSubmit={handleSubmit}
					>
						{props => (
							<form onSubmit={props.handleSubmit}>
								<div className='flex flex-col space-y-4 mb-6'>
									<div>
										<label
											className='block text-sm font-medium mb-2'
											htmlFor='email'
										>
											{t('employeeLogin.labelEmail')}
										</label>
										<Input
											type='email'
											name='email'
											id='email'
											value={props.values.email}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											placeholder={t('employeeLogin.placeholderEmail')}
											className={cn(
												props.touched.email &&
													props.errors.email &&
													'border-red-400 focus-visible:ring-red-500 focus-visible:border-red-500'
											)}
										/>
										{props.touched.email && props.errors.email && (
											<p className='text-red-500 text-sm text-right'>
												{props.errors.email}
											</p>
										)}
									</div>
									<div>
										<label
											className='block text-sm font-medium mb-2'
											htmlFor='password'
										>
											{t('employeeLogin.labelPassword')}
										</label>
										<Input
											type='password'
											name='password'
											id='password'
											value={props.values.password}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											placeholder={t('employeeLogin.placeholderPassword')}
											className={cn(
												props.touched.password &&
													props.errors.password &&
													'border-red-400 focus-visible:ring-red-500 focus-visible:border-red-500'
											)}
										/>
										{props.touched.password && props.errors.password && (
											<p className='text-red-500 text-sm text-right'>
												{props.errors.password}
											</p>
										)}
									</div>
								</div>

								<Button
									className='w-full h-12'
									type='submit'
									// disabled={isLoading || !props.isValid}
								>
									{/* {isLoading ? t('common.loading') : t('employeeLogin.loginBtn')} */}
								</Button>
							</form>
						)}
					</Formik>

					<div className='text-center text-sm'>
						<p>
							{t('employeeLogin.footer')}{' '}
							<button className='text-primary font-medium hover:underline cursor-pointer'>
								{t('employeeLogin.signUp')}
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
