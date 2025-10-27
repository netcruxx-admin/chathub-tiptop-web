// Cookie keys for authentication and user data
export const TIPTOP_USER_TOKEN = 'tiptop_user_token'

// API Constants
export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gateway.ahalts.com/api5/api'
export const REACT_APP_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
export const REACT_APP_CLIENT_IP_ADDRESS =
	process.env.NEXT_PUBLIC_CLIENT_IP_ADDRESS || ''
export const REACT_APP_CLIENT_TOKEN = process.env.NEXT_PUBLIC_CLIENT_TOKEN || ''
export const REACT_APP_MACHINE_KEY = process.env.NEXT_PUBLIC_MACHINE_KEY || ''
export const REACT_APP_TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || ''
export const REACT_APP_TENANT_UID = process.env.NEXT_PUBLIC_TENANT_UID || ''

// OAuth Constants for Employee Login
export const OAUTH_BASE_URL = 'https://gateway.ahalts.com'
export const OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || '57'
export const OAUTH_CLIENT_SECRET =
	process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET ||
	'95AF997E87D071D7ADC43FB87E12291C844C82D4'
export const OAUTH_COMPANY_ID =
	process.env.NEXT_PUBLIC_OAUTH_COMPANY_ID || 'gkv'

// API Gateway Constants
export const API_GATEWAY_BASE_URL = 'https://gateway.ahalts.com/api/api'
export const API_ACCESS_TOKEN =
	process.env.NEXT_PUBLIC_API_ACCESS_TOKEN ||
	'87adac39ab20a22e8130280b3ff5c4088362ff64'
export const APPLICATION_ID = process.env.NEXT_PUBLIC_APPLICATION_ID || '57'
export const CLIENT_IP_ADDRESS =
	process.env.NEXT_PUBLIC_CLIENT_IP_ADDRESS || '::1'
export const GATEWAY_TENANT_ID =
	process.env.NEXT_PUBLIC_GATEWAY_TENANT_ID || '5'
export const GATEWAY_TENANT_OU_ID =
	process.env.NEXT_PUBLIC_GATEWAY_TENANT_OU_ID || '1'

// Other app constants
export const APP_NAME = 'Rozgari'
export const APP_VERSION = '1.0.0'
