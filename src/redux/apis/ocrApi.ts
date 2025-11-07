import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface OcrExtract {
	FirstName: string
	LastName: string
	FatherName: string
	DOB: string
	Sex: string
	Address1: string
	City: string
	State: string
	Country: string
	Zip: string
	GovtID: string
}

export interface OcrExtractRaw extends OcrExtract {
    source: string
	debug: {
		ocr_text: string
		mode_detected: string
		missing_fields_before_llm: string[]
		llm_triggered: boolean
		llm_reason: string[]
	}
}

export const ocrApi = createApi({
	reducerPath: 'ocrApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://gateway.ahalts.com',
		prepareHeaders: headers => {
			headers.set('Accept', 'application/json')
			return headers
		},
	}),
	endpoints: builder => ({
		getDetails: builder.mutation<OcrExtract, File>({
			query: file => {
				const formData = new FormData()
				formData.append('file', file)
				formData.append('type', file.type)
				return {
					url: '/doc/OCR_extract_userdetail?mode=auto',
					method: 'POST',
					body: formData,
				}
			},
            transformResponse: (response: OcrExtractRaw): OcrExtract => {
                const {debug, source, ...cleaned} = response
                return cleaned
            },
			transformErrorResponse: response => response.data,
		}),
	}),
})

export const { useGetDetailsMutation } = ocrApi
