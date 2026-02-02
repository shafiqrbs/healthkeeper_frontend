import { Box, Stack, Table, Group, Text, ScrollArea, Radio } from "@mantine/core";
import { useForm } from "@mantine/form";
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
import SelectForm from "@components/form-builders/SelectForm";
import InputForm from "@components/form-builders/InputForm";

const module = MODULES.LAB_TEST;

const notions = [
	{ label: "R", value: "R" },
	{ label: "S", value: "S" },
	{ label: "C", value: "C" },
	{ label: "IN", value: "IN" },
	{ label: "NA", value: "NA" },
];

// drug columns configuration - split into two rows
const drugColumnsRow1 = [
	{ key: "dst_mtb", label: "MTB" },
	{ key: "dst_inh", label: "INH" },
	{ key: "dst_rif", label: "RIF" },
	{ key: "dst_flq", label: "FLQ" },
	{ key: "dst_lfx", label: "LFX" },
];

const drugColumnsRow2 = [
	{ key: "dst_mfx", label: "MFX" },
	{ key: "dst_eth", label: "ETH" },
	{ key: "dst_bdq", label: "BDQ" },
	{ key: "dst_dlm", label: "DLM" },
	{ key: "dst_pa", label: "PA" },
];

const drugColumnsRow3 = [
	{ key: "dst_lzd", label: "LZD" },
	{ key: "dst_cfz", label: "CFZ" },
	{ key: "dst_amk", label: "AMK" },
	{ key: "dst_kan", label: "KAN" },
	{ key: "dst_cap", label: "CAP" },
];

