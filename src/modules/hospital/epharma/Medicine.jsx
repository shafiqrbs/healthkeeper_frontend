import { getDataWithoutStore } from "@/services/apiService";
import {Box, Text, ScrollArea, Stack, Grid, TextInput, Flex, Button, Center} from "@mantine/core";
import { useEffect, useState,useRef } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import {HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES} from "@/constants/routes";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import {IconChevronUp, IconSelector, IconPrinter, IconThumbUp,IconThumbDown} from "@tabler/icons-react";
import { formatDate } from "@/common/utils";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import {useForm} from "@mantine/form";
import {getFormValues} from "@modules/hospital/lab/helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import {modals} from "@mantine/modals";
import {storeEntityData, updateEntityData} from "@/app/store/core/crudThunk";
import {setRefetchData} from "@/app/store/core/crudSlice";
import {successNotification} from "@components/notification/successNotification";
import {ERROR_NOTIFICATION_COLOR, MODULES_CORE, SUCCESS_NOTIFICATION_COLOR} from "@/constants";
import {errorNotification} from "@components/notification/errorNotification";
import {useDispatch} from "react-redux";
import {useHotkeys} from "@mantine/hooks";

const module = MODULES_CORE.LAB_USER;
export default function Medicine({entity}) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const inputsRef = useRef([]);
	const { mainAreaHeight } = useOutletContext();
	const form = useForm(getFormValues(t));
	const [submitFormData, setSubmitFormData] = useState({});
	const [updatingRows, setUpdatingRows] = useState({});
	const { id, reportId } = useParams();
	const safe = (value) => (value === null || value === undefined || value === "" ? "-" : String(value));

	const handleRowSubmit = () => {};
	const handleFieldChange = async (rowId, field, value) => {

		setSubmitFormData((prev) => ({
			...prev,
			[rowId]: { ...prev[rowId], [field]: value },
		}));
		setUpdatingRows((prev) => ({ ...prev, [rowId]: true }));
		try {
			await dispatch(
				storeEntityData({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.INLINE_UPDATE}/${rowId}`,
					data: { [field]: value },
					module,
				})
			);
		} catch (error) {
			errorNotification(error.message);
		} finally {
			setUpdatingRows((prev) => ({ ...prev, [rowId]: false }));
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Enter") {
			e.preventDefault(); // prevent form submit
			const nextInput = inputsRef.current[index + 1];
			if (nextInput) {
				nextInput.focus(); // move to next
			}
		}
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
				successNotification(t("UpdateSuccessfully"),SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message,ERROR_NOTIFICATION_COLOR);
		}
	}
	useHotkeys(
		[
			["alt+s", () => document.getElementById("EntityFormSubmit").click()],
		],
		[]
	);

	return (
		<Box className="borderRadiusAll" bg="white">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("Medicines")}
				</Text>
			</Box>
			{entity?.sales_items ? (
				<>
					<Box className="border-top-none" px="sm" mt={'xs'}>
							<DataTable
								striped
								highlightOnHover
								pinFirstColumn
								stripedColor="var(--theme-tertiary-color-1)"
								classNames={{
									root: tableCss.root,
									table: tableCss.table,
									header: tableCss.header,
									footer: tableCss.footer,
									pagination: tableCss.pagination,
								}}
								records={entity?.sales_items || []}
								columns={[
									{
										accessor: "index",
										title: t("S/N"),
										textAlignment: "right",
										render: (_, index) => index + 1,
									},
									{
										accessor: "name",
										title: t("Name"),
									},
									{
										accessor: "quantity",
										width: "200px",
										title: t("Quantity"),
										render: (item) => (
											entity.process === "Done" ?
												item.result
												:
												<>
													<TextInput
														size="xs"
														fz="xs"
														value={item?.quantity}
														ref={(el) => (inputsRef.current[item.id] = el)}
														onKeyDown={(e) => handleKeyDown(e, item.id)}
														onBlur={(e) =>
															handleFieldChange(item.id, "quantity", e.target.value)
														}
													/>
												</>
										),
									},
									{
										accessor: "uom",
										title: t("Unit"),
									},
									{
										accessor: "action",
										title: "",
										render: (item) => (
											<Center>
												<Button.Group>
												<Button
													onClick={() => handleRowSubmit(item.id)}
													variant="filled"
													fw={400}
													size="compact-xs"
													radius="es"
													className="btnPrimaryBg"
													leftSection={<IconThumbUp size={16} />}
												>{t("Accept")}</Button>
												<Button
													onClick={() => handleRowSubmit(item.id)}
													variant="filled"
													fw={400}
													size="compact-xs"
													radius="es"
													bg={'red'}
													leftSection={<IconThumbDown size={16} />}
												>{t("Omit")}</Button>
													</Button.Group>
											</Center>
										),
									},

								]}
								loaderSize="xs"
								loaderColor="grape"
								height={mainAreaHeight-72}
								sortIcons={{
									sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
									unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
								}}
							/>
						</Box>
				</>
			) : (
				<Box bg="white" >
					<Stack
						h={mainAreaHeight - 154}
						bg="var(--mantine-color-body)"
						align="center"
						justify="center"
						gap="md"
					>
						{t('NoTestSelected')}
					</Stack>
				</Box>
			)}
		</Box>
	);
}
