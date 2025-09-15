import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { setItemData } from "@/app/store/core/crudSlice";

const localConfigData = JSON.parse(localStorage.getItem("config-data") || "{}");

const useConfigData = () => {
	const dispatch = useDispatch();
	const configData = useSelector((state) => state.crud.config.data?.data);

	const fetchData = () => {
		if (localConfigData?.id) {
			dispatch(setItemData({ module: "config", data: localConfigData }));
		} else {
			dispatch(
				getIndexEntityData({
					url: "inventory/config",
					module: "config",
				})
			);
		}
	};

	useEffect(() => {
		if (!configData?.id) {
			fetchData();
		}
	}, [dispatch]);

	return { configData, fetchData };
};

export default useConfigData;
