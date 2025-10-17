import Cookies from 'js-cookie'

export const useGetLocale = () => {
    const locale = Cookies.get('locale')
    return locale
}

export const useSetLocale = () => {
    return (value: string) => {
        Cookies.set('locale', value)
    }
}