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
const getFileHeaders = () => {
	const user = getLoggedInUser();
	return {
		Accept: "application/json",
		"Content-Type": `multipart/form-data`,
		"Access-Control-Allow-Origin": "*",
		"X-Api-Key": API_KEY,
		"X-Api-User": user.id,
	};
};

export const getDataWithoutStore = async (value, headers = {}) => {
	try {
		const response = await axios({
			method: "get",
			url: `${API_BASE_URL}/${value.url}`,
			headers: { ...getCommonHeaders(), ...headers },
			params: value.params,
		});
		return response.data;
	} catch (error) {
		console.error("Error in getDataWithoutStore:", error);
		throw error;
	}
};

export const setDataWithoutStore = async (value, headers = {}) => {
	try {
		const response = await axios({
			method: "post",
			url: `${API_BASE_URL}/${value.url}`,
			headers: { ...getCommonHeaders(), ...headers },
			data: value.data,
		});
		return response.data;
	} catch (error) {
		console.error("Error in setDataWithoutStore:", error);
		throw error;
	}
};

export const getSelectDataWithParam = async (value) => {
	try {
		const response = await axios({
			method: "get",
			url: `${API_BASE_URL}/${value.url}`,
			headers: getCommonHeaders(),
			params: value.params,
		});
		return response.data.data;
	} catch (error) {
		console.error("Error in getSelectDataWithParam:", error);
		throw error;
	}
};

export const getDataWithParam = async (value) => {
	try {
		const response = await axios({
			method: "get",
			url: `${API_BASE_URL}/${value.url}`,
			headers: getCommonHeaders(),
			params: value.params,
		});
		return response.data;
	} catch (error) {
		console.error("Error in getDataWithParam:", error);
		throw error;
	}
};

export const getDataWithoutParam = async (value) => {
	try {
		const response = await axios({
			method: "get",
			url: `${API_BASE_URL}/${value}`,
			headers: getCommonHeaders(),
		});
		return response.data;
	} catch (error) {
		console.error("Error in getDataWithoutParam:", error);
		throw error;
	}
};

export const createData = async ({ url, data }) => {
	try {
		const response = await axios({
			method: "POST",
			url: `${API_BASE_URL}/${url}`,
			headers: getCommonHeaders(),
			data,
		});
		return response;
	} catch (error) {
		const errorResponse = error.response?.data || {};
		return {
			success: false,
			message: errorResponse.message || error.message,
			errors: errorResponse.errors || {},
		};
	}
};

export const editData = async (value) => {
	try {
		const response = await axios({
			method: "GET",
			url: `${API_BASE_URL}/${value.url}`,
			headers: getCommonHeaders(),
		});
		return response;
	} catch (error) {
		console.error("Error in editData:", error);
		throw error;
	}
};

export const updateData = async ({ url, data }) => {
	try {
		const response = await axios({
			method: "PATCH",
			url: `${API_BASE_URL}/${url}`,
			headers: getCommonHeaders(),
			data,
		});
		return response;
	} catch (error) {
		const errorResponse = error.response?.data || {};
		return {
			success: false,
			message: errorResponse.message || error.message,
			errors: errorResponse.errors || {},
		};
	}
};

export const showData = async (value) => {
	try {
		const response = await axios({
			method: "GET",
			url: `${API_BASE_URL}/${value.url}`,
			headers: getCommonHeaders(),
		});
		return response;
	} catch (error) {
		console.error("Error in showData:", error);
		throw error;
	}
};

export const deleteData = async (value) => {
	try {
		const response = await axios({
			method: "DELETE",
			url: `${API_BASE_URL}/${value.url}`,
			headers: getCommonHeaders(),
		});
		return response;
	} catch (error) {
		console.error("Error in deleteData:", error);
		throw error;
	}
};

export const inlineStatusUpdateData = async (value) => {
	try {
		const response = await axios({
			method: "GET",
			url: `${API_BASE_URL}/${value.url}`,
			headers: getCommonHeaders(),
		});
		return response;
	} catch (error) {
		console.error("Error in inlineStatusUpdateData:", error);
		throw error;
	}
};

export const getCoreSettingDropdown = async (value) => {
	try {
		const response = await axios({
			method: "GET",
			url: `${API_BASE_URL}/${value.url}`,
			headers: getCommonHeaders(),
			params: value.params,
		});

		return {
			data: response.data,
			type: value.params["dropdown-type"],
		};
	} catch (error) {
		console.error("Error in getCoreSettingDropdown:", error);
		throw error;
	}
};

export const updateDataWithFile = async (value) => {
	try {
		const response = await axios({
			method: "POST",
			url: `${API_BASE_URL}/${value.url}`,
			headers: getFileHeaders(),
			data: value.data,
		});
		return response;
	} catch (error) {
		console.error("Error in updateDataWithFile:", error);
		throw error;
	}
};
