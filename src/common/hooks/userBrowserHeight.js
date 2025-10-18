import { useMantineScale } from "@/hooks/useMantineScale";
import { useEffect, useState } from "react";

export function useBrowserHeight() {
	const [height, setHeight] = useState(window.innerHeight);
	const scale = useMantineScale();

	useEffect(() => {
		const handleResize = () => setHeight(window.innerHeight);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const scaleAdjustments = {
		0.75: 200,
		0.9: 80,
		1.0: 0,
	};
	return height + (scaleAdjustments[scale] ?? 0);
}
