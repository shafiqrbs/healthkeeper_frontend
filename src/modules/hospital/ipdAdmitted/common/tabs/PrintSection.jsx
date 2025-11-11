import { Box, Button, Flex, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";

// print formats - ipd
import IPDPrescriptionFullEN from "@hospital-components/print-formats/ipd/IPDPrescriptionFullEN";
import IPDPrescriptionFullBN from "@hospital-components/print-formats/ipd/IPDPrescriptionFullBN";
import InvestigationPosEN from "@hospital-components/print-formats/ipd/InvestigationPosEN";
import InvestigationPosBN from "@hospital-components/print-formats/ipd/InvestigationPosBN";

// print formats - admission
import AdmissionFormEN from "@hospital-components/print-formats/admission/AdmissionFormEN";
import AdmissionFormBN from "@hospital-components/print-formats/admission/AdmissionFormBN";
import AdmissionInvoiceEN from "@hospital-components/print-formats/admission/AdmissionInvoiceEN";
import AdmissionInvoiceBN from "@hospital-components/print-formats/admission/AdmissionInvoiceBN";

// print formats - billing
import DetailsInvoiceEN from "@hospital-components/print-formats/billing/DetailsInvoiceEN";
import DetailsInvoiceBN from "@hospital-components/print-formats/billing/DetailsInvoiceBN";
import InvoicePosEN from "@hospital-components/print-formats/billing/InvoicePosEN";
import InvoicePosBN from "@hospital-components/print-formats/billing/InvoicePosBN";

// print formats - opd (for fresh order)
import OPDA4EN from "@hospital-components/print-formats/opd/OPDA4EN";
import OPDA4BN from "@hospital-components/print-formats/opd/OPDA4BN";

export default function PrintSection() {
	const { t } = useTranslation();
	const { id } = useParams();

	const { data: ipdResponse, isLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
	});
	const ipdData = ipdResponse?.data;

	// =============== refs for print targets ================
	const ipdPrescriptionENRef = useRef(null);
	const ipdPrescriptionBNRef = useRef(null);
	const ipdInvestigationENRef = useRef(null);
	const ipdInvestigationBNRef = useRef(null);

	const admissionFormENRef = useRef(null);
	const admissionFormBNRef = useRef(null);
	const admissionInvoiceENRef = useRef(null);
	const admissionInvoiceBNRef = useRef(null);

	const detailsInvoiceENRef = useRef(null);
	const detailsInvoiceBNRef = useRef(null);
	const billingPosENRef = useRef(null);
	const billingPosBNRef = useRef(null);

	const opdA4ENRef = useRef(null);
	const opdA4BNRef = useRef(null);

	// =============== print handlers ================
	const printIPDPrescriptionEN = useReactToPrint({ content: () => ipdPrescriptionENRef.current });
	const printIPDPrescriptionBN = useReactToPrint({ content: () => ipdPrescriptionBNRef.current });
	const printInvestigationEN = useReactToPrint({ content: () => ipdInvestigationENRef.current });
	const printInvestigationBN = useReactToPrint({ content: () => ipdInvestigationBNRef.current });

	const printAdmissionFormEN = useReactToPrint({ content: () => admissionFormENRef.current });
	const printAdmissionFormBN = useReactToPrint({ content: () => admissionFormBNRef.current });
	const printAdmissionInvoiceEN = useReactToPrint({ content: () => admissionInvoiceENRef.current });
	const printAdmissionInvoiceBN = useReactToPrint({ content: () => admissionInvoiceBNRef.current });

	const printDetailsInvoiceEN = useReactToPrint({ content: () => detailsInvoiceENRef.current });
	const printDetailsInvoiceBN = useReactToPrint({ content: () => detailsInvoiceBNRef.current });
	const printBillingPosEN = useReactToPrint({ content: () => billingPosENRef.current });
	const printBillingPosBN = useReactToPrint({ content: () => billingPosBNRef.current });

	const printOPDA4EN = useReactToPrint({ content: () => opdA4ENRef.current });
	const printOPDA4BN = useReactToPrint({ content: () => opdA4BNRef.current });

	// =============== helpers ================
	const PrintButtons = ({ title, onPrintEN, onPrintBN }) => (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)" p="sm">
			<Flex justify="space-between" align="center">
				<Text fw={600} fz="sm">
					{t(title)}
				</Text>
				<Flex gap="xs">
					<Button size="compact-xs" bg="var(--theme-secondary-color-6)" color="white" onClick={onPrintEN}>
						EN
					</Button>
					<Button size="compact-xs" bg="var(--theme-secondary-color-6)" color="white" onClick={onPrintBN}>
						BN
					</Button>
				</Flex>
			</Flex>
		</Box>
	);

	return (
		<Box pos="relative">
			<LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
			<Stack gap="xs">
				{/* =============== ipd prescription (full) ================ */}
				<PrintButtons
					title="IPD Prescription"
					onPrintEN={printIPDPrescriptionEN}
					onPrintBN={printIPDPrescriptionBN}
				/>

				{/* =============== prescription - indoor (same ipd full) ================ */}
				<PrintButtons
					title="Prescription Indoor"
					onPrintEN={printIPDPrescriptionEN}
					onPrintBN={printIPDPrescriptionBN}
				/>

				{/* =============== admission form ================ */}
				<PrintButtons
					title="Admission Form"
					onPrintEN={printAdmissionFormEN}
					onPrintBN={printAdmissionFormBN}
				/>

				{/* =============== admission bill ================ */}
				<PrintButtons
					title="Admission Bill"
					onPrintEN={printAdmissionInvoiceEN}
					onPrintBN={printAdmissionInvoiceBN}
				/>

				{/* =============== billing invoice (details a4) ================ */}
				<PrintButtons
					title="Billing Invoice"
					onPrintEN={printDetailsInvoiceEN}
					onPrintBN={printDetailsInvoiceBN}
				/>

				{/* =============== billing pos (pos ticket) ================ */}
				<PrintButtons title="Billing POS" onPrintEN={printBillingPosEN} onPrintBN={printBillingPosBN} />

				{/* =============== investigation pos ================ */}
				<PrintButtons title="Investigation" onPrintEN={printInvestigationEN} onPrintBN={printInvestigationBN} />

				{/* =============== fresh order (use OPD A4) ================ */}
				<PrintButtons title="Fresh Order" onPrintEN={printOPDA4EN} onPrintBN={printOPDA4BN} />
			</Stack>

			{/* =============== hidden print targets ================ */}
			<IPDPrescriptionFullEN data={ipdData} ref={ipdPrescriptionENRef} />
			<IPDPrescriptionFullBN data={ipdData} ref={ipdPrescriptionBNRef} />
			<InvestigationPosEN data={ipdData} ref={ipdInvestigationENRef} />
			<InvestigationPosBN data={ipdData} ref={ipdInvestigationBNRef} />
			<AdmissionFormEN data={ipdData} ref={admissionFormENRef} />
			<AdmissionFormBN data={ipdData} ref={admissionFormBNRef} />
			<AdmissionInvoiceEN data={ipdData} ref={admissionInvoiceENRef} />
			<AdmissionInvoiceBN data={ipdData} ref={admissionInvoiceBNRef} />

			<DetailsInvoiceEN data={ipdData} ref={detailsInvoiceENRef} />
			<DetailsInvoiceBN data={ipdData} ref={detailsInvoiceBNRef} />
			<InvoicePosEN data={ipdData} ref={billingPosENRef} />
			<InvoicePosBN data={ipdData} ref={billingPosBNRef} />

			<OPDA4EN data={ipdData} ref={opdA4ENRef} />
			<OPDA4BN data={ipdData} ref={opdA4BNRef} />
		</Box>
	);
}
