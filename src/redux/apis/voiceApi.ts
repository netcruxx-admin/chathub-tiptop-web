import { createApi } from '@reduxjs/toolkit/query/react'

interface TextToSpeechRequest {
	text: string
	voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
}

export const voiceApi = createApi({
	reducerPath: 'voiceApi',
	baseQuery: async ({ url, method, body }) => {
		try {
			const response = await fetch(`https://gateway.ahalts.com${url}`, {
				method,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify(body),
			})

			if (!response.ok) {
				return {
					error: {
						status: response.status,
						data: await response.text(),
					},
				}
			}

			// Get the audio as a blob
			const blob = await response.blob()
			// Create an object URL from the blob
			const audioUrl = URL.createObjectURL(blob)

			return { data: { audioUrl } }
		} catch (error) {
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
				url: '/doc/speech/speaks',
				method: 'POST',
				body: {
					text: data.text,
					voice: data.voice || 'nova',
				},
			}),
		}),
	}),
})

export const { useTextToSpeechMutation } = voiceApi
