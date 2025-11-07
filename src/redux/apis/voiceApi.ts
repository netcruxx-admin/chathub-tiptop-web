import { createApi } from '@reduxjs/toolkit/query/react'

interface TextToSpeechRequest {
	text: string
	voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
}

interface StartProfileRequest {
	UserId: string
}

interface StartProfileResponse {
	status: string
	next_question?: {
		question_id: number
		question: string
		section?: string
	}
	// Legacy support
	QuestionId?: number
	Question?: string
	Section?: string
}

interface AnswerRequest {
	UserId: string
	QuestionId: number
	Answer: string
}

interface AnswerResponse {
	status?: string
	next_question?: {
		question_id: number
		question: string
		section?: string
	}
	completed?: boolean
	message?: string
	// Legacy support
	QuestionId?: number
	Question?: string
	Section?: string
	Completed?: boolean
	Message?: string
}

export interface Question {
	id?: string
	question: string
	section: string
	question_order: number
	serial_no: number
}

export interface QuestionResponse {
	Id: number
	QuestionText: string
	PromptTemplate: string
	TargetTable: string
	TargetColumn: string
	Pid: number
	QuestionOrder: number
}

interface AnswerSubmissionRequest {
	user_id: string
	section: string
	question_order: number
	answer: string
	serial_no: number
}

interface AnswerSubmissionResponse {
	status?: string
	message?: string
	next_question?: QuestionResponse
	completed?: boolean
}

export const voiceApi = createApi({
	reducerPath: 'voiceApi',
	baseQuery: async ({ url, method, body, responseType }) => {
		try {
			const fullUrl = `https://gateway.ahalts.com/doc${url}`
			console.log('API Request:', { fullUrl, method, body, responseType })

			const response = await fetch(fullUrl, {
				method,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify(body),
			})

			console.log('API Response Status:', response.status, response.statusText)
			console.log('Response Headers:', Object.fromEntries(response.headers.entries()))

			if (!response.ok) {
				const errorText = await response.text()
				console.error('API Error Response:', errorText)
				return {
					error: {
						status: response.status,
						data: errorText,
					},
				}
			}

			// Handle audio blob response
			if (responseType === 'blob') {
				const blob = await response.blob()
				console.log('Blob received:', {
					size: blob.size,
					type: blob.type,
				})
				const audioUrl = URL.createObjectURL(blob)
				console.log('Created audioUrl:', audioUrl)
				return { data: { audioUrl } }
			}

			// Handle JSON response
			const data = await response.json()
			console.log('JSON Response:', data)
			return { data }
		} catch (error) {
			console.error('Fetch error:', error)
			return {
				error: {
					status: 'FETCH_ERROR',
					error: String(error),
				},
			}
		}
	},
	endpoints: (builder) => ({
		textToSpeech: builder.mutation<{ audioUrl: string }, TextToSpeechRequest>({
			query: (data) => ({
				url: '/speech/speaks',
				method: 'POST',
				body: {
					text: data.text,
					voice: data.voice || 'nova',
				},
				responseType: 'blob',
			}),
		}),
		startProfile: builder.mutation<StartProfileResponse, StartProfileRequest>({
			query: (data) => ({
				url: '/speech-profile/speech/start',
				method: 'POST',
				body: data,
			}),
		}),
		submitAnswer: builder.mutation<AnswerResponse, AnswerRequest>({
			query: (data) => ({
				url: '/speech-profile/speech/answer',
				method: 'POST',
				body: data,
			}),
		}),
		getQuestions: builder.query<QuestionResponse[], string>({
			query: (section) => ({
				url: `/speech-profile/speech/${section}`,
				method: 'GET',
			}),
		}),
		submitAnswerNew: builder.mutation<AnswerSubmissionResponse, AnswerSubmissionRequest>({
			query: (data) => ({
				url: '/speech-profile/speech/submit_answer',
				method: 'POST',
				body: data,
			}),
		}),
	}),
})

export const {
	useTextToSpeechMutation,
	useStartProfileMutation,
	useSubmitAnswerMutation,
	useGetQuestionsQuery,
	useLazyGetQuestionsQuery,
	useSubmitAnswerNewMutation,
} = voiceApi
