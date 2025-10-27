import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import ReduxProvider from '@/providers/ReduxProvider'
import { Toaster } from 'sonner'

const geist = Geist({
	variable: '--font-geist',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Rozgari',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()
	const messages = await getMessages()

	return (
		<html lang={locale}>
			<body className={`${geist.variable} antialiased`}>
				<ReduxProvider>
					<NextIntlClientProvider locale={locale} messages={messages}>
						{children}
						<Toaster position="top-center" richColors />
					</NextIntlClientProvider>
				</ReduxProvider>
			</body>
		</html>
	)
}
