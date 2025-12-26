import { ActionIcon, Box, Flex, LoadingOverlay, ScrollArea } from "@mantine/core";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import OPDA4EN from "@hospital-components/print-formats/opd/OPDA4EN";
import OPDA4BN from "@hospital-components/print-formats/opd/OPDA4BN";
import OPDPosEN from "@hospital-components/print-formats/opd/OPDPosEN";
import OPDPosBN from "@hospital-components/print-formats/opd/OPDPosBN";
import PrescriptionFullEN from "@hospital-components/print-formats/prescription/PrescriptionFullEN";
import PrescriptionFullBN from "@hospital-components/print-formats/prescription/PrescriptionFullBN";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { HOSPITAL_DATA_ROUTES, PHARMACY_DATA_ROUTES } from "@/constants/routes";
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
import InvestigationPosBN from "@hospital-components/print-formats/ipd/InvestigationPosBN";
import InvestigationPosEN from "@hospital-components/print-formats/ipd/InvestigationPosEN";

import DetailsInvoiceBN from "@hospital-components/print-formats/billing/DetailsInvoiceBN";
import DetailsInvoiceEN from "@hospital-components/print-formats/billing/DetailsInvoiceEN";
import DetailsInvoicePosBN from "@hospital-components/print-formats/billing/DetailsInvoicePosBN";
import DetailsInvoicePosEN from "@hospital-components/print-formats/billing/DetailsInvoicePosEN";
import AdmissionInvoiceBN from "@hospital-components/print-formats/admission/AdmissionInvoiceBN";
import AdmissionInvoiceEN from "@hospital-components/print-formats/admission/AdmissionInvoiceEN";
import AdmissionFormBN from "@hospital-components/print-formats/admission/AdmissionFormBN";
import AdmissionFormEN from "@hospital-components/print-formats/admission/AdmissionFormEN";
import InvoicePosBN from "@hospital-components/print-formats/billing/InvoicePosBN";
import InvoicePosEN from "@hospital-components/print-formats/billing/InvoicePosEN";
import IPDInvoicePosEN from "@hospital-components/print-formats/ipd/IPDInvoicePosEN";
import IPDInvoicePosBN from "@hospital-components/print-formats/ipd/IPDInvoicePosBN";
import FreeServiceFormBN from "@hospital-components/print-formats/billing/FreeServiceFormBN";
import FreeServiceFormEN from "@hospital-components/print-formats/billing/FreeServiceFormEN";
import Workorder from "@hospital-components/print-formats/workorder/Workorder";
import Indent from "@hospital-components/print-formats/indent/Indent";
import RefundPosBN from "@hospital-components/print-formats/refund/RefundPosBN";
import DeathCertificateBN from "@hospital-components/print-formats/death-certificate/DeathCertificateBN";
import DeathCertificateEN from "@hospital-components/print-formats/death-certificate/DeathCertificateEN";
import InvoiceSummaryReports from "@modules/hospital/reports/sales-summary/InvoiceSummaryReports";
import DailySummaryReports from "@hospital-components/print-formats/reports/DailySummaryReports";
import FreeServiceFormBedBN from "@hospital-components/print-formats/billing/FreeServiceFormBedBN";
import FreeServiceFormInvestigationBN from "@hospital-components/print-formats/billing/FreeServiceFormInvestigationBN";
import LabGroupReportA4BN from "@hospital-components/print-formats/lab-reports/LabGroupReportA4BN";

const STATIC_OPD_ID = "843042855688";
const STATIC_BILLING_ID = 2335;
const STATIC_PRESCRIPTION_ID = "361001991021";
const REPORT_ID = "098397134876";
const REPORTGROUP_ID = "14";
const REFUND_ID = "1";
const FREE_SERVICE_ID = "342955236078";
const PURCHASE_ID = "8";
const INDENT_ID = "858945689606";
const ADMISSION_ID = "1874";

