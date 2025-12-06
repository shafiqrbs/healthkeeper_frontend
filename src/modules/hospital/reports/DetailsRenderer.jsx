import { Box } from "@mantine/core";
import {useOutletContext, useSearchParams} from "react-router-dom";
import DashboardDailySummary from "./items/DashboardDailySummary";
import PatientTicket from "./items/PatientTicket";
import { useTranslation } from "react-i18next";
import InvoiceSummary from "@modules/hospital/reports/items/InvoiceSummary";

export default function DetailsRenderer() {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const tab = searchParams.get("tab");
	const { mainAreaHeight } = useOutletContext();
	return (
		<Box>
			{!tab ? (
				<DashboardDailySummary height={mainAreaHeight} />
			) : tab === "dashboard-daily-summary" ? (
				<InvoiceSummary />
			) : tab === "patient-ticket" ? (
				<PatientTicket />
			) : null}
		</Box>
	);
}
