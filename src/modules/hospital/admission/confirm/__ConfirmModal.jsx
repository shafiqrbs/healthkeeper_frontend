import { useOutletContext } from "react-router-dom";

import GlobalDrawer from "@components/drawers/GlobalDrawer";
import {
	Box,
	Button,
	Divider,
	Flex,
	Grid,
	ScrollArea,
	Stack,
	Text,
	Tabs,
	Textarea,
	Select,
	NumberInput,
} from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import { useState } from "react";
import Cabin from "../common/Cabin";
import { useTranslation } from "react-i18next";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import Bed from "../common/Bed";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { useDispatch } from "react-redux";
import { capitalizeWords } from "@/common/utils";
import { useForm } from "@mantine/form";

export default function ConfirmModal({ opened, close, form, selectedId, module }) {
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 140;
	const [selectedRoom, setSelectedRoom] = useState(null);
	const { t } = useTranslation();
	const [actionType, setActionType] = useState(null);
	const [actionFormData, setActionFormData] = useState(null);

	const { data: ipdData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.VIEW}/${selectedId}`,
	});

	const actionForm = useForm({
		initialValues: {
			accommodationType: "",
			roomNumber: "",
			comment: "",
			reason: "",
			dayChange: null,
		},
	});

	// =============== use action form data for requested information ================
	const getAccommodationTypeLabel = (type) => {
		if (!type) return "";
		const typeMap = {
			room: t("Room"),
			cabin: t("Cabin"),
			freeCabin: t("FreeCabin"),
			freeBed: t("FreeBed"),
		};
		return typeMap[type] || type;
	};

	const requestedChangeData = {
		accommodationType: actionFormData?.accommodationType || "",
		accommodationTypeLabel: getAccommodationTypeLabel(actionFormData?.accommodationType),
		roomNumber: actionFormData?.roomNumber || "",
		comment: actionFormData?.comment || "",
	};

	const requestedCancelData = {
		reason: actionFormData?.reason || "",
	};

	const requestedDayChangeData = {
		dayChange: actionFormData?.dayChange || "",
	};

	// =============== determine default tab based on action type ================
	const defaultTab = actionFormData?.actionType || "change";

	const handleRoomClick = (room) => {
		form.setFieldValue("room_id", room?.id?.toString());
		setSelectedRoom(room);
	};

	const handleActionSubmit = (values) => {
		// =============== store action form data for confirmation modal ================
		const actionData = {
			actionType: actionType,
			...values,
		};
		setActionFormData(actionData);

		if (actionType === "change") {
			console.log("Change action:", {
				accommodationType: values.accommodationType,
				roomNumber: values.roomNumber,
				comment: values.comment,
			});
			// TODO: implement change action API call
		} else if (actionType === "cancel") {
			console.log("Cancel action:", {
				reason: values.reason,
			});
			// TODO: implement cancel action API call
		} else if (actionType === "dayChange") {
			console.log("Day change action:", {
				dayChange: values.dayChange,
			});
			// TODO: implement day change action API call
		}
		// reset form and close drawer after submission
		actionForm.reset();
		setActionType(null);
		// closeActions();
	};

	const handleSubmit = async (values) => {
		try {
			const formValue = { ...values, hms_invoice_id: selectedId };

			const value = {
				url: HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.CREATE,
				data: formValue,
				module,
			};

			const resultAction = await dispatch(storeEntityData(value));
			if (storeEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					form.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				form.reset();
				close(); // close the drawer
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	};

	return (
		<GlobalDrawer opened={opened} close={close} title={t("ConfirmAdmission")} size="90%">
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Box py="sm">
					<Grid columns={34}>
						<Grid.Col span={10}>
							<ScrollArea h={height}>
								<Stack mih={height} className="form-stack-vertical">
									{/* =============== patient basic information section =============== */}
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("Created")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.created || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("PatientName")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.name || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("PatientId")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.patient_id || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("Invoice")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.invoice || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("HealthId")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.health_id || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("Mobile")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.mobile || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("Gender")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{capitalizeWords(ipdData?.data?.gender || "-")}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("DOB")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.dob || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("Age")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.year
													? `${ipdData?.data?.year} Year, ${
															ipdData?.data?.month || 0
													  } Month, ${ipdData?.data?.day || 0} Day`
													: "-"}
											</Text>
										</Grid.Col>
									</Grid>

									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("Address")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.address || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("NID")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.nid || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("IdentityMode")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.identity_mode || "-"}
											</Text>
										</Grid.Col>
									</Grid>

									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("GuardianName")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.guardian_name || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("GuardianMobile")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.guardian_mobile || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									{/* =============== admission details section =============== */}

									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("RoomNo")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.room_name || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("Mode")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.mode_name || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("PaymentMode")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.payment_mode_name || "-"}
											</Text>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={10}>
											<Text fz="sm">{t("Comment")}:</Text>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="sm" fw={500}>
												{ipdData?.data?.comment || "-"}
											</Text>
										</Grid.Col>
									</Grid>
								</Stack>
							</ScrollArea>
						</Grid.Col>
						<Grid.Col span={14}>
							{/* <Flex p="xs" gap="xs" bg="var(--theme-primary-color-0)" mb="sm">
								<TextInput
									leftSection={<IconSearch size={18} />}
									name="searchPatient"
									placeholder="Mr. Rafiqul Alam"
									w="100%"
								/>
								<Button miw={100}>Process</Button>
							</Flex> */}
							<TabsWithSearch
								module="cabin"
								tabList={["Cabin", "Bed"]}
								searchbarContainerBg="var(--theme-primary-color-1)"
								tabWidth="48%"
								showDatePicker={false}
								tabPanels={[
									{
										tab: "Cabin",
										component: (
											<Cabin selectedRoom={selectedRoom} handleRoomClick={handleRoomClick} />
										),
									},
									{
										tab: "Bed",
										component: (
											<Bed selectedRoom={selectedRoom} handleRoomClick={handleRoomClick} />
										),
									},
								]}
							/>
						</Grid.Col>
						<Grid.Col span={10}>
							<Tabs defaultValue={defaultTab}>
								<Tabs.List>
									<Tabs.Tab value="change">{t("Change")}</Tabs.Tab>
									<Tabs.Tab value="cancel">{t("Cancel")}</Tabs.Tab>
									<Tabs.Tab value="dayChange">{t("DayChange")}</Tabs.Tab>
								</Tabs.List>
								<Divider />
								<Tabs.Panel value="change">
									<Stack gap="md" mt="xs">
										{/* =============== requested information section =============== */}
										<Box p="xs" bg="var(--theme-primary-color-0)" style={{ borderRadius: "4px" }}>
											<Text fz="md" fw={600} mb="xs">
												{t("RequestedInformation")}:
											</Text>
											<Stack gap="xs">
												<Text fz="sm">
													<strong>{t("RequestedAccommodationType")}</strong>:{" "}
													{requestedChangeData.accommodationTypeLabel || "Free Cabin"}
												</Text>
												<Text fz="sm">
													<strong>{t("RequestedRoom")}</strong>:{" "}
													{requestedChangeData.roomNumber || "101"}
												</Text>
												<Text fz="sm">
													<strong>{t("Comment")}</strong>:{" "}
													{requestedChangeData.comment || "placeholder comment"}
												</Text>
											</Stack>
										</Box>
										<Divider />

										<Box>
											<Select
												label={t("AccommodationType")}
												placeholder={t("SelectAccommodationType")}
												data={[
													{ value: "room", label: t("Room") },
													{ value: "cabin", label: t("Cabin") },
													{ value: "freeCabin", label: t("FreeCabin") },
													{ value: "freeBed", label: t("FreeBed") },
												]}
												name="accommodationType"
												{...actionForm.getInputProps("accommodationType")}
												searchable
											/>
											<Select
												label={t("RoomNumber")}
												placeholder={t("SelectRoomNumber")}
												data={[
													{ value: "101", label: "101" },
													{ value: "102", label: "102" },
													{ value: "103", label: "103" },
													{ value: "104", label: "104" },
													{ value: "105", label: "105" },
												]}
												name="roomNumber"
												{...actionForm.getInputProps("roomNumber")}
												searchable
												disabled={!actionForm.values.accommodationType}
											/>
											<Textarea
												label={t("Comment")}
												placeholder={t("EnterComment")}
												name="comment"
												{...actionForm.getInputProps("comment")}
												minRows={3}
											/>
										</Box>
										<Button onClick={() => actionForm.onSubmit(handleActionSubmit)()}>
											{t("Approve")}
										</Button>
										{/* =============== form content section =============== */}
									</Stack>
								</Tabs.Panel>

								<Tabs.Panel value="cancel">
									<Stack gap="md" mt="xs">
										{/* =============== requested information section =============== */}

										<Box p="xs" bg="var(--theme-primary-color-0)" style={{ borderRadius: "4px" }}>
											<Text fz="sm" fw={600} mb="xs">
												{t("RequestedInformation")}:
											</Text>
											<Stack gap="xs">
												<Text fz="sm">
													<strong>{t("Reason")}</strong>:{" "}
													{requestedCancelData.reason || "placeholder reason"}
												</Text>
											</Stack>
										</Box>
										<Divider />
										<Textarea
											label={t("Reason")}
											placeholder={t("EnterReason")}
											name="reason"
											{...actionForm.getInputProps("reason")}
											minRows={3}
											required
										/>
										<Button onClick={() => actionForm.onSubmit(handleSubmit)()}>
											{t("Approve")}
										</Button>
									</Stack>
								</Tabs.Panel>

								<Tabs.Panel value="dayChange">
									<Stack gap="md" mt="xs">
										{/* =============== requested information section =============== */}
										<Box p="xs" bg="var(--theme-primary-color-0)" style={{ borderRadius: "4px" }}>
											<Text fz="sm" fw={600} mb="xs">
												{t("RequestedInformation")}:
											</Text>
											<Stack gap="xs">
												<Text fz="sm">
													<strong>{t("RequestedDayChange")}</strong>:{" "}
													{requestedDayChangeData.dayChange || "10"} {t("Days")}
												</Text>
											</Stack>
										</Box>
										<Divider />
										<NumberInput
											label={t("DayChange")}
											placeholder={t("EnterDayChange")}
											name="dayChange"
											{...actionForm.getInputProps("dayChange")}
											min={1}
											required
										/>
										<Button onClick={() => actionForm.onSubmit(handleActionSubmit)()}>
											{t("Approve")}
										</Button>
									</Stack>
								</Tabs.Panel>
							</Tabs>
						</Grid.Col>

						<Grid.Col span={34}>
							<Flex gap="xs" justify="flex-end">
								<Button type="button" bg="var(--theme-secondary-color-6)" color="white">
									{t("Print")}
								</Button>
								<Button type="submit" bg="var(--theme-primary-color-6)" color="white">
									{t("Confirm")}
								</Button>
								<Button type="button" bg="var(--theme-tertiary-color-6)" color="white" onClick={close}>
									{t("Cancel")}
								</Button>
								{/* <Button
									type="button"
									onClick={handleAdmissionConfirmation}
									bg="var(--theme-primary-color-6)"
									color="white"
								>
									{t("AdmissionConfirmation")}
								</Button> */}
							</Flex>
						</Grid.Col>
					</Grid>
				</Box>
			</form>
		</GlobalDrawer>
	);
}
