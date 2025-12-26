import { Box } from "@mantine/core";
import Prescription from "@modules/hospital/discharge/_Prescription";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function Discharge({ data, refetch }) {
	const { mainAreaHeight } = useOutletContext();
	const [medicines, setMedicines] = useState([]);

	useEffect(() => {
		if (data) {
			setMedicines(data?.prescription_medicine || []);
		}
	}, [data]);

	return (
		<Box w="100%">
			<Prescription
				refetch={refetch}
				medicines={medicines}
				setMedicines={setMedicines}
				baseHeight={mainAreaHeight - 376}
				prescriptionId={data?.prescription_id}
			/>
		</Box>
	);
}
