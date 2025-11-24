import { useCallback, useEffect, useMemo, useState } from "react";
import { getDataWithoutStore } from "@/services/apiService";

export default function useDataWithoutStore({ url, params = {}, headers = {} }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	// memoize params & headers (no re-renders → no re-fetch spam)
	const stableParams = useMemo(() => params, [JSON.stringify(params)]);
	const stableHeaders = useMemo(() => headers, [JSON.stringify(headers)]);

	const fetchData = useCallback(async () => {
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

		fetchData();
	}, [url, stableParams, stableHeaders, fetchData]);

	// manual refetch (always allowed)
	const refetch = useCallback(async () => {
		await fetchData();
	}, [fetchData]);

	return { isLoading, error, data, refetch };
}
