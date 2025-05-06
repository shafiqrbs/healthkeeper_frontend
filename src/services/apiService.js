import { getLoggedInUser } from "@/common/utils";
import { API_BASE_URL, API_KEY } from "@/constants";
import axios from "axios";

const getCommonHeaders = () => {
	const user = getLoggedInUser();
	return {
		Accept: "application/json",
		"Content-Type": `application/json`,
		"Access-Control-Allow-Origin": "*",
		"X-Api-Key": API_KEY,
		"X-Api-User": user.id,
	};
};
export const getSelectDataWithParam = async (value) => {
	let data = [];
	await axios({
		method: "get",
		url: `${API_BASE_URL}/${value.url}`,
		headers: getCommonHeaders(),
		params: value.params,
	})
		.then((res) => {
			data = res.data.data;
		})
		.catch(function (error) {
			console.error(error);
		});
	return data;
};

export const getDataWithParam = async (value) => {
	try {
		const response = await axios({
			method: "get",
			url: `${API_BASE_URL}/${value.url}`,
			headers: getCommonHeaders(),
			params: value.params,
		});
		return response.data; // Return the `data` part of the response
	} catch (error) {
		// Log the error and throw it so it can be caught by `createAsyncThunk`
		console.error("Error in getDataWithParam:", error);
		throw error;
	}
};

export const getDataWithoutParam = async (value) => {
	let data = [];
	await axios({
		method: "get",
		url: `${API_BASE_URL}/${value}`,
		headers: getCommonHeaders(),
	})
		.then((res) => {
			data = res.data.data;
		})
		.catch(function (error) {
			console.error(error);
		});
	return data;
};

export const createData = async (value) => {
	try {
		const response = await axios({
			method: "POST",
			url: `${API_BASE_URL}/${value.url}`,
			headers: getCommonHeaders(),
			data: value.data,
		});
		return response;
	} catch (error) {
		// Return both the message and validation errors
		if (error.response) {
			return {
				success: false,
				message: error.response.data.message,
				errors: error.response.data.errors,
			};
		} else {
			return {
				success: false,
				message: error.message,
				errors: {},
			};
		}
	}
};

export const editData = async (value) => {
	let data = [];
	await axios({
		method: "get",
		url: `${API_BASE_URL}/${value.url}`,
		headers: getCommonHeaders(),
	})
		.then((res) => {
			data = res;
		})
		.catch(function (error) {
			console.error(error);
		});
	return data;
};

export const updateData = async (value) => {
	try {
		const response = await axios({
			method: "PATCH",
			url: `${API_BASE_URL}/${value.url}`,
			headers: getCommonHeaders(),
			data: value.data,
		});
		return response;
	} catch (error) {
		// Return both the message and validation errors
		if (error.response) {
			return {
				success: false,
				message: error.response.data.message,
				errors: error.response.data.errors,
			};
		} else {
			return {
				success: false,
				message: error.message,
				errors: {},
			};
		}
	}
};

export const showData = async (value) => {
	let data = [];
	await axios({
		method: "get",
		url: `${API_BASE_URL}/${value.url}`,
		headers: getCommonHeaders(),
	})
		.then((res) => {
			data = res;
		})
		.catch(function (error) {
			console.error(error);
		});
	return data;
};

export const deleteData = async (value) => {
	let data = [];
	await axios({
		method: "delete",
		url: `${API_BASE_URL}/${value.url}`,
		headers: getCommonHeaders(),
	})
		.then((res) => {
			data = res;
		})
		.catch(function (error) {
			console.error(error);
		});
	return data;
};

/* Inline Status Update */

export const inlineStatusUpdateData = async (value) => {
	let data = [];
	await axios({
		method: "get",
		url: `${API_BASE_URL}/${value.url}`,
		headers: getCommonHeaders(),
	})
		.then((res) => {
			data = res;
		})
		.catch(function (error) {
			console.error(error);
		});
	return data;
};

export const getCoreSettingDropdown = async (value) => {
	let data = [];
	await axios({
		method: "get",
		url: `${API_BASE_URL}/${value.url}`,
		headers: getCommonHeaders(),
		params: value.params,
	})
		.then((res) => {
			data["data"] = res.data;
			data["type"] = value.params["dropdown-type"];
		})
		.catch(function (error) {
			console.error(error);
		});
	return data;
};

export const updateDataWithFile = async (value) => {
	let data = [];
	await axios({
		method: "POST",
		url: `${API_BASE_URL}/${value.url}`,
		headers: getCommonHeaders(),
		data: value.data,
	})
		.then((res) => {
			data = res;
		})
		.catch(function (error) {
			console.error(error);
		});
	return data;
};
