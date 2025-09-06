import AddMedicineForm from "@modules/hospital/common/AddMedicineForm";
import { Box } from "@mantine/core";
import { useOutletContext } from "react-router-dom";

export default function Medicine() {
	const { mainAreaHeight } = useOutletContext();

	return (
		<Box h={mainAreaHeight - 63} p="xs">
			{/* <AddMedicineForm hideActionButtons hideAdviseForm /> */}
		</Box>
	);
}
