import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";

const useMedicineGenericData = ({ term = "" }) => {
	const dispatch = useDispatch();
	const [medicineGenericData, setMedicineGenericData] = useState([]);

	const fetchData = async ({ search }) => {
		const resultAction = await dispatch(
			getIndexEntityData({
				url: "hospital/select/medicine-generic",
				module: "medicineGeneric",
				params: { term: search || "" },
			})
		).unwrap();

		if (resultAction?.data?.status === 200) {
			setMedicineGenericData(resultAction.data?.data || []);
		}
	};

	useEffect(() => {
		if (term) {
			fetchData({ search: term });
		} else {
			setMedicineGenericData([]);
		}
	}, [term]);

	return { medicineGenericData, fetchData };
};

export default useMedicineGenericData;
