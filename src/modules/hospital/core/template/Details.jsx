import { ActionIcon, Box, Flex, LoadingOverlay, ScrollArea } from "@mantine/core";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import OPDA4EN from "@components/print-formats/opd/OPDA4EN";
import OPDA4BN from "@components/print-formats/opd/OPDA4BN";
import OPDPosEN from "@components/print-formats/opd/OPDPosEN";
import OPDPosBN from "@components/print-formats/opd/OPDPosBN";
import PrescriptionFullEN from "@components/print-formats/prescription/PrescriptionFullEN";
import PrescriptionFullBN from "@components/print-formats/prescription/PrescriptionFullBN";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { IconArrowLeft } from "@tabler/icons-react";
import IPDDetails from "@components/print-formats/ipd/IPDDetails";
import EmergencyA4EN from "@components/print-formats/emergency/EmergencyA4EN";
import EmergencyA4BN from "@components/print-formats/emergency/EmergencyA4BN";
import EmergencyPosEN from "@components/print-formats/emergency/EmergencyPosEN";
import EmergencyPosBN from "@components/print-formats/emergency/EmergencyPosBN";
import IPDPrescriptionFullBN from "@components/print-formats/ipd/IPDPrescriptionFullBN";
import IPDPrescriptionFullEN from "@components/print-formats/ipd/IPDPrescriptionFullEN";
import LabReportA4EN from "@components/print-formats/lab-reports/LabReportA4EN";
import LabReportA4BN from "@components/print-formats/lab-reports/LabReportA4BN";

const STATIC_OPD_ID = 59;
const STATIC_PRESCRIPTION_ID = 59;

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
					{name === "IPDDetails" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<IPDDetails preview data={prescriptionData?.data} />
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
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<LabReportA4EN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "LabReportA4BN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<LabReportA4BN preview data={prescriptionData?.data} />
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
