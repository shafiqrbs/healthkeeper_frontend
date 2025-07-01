import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGlobalDropdown } from "@/app/store/core/utilityThunk";

const useGlobalDropdownData = ({ path, utility, params = {}, type = null }) => {
	const dispatch = useDispatch();
	const [dropdownData, setDropdownData] = useState([]);

	// =============== dynamically select dropdown data from store ================
	const storeData = useSelector((state) => {
		// =============== first check dynamic dropdown data ================
		if (state.utility.dynamicDropdownData[utility]) {
			console.log("state.utility.dynamicDropdownData[utility]", state.utility.dynamicDropdownData[utility]);
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
		const value = {
			url: path,
			params: params,
			utility: utility, // =============== pass utility key to thunk ================
			type: type, // =============== pass type for type-based dropdowns ================
		};
		dispatch(getGlobalDropdown(value));
	}, [dispatch, path, utility, type, JSON.stringify(params)]);

	useEffect(() => {
		if (storeData && storeData.data?.length > 0) {
			const transformedData = storeData.data?.map((item) => {
				// =============== handle different data structures ================
				const label = item.display_name || item.name || item.label || item.title || "";
				const value = String(item.id || item.value || "");

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

				return { label, value };
			});
			setDropdownData(transformedData);
		}
	}, [storeData]);

	return dropdownData;
};

export default useGlobalDropdownData;
