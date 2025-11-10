import { useEffect, useState } from "react";
import { getDataWithoutStore } from "@/services/apiService";

export default function useDataWithoutStore({ url, params, headers }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	const fetchData = async () => {
		setIsLoading(true);
		setError(null);
		setData(null);
		try {
			const response = await getDataWithoutStore({ url, params }, headers);
			setData(response);
		} catch (error) {
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const refetch = async () => {
		await fetchData();
	};

	useEffect(() => {
		const parsedUrl = url?.split("/");
		if (parsedUrl?.some((item) => item === "undefined")) {
			console.warn("URL is not valid:", url);
		} else {
			fetchData();
		}
	}, [url, JSON.stringify(params), JSON.stringify(headers)]);

	return { isLoading, error, data, refetch };
}
