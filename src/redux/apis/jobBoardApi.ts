import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Job Posting Response Types
export interface JobPosting {
	Id: string
	Title: string
	Number: string
	Description: string
	Responsibility: string
	Qualification: string
	Location: string
	SalaryFrom: number
	SalaryTo: number
	AvailablePositionCount: number
	PostingDate: string
	DeadLineDate: string
	Status: number // 0=draft, 1=published, 2=closed
	HtmlContent: string | null
	CompanyDetail: string
	VacancyType: number
	JobPostingCategoryId: string
	CreatedByUserId: string
	CreatedAtUtc: string
	UpdatedByUserId: string | null
	UpdatedAtUtc: string | null
	IsNotDeleted: number // 1=active, 0=deleted
	Slug: string | null
	ImageId: string | null
}

export const jobBoardApi = createApi({
	reducerPath: 'jobBoardApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://gateway.ahalts.com/doc',
		prepareHeaders: headers => {
			headers.set('Accept', 'application/json')
			return headers
		},
	}),
	tagTypes: ['JobPostings'],
	endpoints: builder => ({
		getAllJobPostings: builder.query<JobPosting[], void>({
			query: () => '/jobposting/all',
			providesTags: ['JobPostings'],
		}),
		getJobPostingById: builder.query<JobPosting, string>({
			query: (id) => `/jobposting/get/${id}`,
			providesTags: ['JobPostings'],
		}),
	}),
})

export const { useGetAllJobPostingsQuery, useGetJobPostingByIdQuery } = jobBoardApi
