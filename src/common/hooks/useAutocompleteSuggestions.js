import { useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { ERROR_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { getDataWithoutStore } from "@/services/apiService";

/**
 * =============== custom hook for fetching autocomplete suggestions from api ================
 * @param {Object} options - Configuration options
 * @param {string} options.baseUrl - Base URL for the suggestions API endpoint
 * @param {string} options.fieldName - Field name to search for (e.g., "dose_details_bn")
 * @param {number} options.debounceDelay - Debounce delay in milliseconds (default: 300)
 * @returns {Object} - Object containing search state and handlers
 */
export default function useAutocompleteSuggestions({ baseUrl, fieldName, debounceDelay = 300 }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);

	// =============== search for keyword suggestions from api ================
	const searchSuggestions = async (searchQuery) => {
		if (!searchQuery || !searchQuery.trim()) {
			setSearchResults([]);
			return;
		}

		if (!baseUrl || !fieldName) {
			setSearchResults([]);
			return;
		}

		try {
			setIsSearching(true);
			const url = `${baseUrl}?field_name=${fieldName}&term=${encodeURIComponent(searchQuery)}`;

			const result = await getDataWithoutStore({ url });

			// =============== handle different response structures ================
			if (Array.isArray(result)) {
				setSearchResults(result);
			} else if (result?.data && Array.isArray(result.data)) {
				setSearchResults(result.data);
			} else if (result?.data?.data && Array.isArray(result.data.data)) {
				setSearchResults(result.data.data);
			} else {
				setSearchResults([]);
			}
		} catch (error) {
			console.error("Error searching suggestions:", error);
			setSearchResults([]);
			errorNotification("Failed to fetch search results", ERROR_NOTIFICATION_COLOR);
		} finally {
			setIsSearching(false);
		}
	};

	// =============== debounced search callback to avoid too many api calls ================
	const debouncedSearch = useDebouncedCallback((searchQuery) => {
		searchSuggestions(searchQuery);
	}, debounceDelay);

	// =============== handle search term change ================
	const handleSearchChange = (searchQuery) => {
		setSearchTerm(searchQuery);
		if (searchQuery && searchQuery.trim()) {
			debouncedSearch(searchQuery);
		} else {
			setSearchResults([]);
		}
	};

	// =============== reset search state ================
	const resetSearch = () => {
		setSearchTerm("");
		setSearchResults([]);
	};

	return {
		searchTerm,
		searchResults,
		isSearching,
		handleSearchChange,
		resetSearch,
	};
}
