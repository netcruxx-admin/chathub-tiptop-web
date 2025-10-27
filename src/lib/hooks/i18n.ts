import Cookies from 'js-cookie'
import type { Locale } from '@/types'

export const useGetLocale = (): Locale | undefined => {
    const locale = Cookies.get('locale') as Locale | undefined
    return locale
}

export const useSetLocale = () => {
    return (value: Locale) => {
        Cookies.set('locale', value, {
            expires: 365, // 1 year
            path: '/',
            sameSite: 'lax'
        })
    }
}