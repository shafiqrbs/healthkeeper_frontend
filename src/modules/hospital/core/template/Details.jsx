import { Box, ScrollArea } from "@mantine/core";
import { useParams, useOutletContext } from "react-router-dom";
import OPDA4 from "./print-formats/opd/OPDA4";
import Prescription2 from "./print-formats/opd/Prescription2";
import PrescriptionFull from "./print-formats/prescription/PrescriptionFull";
import OPDPos from "./print-formats/opd/OPDPos";

export default function Details() {
	const { name } = useParams();
	const { mainAreaHeight } = useOutletContext();

	return (
		<>
			<Box bg="gray.1" p="xxxs" fz="sm">
				{name}
			</Box>
			<ScrollArea h={mainAreaHeight - 100}>
				<Box p="sm">
					{name === "OPDA4" && <OPDA4 />}
					{name === "OPDPos" && <OPDPos />}
					{name === "PrescriptionFull" && <PrescriptionFull />}
				</Box>
			</ScrollArea>
		</>
	);
}
