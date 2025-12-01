import { Box } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import DashboardDailySummary from "./items/DashboardDailySummary";
import PatientTicket from "./items/PatientTicket";
import { useTranslation } from "react-i18next";

export default function DetailsRenderer() {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const tab = searchParams.get("tab");

	if (!tab) return <Box>{t("NoDataSelected")}</Box>;

	return (
		<Box>
			{tab === "dashboard-daily-summary" ? (
				<DashboardDailySummary />
			) : tab === "patient-ticket" ? (
				<PatientTicket />
			) : null}
		</Box>
	);
}
