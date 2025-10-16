"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Globe, GraduationCap } from "lucide-react";
import { cn } from "@/lib/cn";
import Link from "next/link";

const carouselImages = [
	{
		src: "/indian-delivery-worker-with-food-bag-on-bike-wearin.jpg",
		alt: "Food delivery worker on bike",
		stat: "50,000+",
		description: "Active job seekers finding opportunities",
	},
	{
		src: "/indian-construction-workers-at-building-site-weari.jpg",
		alt: "Construction workers at site",
		stat: "10,000+",
		description: "Jobs posted every month",
	},
	{
		src: "/indian-woman-cooking-in-small-kitchen-wearing-apron.jpg",
		alt: "Woman cook preparing food",
		stat: "500+",
		description: "Trusted employers hiring",
	},
	{
		src: "/indian-warehouse-worker-moving-boxes-in-casual-work.jpg",
		alt: "Warehouse worker handling packages",
		stat: "95%",
		description: "Job seekers get interviews within 7 days",
	},
	{
		src: "/indian-electrician-working-on-electrical-panel-wea.jpg",
		alt: "Electrician at work",
		stat: "₹15-25k",
		description: "Average monthly salary range",
	},
	{
		src: "/indian-woman-housekeeping-worker-cleaning-in-unifor.jpg",
		alt: "Woman housekeeping worker",
		stat: "24/7",
		description: "Support available anytime",
	},
];

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
			{/* Desktop Layout */}
			<div className="hidden lg:flex min-h-screen">
				{/* Left Panel - Carousel */}
				<div className="flex flex-1 justify-center items-stretch w-full bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
					<div className="w-full flex flex-col justify-center items-center p-12">
						<div className="w-full max-w-md mb-8 relative">
							<div className="relative h-96 rounded-2xl shadow-2xl overflow-hidden">
								{carouselImages.map((image, index) => (
									<div
										key={index}
										className={`absolute inset-0 transition-opacity duration-500 ${
											index === currentImageIndex ? "opacity-100" : "opacity-0"
										}`}
									>
										<Image
											src={image.src || "/placeholder.svg"}
											alt={image.alt}
											fill
											style={{ objectFit: "cover" }}
											priority={index === currentImageIndex}
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6">
											<div className="text-white">
												<div className="text-4xl font-bold mb-2">{image.stat}</div>
												<div className="text-sm opacity-90">{image.description}</div>
											</div>
										</div>
									</div>
								))}
							</div>
							<div className="flex justify-center space-x-2 mt-4">
								{carouselImages.map((_, index) => (
									<Button
										key={index}
										size="icon"
										onClick={() => setCurrentImageIndex(index)}
										className={cn(
											"w-2 h-2 rounded-full transition-all p-0",
											index === currentImageIndex ? "bg-primary w-6" : "bg-primary/30"
										)}
									/>
								))}
							</div>
						</div>

						<div className="text-center space-y-6 max-w-md">
							<div className="bg-primary text-primary-foreground px-4 py-2 rounded-full inline-flex items-center space-x-2 shadow-lg">
								<GraduationCap className="w-4 h-4" />
								<span className="font-semibold text-sm">NSDC Partner</span>
							</div>

							<div className="space-y-3">
								<p className="text-sm text-muted-foreground font-medium">
									Trusted by leading companies
								</p>
								<div className="flex items-center justify-center space-x-6">
									<div className="relative w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md p-2">
										<div className="relative w-full h-full">
											<Image
												src="/tcs-logo.jpg"
												alt="TCS"
												fill
												style={{ objectFit: "cover" }}
											/>
										</div>
									</div>
									<div className="relative w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md p-2">
										<div className="relative w-full h-full">
											<Image
												src="/swiggy-logo.jpg"
												alt="Swiggy"
												fill
												style={{ objectFit: "cover" }}
											/>
										</div>
									</div>
									<div className="relative w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md p-2">
										<div className="relative w-full h-full">
											<Image
												src="/reliance-logo.jpg"
												alt="Reliance"
												fill
												style={{ objectFit: "cover" }}
											/>
										</div>
									</div>
									<div className="relative w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md p-2">
										<div className="relative w-full h-full">
											<Image
												src="/lt-logo.jpg"
												alt="L&T"
												fill
												style={{ objectFit: "cover" }}
											/>
										</div>
									</div>
								</div>
								<p className="text-sm text-muted-foreground">+200 more...</p>
							</div>
						</div>
					</div>
				</div>

				{/* Right Panel - Content Area */}
				<div className="max-w-[440px] bg-background flex flex-col w-full">
					<div className="p-6 border-b">
						<div className="flex items-center justify-between">
							<Link
								href={"/"}
								className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
							>
								<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md">
									<span className="text-primary-foreground font-bold">₹</span>
								</div>
								<div className="flex flex-col">
									<span className="font-bold text-xl text-primary leading-none">
										Rozgari
									</span>
									<span className="text-xs text-muted-foreground">by AHALTS</span>
								</div>
							</Link>
							<Button
								variant="outline"
								size="sm"
								// onClick={onLanguageChange}
								className="h-9 px-3 text-sm gap-1.5"
							>
								<Globe className="w-3.5 h-3.5" />
								{/* <span className="font-medium">{languageCode}</span> */}
								<span className="font-medium">HE</span>
							</Button>
						</div>
					</div>
					{children}
				</div>
			</div>

			{/* Mobile Layout */}
			<div className="lg:hidden min-h-screen flex flex-col bg-background">
				{children}
			</div>
		</div>
	);
}
