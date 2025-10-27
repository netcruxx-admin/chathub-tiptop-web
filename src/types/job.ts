// Job Related Types

export interface JobPosting {
	id: string
	title: string
	company: string
	location: string
	salary: JobSalary
	description: string
	requirements: string[]
	postedOn: Date
	jobType: JobType
}

export interface JobSalary {
	min: number
	max: number
	currency: string
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'temporary'

export interface JobApplication {
	id: string
	jobId: string
	userId: string
	status: JobApplicationStatus
	appliedOn: Date
}

export type JobApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected'
