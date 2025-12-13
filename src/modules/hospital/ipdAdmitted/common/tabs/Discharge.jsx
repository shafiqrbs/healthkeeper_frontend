import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { Box } from "@mantine/core";
import Prescription from "@modules/hospital/discharge/_Prescription";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

export default function Discharge() {
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const [medicines, setMedicines] = useState([]);

	const { data: prescriptionData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
	});

	useEffect(() => {
		if (prescriptionData?.data) {
			setMedicines(prescriptionData?.data?.prescription_medicine || []);
		}
	}, [prescriptionData]);

	return (
		<Box w="100%">
			<Prescription
				medicines={medicines}
				setMedicines={setMedicines}
				baseHeight={mainAreaHeight - 376}
				prescriptionId={prescriptionData?.data?.prescription_id}
			/>
		</Box>
	);
}
