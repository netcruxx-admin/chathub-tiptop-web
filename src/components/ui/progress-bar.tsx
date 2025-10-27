interface ProgressBarProps {
	progress: number
	label?: string
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
	return (
		<div className='space-y-1'>
			{label && <p className='text-xs text-muted-foreground'>{label}</p>}
			<div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
				<div
					className='bg-primary h-full transition-all duration-300 ease-in-out'
					style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
				/>
			</div>
		</div>
	)
}
