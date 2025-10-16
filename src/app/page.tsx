"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		router.push("/welcome");
	}, [router]);

	return (
		<section className="bg-primary grid place-content-center h-screen">
			<p className="text-4xl text-white">Loading...</p>
		</section>
	);
}
