"use client"

import {
	useTextToSpeechMutation,
	useStartProfileMutation,
	useSubmitAnswerMutation,
	useLazyGetQuestionsQuery,
	useSubmitAnswerNewMutation,
	type QuestionResponse,
} from '@/redux/apis/voiceApi'
import { Howl } from 'howler'
import { useState, useEffect, useRef } from 'react'

interface Message {
	type: 'question' | 'answer'
	text: string
	timestamp: Date
}

export default function AudioDemo() {
	const [textToSpeech] = useTextToSpeechMutation()
	const [getQuestions] = useLazyGetQuestionsQuery()
	const [submitAnswerNew] = useSubmitAnswerNewMutation()

	const [userId, setUserId] = useState('')
	const [hasStarted, setHasStarted] = useState(false)
	const [allQuestions, setAllQuestions] = useState<QuestionResponse[]>([])
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [currentQuestion, setCurrentQuestion] = useState<{
		id: string | number
		text: string
		serial_no: number
		question_order: number
	} | null>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [isListening, setIsListening] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isLoadingAudio, setIsLoadingAudio] = useState(false)
	const [currentSound, setCurrentSound] = useState<Howl | null>(null)
	const [isSessionComplete, setIsSessionComplete] = useState(false)
	const [error, setError] = useState('')
	const [interimTranscript, setInterimTranscript] = useState('')

	const recognitionRef = useRef<SpeechRecognition | null>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const interimTranscriptRef = useRef('')
	const userIdRef = useRef('')
	const currentQuestionRef = useRef<{
		id: string | number
		text: string
		serial_no: number
		question_order: number
	} | null>(null)

	// Initialize speech recognition
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const SpeechRecognition =
				window.SpeechRecognition || window.webkitSpeechRecognition
			if (SpeechRecognition) {
				const recognition = new SpeechRecognition()
				recognition.continuous = false
				recognition.interimResults = true
				recognition.lang = 'en-US'

				recognition.onstart = () => {
					console.log('Speech recognition started')
					setIsListening(true)
				}

				recognition.onresult = (event) => {
					console.log('Speech recognition result:', event)
					let finalTranscript = ''
					let interim = ''

					for (let i = 0; i < event.results.length; i++) {
						const transcript = event.results[i][0].transcript
						if (event.results[i].isFinal) {
							finalTranscript += transcript
						} else {
							interim += transcript
						}
					}

					console.log('Final:', finalTranscript, 'Interim:', interim)

					if (finalTranscript) {
						console.log('Processing final transcript:', finalTranscript)
						console.log('About to call handleUserAnswer with:', finalTranscript)
						setInterimTranscript('')
						interimTranscriptRef.current = ''

						// Use setTimeout to ensure state is updated
						setTimeout(() => {
							console.log('Calling handleUserAnswer NOW')
							handleUserAnswer(finalTranscript)
						}, 100)
					} else if (interim) {
						console.log('Showing interim transcript:', interim)
						setInterimTranscript(interim)
						interimTranscriptRef.current = interim
					}
				}

				recognition.onerror = (event) => {
					console.error('Speech recognition error:', event.error, event)
					setIsListening(false)
					if (event.error === 'no-speech') {
						setError('No speech detected. Please try again.')
					} else if (event.error === 'not-allowed') {
						setError('Microphone access denied. Please allow microphone access.')
					} else {
						setError(`Speech recognition error: ${event.error}`)
					}
				}

				recognition.onend = () => {
					console.log('Speech recognition ended')
					setIsListening(false)

					// Submit interim transcript if we have one and no final was received
					const interim = interimTranscriptRef.current
					if (interim) {
						console.log('Submitting interim transcript on end:', interim)
						handleUserAnswer(interim)
						setInterimTranscript('')
						interimTranscriptRef.current = ''
					}
				}

				recognition.onspeechstart = () => {
					console.log('Speech detected')
				}

				recognition.onspeechend = () => {
					console.log('Speech ended - capturing interim transcript')
					// Capture the interim transcript before it's cleared
					const interim = interimTranscriptRef.current
					if (interim) {
						console.log('Speech ended with interim:', interim)
						// Submit after a small delay to allow final results
						setTimeout(() => {
							const stillInterim = interimTranscriptRef.current
							if (stillInterim === interim) {
								console.log('No final result received, submitting interim:', stillInterim)
								handleUserAnswer(stillInterim)
								setInterimTranscript('')
								interimTranscriptRef.current = ''
								recognition.stop()
							}
						}, 500)
					}
				}

				recognitionRef.current = recognition
			} else {
				console.error('Speech recognition not supported')
				setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
			}
		}
	}, [])

	// Sync userId with ref
	useEffect(() => {
		userIdRef.current = userId
		console.log('userId updated in ref:', userId)
	}, [userId])

	// Sync currentQuestion with ref
	useEffect(() => {
		currentQuestionRef.current = currentQuestion
		console.log('currentQuestion updated:', currentQuestion)
	}, [currentQuestion])

	// Auto-scroll to bottom of messages
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const playQuestionAudio = async (text: string) => {
		try {
			// Stop current audio if playing
			if (currentSound) {
				currentSound.stop()
				currentSound.unload()
			}

			setIsLoadingAudio(true)
			console.log('Calling TTS API with:', { text, voice: 'nova' })
			const response = await textToSpeech({
				text,
				voice: 'nova',
			}).unwrap()

			console.log('TTS API Response:', response)
			setIsLoadingAudio(false)

			if (response.audioUrl) {
				const sound = new Howl({
					src: [response.audioUrl],
					format: ['mp3'],
					html5: true,
					onload: () => {
						console.log('✅ Audio loaded successfully')
						setIsPlaying(true)
					},
					onloaderror: (_id, error) => {
						console.error('❌ Howler failed to load audio:', error)
						setError('Failed to load audio. Please try again.')
						setIsPlaying(false)
						setIsLoadingAudio(false)
					},
					onplay: () => {
						console.log('Audio playing')
						setIsPlaying(true)
					},
					onend: () => {
						console.log('Audio ended')
						setIsPlaying(false)
						URL.revokeObjectURL(response.audioUrl)
						// Auto-start listening after question finishes
						startListening()
					},
					onstop: () => {
						setIsPlaying(false)
					},
				})

				setCurrentSound(sound)
				sound.play()
			} else {
				console.error('No audioUrl in response')
				setError('No audio received from API.')
				setIsLoadingAudio(false)
			}
		} catch (error) {
			console.error('Failed to play audio:', error)
			setError(`Failed to play audio: ${error}`)
			setIsLoadingAudio(false)
		}
	}

	const handleStartSession = async () => {
		if (!userId.trim()) {
			setError('Please enter a User ID')
			return
		}

		try {
			setError('')
			// Get questions from the 'profile' section
			const response = await getQuestions('profile').unwrap()

			console.log('Get Questions Response:', response)

			if (!response || response.length === 0) {
				setError('No questions found for profile section.')
				return
			}

			// Store all questions and set the first one
			setAllQuestions(response)
			const firstQuestion = response[0]

			// Map the API response fields to our internal structure
			setCurrentQuestion({
				id: firstQuestion.Id,
				text: firstQuestion.QuestionText,
				serial_no: firstQuestion.Pid || 0,
				question_order: firstQuestion.QuestionOrder,
			})
			setMessages([
				{
					type: 'question',
					text: firstQuestion.QuestionText,
					timestamp: new Date(),
				},
			])
			setHasStarted(true)
			setCurrentQuestionIndex(0)

			// Play the first question
			await playQuestionAudio(firstQuestion.QuestionText)
		} catch (error) {
			console.error('Failed to start profile:', error)
			setError('Failed to start session. Please try again.')
		}
	}

	const startListening = () => {
		if (!recognitionRef.current) {
			console.error('Speech recognition not initialized')
			setError('Speech recognition not available. Please use Chrome or Edge.')
			return
		}

		if (isListening) {
			console.log('Already listening')
			return
		}

		try {
			console.log('Attempting to start speech recognition...')
			recognitionRef.current.start()
			setError('')
		} catch (error) {
			console.error('Failed to start listening:', error)
			setError(`Failed to start recording: ${error}`)
		}
	}

	const stopListening = () => {
		if (recognitionRef.current && isListening) {
			recognitionRef.current.stop()
			setIsListening(false)
		}
	}

	const handleSkipAnswer = () => {
		// Clear interim transcript before stopping to prevent onend from submitting
		setInterimTranscript('')
		interimTranscriptRef.current = ''
		stopListening()
		// Use setTimeout to ensure recognition has fully stopped
		setTimeout(() => {
			handleUserAnswer('')
		}, 100)
	}

	const handleUserAnswer = async (answer: string) => {
		const question = currentQuestionRef.current
		if (!question) {
			console.error('No current question, cannot submit answer')
			console.error('currentQuestionRef.current:', currentQuestionRef.current)
			console.error('currentQuestion state:', currentQuestion)
			return
		}

		console.log('handleUserAnswer called with:', answer)
		console.log('Current userId from state:', userId)
		console.log('Current userId from ref:', userIdRef.current)

		try {
			setError('')
			// Add user's answer to messages
			setMessages((prev) => {
				const newMessages: Message[] = [
					...prev,
					{ type: 'answer' as const, text: answer, timestamp: new Date() },
				]
				console.log('Messages updated, new messages:', newMessages)
				return newMessages
			})

			// Submit answer to new API - Use ref to get current userId
			const payload = {
				user_id: userIdRef.current,
				section: 'profile',
				question_order: question.question_order,
				answer: answer,
				serial_no: question.serial_no,
			}
			console.log('Submitting payload:', payload)

			const response = await submitAnswerNew(payload).unwrap()

			console.log('Submit Answer Response:', response)

			// Check for completion or get next question
			if (response.completed) {
				setIsSessionComplete(true)
				const completionMessage = response.message || 'Profile completed! Thank you.'
				setMessages((prev) => [
					...prev,
					{
						type: 'question' as const,
						text: completionMessage,
						timestamp: new Date(),
					},
				])
			} else if (response.next_question) {
				// The API returns the next question with capitalized fields
				const nextQ = response.next_question
				setCurrentQuestion({
					id: nextQ.Id,
					text: nextQ.QuestionText,
					serial_no: nextQ.Pid || 0,
					question_order: nextQ.QuestionOrder,
				})
				setMessages((prev) => [
					...prev,
					{ type: 'question' as const, text: nextQ.QuestionText, timestamp: new Date() },
				])

				// Play the next question
				await playQuestionAudio(nextQ.QuestionText)
			} else {
				// Fallback: Move to next question in the list
				const nextIndex = currentQuestionIndex + 1
				if (nextIndex < allQuestions.length) {
					const nextQ = allQuestions[nextIndex]
					setCurrentQuestionIndex(nextIndex)
					setCurrentQuestion({
						id: nextQ.Id,
						text: nextQ.QuestionText,
						serial_no: nextQ.Pid || 0,
						question_order: nextQ.QuestionOrder,
					})
					setMessages((prev) => [
						...prev,
						{ type: 'question', text: nextQ.QuestionText, timestamp: new Date() },
					])
					await playQuestionAudio(nextQ.QuestionText)
				} else {
					// No more questions
					setIsSessionComplete(true)
					setMessages((prev) => [
						...prev,
						{
							type: 'question',
							text: 'Profile completed! Thank you.',
							timestamp: new Date(),
						},
					])
				}
			}
		} catch (error) {
			console.error('Failed to submit answer:', error)
			setError('Failed to submit answer. Please try again.')
		}
	}

	if (!hasStarted) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
				<div className='w-full max-w-md bg-white rounded-lg shadow-lg p-6'>
					<h1 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
						Voice Profile Session
					</h1>

					<div className='space-y-4'>
						<div>
							<label
								htmlFor='userId'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								User ID
							</label>
							<input
								id='userId'
								type='text'
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Enter your User ID'
							/>
						</div>

						{error && (
							<div className='text-red-500 text-sm text-center'>{error}</div>
						)}

						<button
							onClick={handleStartSession}
							disabled={!userId.trim()}
							className='w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
						>
							Start Session
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 p-4'>
			<div className='max-w-3xl mx-auto'>
				<div className='bg-white rounded-lg shadow-lg overflow-hidden'>
					{/* Header */}
					<div className='bg-blue-600 text-white p-4'>
						<h1 className='text-xl font-bold'>Voice Profile Session</h1>
						<p className='text-sm opacity-90'>User: {userId}</p>
					</div>

					{/* Messages */}
					<div className='h-96 overflow-y-auto p-4 space-y-4'>
						{messages.map((message, index) => (
							<div
								key={index}
								className={`flex ${
									message.type === 'question' ? 'justify-start' : 'justify-end'
								}`}
							>
								<div
									className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
										message.type === 'question'
											? 'bg-gray-200 text-gray-800'
											: 'bg-blue-600 text-white'
									}`}
								>
									<p className='text-sm'>{message.text}</p>
									<p className='text-xs opacity-70 mt-1'>
										{message.timestamp.toLocaleTimeString()}
									</p>
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>

					{/* Controls */}
					<div className='border-t p-4 bg-gray-50'>
						{error && (
							<div className='mb-3 text-red-500 text-sm text-center'>
								{error}
							</div>
						)}

						{isSessionComplete ? (
							<div className='text-center'>
								<p className='text-green-600 font-medium mb-4'>
									Session completed!
								</p>
								<button
									onClick={() => window.location.reload()}
									className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
								>
									Start New Session
								</button>
							</div>
						) : (
							<div className='space-y-3'>
								{/* Loading state while fetching TTS audio */}
								{isLoadingAudio && (
									<div className='text-center'>
										<div className='inline-flex items-center gap-2 text-blue-600 font-medium'>
											<svg className='animate-spin h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
												<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
												<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
											</svg>
											Loading audio...
										</div>
									</div>
								)}

								{/* Playing state */}
								{isPlaying && !isLoadingAudio && (
									<div className='text-center'>
										<div className='text-blue-600 font-medium'>
											Playing question...
										</div>
									</div>
								)}

								{/* Interim transcript display */}
								{interimTranscript && isListening && (
									<div className='bg-gray-100 p-3 rounded-md border-2 border-blue-300'>
										<p className='text-sm text-gray-600 italic'>
											Hearing: "{interimTranscript}"
										</p>
									</div>
								)}

								{/* Recording controls - only show when not loading or playing */}
								{!isLoadingAudio && !isPlaying && (
									<div className='flex flex-col items-center gap-3'>
										<button
											onClick={isListening ? stopListening : startListening}
											className={`px-6 py-3 rounded-full font-medium transition-colors ${
												isListening
													? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
													: 'bg-blue-600 hover:bg-blue-700 text-white'
											}`}
										>
											{isListening ? 'Stop Recording' : 'Start Recording'}
										</button>

										{isListening && (
											<div className='flex flex-col items-center gap-2'>
												<div className='text-red-600 font-medium'>Listening...</div>
												<button
													onClick={handleSkipAnswer}
													className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm'
												>
													Skip Question
												</button>
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
