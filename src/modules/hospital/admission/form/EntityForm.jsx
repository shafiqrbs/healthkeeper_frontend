import DatePickerForm from "@components/form-builders/DatePicker";
import InputForm from "@components/form-builders/InputForm";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import SelectForm from "@components/form-builders/SelectForm";

import {ActionIcon, Box, Flex, Grid, ScrollArea, SegmentedControl, Stack, Text} from "@mantine/core";
import {IconChevronRight, IconCirclePlusFilled, IconSearch} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import DoctorsRoomDrawer from "../../common/__DoctorsRoomDrawer";
import { useDisclosure } from "@mantine/hooks";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { editEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import IPDFooter from "@modules/hospital/common/IPDFooter";

import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import {formatDate} from "@utils/index";


const DISEASE_PROFILE = ["Diabetic", "Hypertension", "Asthma", "Allergy", "Other"];

export default function EntityForm({ form, module }) {
	const dispatch = useDispatch();
	const [gender, setGender] = useState("male");
	const [openedDoctorsRoom, { open: openDoctorsRoom, close: closeDoctorsRoom }] = useDisclosure(false);
	const { t } = useTranslation();
	const { id } = useParams();

	const [record, setRecord] = useState({})
	const [showUserData, setShowUserData] = useState({})
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 260;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [openedHSIDDataPreview, { open: openHSIDDataPreview, close: closeHSIDDataPreview }] = useDisclosure(false);

	const handleSubmit = async () => {
		if (!form.validate().hasErrors) {
			setIsSubmitting(true);

			try {
				const createdBy = JSON.parse(localStorage.getItem("user"));

				const formValue = {
					...form.values,
					created_by_id: createdBy?.id,
				};

				const data = {
					url: HOSPITAL_DATA_ROUTES.API_ROUTES.VISIT.CREATE,
					data: formValue,
					module,
				};

				const resultAction = await dispatch(storeEntityData(data));

				if (storeEntityData.rejected.match(resultAction)) {
					showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 1000, true);
				} else {
					showNotificationComponent(t("Visit saved successfully"), "green", "lightgray", true, 1000, true);
					setRefetchData({ module, refetching: true });
					form.reset();
				}
			} catch (error) {
				console.error("Error submitting visit:", error);
				showNotificationComponent(t("Something went wrong"), "red", "lightgray", true, 1000, true);
			} finally {
				setIsSubmitting(false);
			}
		} else {
			if (Object.keys(form.errors)?.length > 0 && form.isDirty()) {
				console.error(form.errors);
				notifications.show({
					title: "Error",
					message: "Please fill all the fields",
					color: "red",
					position: "top-right",
				});
			}
		}
	};
	const handleGenderChange = (val) => {
		setGender(val);
	};
	const {data:entity} = useDataWithoutStore({url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.VIEW}/${id}`})
	const item = entity?.data
	const entities = entity?.data?.invoice_particular

	useEffect(() => {
		form.setValues({
			name: item?.name,
			mobile: item?.mobile,
		});
	}, [item]);

	const handleReset = () => {
		form.reset();
		localStorage.removeItem(LOCAL_STORAGE_KEY);
		setShowUserData(false);
	};


	const handleTypeChange = (val) => {
		form.setFieldValue("patient_type", val);
		if (val === "admission") {
			form.setFieldValue("guardian_mobile", form.values.mobile);
		}
	};

	// =============== handle HSID search and populate form fields ================
	const handleHSIDSearch = () => {
		if (!form.values.identity) {
			showNotificationComponent(t("PleaseEnterIdentity"), "red", "lightgray", true, 1000, true);
			return;
		}
		setShowUserData(true);

		// =============== populate form fields with emergency data ================
		setTimeout(() => {
			form.setFieldValue("name", userEmergencyData.citizenData.fullName_English);
			form.setFieldValue("mobile", userEmergencyData.citizenData.mobile);
			form.setFieldValue("gender", userEmergencyData.citizenData.gender === 1 ? "male" : "female");
			form.setFieldValue("dob", "01-01-1990");
			form.setFieldValue(
				"guardian_name",
				userEmergencyData.citizenData.fatherName_English || userEmergencyData.citizenData.motherName_English
			);
			form.setFieldValue(
				"address",
				`${userEmergencyData.citizenData.presentHouseholdNo.division}, ${userEmergencyData.citizenData.presentHouseholdNo.district}, ${userEmergencyData.citizenData.presentHouseholdNo.upazilla}, ${userEmergencyData.citizenData.presentHouseholdNo.unionOrWard}, ${userEmergencyData.citizenData.presentHouseholdNo.mouzaOrMoholla}, ${userEmergencyData.citizenData.presentHouseholdNo.villageOrRoad}, ${userEmergencyData.citizenData.presentHouseholdNo.houseOrHoldingNo}`
			);

			// =============== trigger age calculation ================
			handleDobChange();
		}, 500);
	};

	return (
		<>
			<Grid columns={24} gutter="les">
				<Grid.Col span={12}>
					<Box className="borderRadiusAll">
						<Box bg="var(--theme-primary-color-0)" p="sm">
							<Text fw={600} fz="sm" py="es">
								{t("AdmissionInformation")}
							</Text>
						</Box>
						<ScrollArea scrollbars="y" type="never" h={height}>
							<Stack className="form-stack-vertical">
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("Created")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										{formatDate(item?.created)}
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("InvoiceID")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										{item?.invoice}
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("PatientID")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										{item?.patient_id}
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("patientName")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterPatientName")}
											placeholder="Mr. Rahim"
											name="name"
											id="patientName"
											nextField="mobile"
											value={form.values.name}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("MobileNo")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterPatientName")}
											placeholder={t("MobileNo")}
											name="mobile"
											id="patientName"
											nextField="mobile"
											value={form.values.mobile}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("dateOfBirth")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<DatePickerForm
											form={form}
											label=""
											placeholder="23-06-2025"
											tooltip={t("enterPatientDateOfBirth")}
											name="dob"
											id="dob"
											nextField="age"
											value={form.values.dob}
											required
											disabledFutureDate
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("Type")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<SegmentedControl
											fullWidth
											color="var(--theme-primary-color-6)"
											value={form.values.identity_mode}
											id="identity_mode"
											name="identity_mode"
											onChange={(val) => handleTypeChange(val)}
											data={[
												{ label: t("NID"), value: "NID" },
												{ label: t("BRID"), value: "BRID" },
												{ label: t("HID"), value: "HID" },
											]}
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">
											{form.values.identity_mode === "NID"
												? t("NID")
												: form.values.identity_mode === "BRID"
													? t("BRID")
													: t("HID")}
										</Text>
									</Grid.Col>
									<Grid.Col span={9}>
										<InputNumberForm
											form={form}
											label=""
											placeholder="1234567890"
											tooltip={t("enterPatientIdentity")}
											name="identity"
											id="identity"
											nextField="guardian_name"
											value={form.values.identity}
											rightSection={
												<ActionIcon
													onClick={handleHSIDSearch}
													bg="var(--theme-secondary-color-6)"
												>
													<IconSearch size={"16"} />
												</ActionIcon>
											}
											required
										/>
									</Grid.Col>
									{showUserData && (
										<Grid.Col span={5}>
											<Text
												ta="right"
												onClick={openHSIDDataPreview}
												pr="xs"
												fz="sm"
												className="cursor-pointer user-none"
												c="var(--theme-primary-color-6)"
											>
												{form.values.healthID || t("HSID000000")}
											</Text>
										</Grid.Col>
									)}
								</Grid>
								<Flex className="form-action-header full-bleed">
									<Text fz="sm">{t("Cabin/Bed")}</Text>
									<Flex align="center" gap="xs"  className="cursor-pointer">
										<Text fz="sm">{item?.room_name}</Text> <IconChevronRight size="16px" />
									</Flex>
								</Flex>

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("UnitName")}</Text>
									</Grid.Col>
									<Grid.Col span={14} onClick={openDoctorsRoom}>
										<Text fz="sm">{item?.admit_unit_name}</Text>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("Department")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<Text fz="sm">{item?.admit_department_name}</Text>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("Consultant")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<Text fz="sm">{item?.admit_consultant_name}</Text>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("AssignDoctor")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<Text fz="sm">{item?.admit_doctor_name}</Text>
									</Grid.Col>
								</Grid>
								<Flex className="form-action-header full-bleed">
									<Text fz="sm">{t("PrescriptionInformation")}</Text>
									<Flex align="center" gap="xs"  className="cursor-pointer">
										<Text fz="sm">{item?.prescription_id}</Text> <IconChevronRight size="16px" />
									</Flex>
								</Flex>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("PrescriptionDoctor")}</Text>
									</Grid.Col>
									<Grid.Col span={14} >
										<Text fz="sm">{item?.prescription_doctor_name}</Text>
									</Grid.Col>
								</Grid>
							</Stack>
						</ScrollArea>
					</Box>
				</Grid.Col>
				<Grid.Col span={12}>
					<Box className="borderRadiusAll">
						<Box bg="var(--theme-primary-color-0)" p="sm">
							<Text fw={600} fz="sm" py="es">
								{t("PatientInformation")}
							</Text>
						</Box>
						<ScrollArea scrollbars="y" type="never" h={height}>
							<Stack className="form-stack-vertical">

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("status")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<Flex gap="les">
											<InputNumberForm
												form={form}
												label=""
												placeholder="170"
												tooltip={t("enterPatientHeight")}
												name="height"
												id="height"
												nextField="weight"
												value={form.values.height}
												required
											/>
											<InputNumberForm
												form={form}
												label=""
												placeholder="60"
												tooltip={t("enterPatientWeight")}
												name="weight"
												id="weight"
												nextField="bp"
												value={form.values.weight}
												required
											/>
											<InputForm
												form={form}
												label=""
												placeholder="120/80"
												tooltip={t("enterPatientBp")}
												name="bp"
												id="bp"
												nextField="dateOfBirth"
												value={form.values.bp}
												required
											/>
										</Flex>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("age")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<Flex gap="xs">
											<InputNumberForm
												form={form}
												label=""
												placeholder="Y"
												tooltip={t("years")}
												name="ageYear"
												id="ageYear"
												nextField="ageMonth"
												value={form.values.ageYear}
												min={0}
												max={150}
											/>
											<InputNumberForm
												form={form}
												label=""
												placeholder="M"
												tooltip={t("months")}
												name="ageMonth"
												id="ageMonth"
												nextField="ageDay"
												value={form.values.ageMonth}
												min={0}
												max={11}
											/>
											<InputNumberForm
												form={form}
												label=""
												placeholder="D"
												tooltip={t("days")}
												name="ageDay"
												id="ageDay"
												nextField="district"
												value={form.values.ageDay}
												min={0}
												max={31}
											/>
										</Flex>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("gender")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<SegmentedControl
											fullWidth
											color="var(--theme-primary-color-6)"
											value={gender}
											id="gender"
											name="gender"
											onChange={(val) => handleGenderChange(val)}
											data={[
												{ label: t("male"), value: "male" },
												{ label: t("female"), value: "female" },
												{ label: t("other"), value: "other" },
											]}
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("FatherName")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterGuardianName")}
											placeholder="John Doe"
											name="guardian_name"
											id="guardian_name"
											nextField="guardian_mobile"
											value={form.values.guardian_name}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("MotherName")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterGuardianName")}
											placeholder="+8801711111111"
											name="guardian_mobile"
											id="guardian_mobile"
											nextField="identity"
											value={form.values.guardian_mobile}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("GuardianName")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterGuardianName")}
											placeholder="John Doe"
											name="guardian_name"
											id="guardian_name"
											nextField="guardian_mobile"
											value={form.values.guardian_name}
											required
										/>
									</Grid.Col>
								</Grid>
							</Stack>
							<Stack className="form-stack-vertical">

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("GuardianMobile")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterGuardianName")}
											placeholder="+8801711111111"
											name="guardian_mobile"
											id="guardian_mobile"
											nextField="identity"
											value={form.values.guardian_mobile}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("GuardianMobile")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterGuardianName")}
											placeholder="+8801711111111"
											name="guardian_mobile"
											id="guardian_mobile"
											nextField="identity"
											value={form.values.guardian_mobile}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("RelationWithParent")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterPresentAddress")}
											placeholder="12 street, 123456"
											name="presentAddress"
											id="presentAddress"
											nextField="permanentAddress"
											value={form.values.presentAddress}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("Profession")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterPresentAddress")}
											placeholder="12 street, 123456"
											name="presentAddress"
											id="presentAddress"
											nextField="permanentAddress"
											value={form.values.presentAddress}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("PermanentAddress")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterPermanentAddress")}
											placeholder="12 street, 123456"
											name="permanentAddress"
											id="permanentAddress"
											nextField="dateOfBirth"
											value={form.values.permanentAddress}
											required
										/>
									</Grid.Col>
								</Grid>

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("Religion")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterReligion")}
											placeholder="Islam"
											name="religion"
											id="religion"
											nextField="bloodGroup"
											value={form.values.religion}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("Nationality")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterReligion")}
											placeholder="Bangladesh"
											name="religion"
											id="religion"
											nextField="bloodGroup"
											value={form.values.religion}
											required
										/>
									</Grid.Col>
								</Grid>
							</Stack>
						</ScrollArea>
					</Box>
				</Grid.Col>
			</Grid>
			<IPDFooter form={form} entities={entities} isSubmitting={isSubmitting} handleSubmit={handleSubmit} />
			<DoctorsRoomDrawer form={form} opened={openedDoctorsRoom} close={closeDoctorsRoom} />
		</>
	);
}
