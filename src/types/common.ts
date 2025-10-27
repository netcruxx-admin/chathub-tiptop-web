// Common Utility Types

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
	}[Keys]

// API Response Types
export interface ApiResponse<T = any> {
	success: boolean
	data?: T
	error?: string
	message?: string
}

export interface PaginatedResponse<T = any> {
	data: T[]
	page: number
	pageSize: number
	total: number
	totalPages: number
}

// Component Props Types
export interface ButtonProps {
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
	size?: 'default' | 'sm' | 'lg' | 'icon'
	asChild?: boolean
	className?: string
	children?: React.ReactNode
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean
}
