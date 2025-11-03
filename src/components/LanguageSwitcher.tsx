'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { useAppSelector } from '@/redux/hooks'
import { selectCurrentLanguage } from '@/redux/slices/languageSlice'

interface LanguageSwitcherProps {
	variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary'
	size?: 'default' | 'sm' | 'lg' | 'icon'
	className?: string
	showIcon?: boolean
	href?: string
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
	variant = 'outline',
	size = 'sm',
	className = '',
	showIcon = true,
	href = '/select-language',
}) => {
	const currentLanguage = useAppSelector(selectCurrentLanguage)

	return (
		<Link href={href}>
			<Button
				variant={variant}
				size={size}
				className={`${size === 'sm' ? 'h-9 px-3 text-sm' : ''} gap-1.5 ${className}`}
			>
				{showIcon && <Globe className='w-3.5 h-3.5' />}
				<span className='font-medium'>{currentLanguage.displayCode}</span>
			</Button>
		</Link>
	)
}
