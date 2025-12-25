import { getDataWithoutStore } from "@/services/apiService";
import { Box, Text, Stack, Grid, Flex, Button, ActionIcon } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import { IconChevronUp, IconPrinter, IconSelector, IconX } from "@tabler/icons-react";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useForm } from "@mantine/form";
import { getFormValues } from "@modules/hospital/lab/helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { modals } from "@mantine/modals";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, MODULES_CORE, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { useDispatch } from "react-redux";
import { useHotkeys } from "@mantine/hooks";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice";
import { useReactToPrint } from "react-to-print";
import usePrintAfterUpdate from "@hooks/usePrintAfterUpdate";
import InvoicePosBN from "@hospital-components/print-formats/billing/InvoicePosBN";
import AdmissionInvoiceBN from "@hospital-components/print-formats/admission/AdmissionInvoiceBN";
import IPDInvoicePosBn from "@hospital-components/print-formats/ipd/IPDInvoicePosBN";

const module = MODULES_CORE.BILLING;

export default function InvoiceDetails({ entity, setRefetchBillingKey }) {
	const navigate = useNavigate();
	const [invoiceDetails, setInvoiceDetails] = useState([]);
	const { id } = useParams();
	const [fetching, setFetching] = useState(false);
	const [selectedRecords, setSelectedRecords] = useState([]);
	const [investigationRecords, setInvestigationRecords] = useState([]);
	const [roomItems, setRoomItems] = useState([]);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const invoicePrintRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });

	// =============== separate forms for investigation and room submissions ================
	const investigationForm = useForm({
		...getFormValues(t),
		initialValues: {
			...getFormValues(t).initialValues,
			amount: "",
		},
	});
	const roomForm = useForm({
		...getFormValues(t),
		initialValues: {
			...getFormValues(t).initialValues,
			amount: "",
			days: "",
		},
	});

	const { data: investigationOptions } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.INVESTIGATION.PATH,
		params: { "dropdown-type": CORE_DROPDOWNS.INVESTIGATION.TYPE },
		utility: CORE_DROPDOWNS.INVESTIGATION.UTILITY,
		identifierName: "investigation",
	});

	useEffect(() => {
		if (id) {
			setFetching(true);
			(async () => {
				const res = await getDataWithoutStore({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.INDEX}/${id}`,
				});
				// =============== reset both forms after fetching invoice details ================
				investigationForm.reset();
				roomForm.reset();
				setInvoiceDetails(res?.data);
				setFetching(false);
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	// =============== initialize local investigations from entity to allow local editing ================
	useEffect(() => {
		const initialInvestigations = Array.isArray(entity?.invoice_particular) ? entity.invoice_particular : [];
		setInvestigationRecords(
			initialInvestigations.map((item) => ({
				id: item?.id,
				particular_id: item?.particular_id,
				name: item.name ?? item.label ?? "",
				quantity: item.quantity ?? 1,
				price: item.price ?? 0,
				is_new: item.process === "New",
			}))
		);
	}, [entity]);

	// =============== auto-select all records when investigation records are available ================
	useEffect(() => {
		if (investigationRecords?.length > 0) {
			setSelectedRecords([...investigationRecords]);
		} else {
			setSelectedRecords([]);
		}
	}, [investigationRecords]);

	// =============== prevent unchecking records by only allowing additions to selection ================
	const handleSelectedRecordsChange = (newSelectedRecords) => {
		// =============== only allow adding records, prevent removing existing selections ================
		const currentSelectedIds = new Set(selectedRecords.map((record) => record.id));
		const newSelectedIds = new Set(newSelectedRecords.map((record) => record.id));

		// =============== if trying to remove records, keep the current selection ================
		if (newSelectedIds.size < currentSelectedIds.size) {
			return; // =============== prevent unchecking by ignoring the change ================
		}

		// =============== allow adding new records ================
		setSelectedRecords(newSelectedRecords);
	};

	// =============== initialize local room items from fetched invoice details to allow local editing ================
	useEffect(() => {
		const initialItems = Array.isArray(invoiceDetails?.items) ? invoiceDetails.items : [];
		setRoomItems(initialItems);
	}, [invoiceDetails]);

	// =============== create submit handler bound to a specific form and payload source ================
	const createSubmitHandler = (targetForm, payloadSource) => (values) => {
		let jsonContent = [];

		if (payloadSource === "room") {
			const allRoomItems = roomItems || [];
			jsonContent = allRoomItems.map((item) => ({
				...item,
				is_selected: true,
			}));
		}

		const extendedValues = {
			...values,
			total:
				payloadSource === "investigation" ? investigationSubtotal : payloadSource === "room" ? roomSubtotal : 0,
			json_content: jsonContent,
		};

		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmModal(extendedValues, targetForm),
		});
	};

	async function handleConfirmModal(values, targetForm) {
		try {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.UPDATE}/${id}`,
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
					targetForm?.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				dispatch(setRefetchData({ module, refetching: true }));
				setInvoiceDetails(resultAction.payload.data?.data);
				setInvestigationRecords([]);
				// navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.ADMISSION_BILLING.INDEX, { replace: true });
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				setInvoicePrintData(resultAction.payload.data?.data);
				setRefetchBillingKey((prev) => prev + 1);
				setSelectedRecords([]);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	const handlePrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.REFUND_HISTORY.PRINT}/${id}`,
		});
		setInvoicePrintData(res?.data);
	};
	useEffect(() => {
		if(invoicePrintData){
			invoicePrint();
		}
	}, [invoicePrintData]);

	useHotkeys(
		[
			[
				"alt+s",
				() => {
					const submitButton =
						document.getElementById("EntityFormSubmitInvestigation") ||
						document.getElementById("EntityFormSubmitRoom");
					if (submitButton) {
						submitButton.click();
					}
				},
			],
		],
		[]
	);

	// =============== compute totals from local state (only selected investigations) ================
	const investigationSubtotal = useMemo(() => {
		const recordsToSum = (selectedRecords || []).length ? selectedRecords : [];
		return recordsToSum.reduce((accumulator, record) => {
			const quantity = Number(record?.quantity ?? 0);
			const price = Number(record?.price ?? 0);
			return accumulator + quantity * price;
		}, 0);
	}, [selectedRecords]);

	const roomSubtotal = useMemo(() => {
		return (roomItems || []).reduce((accumulator, item) => {
			const subtotal = Number(item?.subtotal ?? Number(item?.days ?? 0) * Number(item?.price ?? 0));
			return accumulator + subtotal;
		}, 0);
	}, [roomItems]);

	// =============== compute receive/due/return for investigation and room ================
	useHotkeys([["alt+p", createSubmitHandler]]);

	return (
		<Box pos="relative" className="borderRadiusAll" bg="var(--mantine-color-white)">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("InvoiceDetails")}
				</Text>
			</Box>
			<Box className="border-top-none" px="sm" mt="xs">
				<DataTable
					striped
					highlightOnHover
					pinFirstColumn
					stripedColor="var(--theme-tertiary-color-1)"
					selectedRecords={selectedRecords}
					onSelectedRecordsChange={handleSelectedRecordsChange}
					getRecordId={(record) => record.id}
					selectionCheckboxProps={() => ({
						disabled: true, // =============== disable all checkboxes to prevent unchecking ================
					})}
					selectionColumnStyle={{ minWidth: 80 }}
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						header: tableCss.header,
						footer: tableCss.footer,
						pagination: tableCss.pagination,
					}}
					records={investigationRecords || []}
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
							title: t("Quantity"),
							render: (record) => record?.quantity || 1,
						},
						{
							accessor: "price",
							title: t("Price"),
						},
						{
							accessor: "subtotal",
							title: t("SubTotal"),
							render: (record) => record?.price * record?.quantity || 0,
						},
						// {
						// 	accessor: "actions",
						// 	title: t("Action"),
						// 	textAlignment: "center",
						// 	render: (record) =>
						// 		record.is_new ? (
						// 			<ActionIcon
						// 				color="red"
						// 				variant="subtle"
						// 				onClick={() => handleRemoveInvestigation(record.id)}
						// 			>
						// 				{/* =============== user can remove only newly added investigations ================ */}
						// 				<IconX size={16} />
						// 			</ActionIcon>
						// 		) : null,
						// },
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={mainAreaHeight - 152}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
			{investigationRecords?.length > 0 && (
				// =============== investigation-specific form: comment, display total, receive, submit ================
				<Box gap={0} justify="space-between" mt="xs" px="xs" pb="xs" bg="var(--mantine-color-white)">
					<form
						onSubmit={investigationForm.onSubmit(createSubmitHandler(investigationForm, "investigation"))}
					>
						<Box w="100%">
							<Grid columns={18} gutter="xs">
								<Grid.Col
									span={12}
									className="animate-ease-out"
									bg="var(--theme-primary-color-0)"
									px="xs"
								>
									<Box mt="md">
										<TextAreaForm
											id="investigation-comment"
											form={investigationForm}
											tooltip={t("EnterComment")}
											placeholder={t("EnterComment")}
											name="comment"
											disabled={invoiceDetails?.process === "Done"}
										/>
									</Box>
								</Grid.Col>
								<Grid.Col
									span={6}
									className="animate-ease-out"
									bg="var(--theme-secondary-color-0)"
									px="xs"
								>
									<Grid align="center" gutter="3xs" columns={20}>
										<Grid.Col span={8}>
											<Text fz="sm" fw="800">
												{t("Receive")}
											</Text>
										</Grid.Col>
										<Grid.Col span={8}>{investigationSubtotal || 0}</Grid.Col>
									</Grid>
									<Box mt="xs">
										<Button.Group>
											<Button
												type="submit"
												w="100%"
												size="sm"
												bg="var(--theme-primary-color-6)"
												leftSection={
													<IconPrinter style={{ width: "70%", height: "70%" }} stroke={1.5} />
												}
											>
												<Stack gap={0} align="center" justify="center">
													<Text fz="md">{t("Print")}</Text>
													<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
														(alt + p)
													</Text>
												</Stack>
											</Button>
										</Button.Group>
									</Box>
								</Grid.Col>
							</Grid>
						</Box>
					</form>
				</Box>
			)}

			{/* =============== removed shared bottom form; forms moved into their respective tabs =============== */}
			<Box bg="var(--mantine-color-white)">
				<Stack h={mainAreaHeight - 62} bg="var(--mantine-color-body)" align="center" justify="center" gap="md">
					{t("NoTestSelected")}
				</Stack>
			</Box>
			<IPDInvoicePosBn data={invoiceDetails} ref={invoicePrintRef} />
		</Box>
	);
}
