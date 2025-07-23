import PatientForm from "../../common/__PatientForm";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import PatientInformation from "../../common/PatientInformation";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { setInsertType } from "@/app/store/core/crudSlice";

export default function Form({ form, isOpenPatientInfo, setIsOpenPatientInfo, setPatientData }) {
	const params = useParams();
	const dispatch = useDispatch();
	const insertType = useSelector((state) => state.crud.prescription.insertType);

	useEffect(() => {
		dispatch(
			setInsertType({
				insertType: params.id ? "edit" : "create",
				module: "prescription",
			})
		);
	}, [params, dispatch]);

	const handleSubmit = (values) => {
		console.log(values);
	};

	return (
		<>
			{insertType === "create" ? (
				<>
					<Box className="right-arrow-button" onClick={() => setIsOpenPatientInfo(!isOpenPatientInfo)}>
						{isOpenPatientInfo ? <IconChevronLeft size={20} /> : <IconChevronRight size={20} />}
					</Box>
					<PatientInformation
						isOpenPatientInfo={isOpenPatientInfo}
						setIsOpenPatientInfo={setIsOpenPatientInfo}
						setPatientData={setPatientData}
					/>
				</>
			) : (
				<PatientForm form={form} handleSubmit={handleSubmit} canClose={true} />
			)}
		</>
	);
}
