import { Box, Text, ScrollArea, Stack, Button, Flex, ActionIcon, LoadingOverlay } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { IconEye, IconPrinter, IconTag } from "@tabler/icons-react";
import { getUserRole } from "@utils/index";
import { useRef, useState } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import LabReportA4BN from "@components/print-formats/lab-reports/LabReportA4BN";

const ALLOWED_LAB_ROLES = ["doctor_lab", "lab_assistant", "admin_administrator"];
const ALLOWED_LAB_DOCTOR_ROLES = ["doctor_lab", "admin_administrator"];

export default function Test({ entity, isLoading }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const test = entity;
	const { id } = useParams();
	const navigate = useNavigate();
	const userRoles = getUserRole();
	const barCodeRef = useRef(null);
	const [barcodeValue, setBarcodeValue] = useState("");
	const labReportRef = useRef(null);
	const [labReportData, setLabReportData] = useState(null);

	const printLabReport = useReactToPrint({
		content: () => labReportRef.current,
	});
	const printBarCodeValue = useReactToPrint({
		content: () => barCodeRef.current,
	});

	const handleTest = (reportId) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.LAB_TEST.VIEW}/${id}/report/${reportId}`);
	};

	const handleLabReport = (id) => {
		setLabReportData({ id });
		requestAnimationFrame(printLabReport);
	};

	const handleBarcodeTag = (barcode) => {
		setBarcodeValue(barcode);
		requestAnimationFrame(() => printBarCodeValue());
	};

	const handleSubmit = (values) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmModal(values),
		});
	};

	async function handleConfirmModal(values) {
		try {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.UPDATE}/${reportId}`,
				data: values,
				module,
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				dispatch(setRefetchData({ module, refetching: true }));
				refetchDiagnosticReport();
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				setRefetch(true);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	return (
		<Box className="borderRadiusAll" bg="white">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("Test")}
				</Text>
			</Box>

			{id ? (
				<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 154} pos="relative">
					<LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
					<Stack className="form-stack-vertical" p="xs">
						{test?.invoice_particular?.map((item, index) => (
							<Box key={index} className="borderRadiusAll" bg={"white"} p="sm">
								<Text fz="sm">{item.item_name}</Text>
								<Text fz="xs">Status:{item?.process}</Text>
								<Flex align="center" gap="mes" mt="xs">
									{userRoles.some((role) => ALLOWED_LAB_ROLES.includes(role)) && (
										<>
											{item?.process === "New" &&
												userRoles.some((role) => ALLOWED_LAB_ROLES.includes(role)) && (
													<Button
														onClick={() => handleTest(item.invoice_particular_id)}
														size="xs"
														bg="var(--theme-primary-color-6)"
														color="white"
													>
														{t("Process")}
													</Button>
												)}
											{item?.process === "In-progress" &&
												userRoles.some((role) => ALLOWED_LAB_DOCTOR_ROLES.includes(role)) && (
													<Button
														onClick={() => handleTest(item.invoice_particular_id)}
														size="xs"
														bg="var(--theme-primary-color-6)"
														color="white"
													>
														{t("Confirm")}
													</Button>
												)}
											{item?.process === "Done" ? (
												<>
													<Button
														onClick={() => handleTest(item.invoice_particular_id)}
														size="xs"
														bg="var(--theme-primary-color-6)"
														color="white"
														leftSection={<IconEye color="white" size={16} />}
													>
														{t("Show")}
													</Button>
													<Button
														size="xs"
														bg="var(--theme-secondary-color-6)"
														onClick={() => handleLabReport(item.invoice_particular_id)}
														color="white"
														leftSection={<IconPrinter color="white" size={16} />}
													>
														{t("Print")}
													</Button>
												</>
											) : (
												<Button
													leftSection={<IconTag stroke={1.5} size={16} />}
													onClick={() => handleBarcodeTag(item.barcode)}
													size="xs"
													bg="var(--mantine-color-teal-6)"
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
					</Stack>
				</ScrollArea>
			) : (
				<Stack h={mainAreaHeight - 154} bg="var(--mantine-color-body)" align="center" justify="center" gap="md">
					<Box>{t("NoPatientSelected")}</Box>
				</Stack>
			)}

			{/* ----------- barcode generator ---------- */}
			<Box display="none">
				<Box ref={barCodeRef}>
					<Barcode fontSize="12" width="1" height="40" value={barcodeValue || "BARCODETEST"} />
				</Box>
			</Box>

			<LabReportA4BN data={labReportData} ref={labReportRef} />
		</Box>
	);
}
