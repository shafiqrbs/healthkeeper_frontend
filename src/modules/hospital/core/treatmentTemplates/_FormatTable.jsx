import { useState } from "react";
import { Box } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import TreatmentAddMedicineForm from "@hospital-components/__TreatmentAddMedicineForm";

export default function _FormatTable({ module }) {
	const [medicines, setMedicines] = useState([]);
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 48;

	return (
		<Box className="border-top-none">
			<TreatmentAddMedicineForm
				medicines={medicines}
				module={module}
				setMedicines={setMedicines}
				baseHeight={height - 170}
			/>
		</Box>
	);
}
