import InputForm from "@components/form-builders/InputForm";
import {
	ActionIcon,
	Box,
	Button,
	Flex,
	Grid,
	LoadingOverlay,
	ScrollArea,
	SegmentedControl,
	Stack,
	Text, TextInput, Table, Checkbox
} from "@mantine/core";
import {IconChevronUp, IconSearch, IconSelector} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import DoctorsRoomDrawer from "@hospital-components/__DoctorsRoomDrawer";
import { useDisclosure } from "@mantine/hooks";
import {HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES} from "@/constants/routes";
import { getIndexEntityData, storeEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { useDispatch, useSelector } from "react-redux";
import useHospitalSettingData from "@hooks/config-data/useHospitalSettingData";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import {successNotification} from "@components/notification/successNotification";
import {ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR} from "@/constants";
import {errorNotification} from "@components/notification/errorNotification";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import {calculateDetailedAge, capitalizeWords, formatDate, formatDOB} from "@utils/index";

export default function EntityForm({ form, module }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams();
	const [showUserData, setShowUserData] = useState({});
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight;
	const { data: ipdData, isLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.VIEW}/${id}`,
	});
	const  entity = ipdData?.data;
	const handleSubmit = async (values) => {
		try {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.POLICE_CASE_CREATE}/${id}`,
				data: values,
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
		<Box pos="relative">
			<LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
			<Box w="100%">
				<Box bg="var(--theme-primary-color-0)" p="sm">
					<Text fw={600} fz="sm" py="es">
						{t("PoliceCase")}
					</Text>
				</Box>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Box py="sm">
						<Grid columns={24}>
							<Grid.Col span={10}>
								<ScrollArea h={height-70}>
									<Stack mih={height-70} className="form-stack-vertical">
										{/* =============== patient basic information section =============== */}
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("Created")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.created || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("PatientName")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.name || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("PatientId")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.patient_id || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("Invoice")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.invoice || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("HealthId")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.health_id || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("Mobile")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.mobile || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("Gender")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{capitalizeWords(entity?.gender || "-")}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("DOB")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.dob || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("Age")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.year
														? `${entity?.year} Year, ${
															entity?.month || 0
														} Month, ${entity?.day || 0} Day`
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
													{entity?.address || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("NID")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.nid || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("IdentityMode")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.identity_mode || "-"}
												</Text>
											</Grid.Col>
										</Grid>

										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("GuardianName")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.guardian_name || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("GuardianMobile")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.guardian_mobile || "-"}
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
													{entity?.room_name || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("Mode")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.mode_name || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("PaymentMode")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.payment_mode_name || "-"}
												</Text>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20}>
											<Grid.Col span={10}>
												<Text fz="sm">{t("Comment")}:</Text>
											</Grid.Col>
											<Grid.Col span={10}>
												<Text fz="sm" fw={500}>
													{entity?.comment || "-"}
												</Text>
											</Grid.Col>
										</Grid>
									</Stack>
								</ScrollArea>
							</Grid.Col>
							<Grid.Col span={14}>
								<Box className="border-top-none" bg={'white'}>
									<Box px="sm"  h={height-166}>
										<Stack p={"xs"} gap={"mes"}>
											<Grid align="center" columns={20}>
												<Grid.Col span={4}>
													<Text fz="sm">{t("CaseNo")}</Text>
												</Grid.Col>
												<Grid.Col span={16}>
													<InputForm
														form={form}
														label=""
														tooltip={t("EnterCaseNo")}
														placeholder={t("EnterCaseNo")}
														name="case_no"
														id="case_no"
														nextField="thana"
														value={form.values.name}
														required
													/>
												</Grid.Col>
											</Grid>
											<Grid align="center" columns={20}>
												<Grid.Col span={4}>
													<Text fz="sm">{t("Thana")}</Text>
												</Grid.Col>
												<Grid.Col span={16}>
													<InputForm
														form={form}
														label=""
														tooltip={t("EnterThanaName")}
														placeholder={t("EnterThanaName")}
														name="thana"
														id="thana"
														nextField="duty_officer"
														value={form.values.name}
														required
													/>
												</Grid.Col>
											</Grid>
											<Grid align="center" columns={20}>
												<Grid.Col span={4}>
													<Text fz="sm">{t("DutyOfficer")}</Text>
												</Grid.Col>
												<Grid.Col span={16}>
													<InputForm
														form={form}
														label=""
														tooltip={t("EnterDutyOfficer")}
														placeholder={t("EnterDutyOfficer")}
														name="duty_officer"
														id="duty_officer"
														nextField="mobile"
														value={form.values.name}
														required
													/>
												</Grid.Col>
											</Grid>
											<Grid align="center" columns={20}>
												<Grid.Col span={4}>
													<Text fz="sm">{t("MobileNo")}</Text>
												</Grid.Col>
												<Grid.Col span={16}>
													<InputForm
														form={form}
														label=""
														tooltip={t("EnterPatientName")}
														placeholder={t("MobileNo")}
														name="mobile"
														id="mobile"
														nextField="mobile"
														value={form.values.mobile}
														required
													/>
												</Grid.Col>
											</Grid>
											<Grid align="center" columns={20}>
												<Grid.Col span={4}>
													<Text fz="sm">{t("CaseDetails")}</Text>
												</Grid.Col>
												<Grid.Col span={16}>
													<TextAreaForm
														id="case_details"
														form={form}
														tooltip={t("EnterCaseDetails")}
														placeholder={t("EnterCaseDetails")}
														name="case_details"
														required
													/>
												</Grid.Col>
											</Grid>
											<Grid align="center" columns={20}>
												<Grid.Col span={4}>
													<Text fz="sm">{t("Comment")}</Text>
												</Grid.Col>
												<Grid.Col span={16}>
													<TextAreaForm
														id="comment"
														form={form}
														tooltip={t("EnterComment")}
														placeholder={t("EnterComment")}
														name="comment"
														required
													/>
												</Grid.Col>
											</Grid>
										</Stack>
									</Box>
									<Box bg="var(--theme-tertiary-color-0)" mt={'xl'} p={'xs'}>
										<Grid columns={24}>
											<Grid.Col span={18}>
											</Grid.Col>
											<Grid.Col span={6}>
												<Flex gap="xs" justify="flex-end"  align="flex-end" h={'42'}>
													<Button type="button" color="var(--theme-tertiary-color-6)" variant={'outline'}  onClick={close}>
														{t("Cancel")}
													</Button>
													<Button type="submit" bg="var(--theme-primary-color-6)" color="white">
														{t("Confirm")}
													</Button>
												</Flex>
											</Grid.Col>
										</Grid>
									</Box>
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</form>
			</Box>
		</Box>
	);
}
