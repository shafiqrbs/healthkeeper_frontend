import {
	createData,
	deleteData,
	editData,
	getDataWithoutParam,
	getDataWithParam,
	inlineStatusUpdateData,
	showData,
	updateData,
	updateDataWithFile,
} from "@/services/apiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getIndexEntityData = createAsyncThunk(
	"index", // Unique action type
	async (value, { rejectWithValue }) => {
		try {
			const data = await getDataWithParam(value); // Wait for the API response
			return { data, module: value.module }; // Return data (will trigger `fulfilled` case)
		} catch (error) {
			return rejectWithValue(error.response?.data || "Failed to fetch data"); // Return error details to `rejected` case
		}
	}
);

export const getCustomerIndexData = createAsyncThunk("customer-index", async (value) => {
	try {
		const response = getDataWithoutParam(value);
		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const getStatusInlineUpdateData = createAsyncThunk("status-update", async (value) => {
	try {
		const response = inlineStatusUpdateData(value);
		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const storeEntityData = createAsyncThunk("store", async (value, { rejectWithValue }) => {
	const response = await createData(value);
	if (response.success === false) {
		return rejectWithValue({
			message: response.message,
			errors: response.errors,
		});
	}

	return { ...response, module: value.module };
});

export const editEntityData = createAsyncThunk("edit", async (value) => {
	try {
		const response = editData(value);
		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const updateEntityData = createAsyncThunk("update", async (value, { rejectWithValue }) => {
	const response = await updateData(value);

	if (response.success === false) {
		return rejectWithValue({
			message: response.message,
			errors: response.errors,
		});
	}

	return { ...response, module: value.module };
});

export const updateEntityDataWithFile = createAsyncThunk("update-with-file", async (value) => {
	try {
		const response = updateDataWithFile(value);
		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const showEntityData = createAsyncThunk("show", async (value) => {
	try {
		const response = showData(value);
		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const deleteEntityData = createAsyncThunk("delete", async (value) => {
	try {
		const response = deleteData(value);
		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});
