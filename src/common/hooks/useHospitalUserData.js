import { useEffect, useState } from "react";
import { getDataWithoutStore } from "@/services/apiService";
import {getLoggedInHospitalUser, getLoggedInUser} from "@utils/index";
import {CONFIGURATION_ROUTES} from "@/constants/routes";

export default function useHospitalUserData() {
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);
	const user = getLoggedInUser();
	const existHospitalUser = getLoggedInHospitalUser();
	const url = `${CONFIGURATION_ROUTES.API_ROUTES.HOSPITAL_CONFIG.USER_INFO}/${user.id}`
	const fetchData = async () => {
		setError(null);
		setData(null);
		try {
			if(existHospitalUser?.id){
				setData(existHospitalUser);
			}else{
				const response = await getDataWithoutStore({url});
				setData(response);
				localStorage.setItem("hospital-user", JSON.stringify(response.data));
			}
		} catch (error) {
			setError(error);
		}
	};
	const refetch = async () => {
		await fetchData();
	};

	useEffect(() => {
		fetchData();
	}, []);

	return {error, userInfo:data, refetch };
}
