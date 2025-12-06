import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { setItemData } from "@/app/store/core/crudSlice";
import {useAuthStore} from "@/store/useAuthStore";

const localHospitalConfigData = JSON.parse(localStorage.getItem("hospital-config") || "{}");

const useHospitalConfigData = () => {

	const [hospitalConfigData,setHospitalConfigData] = useState({});
	const authStorage = useAuthStore(state => state);
	const fetchData = () => {
		// available inside the localstorage then use that
		return authStorage?.hospitalConfig?.config;
	};
	useEffect(() => {
		if (!hospitalConfigData?.id) {
			setHospitalConfigData(fetchData());
		}
	}, []);

	return { hospitalConfigData: hospitalConfigData, fetchData };
};

export default useHospitalConfigData;
