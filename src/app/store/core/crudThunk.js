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
			return rejectWithValue({
				message: error.response?.data || "Failed to fetch data",
				module: value.module,
			}); // Return error details to `rejected` case
		}
	}
);

export const getCustomerIndexData = createAsyncThunk("customer-index", async (value) => {
	try {
		const response = await getDataWithoutParam(value);
		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const getStatusInlineUpdateData = createAsyncThunk("status-update", async (value) => {
	try {
		const response = await inlineStatusUpdateData(value);
		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const storeEntityData = createAsyncThunk("store", async (value, { rejectWithValue }) => {
	try {
		const response = await createData(value);
		if (response.status !== 200) {
			return rejectWithValue({
				message: response.message,
				errors: response.errors,
				module: value.module,
			});
		}

		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		return rejectWithValue({
			message: error.message || "Failed to store data",
			errors: error.response?.data?.errors || {},
			module: value.module,
		});
	}
});

export const editEntityData = createAsyncThunk("edit", async (value) => {
	try {
		const response = await editData(value);
		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		return rejectWithValue({
			message: error.message || "Failed to edit data",
			errors: error.response?.data?.errors || {},
			module: value.module,
		});
	}
});

export const updateEntityData = createAsyncThunk("update", async (value, { rejectWithValue }) => {
	try {
		const response = await updateData(value);

		if (response.success === false) {
			return rejectWithValue({
				message: response.message,
				errors: response.errors,
				module: value.module,
			});
		}

		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const updateEntityDataWithFile = createAsyncThunk("update-with-file", async (value) => {
	try {
		const response = await updateDataWithFile(value);
		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const showEntityData = createAsyncThunk("show", async (value) => {
	try {
		const response = await showData(value);
		return { ...response, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});

export const deleteEntityData = createAsyncThunk("delete", async (value, { rejectWithValue }) => {
	try {
		const response = await deleteData(value);
		return { ...response, id: value.id, module: value.module };
	} catch (error) {
		console.error("error", error.message);
		return rejectWithValue({
			message: error.message || "Failed to delete data",
			errors: error.response?.data?.errors || {},
			module: value.module,
		});
	}
});
