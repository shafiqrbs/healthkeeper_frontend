import {
	Box,
	Text,
	ScrollArea,
	Stack,
	Button,
	Flex,
	Grid,
	Tabs,
	ActionIcon,
	Select,
	Autocomplete,
	LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { formatDate, getUserRole } from "@utils/index";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useForm } from "@mantine/form";
import { getFormValues } from "@modules/hospital/lab/helpers/request";
import { modals } from "@mantine/modals";
import { getIndexEntityData, storeEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, MODULES, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { useDispatch, useSelector } from "react-redux";
import useParticularsData from "@hooks/useParticularsData";
import { IconCaretUpDownFilled, IconX } from "@tabler/icons-react";
import inputCss from "@assets/css/InputField.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import IPDAllPrint from "@hospital-components/print-formats/ipd/IPDAllPrint";
import { useReactToPrint } from "react-to-print";
import InvoicePosBN from "@hospital-components/print-formats/billing/InvoicePosBN";
import {getDataWithoutStore} from "@/services/apiService";

const ALLOWED_BILLING_ROLES = ["billing_manager", "billing_cash", "admin_hospital", "admin_administrator"];
const module = MODULES.BILLING;
const PER_PAGE = 500;

export default function Invoice({ transactions,setRefetchBillingKey }) {
	const invoicePrintRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const { t } = useTranslation();
	const form = useForm(getFormValues(t));
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const { id, transactionId: selectedTransactionId } = useParams();
	const navigate = useNavigate();
	const userRoles = getUserRole();
	const [autocompleteValue, setAutocompleteValue] = useState("");
	const { particularsData } = useParticularsData({ modeName: "Admission" });
	const investigationParticulars = particularsData?.find((item) => item.particular_type.name === "Investigation");
	const cabinListData = useSelector((state) => state.crud.cabin?.data?.data);
	const bedListData = useSelector((state) => state.crud.bed?.data?.data);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const ipdAllPrintRef = useRef(null);


	const printIPDAll = useReactToPrint({ content: () => ipdAllPrintRef.current });

	const getRoomData = () => {
		if (form.values.roomType === "cabin") {
			return (
				cabinListData?.map((cabin) => ({
					value: cabin.id?.toString(),
					label: cabin.display_name || cabin.cabin_name,
				})) || []
			);
		} else if (form.values.roomType === "bed") {
			return (
				bedListData?.map((bed) => ({
					value: bed.id?.toString(),
					label: bed.display_name || bed.bed_name,
				})) || []
			);
		}
		return [];
	};

	const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });

	const fetchData = useCallback(
		(roomType = "cabin") => {
			if (roomType === "cabin") {
				dispatch(
					getIndexEntityData({
						url: MASTER_DATA_ROUTES.API_ROUTES.CABIN.INDEX,
						module: "cabin",
						params: { particular_type: "cabin", term: "", page: 1, offset: PER_PAGE },
					})
				);
			} else if (roomType === "bed") {
				dispatch(
					getIndexEntityData({
						url: MASTER_DATA_ROUTES.API_ROUTES.BED.INDEX,
						module: "bed",
						params: { particular_type: "bed", term: "", page: 1, offset: PER_PAGE },
					})
				);
			}
		},
		[dispatch]
	);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleTest = (transactionId) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.BILLING.VIEW}/${id}/payment/${transactionId}`);
	};

	const handlePrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.PRINT}/${id}`,
		});
		setInvoicePrintData(res.data);
		requestAnimationFrame(invoicePrint);
	};

	const handleAutocompleteOptionAdd = (value) => {
		const allParticulars = investigationParticulars?.particular_type?.particulars || [];
		const sectionParticulars = allParticulars.find((p) => p.name === value);

		if (sectionParticulars) {
			// =============== get current investigation list or initialize empty array ================
			const currentList = Array.isArray(form.values.investigation) ? form.values.investigation : [];

			// =============== check if this value already exists ================
			const existingIndex = currentList.findIndex(
				(item) => item.id === sectionParticulars.id && item.name === sectionParticulars.name
			);

			if (existingIndex === -1) {
				// =============== add new item to the list ================
				const newItem = {
					id: sectionParticulars.id,
					name: sectionParticulars.name,
					value: sectionParticulars.name,
				};

				const updatedList = [...currentList, newItem];
				form.setFieldValue("investigation", updatedList);
				return;
			}
		}
	};

	const handleAutocompleteOptionRemove = (idx) => {
		// =============== get current investigation list and remove item at index ================
		const currentList = Array.isArray(form.values.investigation) ? form.values.investigation : [];
		const updatedList = currentList.filter((_, index) => index !== idx);
		form.setFieldValue("investigation", updatedList);
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
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				dispatch(setRefetchData({ module, refetching: true }));
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	const handleInvestigationSubmit = async () => {
		setIsSubmitting(true);
		try {
			const formValue = {
				json_content: form.values?.investigation,
				ipd_module: "investigation",
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PROCESS}/${id}`,
				data: formValue,
				module: "admission",
			};

			const resultAction = await dispatch(storeEntityData(value)).unwrap();

			if (resultAction.status === 200) {
				successNotification(t("InvestigationAddedSuccessfully"));
				// await refetchInvestigationData();
				setRefetchBillingKey(Date.now());
				form.reset();
			} else {
				errorNotification(t("InvestigationAddedFailed"));
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRoomSubmit = async () => {
		try {
			setIsSubmitting(true);
			if (!form.values?.room || !form.values?.quantity) {
				errorNotification(t("PleaseFillAllFieldsToSubmit"), ERROR_NOTIFICATION_COLOR);
				setIsSubmitting(false);
				return;
			}
			const formValue = {
				json_content: [
					{
						id: form.values?.room,
						quantity: form.values?.quantity,
						start_date: formatDate(new Date()),
					},
				],
				ipd_module: "room",
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PROCESS}/${id}`,
				data: formValue,
				module: "admission",
			};

			const resultAction = await dispatch(storeEntityData(value)).unwrap();

			if (resultAction.status === 200) {
				successNotification(t("RoomAddedSuccessfully"));
				// await refetchInvestigationData();
				setRefetchBillingKey(Date.now());
				form.reset();
			} else {
				errorNotification(t("RoomAddedFailed"));
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)">
			<Flex bg="var(--theme-primary-color-0)" p="sm" justify="space-between">
				<Text fw={600} fz="sm" py="es" px="xs">
					{t("InvoiceHistory")}
				</Text>
				<Button onClick={printIPDAll} bg="var(--theme-secondary-color-6)" color="white" size="compact-xs">
					{t("AllPrint")}
				</Button>
			</Flex>
			{id && transactions.length ? (
				<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 52}>
					<LoadingOverlay visible={isSubmitting} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
					<Stack className="form-stack-vertical" p="xs" pos="relative">
						{transactions?.map((item, index) => (
							<Box
								key={index}
								className="borderRadiusAll"
								bg={
									selectedTransactionId == item.hms_invoice_transaction_id
										? "var(--theme-primary-color-1)"
										: "white"
								}
								p="sm"
							>
								<Grid columns={16} gap={0} gutter="xs">
									<Grid.Col span={4} py={0}>
										<Text size="xs" fw={600}>
											Created:
										</Text>
									</Grid.Col>
									<Grid.Col span={4} py={0}>
										<Text size="xs">{item?.created}</Text>
									</Grid.Col>
									<Grid.Col span={4} py={0}>
										<Text size="xs" fw={600}>
											Mode:
										</Text>
									</Grid.Col>
									<Grid.Col span={4} py={0}>
										<Text size="xs">{item?.mode}</Text>
									</Grid.Col>
									<Grid.Col span={4} py={0}>
										<Text size="xs" fw={600}>
											Amount:
										</Text>
									</Grid.Col>
									<Grid.Col span={4} py={0}>
										<Text size="xs">{Number(item?.total, 2)}</Text>
									</Grid.Col>
									<Grid.Col span={4} py={0}>
										<Text size="xs" fw={600}>
											Status:
										</Text>
									</Grid.Col>
									<Grid.Col span={4} py={0}>
										<Text size="xs">{item?.process}</Text>
									</Grid.Col>
								</Grid>
								<Flex align="center" gap="sm" mt={"md"} justify="flex-end">
									{userRoles.some((role) => ALLOWED_BILLING_ROLES.includes(role)) && (
										<>

											{item?.process === "Done" && (
												<>
													<Button
														onClick={() => handleTest(item.hms_invoice_transaction_id)}
														size="compact-xs"
														bg="var(--theme-primary-color-6)"
														color="white"
													>
														{t("Show")}
													</Button>
													<Button
														onClick={() => handlePrint(item)}
														size="compact-xs"
														bg="var(--theme-secondary-color-6)"
														color="white"
													>
														{t("Print")}
													</Button>
												</>
											)}
										</>
									)}
								</Flex>
							</Box>
						))}
					</Stack>
				</ScrollArea>
			) : (
				<Stack h={mainAreaHeight - 52} bg="var(--mantine-color-body)" align="center" justify="center" gap="md">
					<Box>{t("NoPatientSelected")}</Box>
				</Stack>
			)}
			<InvoicePosBN data={invoicePrintData} ref={invoicePrintRef} />
			{/*<IPDAllPrint data={test} ref={ipdAllPrintRef} />*/}
		</Box>
	);
}
