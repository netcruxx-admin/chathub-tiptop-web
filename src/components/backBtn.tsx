import { ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export default function BackBtn() {
	const router = useRouter()
	return (
		<Button
			variant='ghost'
			size='sm'
			onClick={() => router.back()}
			className='mb-4 -ml-2'
		>
			<ArrowLeft className='w-4 h-4 mr-2' />
			Back
		</Button>
	)
}
