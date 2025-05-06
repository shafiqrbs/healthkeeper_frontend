import { createSlice } from "@reduxjs/toolkit";
import {
	coreSettingDropdown,
	getAccountingDropdown,
	getCountryDropdown,
	getCustomerDropdown,
	getExecutiveDropdown,
	getLocationDropdown,
	getLocationProDropdown,
	getSettingTypeDropdown,
	getUserDropdown,
	getVendorDropdown,
	getVoucherDropdown,
	getVoucherTypeDropdown,
} from "./utilityThunk";

const initialState = {
	isLoading: true,
	fetching: true,
	customerDropdownData: [],
	vendorDropdownData: [],
	countryDropdownData: [],
	userDropdownData: [],
	locationDropdownData: [],
	voucherDropdownData: [],
	voucherAllDropdownData: [],
	locationProDropdownData: [],
	accountingDropdownData: [],
	executiveDropdownData: [],
	customerGroupDropdownData: [],
	vendorGroupDropdownData: [],
	employeeGroupDropdownData: [],
	coreLocationDropdownData: [],
	coreDesignationDropdownData: [],
	coreDepartmentDropdownData: [],
	coreWarehouseDropdownData: [],
	accountHeadDropdownData: [],
	accountSubHeadDropdownData: [],
	accountLedgerDropdownData: [],
};

const utilitySlice = createSlice({
	name: "utility",
	initialState,
	reducers: {
		setFetching: (state, action) => {
			state.fetching = action.payload;
		},
	},

	extraReducers: (builder) => {
		builder.addCase(getSettingTypeDropdown.fulfilled, (state, action) => {
			state.settingTypeDropdownData = action.payload;
		});

		builder.addCase(getUserDropdown.fulfilled, (state, action) => {
			state.userDropdownData = action.payload;
		});

		builder.addCase(getCustomerDropdown.fulfilled, (state, action) => {
			state.customerDropdownData = action.payload;
		});

		builder.addCase(getCountryDropdown.fulfilled, (state, action) => {
			state.countryDropdownData = action.payload;
		});

		builder.addCase(getVendorDropdown.fulfilled, (state, action) => {
			state.vendorDropdownData = action.payload;
		});

		builder.addCase(getLocationDropdown.fulfilled, (state, action) => {
			state.locationDropdownData = action.payload;
		});
		builder.addCase(getVoucherDropdown.fulfilled, (state, action) => {
			state.voucherAllDropdownData = action.payload;
		});
		builder.addCase(getAccountingDropdown.fulfilled, (state, action) => {
			state.accountingDropdownData = action.payload;
		});
		builder.addCase(getVoucherTypeDropdown.fulfilled, (state, action) => {
			state.voucherDropdownData = action.payload;
		});

		builder.addCase(getLocationProDropdown.fulfilled, (state, action) => {
			state.locationProDropdownData = action.payload;
		});

		builder.addCase(getExecutiveDropdown.fulfilled, (state, action) => {
			state.executiveDropdownData = action.payload;
		});

		builder.addCase(coreSettingDropdown.fulfilled, (state, action) => {
			if (action.payload.type == "customer-group") {
				state.customerGroupDropdownData = action.payload.data.data;
			}

			if (action.payload.type == "vendor-group") {
				state.vendorGroupDropdownData = action.payload.data.data;
			}

			if (action.payload.type == "employee-group") {
				state.employeeGroupDropdownData = action.payload.data.data;
			}
			if (action.payload.type == "location") {
				state.coreLocationDropdownData = action.payload.data.data;
			}
			if (action.payload.type == "designation") {
				state.coreDesignationDropdownData = action.payload.data.data;
			}
			if (action.payload.type == "department") {
				state.coreDepartmentDropdownData = action.payload.data.data;
			}
			if (action.payload.type == "warehouse") {
				state.coreWarehouseDropdownData = action.payload.data.data;
			}
			if (action.payload.type == "sub-head") {
				state.accountSubHeadDropdownData = action.payload.data.data;
			}
			if (action.payload.type == "ledger") {
				state.accountLedgerDropdownData = action.payload.data.data;
			}
			if (action.payload.type == "account-head") {
				state.accountHeadDropdownData = action.payload.data.data;
			}
		});
	},
});

export const { setFetching } = utilitySlice.actions;

export default utilitySlice.reducer;
