import axios from "axios";

const share_health = {
	id: 1,
	config_id: 2,
	x_auth_token: "bc838372-7a26-4049-9bc6-0483c563994a",
	client_id: "209364",
	email: "shyamoli250bedtb@shrapi.dghs.gov.bd",
	from: "shyamoli250bedtb@shrapi.dghs.gov.bd",
	health_share_url: "http://mci.mcishr.dghs.gov.bd/api/v1/patients",
	nid_url: "http://mci.mcishr.dghs.gov.bd/api/v1/patients",
	patient_url: "http://mci.mcishr.dghs.gov.bd/api/v1/patients",
	health_share_email: null,
	health_share_token: "1234567890",
	health_share_password: "1234567890",
	status: 1,
	created_at: "2025-09-16T03:36:38.000000Z",
	updated_at: "2025-09-16T03:36:38.000000Z",
};

export const getPatientSearchByHID = async (pid) => {
	try {
		const response = await axios({
			method: "GET",
			url: `${share_health.patient_url}/${pid}`,
			headers: {
				from: share_health.from,
				"X-Auth-Token": share_health.x_auth_token,
				"client-id": share_health.client_id,
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("Error in getPatientSearch:", error);
		throw error;
	}
};

export const getPatientSearchByNID = async (nid) => {
	try {
		const response = await axios({
			method: "GET",
			url: `${share_health.nid_url}?nid=${nid}`,
			headers: {
				from: share_health.from,
				"X-Auth-Token": share_health.x_auth_token,
				"client-id": share_health.client_id,
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("Error in getPatientSearch:", error);
		throw error;
	}
};

export const getPatientSearchByBRN = async (brn) => {
	try {
		const response = await axios({
			method: "GET",
			url: `${share_health.health_share_url}?bin_brn=${brn}`,
			headers: {
				from: share_health.from,
				"X-Auth-Token": share_health.x_auth_token,
				"client-id": share_health.client_id,
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("Error in getPatientSearch:", error);
		throw error;
	}
};
