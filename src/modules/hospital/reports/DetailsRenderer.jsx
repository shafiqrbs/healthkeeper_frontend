import { Box } from "@mantine/core";
import { useOutletContext, useSearchParams } from "react-router-dom";
import DashboardDailySummary from "./items/DashboardDailySummary";
import PatientTicket from "./items/PatientTicket";
import { useTranslation } from "react-i18next";
import InvoiceSummary from "@modules/hospital/reports/items/InvoiceSummary";
import StockItemHistory from "@modules/hospital/reports/items/StockItemHistory.jsx";
import MedicineIssue from "@modules/hospital/reports/items/MedicineIssue.jsx";
import StockSummery from "@modules/hospital/reports/items/StockSummery.jsx";
import DailyCollectionService from "@modules/hospital/reports/items/DailyCollectionService";
import DailyOpdEmergencyIpdPatient from "@modules/hospital/reports/items/DailyOpdEmergencyIpdPatient";
import UserDailyInvoiceSummary from "@modules/hospital/reports/items/UserDailyInvoiceSummary";
import PatientMedicineIssue from "@modules/hospital/reports/items/PatientMedicineIssue.jsx";


export default function DetailsRenderer() {
	const { t } = useTranslation();
	const [ searchParams ] = useSearchParams();
	const tab = searchParams.get("tab");
	const { mainAreaHeight } = useOutletContext();
	return (
		<Box>
			{!tab ? (
				<InvoiceSummary mainAreaHeight={mainAreaHeight} />
			) : tab === "dashboard-daily-summary" ? (
				<InvoiceSummary mainAreaHeight={mainAreaHeight} />
			) : tab === "user-daily-summary" ? (
				<UserDailyInvoiceSummary mainAreaHeight={mainAreaHeight} />
			) : tab === "patient-ticket" ? (
				<PatientTicket />
			) : tab === "daily-collection-service" ? (
				<DailyCollectionService height={mainAreaHeight} />
			) : tab === "daily-opd-emergency-ipd" ? (
				<DailyOpdEmergencyIpdPatient height={mainAreaHeight} />
			) : tab === "patient-medicine-issue" ? (
				<PatientMedicineIssue />
			) : tab === "medicine-issue" ? (
				<MedicineIssue />
			) : tab === "stock-summery" ? (
				<StockSummery />
			) : null}
		</Box>
	);
}
