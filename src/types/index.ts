// Central export file for all types
// Import types from specific domain files

// i18n Types
export type { TranslationFunction, Locale, Language, UserSettings } from './i18n'

// Validation Types
export type {
	PhoneNumberValidationValues,
	EmployerLoginValidationValues,
	FormError,
	FormTouched,
} from './validation'

// User Types
export type { UserNameData, UserLocationData, UserProfileData, Skill, SkillCategory } from './user'

// Job Types
export type { JobPosting, JobSalary, JobType, JobApplication, JobApplicationStatus } from './job'

// Carousel Types
export type { CarouselImage, CarouselStats } from './carousel'

// Redux Types
export type {
	RootState,
	AppDispatch,
	SignUpData,
	LoginData,
	AuthState,
	ErrorResponse,
	VerificationCodeData,
	VerifyCodeData,
	PasswordManagerData,
	PasswordResetEmailData,
} from './redux'

// Common Types
export type {
	Nullable,
	Optional,
	RequireAtLeastOne,
	ApiResponse,
	PaginatedResponse,
	ButtonProps,
	InputProps,
} from './common'
