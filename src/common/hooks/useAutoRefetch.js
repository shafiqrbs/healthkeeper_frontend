import { useEffect, useRef } from "react";

export function useAutoRefetch(callback, intervalMs = 5000, enabled = true) {
	const savedCallback = useRef(callback);

	// save latest callback so interval never uses stale closure
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		if (!enabled) return;

		const id = setInterval(() => {
			savedCallback.current?.();
		}, intervalMs);

		return () => clearInterval(id);
	}, [intervalMs, enabled]);
}
