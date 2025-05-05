import { useState, useEffect } from "react";

export function useGetLoadingProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((oldProgress) => Math.min(oldProgress + 10, 100));
		}, 100);

		return () => clearInterval(timer);
	}, []);

	return progress;
}
