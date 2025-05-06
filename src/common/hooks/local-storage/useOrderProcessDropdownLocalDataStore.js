import { API_BASE_URL, API_KEY } from "@/constants";
import axios from "axios";

const useOrderProcessDropdownLocalDataStore = async (user_id) => {
	try {
		const response = await axios({
			method: "get",
			url: `${API_BASE_URL}/utility/select/setting`,
			headers: {
				Accept: `application/json`,
				"Content-Type": `application/json`,
				"Access-Control-Allow-Origin": "*",
				"X-Api-Key": API_KEY,
				"X-Api-User": user_id,
			},
			params: { "dropdown-type": "sales-process-type" },
		});
		if (response) {
			if (response.data.data) {
				if (response.data.data && response.data.data.length > 0) {
					const transformedData = response.data.data.map((type) => {
						return { label: type.name, value: String(type.id) };
					});
					localStorage.setItem("order-process", JSON.stringify(transformedData));
				}
			}
		}
	} catch (error) {
		console.error(error);
	}
};

export default useOrderProcessDropdownLocalDataStore;
