import { useCallback, useRef } from "react";

/**
 * Custom hook that creates a debounced version of a function
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
const useDebounce = (func, delay) => {
	const timeoutRef = useRef(null);

	const debouncedFunc = useCallback(
		(...args) => {
			// Clear the previous timeout
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			// Set a new timeout
			timeoutRef.current = setTimeout(() => {
				func(...args);
			}, delay);
		},
		[func, delay]
	);

	// Cleanup timeout on unmount
	useCallback(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return debouncedFunc;
};

export default useDebounce;
