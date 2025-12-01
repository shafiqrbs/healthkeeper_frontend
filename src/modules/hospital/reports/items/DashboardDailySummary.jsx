import { getDataWithoutStore } from "@/services/apiService";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function DashboardDailySummary() {
	const [searchParams] = useSearchParams();
	const tab = searchParams.get("tab");

	useEffect(() => {
		(async () => {
			const res = await getDataWithoutStore({
				url: "hospital/reports/dashboard-daily-summary",
			});
			console.log(res);
		})();
	}, [tab]);

	return <div>DashboardDailySummary</div>;
}
