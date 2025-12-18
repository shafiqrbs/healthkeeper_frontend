import { useOutletContext } from "react-router-dom";

import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Button, Divider, Grid, ScrollArea, Stack, Text, Tabs, Textarea, Select, NumberInput } from "@mantine/core";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { capitalizeWords } from "@/common/utils";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { getRoomOptions } from "@utils/ipd";

const PER_PAGE = 200;

export default function ManageModal({ opened, close, form, selectedId }) {
	const dispatch = useDispatch();
	const [updateKey, setUpdateKey] = useState(0);
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 140;
	const { t } = useTranslation();

	const [actionFormData, setActionFormData] = useState(null);
	const cabinData = useSelector((state) => state.crud.cabin?.data?.data);
	const bedData = useSelector((state) => state.crud.bed?.data?.data);

	const { data: ipdData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.VIEW}/${selectedId}`,
	});

	const [actionType, setActionType] = useState("change");
	const [activeTab, setActiveTab] = useState('change');

	const fetchData = useCallback(() => {
		dispatch(
			getIndexEntityData({
				url: MASTER_DATA_ROUTES.API_ROUTES.OPERATIONAL_API.ROOM_CABIN,
				module: "cabin",
				params: { particular_type: "cabin", page: 1, offset: PER_PAGE },
			})
		);
		dispatch(
			getIndexEntityData({
				url: MASTER_DATA_ROUTES.API_ROUTES.OPERATIONAL_API.ROOM_CABIN,
				module: "bed",
				params: { particular_type: "bed", page: 1, offset: PER_PAGE },
			})
		);
	}, [dispatch]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// =============== use action form data for requested information ================
	const getAccommodationTypeLabel = (type) => {
		if (!type) return "";
		const typeMap = {
			bed: t("Bed"),
			cabin: t("Cabin"),
			freeBed: t("FreeBed"),
			freeCabin: t("FreeCabin"),
		};
		return typeMap[type] || type;
	};

	const requestedChangeData = {
		accommodationType: actionFormData?.accommodationType || "",
		accommodationTypeLabel: getAccommodationTypeLabel(actionFormData?.accommodationType),
		roomNumber: actionFormData?.roomNumber || "",
		comment: actionFormData?.comment || "",
	};

	// =============== reset selected room when accommodation type changes ================
	useEffect(() => {
		form.setFieldValue("roomNumber", "");
		setUpdateKey((prev) => prev + 1);
	}, [form.values.accommodationType]);

	const requestedCancelData = {
		reason: actionFormData?.reason || "",
	};

	const requestedDayChangeData = {
		dayChange: actionFormData?.dayChange || "",
	};

	// =============== determine default tab based on action type ================
	const defaultTab = ipdData?.data?.change_mode || "change";

	useEffect(() => {
		setActiveTab(defaultTab);
		setActionType(defaultTab);
	}, [defaultTab]);

	const handleTabChange = (tabValue) => {
		setActiveTab(tabValue);
		setActionType(tabValue);
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
				dayChangeComment: values.dayChangeComment,
			});
			// TODO: implement day change action API call
		}
		// reset form and close drawer after submission
		form.reset();
		setActionType(null);
		// closeActions();
	};

	console.log(ipdData);

	return (
		<GlobalDrawer opened={opened} close={close} title={t("ManageAdmission")} size="60%">
			<Box component="form" onSubmit={form.onSubmit(handleActionSubmit)} py="sm" noValidate>
				<Grid columns={24}>
					<Grid.Col span={12}>
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
												? `${ipdData?.data?.year} Year, ${ipdData?.data?.month || 0} Month, ${ipdData?.data?.day || 0} Day`
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
					<Grid.Col span={12}>
						<Tabs value={activeTab} onChange={handleTabChange} defaultValue={defaultTab}>
							<Tabs.List>
								<Tabs.Tab value="change">{t("Change")}</Tabs.Tab>
								<Tabs.Tab value="change_day">{t("DayChange")}</Tabs.Tab>
								<Tabs.Tab value="cancel">{t("Cancel")}</Tabs.Tab>
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
												<strong>{t("Comment")}</strong>:{" "}
												{ipdData?.data?.change_comment}
											</Text>
										</Stack>
									</Box>
									<Divider />
									<Box>
										<Select
											label={t("AccommodationType")}
											placeholder={t("SelectAccommodationType")}
											data={[
												{ value: "", label: t("Select") },
												{ value: "bed", label: t("Bed") },
												{ value: "cabin", label: t("Cabin") },
												{ value: "freeBed", label: t("FreeBed") },
												{ value: "freeCabin", label: t("FreeCabin") },
											]}
											name="accommodationType"
											{...form.getInputProps("accommodationType")}
										/>
										<Select
											key={updateKey}
											label={t("Bed/CabinNumber")}
											placeholder={t("Select")}
											data={getRoomOptions(form, cabinData, bedData, t)}
											name="roomNumber"
											{...form.getInputProps("roomNumber")}
											searchable
											disabled={!form.values.accommodationType}
										/>
										<Textarea
											label={t("Comment")}
											placeholder={t("EnterComment")}
											name="comment"
											{...form.getInputProps("comment")}
											minRows={3}
										/>
									</Box>
									<Button type="submit">{t("Approve")}</Button>
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
												<strong>{t("Reason")}</strong>: {ipdData?.data?.change_comment}
											</Text>
										</Stack>
									</Box>
									<Divider />
									<Textarea
										label={t("Reason")}
										placeholder={t("EnterReason")}
										name="reason"
										{...form.getInputProps("reason")}
										minRows={3}
										required={activeTab === "cancel"}
									/>
									<Button type="submit">{t("Approve")}</Button>
								</Stack>
							</Tabs.Panel>

							<Tabs.Panel value="change_day">
								<Stack gap="md" mt="xs">
									{/* =============== requested information section =============== */}
									<Box p="xs" bg="var(--theme-primary-color-0)" style={{ borderRadius: "4px" }}>
										<Text fz="sm" fw={600} mb="xs">
											{t("RequestedInformation")}:
										</Text>
										<Stack gap="xs">
											<Text fz="sm">
												<strong>{t("RequestedDayChange")}</strong>:{" "}
												{ipdData?.data?.change_comment}
											</Text>
										</Stack>
									</Box>
									<Divider />
									<NumberInput
										label={t("DayChange")}
										placeholder={t("EnterDayChange")}
										name="dayChange"
										{...form.getInputProps("dayChange")}
										min={1}
										required={activeTab === "dayChange"}
									/>
									<Textarea
										label={t("DayChangeComment")}
										placeholder={t("EnterComment")}
										name="dayChangeComment"
										{...form.getInputProps("dayChangeComment")}
										minRows={3}
									/>
									<Button type="submit">{t("Approve")}</Button>
								</Stack>
							</Tabs.Panel>
						</Tabs>
					</Grid.Col>
				</Grid>
			</Box>
		</GlobalDrawer>
	);
}
