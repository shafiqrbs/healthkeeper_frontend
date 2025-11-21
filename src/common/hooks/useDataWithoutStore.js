import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDataWithoutStore } from "@/services/apiService";

export default function useDataWithoutStore({ url, params = {}, headers = {} }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	// memoize params & headers (no re-renders → no re-fetch spam)
	const stableParams = useMemo(() => params, [JSON.stringify(params)]);
	const stableHeaders = useMemo(() => headers, [JSON.stringify(headers)]);

	// prevent duplicate fetch calls (even in Strict Mode)
	const hasFetchedRef = useRef(false);

	const fetchData = useCallback(async () => {
		if (hasFetchedRef.current) return; // prevent duplicate strict-mode calls
		hasFetchedRef.current = true;

		setIsLoading(true);
		setError(null);

		try {
			const response = await getDataWithoutStore({ url, params: stableParams }, stableHeaders);
			setData(response);
		} catch (err) {
			console.error(err);
			setError(err);
		} finally {
			setIsLoading(false);
		}
	}, [url, stableParams, stableHeaders]);

	// fetch once when URL becomes valid
	useEffect(() => {
		if (!url || url.includes("undefined") || url.includes("null")) return;

		hasFetchedRef.current = false; // reset for each new URL
		fetchData();
	}, [url, stableParams, stableHeaders, fetchData]);

	// manual refetch (always allowed)
	const refetch = useCallback(async () => {
		hasFetchedRef.current = true; // avoid double run in strict mode
		await fetchData();
	}, [fetchData]);

	return { isLoading, error, data, refetch };
}
