import { Box, Stack, Table, Group, Text, ScrollArea,Radio,List } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Checkbox } from "@mantine/core";
import ReportSubmission from "../ReportSubmission";
import { useOutletContext, useParams } from "react-router-dom";
import DatePickerForm from "@components/form-builders/DatePicker";
import { useTranslation } from "react-i18next";
import { modals } from "@mantine/modals";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch } from "react-redux";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { ERROR_NOTIFICATION_COLOR, MODULES, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { successNotification } from "@components/notification/successNotification";
import { formatDateForMySQL } from "@utils/index";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import {useEffect, useState} from "react";

const module = MODULES.LAB_TEST;

// =============== sars cov2 results are now handled as individual boolean properties ===============
export default function PulmonaryStatus({
	diagnosticReport,
	refetchDiagnosticReport,
	refetchLabReport,
}) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};
	const is_completed = diagnosticReport?.process === "Done";
	const [apiData, setApiData] = useState('invalid');
	const form = useForm({
		initialValues: {
			test_date: custom_report?.test_date ? new Date(custom_report.test_date) : null,
			lab_no: custom_report?.lab_no || "",
			id: custom_report?.id || "",
			rif_resistance_not_detected: custom_report?.rif_resistance_not_detected || 0,
			rif_resistance_detected: custom_report?.rif_resistance_detected || 0,
			rif_resistance_indeterminate: custom_report?.rif_resistance_indeterminate || 0,
			mtb_not_detected: custom_report?.mtb_not_detected || 0,
			invalid: custom_report?.invalid || 0,
			rif_result: "not_detected", // ✅ default selected
		},
	});

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
				data: {
					json_content: {
						...values,
						test_date: formatDateForMySQL(values.test_date),
					},
					comment: values.comment,
				},
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
					console.error("Field Error occurred!", errorObject);
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				dispatch(setRefetchData({ module, refetching: true }));
				refetchDiagnosticReport();
				if (refetchLabReport && typeof refetchLabReport === "function") {
					refetchLabReport();
				}
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	const rifOptions = [
		{ value: "not_detected", label: "T-MTB Detected, Rif Resistance not Detected" },
		{ value: "detected", label: "RR-MTB Detected, Rif Resistance Detected" },
		{ value: "indeterminate", label: "Indeterminate" },
		{ value: "mtb_not_detected", label: "MTB Not Detected" },
		{ value: "invalid", label: "Invalid" },
	];

	useEffect(() => {
		if (custom_report?.rif_result) {
			form.setFieldValue("rif_result", custom_report.rif_result);
		}
	}, [apiData]);

	return (
		<Box className="border-top-none" px="sm" mt="xs">
			<ScrollArea h={mainAreaHeight - 260} scrollbarSize={2} scrollbars="y">
				<Stack gap="md">
					<Radio.Group
						value={form.values.rif_result}
						onChange={(value) => form.setFieldValue("rif_result", value)}
						readOnly={is_completed}
					>
						<Stack gap="xs">
							{rifOptions.map((item) => (
								<Radio
									key={item.value}
									value={item.value}
									label={item.label}
								/>
							))}
						</Stack>
					</Radio.Group>

					{/* =============== results table =============== */}
					<Box my="md">
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Td colSpan={5} p={0}>
										<Radio.Group
											value={form.values?.rif_result}
											onChange={(value) => form.setFieldValue("rif_result", value)}
											readOnly={is_completed}
											style={{ width: "100%" }}
										>
											<Table withColumnBorders w="100%">
												<Table.Tr>
													<Table.Th>
														<Radio
															value="not_detected"
															label="T-MTB Detected, Rif Resistance not Detected"
														/>
													</Table.Th>
													<Table.Th>
														<Radio
															value="detected"
															label="RR-MTB Detected, Rif Resistance Detected"
														/>
													</Table.Th>

													<Table.Th>
														<Radio
															value="indeterminate"
															label="TI-MTB Detected, Rif Resistance Indeterminate"
														/>
													</Table.Th>

													<Table.Th>
														<Radio
															value="mtb_not_detected"
															label="T-MTB Not Detected"
														/>
													</Table.Th>

													<Table.Th>
														<Radio
															value="invalid"
															label="INVALID/ERROR/NO RESULT"
														/>
													</Table.Th>
												</Table.Tr>
											</Table>
										</Radio.Group>
									</Table.Td>
								</Table.Tr>

							</Table.Thead>
						</Table>
					</Box>
					{/* =============== text date =============== */}
				</Stack>
			</ScrollArea>
			<ReportSubmission
				diagnosticReport={diagnosticReport}
				form={form}
				handleSubmit={handleSubmit}
			/>
		</Box>
	);
}
