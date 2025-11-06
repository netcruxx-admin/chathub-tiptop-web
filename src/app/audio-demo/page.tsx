"use client"

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useTextToSpeechMutation } from '@/redux/apis/voiceApi'
import { Howl } from 'howler'
import { useState } from 'react'

const voiceOptions = [
	{ value: 'alloy', label: 'Alloy' },
	{ value: 'echo', label: 'Echo' },
	{ value: 'fable', label: 'Fable' },
	{ value: 'onyx', label: 'Onyx' },
	{ value: 'nova', label: 'Nova' },
	{ value: 'shimmer', label: 'Shimmer' },
]

const validationSchema = Yup.object({
	text: Yup.string().required('Text is required').min(1, 'Text cannot be empty'),
	voice: Yup.string().required('Voice is required'),
})

export default function AudioDemo() {
	const [textToSpeech, { isLoading }] = useTextToSpeechMutation()
	const [currentSound, setCurrentSound] = useState<Howl | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)

	const handleSubmit = async (values: { text: string; voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' }) => {
		try {
			// Stop current audio if playing
			if (currentSound) {
				currentSound.stop()
				currentSound.unload()
				setIsPlaying(false)
			}

			const response = await textToSpeech(values).unwrap()

			// Play the audio response with Howler using the object URL
			if (response.audioUrl) {
				const sound = new Howl({
					src: [response.audioUrl],
					format: ['mp3'],
					html5: true,
					onload: () => {
						console.log('✅ Audio loaded successfully')
					},
					onloaderror: (_id, error) => {
						console.error('❌ Failed to load audio:', error)
					},
					onplay: () => {
						setIsPlaying(true)
					},
					onend: () => {
						setIsPlaying(false)
						// Clean up the object URL
						URL.revokeObjectURL(response.audioUrl)
					},
					onpause: () => {
						setIsPlaying(false)
					},
					onstop: () => {
						setIsPlaying(false)
					},
				})

				setCurrentSound(sound)
				sound.play()
			}
		} catch (error) {
			console.error('Failed to generate speech:', error)
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
			<div className='w-full max-w-md bg-white rounded-lg shadow-lg p-6'>
				<h1 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
					Text to Speech
				</h1>

				<Formik
					initialValues={{
						text: '',
						voice: 'nova',
					}}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({ isValid, dirty }) => (
						<Form className='space-y-4'>
							<div>
								<label
									htmlFor='text'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									Text
								</label>
								<Field
									as='textarea'
									id='text'
									name='text'
									rows={4}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
									placeholder='Enter text to convert to speech...'
								/>
								<ErrorMessage
									name='text'
									component='div'
									className='text-red-500 text-sm mt-1'
								/>
							</div>

							<div>
								<label
									htmlFor='voice'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									Voice
								</label>
								<Field
									as='select'
									id='voice'
									name='voice'
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								>
									{voiceOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Field>
								<ErrorMessage
									name='voice'
									component='div'
									className='text-red-500 text-sm mt-1'
								/>
							</div>

							<button
								type='submit'
								disabled={isLoading || !isValid || !dirty}
								className='w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
							>
								{isLoading ? 'Generating...' : 'Generate Speech'}
							</button>

							{isPlaying && (
								<div className='text-center text-sm text-green-600 font-medium'>
									Playing audio...
								</div>
							)}
						</Form>
					)}
				</Formik>
			</div>
		</div>
	)
}
