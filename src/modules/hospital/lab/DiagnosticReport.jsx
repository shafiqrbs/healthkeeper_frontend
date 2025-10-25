import { getDataWithoutStore } from "@/services/apiService";
import { Box, Text, Stack } from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useHotkeys } from "@mantine/hooks";
import ReportRenderer from "./common/ReportRenderer";

export default function DiagnosticReport({ refetchDiagnosticReport }) {
	const { t } = useTranslation();
	const inputsRef = useRef([]);
	const { mainAreaHeight } = useOutletContext();
	const [diagnosticReport, setDiagnosticReport] = useState([]);

	const { id, reportId } = useParams();
	const [fetching, setFetching] = useState(false);
	const [refetch, setRefetch] = useState(false);

	useEffect(() => {
		if (id && reportId) {
			fetchLabReport();
		}
	}, [id, reportId]);

	useEffect(() => {
		if (refetch) {
			fetchLabReport();
			setRefetch(false);
		}
	}, [refetch]);

	async function fetchLabReport() {
		setFetching(true);
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.INDEX}/${id}/report/${reportId}`,
		});
		setDiagnosticReport(res?.data);
		setFetching(false);
	}

	useHotkeys([["alt+s", () => document.getElementById("EntityFormSubmit").click()]], []);

	return (
		<Box className="borderRadiusAll" bg="white">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("DiagnosticReportPrepared")}: {diagnosticReport?.name}
				</Text>
			</Box>
			{reportId ? (
				<ReportRenderer
					refetchDiagnosticReport={refetchDiagnosticReport}
					diagnosticReport={diagnosticReport}
					setDiagnosticReport={setDiagnosticReport}
					fetching={fetching}
					inputsRef={inputsRef}
				/>
			) : (
				<Box bg="white">
					<Stack
						h={mainAreaHeight - 154}
						bg="var(--mantine-color-body)"
						align="center"
						justify="center"
						gap="md"
					>
						{t("NoTestSelected")}
					</Stack>
				</Box>
			)}
		</Box>
	);
}
