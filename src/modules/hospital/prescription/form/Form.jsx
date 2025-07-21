import PatientForm from "../../common/__PatientForm";
import { useSelector } from "react-redux";
import { Box } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import PatientInformation from "../common/PatientInformation";

export default function Form({ form, isOpenPatientInfo, setIsOpenPatientInfo, setPatientData }) {
	const insertType = useSelector((state) => state.crud.prescription.insertType);

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
				<PatientForm form={form} handleSubmit={handleSubmit} />
			)}
		</>
	);
}
