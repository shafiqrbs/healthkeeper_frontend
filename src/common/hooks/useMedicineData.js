import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";

const useMedicineData = ({ term = "" }) => {
	const dispatch = useDispatch();
	const [medicineData, setMedicineData] = useState([]);

	const fetchData = async ({ search }) => {
		const resultAction = await dispatch(
			getIndexEntityData({
				url: "hospital/select/medicine",
				module: "medicines",
				params: { term: search || "" },
			})
		).unwrap();

		if (resultAction?.data?.status === 200) {
			setMedicineData(resultAction.data?.data || []);
		}
	};

	const unsetData = () => {
		setMedicineData([]);
	};

	useEffect(() => {
		if (term) {
			fetchData({ search: term });
		} else {
			setMedicineData([]);
		}
	}, [term]);

	return { medicineData, fetchData, unsetData };
};

export default useMedicineData;
