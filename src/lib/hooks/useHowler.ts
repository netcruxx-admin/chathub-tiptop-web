'use client'

import { useEffect, useState } from 'react'
import { Howl, HowlOptions } from 'howler'

interface UseHowlerReturn {
	play: () => void
	pause: () => void
	stop: () => void
	setVolume: (volume: number) => void
	seek: (position?: number) => number | void
	isPlaying: boolean
	sound: Howl | null
}

export function useHowler(
	src: string | string[],
	options?: Partial<HowlOptions>
): UseHowlerReturn {
	const [sound, setSound] = useState<Howl | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)

	useEffect(() => {
		const howl = new Howl({
			src: Array.isArray(src) ? src : [src],
			...options,
			onload: (soundId) => {
				options?.onload?.(soundId)
			},
			onloaderror: (soundId, error) => {
				console.error('Failed to load audio:', error)
				options?.onloaderror?.(soundId, error)
			},
			onplay: (soundId) => {
				setIsPlaying(true)
				options?.onplay?.(soundId)
			},
			onpause: (soundId) => {
				setIsPlaying(false)
				options?.onpause?.(soundId)
			},
			onstop: (soundId) => {
				setIsPlaying(false)
				options?.onstop?.(soundId)
			},
			onend: (soundId) => {
				setIsPlaying(false)
				options?.onend?.(soundId)
			},
			onplayerror: (soundId, error) => {
				console.error('Failed to play audio:', error)
				options?.onplayerror?.(soundId, error)
			},
		})

		setSound(howl)

		return () => {
			howl.unload()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [src])

	const play = () => {
		if (sound) {
			sound.play()
		}
	}

	const pause = () => {
		if (sound) {
			sound.pause()
		}
	}

	const stop = () => {
		if (sound) {
			sound.stop()
		}
	}

	const setVolume = (volume: number) => {
		if (sound) {
			sound.volume(volume)
		}
	}

	const seek = (position?: number) => {
		if (sound) {
			if (position !== undefined) {
				sound.seek(position)
			} else {
				return sound.seek() as number
			}
		}
	}

	return { play, pause, stop, setVolume, seek, isPlaying, sound }
}
