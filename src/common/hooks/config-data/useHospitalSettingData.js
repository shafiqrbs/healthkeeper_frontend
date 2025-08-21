import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";

const useHospitalSettingData = () => {
	const dispatch = useDispatch();
	const hospitalSettingData = useSelector((state) => state.crud.hospitalSetting?.data.data);

	const fetchData = () => {
		dispatch(
			getIndexEntityData({
				url: "hospital/select/modules",
				module: "hospitalSetting",
			})
		);
	};

	useEffect(() => {
		if (!hospitalSettingData?.length) {
			fetchData();
		}
	}, [dispatch]);

	return { hospitalSettingData: hospitalSettingData, fetchData };
};

export default useHospitalSettingData;
