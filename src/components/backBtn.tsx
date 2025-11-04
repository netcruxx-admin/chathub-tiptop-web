import { ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

type BackBtnProps =
	| {
			variant?: 'default'
	  }
	| {
			variant: 'small'
	  }
	| {
			variant: 'custom'
			path: string
			screenName: string
	  }

export default function BackBtn(props: BackBtnProps = { variant: 'default' }) {
	const router = useRouter()
	const t = useTranslations()

	const handleClick = () => {
		if (props.variant === 'custom') {
			router.push(props.path)
		} else {
			router.back()
		}
	}

	// Small variant - icon only
	if (props.variant === 'small') {
		return (
			<Button variant='ghost' size='sm' onClick={handleClick}>
				<ArrowLeft className='w-4 h-4' />
			</Button>
		)
	}

	// Custom variant - icon + "Go back to {screenName}"
	if (props.variant === 'custom') {
		return (
			<Button variant='ghost' size='sm' onClick={handleClick}>
				<ArrowLeft className='w-4 h-4 mr-2' />
				{t('common.goBackTo', { screenName: props.screenName })}
			</Button>
		)
	}

	// Default variant - icon + "Back"
	return (
		<Button variant='ghost' size='sm' onClick={handleClick}>
			<ArrowLeft className='w-4 h-4 mr-2' />
			{t('common.back')}
		</Button>
	)
}
