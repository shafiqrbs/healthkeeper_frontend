import { Box, ScrollArea } from "@mantine/core";
import { useParams, useOutletContext } from "react-router-dom";
import OPDA4 from "./print-formats/opd/OPDA4";
import PrescriptionFull from "./print-formats/prescription/PrescriptionFull";
import OPDPos from "./print-formats/opd/OPDPos";
import IPD from "./print-formats/ipd/IPDA4";
import LabTest from "./print-formats/lab-test/LabTest";
import Discharge from "./print-formats/discharge/Discharge";
import IPDDetails from "./print-formats/ipd/IPDDetails";

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
					{name === "IPD" && <IPD />}
					{name === "IPDDetails" && <IPDDetails />}
					{name === "LabTest" && <LabTest />}
					{name === "Discharge" && <Discharge />}
				</Box>
			</ScrollArea>
		</>
	);
}
