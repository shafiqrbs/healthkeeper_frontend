import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getDataWithoutStore } from "@/services/apiService";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function DashboardDailySummary() {
	const [searchParams] = useSearchParams();
	const tab = searchParams.get("tab");

	useEffect(() => {
		(async () => {
			const res = await getDataWithoutStore({
				url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.DASHBOARD_DAILY_SUMMARY,
			});
			console.log(res);
		})();
	}, [tab]);

	return <div>DashboardDailySummary</div>;
}
