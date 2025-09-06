import { createSlice } from "@reduxjs/toolkit";
import { getGlobalDropdown } from "./utilityThunk";

export const CORE_DROPDOWNS = {
	SETTING_TYPE: { UTILITY: "settingType", TYPE: "setting-type", PATH: "core/select/setting-type" },
	EMPLOYEE: { UTILITY: "employee", TYPE: "employee", PATH: "core/select/user" },
	EMPLOYEE_GROUP: { UTILITY: "employeeGroup", TYPE: "employee-group", PATH: "core/select/setting" },
	DESIGNATION: { UTILITY: "designation", TYPE: "designation", PATH: "core/select/setting" },
	DEPARTMENT: { UTILITY: "department", TYPE: "department", PATH: "core/select/setting" },
	CUSTOMER_GROUP: { UTILITY: "customerGroup", TYPE: "customer-group", PATH: "utility/select/setting" },
	BUSINESS_MODEL: { UTILITY: "businessModel", TYPE: "business-model", PATH: "utility/select/setting" },
	MODULE: { UTILITY: "module", TYPE: "module", PATH: "utility/select/setting" },
	COUNTRY: { UTILITY: "country", TYPE: "country", PATH: "core/select/countries" },
	CURRENCY: { UTILITY: "currency", TYPE: "currency", PATH: "utility/select/currencies" },
	POS_INVOICE_MODE: { UTILITY: "posInvoiceMode", TYPE: "pos-invoice-mode", PATH: "utility/select/setting" },
	LOCATION: { UTILITY: "location", TYPE: "location", PATH: "utility/select/setting" },
	MARKETING_EXECUTIVE: { UTILITY: "marketingExecutive", TYPE: "marketing-executive", PATH: "utility/select/setting" },
	CATEGORY_NATURE: { UTILITY: "categoryNature", TYPE: "product-type", PATH: "inventory/select/setting" },
	CATEGORY_GROUP: { UTILITY: "categoryGroup", TYPE: "category-group", PATH: "inventory/select/group-category" },
	CATEGORY: { UTILITY: "category", TYPE: "category", PATH: "inventory/select/category" },
};

export const ACCOUNTING_DROPDOWNS = {
	ACCOUNT: { UTILITY: "account", TYPE: "sub-head", PATH: "accounting/select/head" },
	ACCOUNT_LEDGER: { UTILITY: "accountLedger", TYPE: "ledger", PATH: "accounting/select/head" },
	VOUCHER: { UTILITY: "voucher", TYPE: "voucher", PATH: "accounting/select/voucher" },
};

export const HOSPITAL_DROPDOWNS = {
	BY_MEAL: { UTILITY: "byMeal", PATH: "hospital/select/bymeal" },
	DOSAGE: { UTILITY: "dosage", PATH: "hospital/select/dosage" },
	PARTICULAR_TYPE: { UTILITY: "particularType", PATH: "hospital/select/particular-type" },
	PARTICULAR_MASTER_TYPE: { UTILITY: "particularMasterType", PATH: "hospital/select/particular-master-type" },

	PARTICULAR_ROOM: { UTILITY: "particularRoom", TYPE: "room", PATH: "hospital/select/particular" },
	PARTICULAR_OPD_ROOM: { UTILITY: "particularOpdRoom", TYPE: "opd-room", PATH: "hospital/select/particular" },

	PARTICULAR_DOCTOR: { UTILITY: "particularDoctor", TYPE: "doctor", PATH: "hospital/select/particular" },

	PARTICULAR_MODE: { UTILITY: "particularOperationMode", TYPE: "operation", PATH: "hospital/select/mode" },
	PARTICULAR_PRINT_MODE: { UTILITY: "particularLabReportModes", TYPE: "print", PATH: "hospital/select/mode" },
	PARTICULAR_REPORT_MODE: {
		UTILITY: "particularLabReportModes",
		TYPE: "lab-report-mode",
		PATH: "hospital/select/mode",
	},
	PARTICULAR_OPERATION_MODE: {
		UTILITY: "particularPatientOperation",
		TYPE: "operation",
		PATH: "hospital/select/mode",
	},

	PARTICULAR_PATIENT_DISEASES_MODE: {
		UTILITY: "particularPatientModes",
		TYPE: "patient-diseases-mode",
		PATH: "hospital/select/mode",
	},

	HOSPITAL: { UTILITY: "hospital", TYPE: "hospital", PATH: "hospital/select/particular" },

	PARTICULAR_PATIENT_TYPE: { UTILITY: "particularPatientTypes", TYPE: "patient-type", PATH: "hospital/select/mode" },
	PARTICULAR_PATIENT_MODE: { UTILITY: "particularPatientModes", TYPE: "patient-mode", PATH: "hospital/select/mode" },
	PARTICULAR_GENDER_MODE: { UTILITY: "particularGenderModes", TYPE: "gender-mode", PATH: "hospital/select/mode" },
	PARTICULAR_PAYMENT_MODE: { UTILITY: "particularPaymentModes", TYPE: "paying-mode", PATH: "hospital/select/mode" },
	PARTICULAR_CABIN_MODE: { UTILITY: "particularCabinModes", TYPE: "cabin-mode", PATH: "hospital/select/mode" },
	CATEGORY: { UTILITY: "category", TYPE: "category", PATH: "hospital/select/category" },
};

const initialState = {
	isLoading: true,
	fetching: true,
	dynamicDropdownData: {},
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
