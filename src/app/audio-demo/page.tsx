"use client"

import { useHowler } from '@/lib/hooks/useHowler'

export default function AudioDemo() {
	const { play, pause, stop, setVolume, isPlaying, sound } = useHowler(
		'/audio.mpga',
		{
			volume: 0.5,
			loop: false,
			html5: true,
			format: ['mp3', 'mpeg'],
			onload: () => {
				console.log('✅ Audio loaded successfully')
				console.log('Sound state:', sound?.state())
			},
			onloaderror: (id, error) => {
				console.error('❌ Failed to load audio:', {
					soundId: id,
					error,
					src: '/audio.mpga',
				})
			},
			onplayerror: (id, error) => {
				console.error('❌ Failed to play audio:', { soundId: id, error })
			},
			onend: () => console.log('Audio finished'),
		}
	)
	return (
		<>
			{/* Audio test controls - remove this after testing */}
			<div className='fixed bottom-4 right-4 z-50 flex gap-2 bg-white p-2 rounded-lg shadow-lg border'>
				<button
					onClick={play}
					className='px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded'
				>
					▶ Play
				</button>
				<button
					onClick={pause}
					className='px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded'
				>
					⏸ Pause
				</button>
				<button
					onClick={stop}
					className='px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded'
				>
					⏹ Stop
				</button>
				<span
					className={`px-3 py-1.5 text-sm rounded ${
						isPlaying
							? 'bg-green-100 text-green-700'
							: 'bg-gray-100 text-gray-700'
					}`}
				>
					{isPlaying ? '🔊 Playing' : '⏹ Stopped'}
				</span>
			</div>
		</>
	)
}
