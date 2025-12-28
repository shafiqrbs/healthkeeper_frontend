import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getDataWithoutStore } from "@/services/apiService";
import { Box } from "@mantine/core";
import Prescription from "@modules/hospital/discharge/_Prescription";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function Discharge({ ipdData, refetch }) {
	const { mainAreaHeight } = useOutletContext();
	const [medicines, setMedicines] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (ipdData?.prescription_id) {
			fetchPrescriptionData();
		}
	}, [ipdData]);

	async function fetchPrescriptionData() {
		try {
			setIsLoading(true);
			const result = await getDataWithoutStore({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${ipdData?.prescription_id}`,
			});
			setMedicines(JSON.parse(result?.data?.json_content)?.medicines || []);
			setIsLoading(false);
		} catch (err) {
			console.error("Unexpected error:", err);
			setIsLoading(false);
		}
	}

	return (
		<Box w="100%">
			<Prescription
				refetch={refetch}
				medicines={medicines}
				setMedicines={setMedicines}
				baseHeight={mainAreaHeight - 376}
				prescriptionId={ipdData?.prescription_id}
			/>
		</Box>
	);
}
