import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";

const useMedicineGenericData = ({ term = "", mode = "generic" }) => {
	const dispatch = useDispatch();
	const [medicineGenericData, setMedicineGenericData] = useState([]);

	const fetchData = async ({ search }) => {
		const resultAction = await dispatch(
			getIndexEntityData({
				url: "hospital/select/medicine-generic",
				module: "medicineGeneric",
				params: { term: search || "", mode },
			})
		).unwrap();

		if (resultAction?.data?.status === 200) {
			setMedicineGenericData(resultAction.data?.data || []);
		}
	};

	const unsetData = () => {
		setMedicineGenericData([]);
	};

	useEffect(() => {
		if (term) {
			fetchData({ search: term });
		} else {
			setMedicineGenericData([]);
		}
	}, [term]);

	return { medicineGenericData, fetchData, unsetData };
};

export default useMedicineGenericData;
