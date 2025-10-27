'use client'

import BackBtn from '@/components/backBtn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import { createEmployerLoginValidation } from '@/lib/validation/authValidation'
import { Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function EmployerLogin() {
	const router = useRouter()
	const t = useTranslations()
	const initialValues = {
		email: '',
		password: '',
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b flex items-center justify-between'>
				<BackBtn />
				<h1 className='text-lg font-semibold'>{t('employerLogin.header')}</h1>
			</div>

			<div className='flex-1 flex flex-col justify-center p-6'>
				<div className='max-w-md mx-auto w-full space-y-6'>
					<div className='text-center'>
						<h2 className='text-2xl font-bold mb-2'>
							{t('employerLogin.title')}
						</h2>
						<p className='text-muted-foreground'>
							{t('employerLogin.subtitle')}
						</p>
					</div>

					<Formik
						initialValues={initialValues}
						validationSchema={createEmployerLoginValidation(t)}
						validateOnMount={true}
						onSubmit={values => {
							console.log(values)
							router.push(`/otpInput?number=${values.phoneNumber}`)
						}}
					>
						{props => (
							<form onSubmit={props.handleSubmit}>
								<div className='flex flex-col space-y-4 mb-6'>
									<div>
										<label
											className='block text-sm font-medium mb-2'
											htmlFor='email'
										>
											{t('employerLogin.labelEmail')}
										</label>
										<Input
											type='email'
											name='email'
											id='email'
											value={props.values.email}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											placeholder={t('employerLogin.placeholderEmail')}
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
											{t('employerLogin.labelPassword')}
										</label>
										<Input
											type='password'
											name='password'
											id='password'
											value={props.values.password}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											placeholder={t('employerLogin.placeholderPassword')}
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

								<Button className='w-full h-12' type='submit'>
									{t('employerLogin.loginBtn')}
								</Button>
							</form>
						)}
					</Formik>

					<div className='text-center text-sm'>
						<p>
							{t('employerLogin.footer')}{' '}
							<button className='text-primary font-medium hover:underline cursor-pointer'>
								{t('employerLogin.signUp')}
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
