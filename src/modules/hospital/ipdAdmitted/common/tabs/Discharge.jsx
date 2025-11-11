import { Box } from "@mantine/core";
import Prescription from "@modules/hospital/discharge/_Prescription";
import { useOutletContext } from "react-router-dom";

export default function Discharge() {
	const { mainAreaHeight } = useOutletContext();
	return (
		<Box w="100%">
			<Prescription baseHeight={mainAreaHeight - 376} />
		</Box>
	);
}