// =============== DST (Drug Susceptibility Testing) results ===============
export default function DST({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};

	const form = useForm({
		initialValues: {
			sample_id: custom_report?.sample_id || '',
			test_id: custom_report?.test_id || '',
			test_date: custom_report?.test_date
				? new Date(custom_report.test_date)
				: null,
			date_specimen_received: custom_report?.date_specimen_received
				? new Date(custom_report.date_specimen_received)
				: null,
			id: diagnosticReport?.particular?.id || 0,
			sample_type: custom_report?.sample_type || "",
			lab_no: custom_report?.lab_no || "",
			dst_method: custom_report?.dst_method || "lj",
			dst_id: custom_report?.dst_id || "",
			dst_mtb: custom_report?.dst_mtb || "",
			dst_inh: custom_report?.dst_inh || "",
			dst_rif: custom_report?.dst_rif || "",
			dst_flq: custom_report?.dst_flq || "",
			dst_lfx: custom_report?.dst_lfx || "",
			dst_mfx: custom_report?.dst_mfx || "",
			dst_eth: custom_report?.dst_eth || "",
			dst_bdq: custom_report?.dst_bdq || "",
			dst_dlm: custom_report?.dst_dlm || "",
			dst_pa: custom_report?.dst_pa || "",
			dst_lzd: custom_report?.dst_lzd || "",
			dst_cfz: custom_report?.dst_cfz || "",
			dst_amk: custom_report?.dst_amk || "",
			dst_kan: custom_report?.dst_kan || "",
			dst_cap: custom_report?.dst_cap || "",
			dst_others: custom_report?.dst_others || "",
			comment: diagnosticReport?.comment || "",
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
						date_specimen_received: formatDateForMySQL(values.date_specimen_received),
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
						errorObject[ key ] = fieldErrors[ key ][ 0 ];
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

	return (
		<Box className="border-top-none" px="sm" mt="xs">
			<ScrollArea h={mainAreaHeight - 260} scrollbarSize={2} scrollbars="y">
				<Stack gap="md">
					<Group grow>
						{/* =============== genexpert site/hospital =============== */}
						<DatePickerForm
							name="date_specimen_received"
							id="date_specimen_received"
							nextField="comment"
							form={form}
							label="Receive Date"
							placeholder="Select receive date"
						/>
						<DatePickerForm
							name="test_date"
							id="test_date"
							nextField="comment"
							form={form}
							label="Test Date"
							placeholder="Select date"
						/>
						<InputNumberForm
							name="sample_id"
							id="sample_id"
							nextField="id"
							form={form}
							label="Sample ID"
							placeholder="Enter Sample ID"
						/>
						<InputNumberForm
							name="test_id"
							id="test_id"
							nextField="id"
							form={form}
							label="Lab Test ID"
							placeholder="Enter Lab Test ID"
						/>

					</Group>
					{/* =============== method used =============== */}
					<Box my="md">
						<Text size="sm" fw={500} mb="xs">
							Method Used:
						</Text>
						<Radio.Group
							value={form.values?.dst_method}
							onChange={(value) => form.setFieldValue("dst_method", value)}
							style={{ width: "100%" }}
						>
							<Table withColumnBorders withTableBorder w="100%">
								<Table.Tbody>
									<Table.Tr>
										<Table.Th>
											<Radio value="lj" label="Proportion method (LJ)" />
										</Table.Th>
										<Table.Th>
											<Radio value="mgit" label="Liquid (MGIT)" />
										</Table.Th>
										<Table.Th>
											<Radio value="lpa" label="Line Probe Assay (LPA)" />
										</Table.Th>
										<Table.Th>
											<Radio value="xdr" label="Xpert XDR" />
										</Table.Th>
									</Table.Tr>
								</Table.Tbody>
							</Table>
						</Radio.Group>
					</Box>

					{/* =============== notation legend =============== */}
					<Box my="xs">
						<Text size="sm" fw={500}>
							Notation: (R= Resistance Detected; S= Resistance Not Detected; C= Contaminated; IN=
							Indeterminate/Non-interpretable; NA= Not Done)
						</Text>
					</Box>

					{/* =============== DTS results table =============== */}
					<Box mb="md">
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Tbody>
								{/* Row 1: Headings and Selects for row1 */}
								<Table.Tr>
									{drugColumnsRow1.map((drug) => (
										<Table.Td key={drug.key} ta="center">
											<Text fw={600} size="sm" mb="xs">
												{drug.label}
											</Text>
											<SelectForm
												name={drug.key}
												id={drug.key}
												form={form}
												dropdownValue={notions}
												placeholder="Select"
												clearable={true}
												allowDeselect={true}
												searchable={false}
												withCheckIcon={false}
											/>
										</Table.Td>
									))}
								</Table.Tr>
								<Table.Tr>
									{drugColumnsRow2.map((drug) => (
										<Table.Td key={drug.key} ta="center">
											<Text fw={600} size="sm" mb="xs">
												{drug.label}
											</Text>
											<SelectForm
												name={drug.key}
												id={drug.key}
												form={form}
												dropdownValue={notions}
												placeholder="Select"
												clearable={true}
												allowDeselect={true}
												searchable={false}
												withCheckIcon={false}
											/>
										</Table.Td>
									))}
								</Table.Tr>
								{/* Row 2: Headings and Selects for row2 */}
								<Table.Tr>
									{drugColumnsRow3.map((drug) => (
										<Table.Td key={drug.key} ta="center">
											<Text fw={600} size="sm" mb="xs">
												{drug.label}
											</Text>
											<SelectForm
												name={drug.key}
												id={drug.key}
												form={form}
												dropdownValue={notions}
												placeholder="Select"
												clearable={true}
												allowDeselect={true}
												searchable={false}
												withCheckIcon={false}
											/>
										</Table.Td>
									))}
								</Table.Tr>
								<Table.Tr>
									<Table.Td ta="center">
										<Text fw={600}>OTHERS</Text>
									</Table.Td>
									<Table.Td ta="center" colSpan={4}>
										<InputForm
											name="dst_others"
											id="dst_others"
											form={form}
											placeholder="Enter Others"
										/>
									</Table.Td>
								</Table.Tr>
							</Table.Tbody>
						</Table>
					</Box>
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} handleSubmit={handleSubmit} />
		</Box>
	);
}