export default function Details() {
	const { name } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();

	const { data: OPDData, isLoading: isOPDLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX}/${STATIC_OPD_ID}`,
	});

	const { data: IPDData, isLoading: isIPDLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${STATIC_OPD_ID}`,
	});

	const { data: prescriptionData, isLoading: isPrescriptionLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${STATIC_PRESCRIPTION_ID}`,
	});

	const { data: labReportData, isLoading: isReportLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.PRINT}/${REPORT_ID}`,
	});

	const { data: labGroupReportData, isLoading: isGroupReportLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_GROUP_TEST.PRINT}/${REPORTGROUP_ID}`,
	});


	const { data: billingData, isLoading: isBillingLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.PRINT}/${STATIC_BILLING_ID}`,
	});

	const { data: refundData, isLoading: isRefundLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.REFUND_HISTORY.PRINT}/${REFUND_ID}`,
	});

	const { data: freeServiceData, isLoading: isFreeServiceLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PATIENT_WAIVER.PRINT}/${FREE_SERVICE_ID}`,
	});

	const { data: workorderData, isLoading: isWorkorderDataLoading } = useDataWithoutStore({
		url: `${PHARMACY_DATA_ROUTES.API_ROUTES.PURCHASE.VIEW}/${PURCHASE_ID}`,
	});

	const { data: indentData, isLoading: isIndentDataLoading } = useDataWithoutStore({
		url: `${PHARMACY_DATA_ROUTES.API_ROUTES.STOCK_TRANSFER.VIEW}/${INDENT_ID}`,
	});

	const { data: admissionData, isLoading: isAdmissionDataLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.ADMISSION_VIEW}/${ADMISSION_ID}`,
	});

	const { data: summaryData, isLoading: isSummaryDataLoading } = useDataWithoutStore({
		url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.DASHBOARD_DAILY_SUMMARY,
		params: {
			start_date: "01-12-2025",
			end_date: "11-12-2025",
		},
	});

	//console.log(prescriptionData?.data)

	return (
		<>
			<Flex align="center" gap="sm" bg="gray.1" p="3xs" fz="sm">
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
							<IPDPrescriptionFullBN preview data={IPDData?.data} />
						</LoadingWrapper>
					)}
					{name === "IPDPrescriptionFullEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<IPDPrescriptionFullEN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "AdmissionFormEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<AdmissionFormEN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "AdmissionFormBN" && (
						<LoadingWrapper isLoading={isAdmissionDataLoading}>
							<AdmissionFormBN preview data={admissionData?.data} />
						</LoadingWrapper>
					)}
					{name === "AdmissionInvoiceBN" && (
						<LoadingWrapper isLoading={isAdmissionDataLoading}>
							<AdmissionInvoiceBN preview data={admissionData?.data} />
						</LoadingWrapper>
					)}
					{name === "AdmissionFormEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<AdmissionFormBN preview data={IPDData?.data} />
						</LoadingWrapper>
					)}
					{name === "IPDInvoicePosEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<IPDInvoicePosEN preview data={IPDData?.data} />
						</LoadingWrapper>
					)}
					{name === "IPDInvoicePosBN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<IPDInvoicePosBN preview data={billingData?.data} />
						</LoadingWrapper>
					)}
					{name === "InvestigationPosBN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<InvestigationPosBN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "InvestigationPosEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<InvestigationPosEN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "InvoicePosBN" && (
						<LoadingWrapper isLoading={isBillingLoading}>
							<InvoicePosBN preview data={billingData?.data} />
						</LoadingWrapper>
					)}
					{name === "InvoicePosEN" && (
						<LoadingWrapper isLoading={isPrescriptionLoading}>
							<InvoicePosEN preview data={prescriptionData?.data} />
						</LoadingWrapper>
					)}
					{name === "RefundPosEN" && (
						<LoadingWrapper isLoading={isRefundLoading}>
							<RefundPosBN preview data={refundData?.data} />
						</LoadingWrapper>
					)}
					{name === "LabReportA4EN" && (
						<LoadingWrapper isLoading={isReportLoading}>
							<LabReportA4EN preview data={labReportData?.data} />
						</LoadingWrapper>
					)}
					{name === "LabGroupReportA4EN" && (
						<LoadingWrapper isLoading={isReportLoading}>
							<LabGroupReportA4BN preview data={labGroupReportData?.data} />
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

					{name === "FreeServiceFormBN" && (
						<LoadingWrapper isLoading={isFreeServiceLoading}>
							<FreeServiceFormBN preview data={freeServiceData?.data} />
						</LoadingWrapper>
					)}
					{name === "FreeServiceFormEN" && (
						<LoadingWrapper isLoading={isFreeServiceLoading}>
							<FreeServiceFormEN preview data={freeServiceData?.data} />
						</LoadingWrapper>
					)}
					{name === "Workorder" && (
						<LoadingWrapper isLoading={isWorkorderDataLoading}>
							<Workorder preview data={workorderData?.data} />
						</LoadingWrapper>
					)}
					{name === "Indent" && (
						<LoadingWrapper isLoading={isIndentDataLoading}>
							<Indent preview data={indentData?.data} />
						</LoadingWrapper>
					)}
					{name === "DeathCertificateBN" && (
						<LoadingWrapper isLoading={isIPDLoading}>
							<DeathCertificateBN preview data={IPDData?.data} />
						</LoadingWrapper>
					)}
					{name === "DeathCertificateEN" && (
						<LoadingWrapper isLoading={isIPDLoading}>
							<DeathCertificateEN preview data={IPDData?.data} />
						</LoadingWrapper>
					)}
					{name === "SummaryReports" && (
						<LoadingWrapper isLoading={isSummaryDataLoading}>
							<DailySummaryReports preview records={summaryData?.data} />
						</LoadingWrapper>
					)}
					{name === "FreeServiceFormBedBN" && (
						<LoadingWrapper isLoading={isFreeServiceLoading}>
							<FreeServiceFormBedBN preview data={freeServiceData?.data} />
						</LoadingWrapper>
					)}
					{name === "FreeServiceFormInvestigationBN" && (
						<LoadingWrapper isLoading={isFreeServiceLoading}>
							<FreeServiceFormInvestigationBN preview data={freeServiceData?.data} />
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
