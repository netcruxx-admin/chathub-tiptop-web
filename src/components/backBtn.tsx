import { ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function BackBtn() {
	const router = useRouter()
	const t = useTranslations()
	return (
		<Button variant='ghost' size='sm' onClick={() => router.back()}>
			<ArrowLeft className='w-4 h-4 mr-2' />
			{t('common.back')}
		</Button>
	)
}
