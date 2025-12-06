import { Box, Text, ScrollArea, Stack, Button, Flex, LoadingOverlay } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { IconEye, IconPrinter, IconTag } from "@tabler/icons-react";
import { formatDate } from "@utils/index";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { useRef, useState } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import LabReportA4BN from "@hospital-components/print-formats/lab-reports/LabReportA4BN";
import CustomDivider from "@components/core-component/CustomDivider";
import { getDataWithoutStore } from "@/services/apiService";

const ALLOWED_LAB_ROLES = ["doctor_lab", "lab_assistant", "admin_administrator"];
const ALLOWED_LAB_DOCTOR_ROLES = ["doctor_lab", "admin_administrator"];

export default function Test({ entity, isLoading, refetchDiagnosticReport }) {
	const { userRoles } = useAppLocalStore();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const test = entity;
	const { id, reportId } = useParams();
	const navigate = useNavigate();
	const barCodeRef = useRef(null);
	const [barcodeValue, setBarcodeValue] = useState("");
	const labReportRef = useRef(null);
	const [labReportData, setLabReportData] = useState(null);
	const [customReportName, setCustomeReportName] = useState(null);

	const printLabReport = useReactToPrint({
		content: () => labReportRef.current,
	});

	const printBarCodeValue = useReactToPrint({
		content: () => barCodeRef.current,
	});
	const handleTest = (report_id) => {
		refetchDiagnosticReport();
		navigate(
			`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.LAB_TEST.VIEW}/${id}/report/${report_id}`,
			{ replace: true }
		);
	};

	const handleLabReport = async (id, reportSlug) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.PRINT}/${id}`,
		});
		setCustomeReportName(reportSlug);
		setLabReportData(res?.data);
		requestAnimationFrame(printLabReport);
	};

	async function handleBarcodeTag(barcode, report_id) {
		await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.TAG_PRINT}/${report_id}`,
		});
		setBarcodeValue(report_id);
		refetchDiagnosticReport();
		requestAnimationFrame(printBarCodeValue);
	}

	return (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("Test")}
				</Text>
			</Box>

			{id ? (
				<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 148} pos="relative">
					<LoadingOverlay
						visible={isLoading}
						zIndex={1000}
						overlayProps={{ radius: "sm", blur: 2 }}
					/>
					<Stack className="form-stack-vertical" p="xs">
						{test?.invoice_transaction?.map((transaction, index) => (
							<Box
								key={index}
								className="borderRadiusAll"
								bg="var(--mantine-color-white)"
							>
								<Box fz={"xs"} fw={"600"} p="sm">
									{t("Date")} : {formatDate(transaction?.created_at)}
								</Box>
								<CustomDivider />
								{transaction?.items?.map((item, index) => (
									<Box
										p={"xs"}
										key={index}
										bg={
											reportId == item.invoice_particular_id
												? "var(--theme-primary-color-1)"
												: "var(--mantine-color-white)"
										}
									>
										<Text fz="xs">{item.item_name}</Text>
										<Text fz="xs">Status:{item?.process}</Text>
										<Flex align="center" gap="mes" mt="xs">
											{userRoles.some((role) =>
												ALLOWED_LAB_ROLES.includes(role)
											) && (
												<>
													{item?.process === "Tagged" &&
														userRoles.some((role) =>
															ALLOWED_LAB_ROLES.includes(role)
														) && (
															<Button
																onClick={() =>
																	handleTest(
																		item.invoice_particular_id
																	)
																}
																size="compact-xs"
																bg="var(--theme-primary-color-6)"
																color="white"
															>
																{t("Process")}
															</Button>
														)}
													{item?.process === "In-progress" &&
														userRoles.some((role) =>
															ALLOWED_LAB_DOCTOR_ROLES.includes(role)
														) && (
															<Button
																onClick={() =>
																	handleTest(
																		item.invoice_particular_id
																	)
																}
																size="compact-xs"
																bg="var(--theme-warn-color-6)"
																color="white"
															>
																{t("Confirm")}
															</Button>
														)}
													{item?.process === "Done" && (
														<>
															<Button
																onClick={() =>
																	handleTest(
																		item.invoice_particular_id
																	)
																}
																size="compact-xs"
																bg="var(--theme-primary-color-6)"
																color="white"
																leftSection={
																	<IconEye
																		color="white"
																		size={16}
																	/>
																}
															>
																{t("Show")}
															</Button>
															<Button
																size="compact-xs"
																bg="var(--theme-secondary-color-6)"
																onClick={() =>
																	handleLabReport(
																		item?.invoice_particular_id,
																		"covid-19"
																	)
																}
																color="white"
																leftSection={
																	<IconPrinter
																		color="white"
																		size={16}
																	/>
																}
															>
																{t("Print")}
															</Button>
														</>
													)}
													{item?.process == "New" && (
														<Button
															leftSection={
																<IconTag stroke={1.2} size={12} />
															}
															onClick={() =>
																handleBarcodeTag(
																	item?.barcode,
																	item?.invoice_particular_id
																)
															}
															size="compact-xs"
															bg="var(--theme-secondary-color-6)"
															color="white"
														>
															{t("Tag")}
														</Button>
													)}
												</>
											)}
										</Flex>
									</Box>
								))}
							</Box>
						))}
					</Stack>
				</ScrollArea>
			) : (
				<Stack
					h={mainAreaHeight - 154}
					bg="var(--mantine-color-body)"
					align="center"
					justify="center"
					gap="md"
				>
					<Box>{t("NoPatientSelected")}</Box>
				</Stack>
			)}

			{/* ----------- barcode generator ---------- */}
			<Box display="none">
				<Box ref={barCodeRef} mx="auto">
					<Barcode
						fontSize="10"
						width="1"
						height="30"
						value={barcodeValue || "BARCODETEST"}
					/>
				</Box>
			</Box>
			{customReportName === "covid-19" ? (
				<LabReportA4BN data={labReportData} ref={labReportRef} />
			) : customReportName === "gene-sputum" ? (
				<LabReportA4BN data={labReportData} ref={labReportRef} />
			) : (
				<LabReportA4BN data={labReportData} ref={labReportRef} />
			)}
		</Box>
	);
}
