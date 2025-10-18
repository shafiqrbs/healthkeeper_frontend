import { useOutletContext } from "react-router-dom";

import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Button, Flex, Grid, ScrollArea, Stack, Text } from "@mantine/core";
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

export default function ConfirmModal({ opened, close, form, selectedId, module }) {
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 140;
	const [selectedRoom, setSelectedRoom] = useState(null);
	const { t } = useTranslation();

	const { data: ipdData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.VIEW}/${selectedId}`,
	});

	const handleRoomClick = (room) => {
		form.setFieldValue("room_id", room?.id?.toString());
		setSelectedRoom(room);
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
		<GlobalDrawer opened={opened} close={close} title={t("ConfirmAdmission")} size="60%">
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Box py="sm">
					<Grid columns={24}>
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

						<Grid.Col span={24}>
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
