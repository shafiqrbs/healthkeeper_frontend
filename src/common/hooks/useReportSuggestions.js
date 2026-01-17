import { useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { ERROR_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { getDataWithoutStore } from "@/services/apiService";

/**
 * =============== custom hook for fetching report keyword suggestions from api ================
 * @param {Object} options - Configuration options
 * @param {string} options.particularId - Particular ID to search for
 * @param {string} options.baseUrl - Base URL for the suggestions API endpoint
 * @param {string} options.module - Module name for the API call
 * @param {number} options.debounceDelay - Debounce delay in milliseconds (default: 300)
 * @returns {Object} - Object containing search state and handlers
 */
export default function useReportSuggestions({ particularId, baseUrl, debounceDelay = 300 }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);

	// =============== search for keyword suggestions from api ================
	const searchKeywordSuggestions = async (searchQuery, fieldName) => {
		if (!searchQuery || !searchQuery.trim()) {
			setSearchResults([]);
			return console.warn("searchQuery is required");
		}

		if (!particularId || !fieldName) {
			return console.warn("particularId or fieldName is required");
		}

		try {
			setIsSearching(true);
			const url = `${baseUrl}/${particularId}?field_name=${fieldName}&term=${encodeURIComponent(searchQuery)}`;

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
			console.error("Error searching keywords:", error);
			setSearchResults([]);
			errorNotification("Failed to fetch search results", ERROR_NOTIFICATION_COLOR);
		} finally {
			setIsSearching(false);
		}
	};

	// =============== debounced search callback to avoid too many api calls ================
	const debouncedSearch = useDebouncedCallback((searchQuery, fieldName) => {
		searchKeywordSuggestions(searchQuery, fieldName);
	}, debounceDelay);

	// =============== handle search term change ================
	const handleSearchChange = (event, fieldName) => {
		const value = event.currentTarget.value;
		setSearchTerm(value);
		debouncedSearch(value, fieldName);
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
