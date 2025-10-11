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
import { getUserRole } from "@utils/index";
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
import { useCallback, useEffect, useState } from "react";

const ALLOWED_BILLING_ROLES = ["billing_manager", "billing_cash", "admin_hospital", "admin_administrator"];
const module = MODULES.BILLING;
const PER_PAGE = 500;

export default function Invoice({ entity, setRefetchBillingKey }) {
	const { t } = useTranslation();
	const form = useForm(getFormValues(t));
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const test = entity;
	const { id } = useParams();
	const navigate = useNavigate();
	const userRoles = getUserRole();
	const [autocompleteValue, setAutocompleteValue] = useState("");
	const { particularsData } = useParticularsData({ modeName: "Admission" });
	const investigationParticulars = particularsData?.find((item) => item.particular_type.name === "Investigation");
	const cabinListData = useSelector((state) => state.crud.cabin?.data?.data);
	const bedListData = useSelector((state) => state.crud.bed?.data?.data);
	const [isSubmitting, setIsSubmitting] = useState(false);

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
		setIsSubmitting(true);
		try {
			const formValue = {
				json_content: { room: form.values?.room, quantity: form.values?.quantity },
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
		<Box className="borderRadiusAll" bg="white">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("InvoiceTransaction")}
				</Text>
			</Box>
			{id ? (
				<>
					<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 320}>
						<LoadingOverlay visible={isSubmitting} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
						<Stack className="form-stack-vertical" p="xs" pos="relative">
							{test?.invoice_transaction?.map((item, index) => (
								<Box key={index} className="borderRadiusAll" bg="white" p="sm">
									<Text fz="sm">{item.invoice_created}</Text>
									<Text fz="xs">Status:{item?.process}</Text>
									<Text fz="xs">Amount:{Number(item?.total, 2)}</Text>
									<Flex align="center" gap="sm">
										{userRoles.some((role) => ALLOWED_BILLING_ROLES.includes(role)) && (
											<>
												{item?.process === "New" &&
													userRoles.some((role) => ALLOWED_BILLING_ROLES.includes(role)) && (
														<Button
															onClick={() => handleTest(item.hms_invoice_transaction_id)}
															size="xs"
															bg="var(--theme-primary-color-6)"
															color="white"
														>
															{t("Process")}
														</Button>
													)}
												{item?.process === "Done" && (
													<>
														<Button
															onClick={() => handleTest(item.hms_invoice_transaction_id)}
															size="xs"
															bg="var(--theme-primary-color-6)"
															color="white"
														>
															{t("Show")}
														</Button>
														<Button
															onClick={() => handleTest(item.hms_invoice_transaction_id)}
															size="xs"
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
					<Box gap={0} justify="space-between" mt="xs">
						<form onSubmit={form.onSubmit(handleSubmit)}>
							<Box bg="var(--theme-primary-color-0)" pl={"xs"} pr={"xs"} pb={"xs"}>
								<Tabs defaultValue="investigation">
									<Tabs.List>
										<Tabs.Tab value="investigation">{t("Investigation")}</Tabs.Tab>
										<Tabs.Tab value="bed-cabin">{t("Bed/Cabin")}</Tabs.Tab>
									</Tabs.List>
									<Tabs.Panel value="investigation" bg="white">
										<Grid align="center" columns={20} mt="xs" mx="xs">
											<Grid.Col span={20}>
												<Autocomplete
													label=""
													placeholder={`Pick value or enter Investigation`}
													data={investigationParticulars?.particular_type?.particulars?.map(
														(particular) => ({
															value: particular.name,
															label: particular.name,
														})
													)}
													value={autocompleteValue}
													onChange={setAutocompleteValue}
													onOptionSubmit={(value) => {
														handleAutocompleteOptionAdd(value);
														setTimeout(() => {
															setAutocompleteValue("");
														}, 0);
													}}
													classNames={inputCss}
													rightSection={<IconCaretUpDownFilled size={16} />}
												/>
											</Grid.Col>
										</Grid>
										<Box w="100%" bg="white">
											<Grid columns={18} gutter="xs">
												<Grid.Col span={18} className="animate-ease-out" px="xs">
													<ScrollArea scrollbars="y" type="never" h="116" mx="xs">
														<Stack
															gap={0}
															bg="white"
															px="sm"
															className="borderRadiusAll"
															mt="xxs"
														>
															{form.values?.investigation?.map((item, idx) => (
																<Flex
																	key={idx}
																	align="center"
																	justify="space-between"
																	px="es"
																	py="xs"
																	style={{
																		borderBottom:
																			idx !==
																			form.values?.investigation?.length - 1
																				? "1px solid var(--theme-tertiary-color-4)"
																				: "none",
																	}}
																>
																	<Text fz="sm">
																		{idx + 1}. {item.name}
																	</Text>
																	<ActionIcon
																		color="red"
																		size="xs"
																		variant="subtle"
																		onClick={() =>
																			handleAutocompleteOptionRemove(idx)
																		}
																	>
																		<IconX size={16} />
																	</ActionIcon>
																</Flex>
															))}
														</Stack>
													</ScrollArea>
													<Box mt="xs">
														<Button.Group>
															<Button
																id="EntityFormSubmit"
																w="100%"
																size="compact-sm"
																bg="var(--theme-pos-btn-color)"
																type="button"
																disabled={isSubmitting}
															>
																<Stack gap={0} align="center" justify="center">
																	<Text fz="xs">{t("Print")}</Text>
																</Stack>
															</Button>
															<Button
																w="100%"
																size="compact-sm"
																bg="var(--theme-save-btn-color)"
																loading={isSubmitting}
																onClick={handleInvestigationSubmit}
															>
																<Stack gap={0} align="center" justify="center">
																	<Text fz="xs">{t("Save")}</Text>
																</Stack>
															</Button>
														</Button.Group>
													</Box>
												</Grid.Col>
											</Grid>
										</Box>
									</Tabs.Panel>
									<Tabs.Panel value="bed-cabin" bg="white">
										<Stack justify="space-between">
											<Grid mt="xs" mx="xs" gutter="xs" align="center" columns={20}>
												<Grid.Col span={20}>
													<Select
														label=""
														name="roomType"
														id="roomType"
														nextField="room"
														placeholder={t("Bed/Cabin")}
														value={form.values.roomType}
														data={[
															{ value: "cabin", label: t("Cabin") },
															{ value: "bed", label: t("Bed") },
														]}
														onChange={(value) => {
															form.setFieldValue("roomType", value);
															form.setFieldValue("room", ""); // Clear room selection when roomType changes
															fetchData(value); // Fetch appropriate data
														}}
														mb="xs"
													/>
													<Select
														name="room"
														label=""
														placeholder="Pick value"
														value={form.values.room}
														data={getRoomData()}
														onChange={(value) => form.setFieldValue("room", value)}
														disabled={!form.values.roomType}
													/>
												</Grid.Col>
											</Grid>
											<Box w="100%" bg="white">
												<Grid columns={18} gutter="xs">
													<Grid.Col span={18} className="animate-ease-out" px="xs">
														<Flex mt="xs" align="center" gap="xs">
															<InputNumberForm
																form={form}
																label=""
																tooltip={t("EnterBillingQuantity")}
																placeholder="quantity"
																name="quantity"
																id="quantity"
																nextField="dob"
																size="xs"
															/>
															<Button
																w="100%"
																size="compact-sm"
																bg="var(--theme-save-btn-color)"
																onClick={handleRoomSubmit}
															>
																<Stack gap={0} align="center" justify="center">
																	<Text fz="xs">{t("Save")}</Text>
																</Stack>
															</Button>
														</Flex>
													</Grid.Col>
												</Grid>
											</Box>
										</Stack>
									</Tabs.Panel>
								</Tabs>
							</Box>
						</form>
					</Box>
				</>
			) : (
				<Stack h={mainAreaHeight - 62} bg="var(--mantine-color-body)" align="center" justify="center" gap="md">
					<Box>{t("NoPatientSelected")}</Box>
				</Stack>
			)}
		</Box>
	);
}
