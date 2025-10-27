// User Related Types

export interface UserNameData {
	firstName: string
	middleName?: string
	lastName: string
	username?: string
	email?: string
}

export interface UserLocationData {
	city: string
	addressLine1: string
	addressLine2?: string
	area: string
	pincode: string
	state: string
	latitude?: number
	longitude?: number
}

export interface UserProfileData extends UserNameData {
	phoneNumber: string
	dateOfBirth?: string
	location?: UserLocationData
	skills?: string[]
}

export interface Skill {
	id: string
	name: string
	category: SkillCategory
	verified: boolean
	certified: boolean
	jobCount?: number
}

export type SkillCategory =
	| 'all'
	| 'delivery'
	| 'housekeeping'
	| 'construction'
	| 'food'
	| 'warehouse'
	| 'maintenance'
	| 'office'
	| 'security'
	| 'retail'
	| 'personal'
	| 'care'
	| 'outdoor'
