import DischargeA4BN from "@hospital-components/print-formats/discharge/DischargeA4BN";
import { Box, Button, LoadingOverlay, ScrollArea } from "@mantine/core";
import { useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import ReferredCertificateBN from "@hospital-components/print-formats/referred-certificate/ReferredCertificateBN";

export default function ReferredPrint({ isLoading = false, data }) {
	const { mainAreaHeight } = useOutletContext();
	const handlePrint = useReactToPrint({ content: () => printRef.current });
	const printRef = useRef(null);
	return (
		<Box pos="relative" bg="var(--mantine-color-white)" className="borderRadiusAll">
			<LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
			<ScrollArea h={mainAreaHeight - 80} scrollbars="y" p="sm">
				<ReferredCertificateBN data={data} ref={printRef} preview />
			</ScrollArea>
			<Box bg="var(--mantine-color-white)" p="sm" className="shadow-2">
				<Button onClick={handlePrint} bg="var(--theme-secondary-color-6)" color="white" size="sm">
					Print
				</Button>
			</Box>
		</Box>
	);
}
