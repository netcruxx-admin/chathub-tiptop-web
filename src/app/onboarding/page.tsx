"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Briefcase,
	GraduationCap,
	TrendingUp,
	ChevronLeft,
	ChevronRight,
	Volume2,
	Sparkles,
} from "lucide-react";
import Image from "next/image";

export default function Onboarding() {
	const [currentCard, setCurrentCard] = useState(0);
	const [isVoicePlaying, setIsVoicePlaying] = useState(false);

	const cards = [
		{
			icon: Briefcase,
			iconColor: "text-green-600",
			listColor: "bg-green-600",
			bgColor: "bg-green-100",
			title: "Earn with Dignity",
			description:
				"Guaranteed payment from verified companies with assured transparency",
			points: [
				"Verified employers - payment guaranteed",
				"Multiple payment options - for your convenience",
				"Transparent salary - no hidden charges",
			],
			image: "/indian-worker-earning-money-happily.jpg",
		},
		{
			icon: GraduationCap,
			iconColor: "text-blue-600",
			listColor: "bg-blue-600",
			bgColor: "bg-blue-100",
			title: "Learn",
			description:
				"Take your skills to the next level with industry-recognized certifications",
			points: [
				"NSDC certified courses - many are free",
				"CSR-funded programs - companies sponsor your training",
				"Practical skills from experts - Learn on the job",
			],
			image: "/indian-worker-learning-in-training-class.jpg",
		},
		{
			icon: TrendingUp,
			iconColor: "text-purple-600",
			listColor: "bg-purple-600",
			bgColor: "bg-purple-100",
			title: "Move Forward",
			description:
				"Unlock better opportunities with every job and increase your earning potential",
			points: [
				"Verify skills to unlock premium jobs",
				"Earn 30-50% more with certifications",
				"Career roadmap and mentorship support",
			],
			image: "/indian-worker-career-growth-success.jpg",
		},
		{
			icon: Sparkles,
			iconColor: "text-orange-600",
			bgColor: "bg-orange-100",
			title: "Smart Technology",
			description:
				"AI-powered platform that understands your needs and delivers the best opportunities",
			points: [
				"AI matching - perfect jobs automatically for you",
				"Live tracking - see application status in real-time",
				"Interview prep - video tips and practice sessions",
			],
			image: "/indian-worker-using-smartphone-app-for-job-search.jpg",
		},
	];

	const currentCardData = cards[currentCard];
	const Icon = currentCardData.icon;

	const handleNext = () => {
		if (currentCard < cards.length - 1) {
			setCurrentCard(currentCard + 1);
		} else {
			alert("DONE");
		}
	};

	const handlePrev = () => {
		if (currentCard > 0) {
			setCurrentCard(currentCard - 1);
		}
	};

	const handleVoicePlay = () => {
		setIsVoicePlaying(true);
		// Simulate voice playing (in real app, this would trigger actual TTS)
		setTimeout(() => setIsVoicePlaying(false), 3000);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
			{/* Header */}
			<div className="bg-primary text-primary-foreground py-4 px-4">
				<div className="max-w-md mx-auto">
					<h1 className="text-xl font-bold">Rozgari</h1>
					<p className="text-xs opacity-90">Powered by AHALTS Academy</p>
				</div>
			</div>

			{/* Main Card Container */}
			<div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
				<div className="w-full max-w-md">
					{/* Card */}
					<div className="bg-card rounded-2xl shadow-lg space-y-4">
						<div className="relative w-full h-48 md:h-64 rounded-tr-lg rounded-tl-lg overflow-hidden bg-muted flex items-center justify-center">
							<Image
								src={currentCardData.image || "/placeholder.svg"}
								alt={currentCardData.title}
								className="w-full h-full object-cover"
								fill
							/>
						</div>

						<div className="p-6 space-y-4 flex flex-col">
							{/* Icon and Title */}
							<div className="flex items-center gap-3">
								<div className={`p-2 ${currentCardData.bgColor} rounded-lg`}>
									<Icon className={`w-6 h-6 ${currentCardData.iconColor}`} />
								</div>
								<h2 className="text-2xl font-bold">{currentCardData.title}</h2>
							</div>
							{/* Description */}
							<p className="text-sm text-muted-foreground leading-relaxed">
								{currentCardData.description}
							</p>
							{/* Bullet Points */}
							<ul className="space-y-2">
								{currentCardData.points.map((point, index) => (
									<li key={index} className="flex items-center gap-2 text-sm">
										<span
											className={`w-1.5 h-1.5 rounded-full ${currentCardData.listColor} flex-shrink-0`}
										/>
										<span>{point}</span>
									</li>
								))}
							</ul>
							{/* Voice Assistant Button */}
							<button
								onClick={handleVoicePlay}
								className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
								disabled={isVoicePlaying}
							>
								<Volume2
									className={`w-4 h-4 ${isVoicePlaying ? "animate-pulse" : ""}`}
								/>
								<span className="text-sm">
									{isVoicePlaying ? "Playing..." : "Listen to this"}
								</span>
							</button>
						</div>
					</div>

					{/* Progress Dots */}
					<div className="flex justify-center gap-2 mt-6">
						{cards.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentCard(index)}
								className={`h-2 rounded-full transition-all ${
									index === currentCard ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
								}`}
								aria-label={`Go to card ${index + 1}`}
							/>
						))}
					</div>

					{/* Navigation Buttons */}
					<div className="flex gap-3 mt-6">
						<Button
							variant="outline"
							onClick={handlePrev}
							className="flex-1 flex items-center bg-transparent disabled:hover:bg-transparent"
							disabled={currentCard <= 0}
						>
							<ChevronLeft className="w-4 h-4 mr-1 mt-[1px]" />
							Back
						</Button>
						<Button onClick={handleNext} className="flex-1 flex items-center">
							{currentCard < cards.length - 1 ? (
								<>
									Next
									<ChevronRight className="w-4 h-4 ml-1 mt-[1px]" />
								</>
							) : (
								<>
									Start Profile Creation
									<ChevronRight className="w-4 h-4 ml-1 mt-[1px]" />
								</>
							)}
						</Button>
					</div>

					{/* Skip Option */}
					<button
						onClick={() => alert("DONE")}
						className="w-full text-center text-sm text-muted-foreground mt-4 hover:text-foreground transition-colors"
					>
						Skip for now
					</button>
				</div>
			</div>
		</div>
	);
}
