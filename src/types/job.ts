export interface JobSalary {
	min: number
	max: number
	currency: string
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'temporary'

export interface JobPosting {
	id: string
	postedOn: Date
	jobTitle: string
	salary: JobSalary
	jobType: JobType
	jobDistance: number
	hiringCompany: string
	jobLocation: string
	jobDescription: string
	jobRequirements: string[]
	jobBenefits: string[]
	hiringCompanyDesc: string
}

export interface JobApplication {
	id: string
	jobId: string
	userId: string
	status: JobApplicationStatus
	appliedOn: Date
}

export type JobApplicationStatus =
	| 'pending'
	| 'reviewed'
	| 'accepted'
	| 'rejected'

// Type definitions for the Gig App

export type UserType = 'worker' | 'employer' | null

export type ProfileStage = 'A' | 'B' | 'C'

export type SkillLevel = 'gray' | 'yellow' | 'green'

export type LanguageCode =
	| 'hindi'
	| 'english'
	| 'hinglish'
	| 'tamil'
	| 'telugu'
	| 'kannada'
	| 'malayalam'
	| 'bengali'
	| 'marathi'
	| 'gujarati'
	| 'punjabi'
	| 'odia'

export interface Language {
	code: LanguageCode
	name: string
	preview: string
}

export interface UserSkill {
	level: SkillLevel
	tasksCompleted: number
	averageRating: number
	certifications: string[]
	verifiedBy: string[]
}

export interface ProfileData {
	name: string
	preferredName: string
	phone: string
	experience: any[]
	skills: string[]
	location: string
	radius: number
}

export interface StageAData {
	firstName: string
	middleName: string
	lastName: string
	dateOfBirth: string
	permanentAddress: string // Full formatted address
	addressLine1?: string // Street address
	addressLine2?: string // Apartment, building, landmark
	area?: string // Locality/neighborhood
	city?: string
	state?: string
	pincode?: string
	latitude?: number
	longitude?: number
	jobRadius: number
	primarySkills: string[]
	gender?: string
	aadhaarNumber?: string
}

export interface StageBData {
	sex: string
	aadhaarNumber: string
	locationPermissionGranted: boolean
	currentAddress: {
		line1: string
		line2: string
		city: string
		state: string
		pincode: string
	}
	permanentAddress: {
		line1: string
		line2: string
		city: string
		state: string
		pincode: string
	}
	sameAsCurrent: boolean
	highestQualification: string
	qualificationDetails: string
	workExperience: Array<{
		company: string
		role: string
		duration: string
		description: string
	}>
	hasExperience: boolean
	willingToRelocate: boolean
}

export interface StageCData {
	aadhaarVerified: boolean
	skillCertifications: string[]
	nsdcCertifications: string[]
	emergencyPhone: string
	emergencyContactName: string
	panCard: string
	bloodGroup: string
	references: Array<{
		name: string
		phone: string
		email: string
		organization: string
	}>
	careerSummary: string
	careerObjective: string
	workPreferences: {
		workType: string[]
		availability: string
		noticePeriod: string
		expectedSalaryMin: string
		expectedSalaryMax: string
	}
}

export interface JobFilters {
	salaryMin: number
	salaryMax: number
	location: string
	hasTraining: boolean
	hasCertification: boolean
	skillLevel: SkillLevel | 'all'
	trainingType: 'all' | 'csr' | 'self-paid' | 'none'
	maxDistance: number
	paymentType: 'all' | 'daily' | 'weekly' | 'monthly' | 'per-task'
}

export type TrainingType = 'csr' | 'self-paid' | null
export type TrainingMode = 'learn-first' | 'learn-on-job' | 'both'

export interface JobTraining {
	type: TrainingType
	provider: string
	cost: number
	duration: string
	mode: TrainingMode
	description: string
}

export interface JobRequirements {
	skillLevel: SkillLevel
	canApplyWithoutCert: boolean
	mustCertifyFirst: boolean
}

export interface NewJob {
	title: string
	company: string
	location: string
	paymentType: string
	salaryMin: string
	salaryMax: string
	description: string
	requirements: string
	skillLevel: string
	hasCoupon: boolean
	couponAmount: string
	trainingDetails: string
}

export interface NewCoupon {
	courseName: string
	amount: string
	quantity: string
	validUntil: string
	criteria: string
	description: string
}

export interface AIVoiceState {
	isActive: boolean
	isListening: boolean
	isProcessing: boolean
	currentTranscript: string
	aiQuestion: string
	conversationHistory: { role: string; content: string }[]
	extractedData: {
		experience: any[]
		skills: string[]
		education: any[]
		preferences: any
	}
	stage: string
}

export type OnboardingFlow = 'voice' | 'form' | 'resume' | null

export type EmployerScreen =
	| 'login'
	| 'dashboard'
	| 'createJob'
	| 'manageCoupons'
	| 'applications'
	| 'analytics'

export type EmployerOnboardingScreen =
	| 'welcome'
	| 'emailSignup'
	| 'emailVerification'
	| 'companyDetails'
	| 'hiringNeeds'
	| 'locations'
	| 'dashboardIntro'

export type AcademyTab = 'courses' | 'learning' | 'certificates'

export interface EmployerOnboardingData {
	// Email signup
	contactEmail: string
	contactPerson: string
	phoneNumber: string
	companyName: string

	// Company details
	companySize: string
	industry: string
	website: string
	gstNumber: string
	companyLogo: string
	headquarters: string // Added headquarters city field

	addressLine1?: string
	addressLine2?: string
	state?: string
	pincode?: string

	// Hiring needs
	hiringRoles: string[]
	jobVolume: string

	// Locations
	primaryLocation: string
	additionalLocations: string[]
}

export interface Job {
	id: number
	title: string
	titleTranslations?: {
		hinglish: string
		hindi: string
		english: string
		kannada: string
	}
	company: string
	location: string
	salaryMin: number
	salaryMax: number
	paymentType: 'daily' | 'weekly' | 'monthly' | 'per-task'
	requiredSkill: string
	requiredSkillLevel: SkillLevel
	skillLevel: number
	distance: number
	training?: JobTraining
	requirements: JobRequirements
	description?: string
	descriptionTranslations?: {
		hinglish: string
		hindi: string
		english: string
		kannada: string
	}
}
