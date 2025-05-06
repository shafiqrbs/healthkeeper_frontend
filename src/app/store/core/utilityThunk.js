import {
	getDataWithoutParam,
	getSelectDataWithParam,
	getDataWithParam,
	getCoreSettingDropdown,
} from "@/services/apiService.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getSettingTypeDropdown = createAsyncThunk("select/setting-type", async (value) => {
	try {
		const response = getDataWithoutParam(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const getUserDropdown = createAsyncThunk("user/select", async (value) => {
	try {
		const response = getDataWithParam(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const getCountryDropdown = createAsyncThunk("country/select", async (value) => {
	try {
		const response = getDataWithoutParam(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const getCustomerDropdown = createAsyncThunk("customer/select", async (value) => {
	try {
		const response = getDataWithoutParam(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const getVendorDropdown = createAsyncThunk("vendor/select", async (value) => {
	try {
		const response = getDataWithParam(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const getLocationDropdown = createAsyncThunk("warehouse/select", async (value) => {
	try {
		const response = getDataWithParam(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});
export const getVoucherDropdown = createAsyncThunk("voucher/all", async (value) => {
	try {
		const response = getSelectDataWithParam(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});
export const getAccountingDropdown = createAsyncThunk("accounting/head", async (value) => {
	try {
		const response = getSelectDataWithParam(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const getVoucherTypeDropdown = createAsyncThunk("voucher/select", async (value) => {
	try {
		const response = getSelectDataWithParam(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const getLocationProDropdown = createAsyncThunk("warehouse/dropdown", async (value) => {
	try {
		const response = getSelectDataWithParam(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const getExecutiveDropdown = createAsyncThunk("executive/select", async (value) => {
	try {
		const response = getSelectDataWithParam(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});
export const coreSettingDropdown = createAsyncThunk("setting/select", async (value) => {
	try {
		const response = getCoreSettingDropdown(value);
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});
