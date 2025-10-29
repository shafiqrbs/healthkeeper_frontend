import { ActionIcon, Box, Flex, LoadingOverlay, ScrollArea } from "@mantine/core";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import OPDA4EN from "@hospital-components/print-formats/opd/OPDA4EN";
import OPDA4BN from "@hospital-components/print-formats/opd/OPDA4BN";
import OPDPosEN from "@hospital-components/print-formats/opd/OPDPosEN";
import OPDPosBN from "@hospital-components/print-formats/opd/OPDPosBN";
import PrescriptionFullEN from "@hospital-components/print-formats/prescription/PrescriptionFullEN";
import PrescriptionFullBN from "@hospital-components/print-formats/prescription/PrescriptionFullBN";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { IconArrowLeft } from "@tabler/icons-react";
import EmergencyA4EN from "@hospital-components/print-formats/emergency/EmergencyA4EN";
import EmergencyA4BN from "@hospital-components/print-formats/emergency/EmergencyA4BN";
import EmergencyPosEN from "@hospital-components/print-formats/emergency/EmergencyPosEN";
import EmergencyPosBN from "@hospital-components/print-formats/emergency/EmergencyPosBN";
import IPDPrescriptionFullBN from "@hospital-components/print-formats/ipd/IPDPrescriptionFullBN";
import IPDPrescriptionFullEN from "@hospital-components/print-formats/ipd/IPDPrescriptionFullEN";
import LabReportA4EN from "@hospital-components/print-formats/lab-reports/LabReportA4EN";
import LabReportA4BN from "@hospital-components/print-formats/lab-reports/LabReportA4BN";
import DischargeA4BN from "@hospital-components/print-formats/discharge/DischargeA4BN";
import DischargeA4EN from "@hospital-components/print-formats/discharge/DischargeA4EN";
import IPDDetailsBN from "@hospital-components/print-formats/ipd/IPDDetailsBN";
import IPDDetailsEN from "@hospital-components/print-formats/ipd/IPDDetailsEN";

import DetailsInvoiceBN from "@hospital-components/print-formats/billing/DetailsInvoiceBN";
import DetailsInvoiceEN from "@hospital-components/print-formats/billing/DetailsInvoiceEN";
import DetailsInvoicePosBN from "@hospital-components/print-formats/billing/DetailsInvoicePosBN";
import DetailsInvoicePosEN from "@hospital-components/print-formats/billing/DetailsInvoicePosEN";
import AdmissionInvoiceBN from "@hospital-components/print-formats/admission/AdmissionInvoiceBN";
import AdmissionInvoiceEN from "@hospital-components/print-formats/admission/AdmissionInvoiceEN";

const STATIC_OPD_ID = 1;
const STATIC_PRESCRIPTION_ID = 92;
const REPORT_ID = 274;

export default function Details() {
	const { name } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const { data: OPDData, isLoading: isOPDLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX}/${STATIC_OPD_ID}`,
	});

	const { data: prescriptionData, isLoading: isPrescriptionLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${STATIC_PRESCRIPTION_ID}`,
	});

	const { data: labReportData, isLoading: isReportLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.PRINT}/${REPORT_ID}`,
	});

	return (
		<>
			<Flex align="center" gap="sm" bg="gray.1" p="xxxs" fz="sm">
				<ActionIcon color="var(--theme-primary-color-6)" onClick={() => navigate(-1)}>
					<IconArrowLeft size={16} />
				</ActionIcon>
				{name}
			</Flex>
			<ScrollArea h={mainAreaHeight - 100}>
				<Box p="sm">
					{name === "OPDA4EN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<OPDA4EN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "OPDA4BN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<OPDA4BN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "OPDPosEN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<OPDPosEN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "OPDPosBN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<OPDPosBN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "EmergencyA4EN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<EmergencyA4EN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "EmergencyA4BN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<EmergencyA4BN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "EmergencyPosEN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<EmergencyPosEN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "EmergencyPosBN" && (
						<LoadingWrapper isLoading={isOPDLoading}>
							<EmergencyPosBN data={OPDData?.data} preview />
						</LoadingWrapper>
					)}
					{name === "PrescriptionFullEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<PrescriptionFullEN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "PrescriptionFullBN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<PrescriptionFullBN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "IPDDetailsBN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<IPDDetailsBN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "IPDDetailsEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<IPDDetailsEN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "IPDPrescriptionFullBN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<IPDPrescriptionFullBN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "IPDPrescriptionFullEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<IPDPrescriptionFullEN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "LabReportA4EN" && (
						<LoadingWrapper isLoading={isReportLoading}>
							<LabReportA4EN preview data={labReportData?.data} />
						</LoadingWrapper>
					)}
					{name === "LabReportA4BN" && (
						<LoadingWrapper isLoading={isReportLoading}>
							<LabReportA4BN preview data={labReportData?.data} />
						</LoadingWrapper>
					)}
					{name === "DischargeA4BN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<DischargeA4BN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "DischargeA4EN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<DischargeA4EN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "DetailsInvoiceBN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<DetailsInvoiceBN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "DetailsInvoiceEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<DetailsInvoiceEN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "DetailsInvoicePosBN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<DetailsInvoicePosBN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "DetailsInvoicePosEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<DetailsInvoicePosEN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "AdmissionInvoiceBN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<AdmissionInvoiceBN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "AdmissionInvoiceEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<AdmissionInvoiceEN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
				</Box>
			</ScrollArea>
		</>
	);
}

function LoadingWrapper({ isLoading, children }) {
	return (
		<Box pos="relative">
			<LoadingOverlay visible={isLoading} />
			{children}
		</Box>
	);
}
