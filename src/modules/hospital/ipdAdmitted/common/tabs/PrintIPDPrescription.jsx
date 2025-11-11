import { Box, Button, LoadingOverlay, ScrollArea, Stack } from "@mantine/core";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import IPDPrescriptionFullEN from "@hospital-components/print-formats/ipd/IPDPrescriptionFullEN";

export default function PrintIPDPrescription() {
	const { mainAreaHeight } = useOutletContext();
	const { id } = useParams();
	const printRef = useRef(null);
	const { data: ipdResponse, isLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
	});
	const ipdData = ipdResponse?.data;

	const handlePrint = useReactToPrint({ content: () => printRef.current });

	return (
		<Box pos="relative" bg="var(--mantine-color-white)" className="borderRadiusAll">
			<LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
			<ScrollArea h={mainAreaHeight - 80} scrollbars="y" p="sm">
				<IPDPrescriptionFullEN data={ipdData} ref={printRef} preview />
			</ScrollArea>
			<Box bg="var(--mantine-color-white)" p="sm" className="shadow-2">
				<Button onClick={handlePrint} bg="var(--theme-secondary-color-6)" color="white" size="sm">
					Print
				</Button>
			</Box>
		</Box>
	);
}
