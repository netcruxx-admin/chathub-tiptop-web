// Carousel Component Types

export interface CarouselImage {
	src: string
	alt: string
	statKey: string
	descKey: string
}

export interface CarouselStats {
	activeJobSeekers: string
	activeJobSeekersDesc: string
	jobsPosted: string
	jobsPostedDesc: string
	trustedEmployers: string
	trustedEmployersDesc: string
	interviewRate: string
	interviewRateDesc: string
	salaryRange: string
	salaryRangeDesc: string
	support: string
	supportDesc: string
}
