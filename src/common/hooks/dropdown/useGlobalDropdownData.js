import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGlobalDropdown } from "@/app/store/core/utilityThunk";
import { setDynamicDropdownData } from "@/app/store/core/utilitySlice";

// =============== utility function to get data from localStorage ================
const getDataFromLocalStorage = (utility) => {
	try {
		const data = localStorage.getItem(utility);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.error(`Error reading ${utility} from localStorage:`, error);
		return null;
	}
};

const useGlobalDropdownData = ({ path, utility, params = {}, type = null, identifierName = null }) => {
	const dispatch = useDispatch();
	const [dropdownData, setDropdownData] = useState([]);

	const value = {
		url: path,
		params: params,
		utility: utility,
		type: type,
	};

	// =============== dynamically select dropdown data from store ================
	const storeData = useSelector((state) => {
		// =============== first check dynamic dropdown data ================
		if (state.utility.dynamicDropdownData[utility]) {
			return state.utility.dynamicDropdownData[utility];
		}

		// =============== check type-based state properties ================
		if (type) {
			const typeStateMap = {
				"customer-group": "customerGroup",
				"vendor-group": "vendorGroup",
				"employee-group": "employeeGroup",
				location: "coreLocation",
				designation: "coreDesignation",
				department: "coreDepartment",
				warehouse: "coreWarehouse",
				"sub-head": "accountSubHead",
				ledger: "accountLedger",
				"account-head": "accountHead",
			};

			const stateKey = typeStateMap[type];
			if (stateKey && state.utility[stateKey]) {
				return state.utility[stateKey];
			}
		}

		// =============== fallback to existing hardcoded properties ================
		const data = state.utility[utility];
		return data?.data || data || [];
	});

	useEffect(() => {
		if (!storeData?.length && !storeData?.data?.length) {
			// =============== check localStorage first ================
			const localStorageData = getDataFromLocalStorage(utility);

			if (localStorageData) {
				// =============== if data exists in localStorage, set it to Redux store ================
				dispatch(
					setDynamicDropdownData({
						key: utility,
						data: { data: localStorageData },
					})
				);
			} else {
				// =============== if no data in localStorage, make API call ================
				dispatch(getGlobalDropdown(value));
			}
		}
	}, [dispatch, path, utility, type, JSON.stringify(params)]);

	useEffect(() => {
		if (storeData && storeData.data?.length > 0) {
			const transformedData = storeData.data?.map((item) => {
				// =============== handle different data structures ================
				const label = item.display_name || item.name || item.label || item.title || "";
				const value = String(item.id || item.value || item.name);
				const slug = item.slug || "";

				// =============== handle special cases like country with code and phonecode ================
				if (item.code && item.phonecode) {
					return {
						label: `${item.name} (${item.code}-${item.phonecode})`,
						value: String(item.id),
					};
				}

				// =============== handle currency with code and symbol ================
				if (item.code && item.symbol) {
					return {
						label: `${item.name} (${item.code}-${item.symbol})`,
						value: String(item.id),
					};
				}

				// =============== handle nbr tariff with name and label ================
				if (item.name && item.label) {
					return {
						label: `${item.name} - ${item.label}`,
						value: String(item.id),
					};
				}

				if (identifierName === "investigation") {
					return {
						label: item.name,
						value: String(item.id),
						price: item.price ?? 0,
					};
				}

				if (identifierName === "medicine-duration-mode") {
					return {
						label: item.name,
						value: String(item.id),
						name_bn: item.name_bn,
					};
				}

				return { label, value, slug };
			});
			setDropdownData(transformedData);
		}
	}, [storeData]);

	return { data: dropdownData, refetch: () => dispatch(getGlobalDropdown(value)) };
};

export default useGlobalDropdownData;
