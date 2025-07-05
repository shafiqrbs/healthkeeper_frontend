import { createSlice } from "@reduxjs/toolkit";
import { getGlobalDropdown } from "./utilityThunk";

const initialState = {
	isLoading: true,
	fetching: true,
	dynamicDropdownData: {},
	// dynamic dropdowns data will be stored in the following format:
	// businessModel
	// module
	// posInvoiceMode
	// country
	// currency
};

const utilitySlice = createSlice({
	name: "utility",
	initialState,
	reducers: {
		setFetching: (state, action) => {
			state.fetching = action.payload;
		},
		// =============== set dynamic dropdown data ================
		setDynamicDropdownData: (state, action) => {
			const { key, data } = action.payload;
			state.dynamicDropdownData[key] = data;
		},
	},

	extraReducers: (builder) => {
		// =============== global dropdown handler ================
		builder.addCase(getGlobalDropdown.fulfilled, (state, action) => {
			// =============== extract utility key from the request ================
			const utilityKey = action.meta.arg.utility || "default";

			// =============== check if this is a type-based dropdown (like coreSettingDropdown) ================
			if (action.payload.type) {
				// =============== type-based state mapping ================
				const typeStateMap = {
					"customer-group": "customerGroupDropdownData",
					"vendor-group": "vendorGroupDropdownData",
					"employee-group": "employeeGroupDropdownData",
					location: "coreLocationDropdownData",
					designation: "coreDesignationDropdownData",
					department: "coreDepartmentDropdownData",
					warehouse: "coreWarehouseDropdownData",
					"sub-head": "accountSubHeadDropdownData",
					ledger: "accountLedgerDropdownData",
					"account-head": "accountHeadDropdownData",
				};

				const stateKey = typeStateMap[action.payload.type];
				if (stateKey && action.payload.data?.data) {
					state[stateKey] = action.payload.data.data;
				}
			} else {
				// =============== regular dropdown data storage ================
				state.dynamicDropdownData[utilityKey] = action.payload;
			}
		});
	},
});

export const { setFetching, setDynamicDropdownData } = utilitySlice.actions;

export default utilitySlice.reducer;
