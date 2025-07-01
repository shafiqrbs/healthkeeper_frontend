import { getDataWithoutParam, getDataWithParam } from "@/services/apiService.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

// =============== global dropdown thunk for dynamic dropdown handling ================
export const getGlobalDropdown = createAsyncThunk("global/dropdown", async (value) => {
	try {
		// =============== determine which api service to use based on params ================
		let response;
		if (value.params && Object.keys(value.params).length > 0) {
			response = getDataWithParam(value);
		} else {
			response = getDataWithoutParam(value.url);
		}
		
		// =============== if this is a type-based dropdown, add type to response ================
		if (value.type) {
			return {
				type: value.type,
				data: response
			};
		}
		
		return response;
	} catch (error) {
		console.error("error", error.message);
		throw error;
	}
});
