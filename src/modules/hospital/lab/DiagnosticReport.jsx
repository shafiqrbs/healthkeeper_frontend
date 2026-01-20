import { getDataWithoutStore } from "@/services/apiService";
import { Box, Text, Stack } from "@mantine/core";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useHotkeys } from "@mantine/hooks";
import ReportRenderer from "./common/ReportRenderer";
import useAppLocalStore from "@hooks/useAppLocalStore";

const ALLOWED_LAB_ROLES = [ "doctor_lab", "lab_assistant" ];

export default function DiagnosticReport({ refetchDiagnosticReport, refreshKey }) {
	const { userRoles } = useAppLocalStore();
	const { t } = useTranslation();
	const inputsRef = useRef([]);
	const { mainAreaHeight } = useOutletContext();
	const [ diagnosticReport, setDiagnosticReport ] = useState([]);

	const { id, reportId } = useParams();
	const [ fetching, setFetching ] = useState(false);

	const fetchLabReport = useCallback(async () => {
		setFetching(true);
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.INDEX}/${id}/report/${reportId}`,
		});
		setDiagnosticReport(res?.data);
		setFetching(false);
	}, [ id, reportId ]);

	useEffect(() => {
		if (id && reportId) {
			fetchLabReport();
		}
	}, [ id, reportId, fetchLabReport ]);

	useHotkeys([ [ "alt+s", () => document.getElementById("EntityFormSubmit").click() ] ], []);


	return (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)" h={mainAreaHeight - 96}>
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("DiagnosticReportPrepared")}: {diagnosticReport?.name}
				</Text>
			</Box>
			{reportId && userRoles.some((role) => ALLOWED_LAB_ROLES.includes(role)) ? (
				<ReportRenderer
					refetchDiagnosticReport={refetchDiagnosticReport}
					diagnosticReport={diagnosticReport}
					fetching={fetching}
					refreshKey={refreshKey}
					inputsRef={inputsRef}
					refetchLabReport={fetchLabReport}
				/>
			) : (
				<Box bg="var(--mantine-color-white)">
					<Stack
						h={mainAreaHeight - 154}
						bg="var(--mantine-color-body)"
						align="center"
						justify="center"
						gap="md"
					>
						{t("NotAvailableForView")}
					</Stack>
				</Box>
			)}
		</Box>
	);
}
