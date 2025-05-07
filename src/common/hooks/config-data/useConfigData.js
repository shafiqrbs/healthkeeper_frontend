import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";

const useConfigData = () => {
	const dispatch = useDispatch();
	const configData = useSelector((state) => state.crud.config.data?.data);

	const fetchData = () => {
		dispatch(
			getIndexEntityData({
				url: "inventory/config",
				module: "config",
			})
		);
	};

	useEffect(() => {
		if (!configData?.id) {
			fetchData();
		}
	}, [dispatch]);

	return { configData, fetchData };
};

export default useConfigData;
