import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'

const geist = Geist({
	variable: '--font-geist',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Rozgari',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${geist.variable} antialiased`}>
				<NextIntlClientProvider>{children}</NextIntlClientProvider>
			</body>
		</html>
	)
}
