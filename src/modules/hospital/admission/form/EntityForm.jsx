import InputForm from "@components/form-builders/InputForm";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import SelectForm from "@components/form-builders/SelectForm";

import { ActionIcon, Box, Flex, Grid, LoadingOverlay, ScrollArea, SegmentedControl, Stack, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import DoctorsRoomDrawer from "@hospital-components/__DoctorsRoomDrawer";
import { useDisclosure } from "@mantine/hooks";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData, storeEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import useDataWithoutStore from "@hooks/useDataWithoutStore";

import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { calculateDetailedAge, formatDate, formatDOB } from "@utils/index";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { CORE_DROPDOWNS, HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice.js";
import useHospitalSettingData from "@hooks/config-data/useHospitalSettingData";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import IpdActionButtons from "@hospital-components/_IpdActionButtons";
import DateSelectorForm from "@components/form-builders/DateSelectorForm";
import RequiredAsterisk from "@components/form-builders/RequiredAsterisk";

const USER_NID_DATA = {
	verifyToken: "a9a98eac-68c4-4dd1-9cb9-8127a5b44833",
	citizenData: {
		mobile: null,
		fullName_English: "Md KarimI Mia",
		motherName_English: "",
		motherName_Bangla: "মোসাঃ ….. বেগম",
		fatherName_English: "",
		fatherName_Bangla: "মোঃ আঃ ……….",
		permanentHouseholdNoText: null,
		dob: "1986-05-10",
		bin_BRN: null,
		gender: 1,
		fullName_Bangla: "মোঃ ….. ইসলাম",
		presentHouseholdNoText: null,
		citizen_nid: "1234567890",
		permanentHouseholdNo: {
			division: "Dhaka",
			district: "Narayanganj",
			upazilla: "Sonargaon",
			unionOrWard: null,
			mouzaOrMoholla: "Pailopara",
			villageOrRoad: "Cengakandini",
			houseOrHoldingNo: "",
			address_line: null,
		},
		presentHouseholdNo: {
			division: "Dhaka",
			district: "Narayanganj",
			upazilla: "Sonargaon",
			unionOrWard: "Baridhi",
			mouzaOrMoholla: "Pailopara",
			villageOrRoad: "Cengakandini",
			houseOrHoldingNo: "",
			address_line: null,
		},
	},
};

export default function EntityForm({ form, module }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [gender, setGender] = useState("male");
	const [openedDoctorsRoom, { open: openDoctorsRoom, close: closeDoctorsRoom }] = useDisclosure(false);
	const { t } = useTranslation();
	const { id } = useParams();
	const [admissionData, setAdmissionData] = useState(USER_NID_DATA);
	const [showUserData, setShowUserData] = useState({});
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 248;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { hospitalSettingData } = useHospitalSettingData();
	const [openedHSIDDataPreview, { open: openHSIDDataPreview, close: closeHSIDDataPreview }] = useDisclosure(false);
	const locations = useSelector((state) => state.crud.locations.data);

	const { data: entity, isLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.VIEW}/${id}`,
	});

	useEffect(() => {
		if(entity?.data === 'not_found'){
			navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMISSION.INDEX, { replace: true });
		}
	}, [entity]);

	useEffect(() => {
		dispatch(getIndexEntityData({ module: "locations", url: HOSPITAL_DATA_ROUTES.API_ROUTES.LOCATIONS.INDEX }));
	}, []);

	const { data: countryDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.COUNTRY.PATH,
		utility: CORE_DROPDOWNS.COUNTRY.UTILITY,
	});

	const { data: religionDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.RELIGION.PATH,
		utility: CORE_DROPDOWNS.RELIGION.UTILITY,
		params: { "dropdown-type": CORE_DROPDOWNS.RELIGION.TYPE },
	});

	const { data: doctorDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_DOCTOR.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_DOCTOR.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_DOCTOR.UTILITY,
	});

	const BLOOD_GROUPS = [
		{ label: "A+", value: "A+" },
		{ label: "A-", value: "A-" },
		{ label: "B+", value: "B+" },
		{ label: "B-", value: "B-" },
		{ label: "O+", value: "O+" },
		{ label: "O-", value: "O-" },
		{ label: "AB+", value: "AB+" },
		{ label: "AB-", value: "AB-" },
	];

	const handleSubmit = async (skipRedirect = false) => {
		if (!form.validate().hasErrors) {
			setIsSubmitting(true);

			try {
				const createdBy = JSON.parse(localStorage.getItem("user"));

				const formValue = {
					...form.values,
					dob: formatDate(form.values.dob),
					created_by_id: createdBy?.id,
				};

				const data = {
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.UPDATE}/${id}`,
					data: formValue,
					module,
				};

				const resultAction = await dispatch(updateEntityData(data));

				if (storeEntityData.rejected.match(resultAction)) {
					showNotificationComponent(resultAction.payload.message, "red", "lightgray", "", true, 500, true);
				} else {
					showNotificationComponent(
						t("PatientAdmittedSuccessfully"),
						"green",
						"lightgray",
						"",
						true,
						1000,
						true
					);
					setRefetchData({ module, refetching: true });
					if (!skipRedirect) {
						navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMISSION.INDEX, { replace: true });
					} else {
						return resultAction.payload?.data || {};
					}
				}
			} catch (error) {
				console.error("Error submitting admission:", error);
				showNotificationComponent(t("SomethingWentWrong"), "red", "lightgray", "", true, 700, true);
			} finally {
				setIsSubmitting(false);
			}
		} else {
			if (Object.keys(form.errors)?.length > 0 && form.isDirty()) {
				console.error(form.errors);
				notifications.show({
					title: "Error",
					message: t("PleaseFillAllFieldsToSubmit"),
					color: "red",
					position: "top-right",
				});
			}
		}
	};

	const handleGenderChange = (val) => {
		setGender(val);
		form.setFieldValue("gender", val);
	};



	const item = entity?.data;
	const entities = entity?.data?.invoice_particular;

	useEffect(() => {
		Object.entries(item || {})?.forEach(([key, value]) => {
			form.setFieldValue(key, value);
		});
	}, [item]);

	useEffect(() => {
		handleDobChange();
	}, [JSON.stringify(form.values.dob)]);

	const handleDobChange = () => {
		if (form.values.dob) {
			const formattedDOB = formatDOB(form.values.dob);
			const detailedAge = calculateDetailedAge(formattedDOB);
			form.setFieldValue("year", detailedAge.years);
			form.setFieldValue("month", detailedAge.months);
			form.setFieldValue("day", detailedAge.days);
		}
	};

	// =============== handle HSID search and populate form fields ================
	const handleHSIDSearch = () => {
		if (!form.values.identity) {
			showNotificationComponent(t("PleaseEnterIdentity"), "red", "lightgray", "", true, 700, true);
			return;
		}
		setShowUserData(true);

		// =============== populate form fields with emergency data ================
		setTimeout(() => {
			form.setFieldValue("name", admissionData.citizenData.fullName_English);
			form.setFieldValue("mobile", admissionData.citizenData.mobile);
			form.setFieldValue("gender", admissionData.citizenData.gender === 1 ? "male" : "female");
			form.setFieldValue("dob", "01-01-1990");
			form.setFieldValue(
				"guardian_name",
				admissionData.citizenData.fatherName_English || admissionData.citizenData.motherName_English
			);
			form.setFieldValue(
				"address",
				`${admissionData.citizenData.presentHouseholdNo.division}, ${admissionData.citizenData.presentHouseholdNo.district}, ${admissionData.citizenData.presentHouseholdNo.upazilla}, ${admissionData.citizenData.presentHouseholdNo.unionOrWard}, ${admissionData.citizenData.presentHouseholdNo.mouzaOrMoholla}, ${admissionData.citizenData.presentHouseholdNo.villageOrRoad}, ${admissionData.citizenData.presentHouseholdNo.houseOrHoldingNo}`
			);

			// =============== trigger age calculation ================
			handleDobChange();
		}, 500);
	};

	const handleTypeChange = (val) => {
		form.setFieldValue("identity_mode", val);
	};

	return (
		<Box pos="relative">
			<LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
			<Box w="100%">
				<Grid columns="24" gutter="les">
					<Grid.Col className="form-stack-vertical" span={8}>
						<Box>
							<Box bg="var(--theme-primary-color-0)" p="sm">
								<Text fw={600} fz="sm" py="es">
									{t("AdmissionInformation")}
								</Text>
							</Box>
							<ScrollArea scrollbars="y" type="never" h={height}>
								<Stack p={"xs"} gap={"mes"}>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Created")}</Text>
										</Grid.Col>
										<Grid.Col span={14} fz={"xs"}>
											{formatDate(item?.created_at)}
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("InvoiceID")}</Text>
										</Grid.Col>
										<Grid.Col span={14} fz={"xs"}>
											{item?.invoice}
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("PatientID")}</Text>
										</Grid.Col>
										<Grid.Col span={14} fz={"xs"}>
											{item?.patient_id}
										</Grid.Col>
									</Grid>

									<Flex className="form-action-header full-bleed">
										<Text fz="sm">{t("Cabin/Bed")}</Text>
										<Flex align="center" gap="xs">
											<Text fz="sm">{entities?.[0]?.item_name}</Text>
										</Flex>
									</Flex>

									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("UnitName")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												label=""
												tooltip={t("EnterUnitName")}
												placeholder="R1234"
												name="admit_unit_id"
												id="admit_unit_id"
												value={form.values.admit_unit_id?.toString()}
												dropdownValue={hospitalSettingData?.["unit-group"]?.modes.map(
													(mode) => ({
														label: mode.name,
														value: mode.id?.toString(),
													})
												)}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Department")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												label=""
												tooltip={t("EnterDepartmentName")}
												placeholder="Medicine"
												name="admit_department_id"
												id="admit_department_id"
												value={form.values.admit_department_id?.toString()}
												dropdownValue={hospitalSettingData?.department?.modes.map((mode) => ({
													label: mode.name,
													value: mode.id?.toString(),
												}))}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("AssignConsultant")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>{item?.admit_consultant_name}</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("AssignDoctor")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												label=""
												tooltip={t("EnterAssignDoctorName")}
												placeholder="HeadofUnitDoctor"
												name="admit_doctor_id"
												id="admit_doctor_id"
												value={form.values.admit_doctor_id?.toString()}
												dropdownValue={doctorDropdown}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Comment")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<TextAreaForm
												form={form}
												label=""
												tooltip={t("EnterCommentText")}
												placeholder="Comment"
												name="comment"
												id="comment"
												nextField="dob"
												value={form.values.comment}
												style={{ input: { height: "60px" } }}
											/>
										</Grid.Col>
									</Grid>

									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("PrescriptionDoctor")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<Text fz="sm">{item?.prescription_doctor_name}</Text>
										</Grid.Col>
									</Grid>
								</Stack>
							</ScrollArea>
						</Box>
					</Grid.Col>
					<Grid.Col className="form-stack-vertical" span={8}>
						<Box>
							<Box bg="var(--theme-primary-color-0)" p="sm">
								<Text fw={600} fz="sm" py="es">
									{t("AdmissionBasic")}
								</Text>
							</Box>
							<ScrollArea scrollbars="y" type="never" h={height}>
								<Stack p={"xs"} gap={"mes"}>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("SpO2")}</Text>
										</Grid.Col>
										<Grid.Col span={5}>
											<Flex gap="les">
												<InputNumberForm
													form={form}
													label=""
													placeholder={t("SpO2")}
													tooltip={t("EnterPatientSpO2")}
													name="oxygen"
													id="oxygen"
													nextField="temperature"
													value={form.values.oxygen}
													required
												/>
											</Flex>
										</Grid.Col>
										<Grid.Col span={4}>
											<Text fz="sm">{t("Temperature")}</Text>
										</Grid.Col>
										<Grid.Col span={5}>
											<Flex gap="les">
												<InputNumberForm
													form={form}
													label=""
													placeholder={t("Temperature")}
													tooltip={t("EnterPatientTemperature")}
													name="temperature"
													id="temperature"
													nextField="weight"
													value={form.values.temperature}
													required
												/>
											</Flex>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Weight")}</Text>
										</Grid.Col>
										<Grid.Col span={5}>
											<Flex gap="les">
												<InputNumberForm
													form={form}
													label=""
													placeholder="60"
													tooltip={t("EnterPatientWeight")}
													name="weight"
													id="weight"
													nextField="bp"
													value={form.values.weight}
													required
												/>
											</Flex>
										</Grid.Col>
										<Grid.Col span={4}>
											<Text fz="sm">{t("Blood/Presure")}</Text>
										</Grid.Col>
										<Grid.Col span={5}>
											<Flex gap="les">
												<InputForm
													form={form}
													label=""
													placeholder="120/80"
													tooltip={t("EnterPatientBp")}
													name="bp"
													id="bp"
													nextField="pulse"
													value={form.values.bp}
													required
												/>
											</Flex>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Pulse")}</Text>
										</Grid.Col>
										<Grid.Col span={5}>
											<Flex gap="les">
												<InputForm
													form={form}
													label=""
													placeholder={t("Pulse")}
													tooltip={t("EnterPatientPulse")}
													name="pulse"
													id="pulse"
													nextField="blood_sugar"
													value={form.values.pulse}
													required
												/>
											</Flex>
										</Grid.Col>
										<Grid.Col span={4}>
											<Text fz="sm">{t("Blood/Sugar")}</Text>
										</Grid.Col>
										<Grid.Col span={5}>
											<Flex gap="les">
												<InputForm
													form={form}
													label=""
													placeholder={t("BloodSugar")}
													tooltip={t("BloodSugar")}
													name="blood_sugar"
													id="blood_sugar"
													nextField="blood_group"
													value={form.values.blood_sugar}
												/>
											</Flex>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("SatWithO2")}</Text>
										</Grid.Col>
										<Grid.Col span={5}>
											<Flex gap="les">
												<InputNumberForm
													form={form}
													label=""
													placeholder={t("SatWithO2")}
													tooltip={t("SatWithO2")}
													name="sat_with_O2"
													id="sat_with_O2"
													nextField="sat_without_O2"
													value={form.values.sat_with_O2}
												/>
											</Flex>
										</Grid.Col>
										<Grid.Col span={4}>
											<Text fz="sm">{t("SatWithoutO2")}</Text>
										</Grid.Col>
										<Grid.Col span={5}>
											<Flex gap="les">
												<InputNumberForm
													form={form}
													label=""
													placeholder={t("SatWithoutO2")}
													tooltip={t("SatWithoutO2")}
													name="sat_without_O2"
													id="sat_without_O2"
													nextField="blood_group"
													value={form.values.sat_without_O2}
													required
												/>
											</Flex>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("bloodGroup")}</Text>
										</Grid.Col>
										<Grid.Col span={5}>
											<SelectForm
												form={form}
												name="blood_group"
												id="blood_group"
												dropdownValue={BLOOD_GROUPS}
												value={form.values?.blood_group}
												mt={0}
												size="sm"
												pt={0}
												placeholder="A+"
											/>
										</Grid.Col>
										<Grid.Col span={4}>
											<Text fz="sm">{t("Respiration")}</Text>
										</Grid.Col>
										<Grid.Col span={5}>
											<Flex gap="les">
												<InputForm
													form={form}
													label=""
													placeholder={t("Respiration")}
													tooltip={t("Respiration")}
													name="respiration"
													id="respiration"
													nextField="name"
													value={form.values.respiration}
													required
												/>
											</Flex>
										</Grid.Col>
									</Grid>
								</Stack>
								<Stack p={"xs"} gap={"mes"}>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("patientName")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												label=""
												tooltip={t("EnterPatientName")}
												placeholder={t("EnterPatientName")}
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
												tooltip={t("EnterPatientName")}
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
											<Text fz="sm">{t("gender")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SegmentedControl
												fullWidth
												color="var(--theme-primary-color-6)"
												value={form.values.gender}
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
											<Text fz="sm">{t("DOB")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<DateSelectorForm
												key={form.values.dob ? form.values?.dob : "dob-empty"}
												form={form}
												placeholder="01-01-2020"
												tooltip={t("EnterDateOfBirth")}
												name="dob"
												id="dob"
												nextField="year"
												value={form.values.dob}
												required
												disabledFutureDate
											/>
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
													placeholder="Years"
													tooltip={t("days")}
													name="year"
													id="year"
													nextField="father_name"
													value={form.values.year}
													min={0}
													max={31}
												/>
												<InputNumberForm
													form={form}
													label=""
													placeholder="Months"
													tooltip={t("Months")}
													name="month"
													id="month"
													nextField="year"
													value={form.values.month}
													min={0}
													max={11}
												/>
												<InputNumberForm
													form={form}
													label=""
													placeholder="Days"
													tooltip={t("Days")}
													name="day"
													id="day"
													nextField="month"
													value={form.values.day}
													min={0}
													max={150}
												/>
											</Flex>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("Religion")}
												<RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("SelectReligionValidateMessage")}
												placeholder={t("SelectReligion")}
												name="religion_id"
												id="religion_id"
												nextField="name"
												value={form.values.religion_id}
												dropdownValue={religionDropdown}
											/>
										</Grid.Col>
									</Grid>
								</Stack>
							</ScrollArea>
						</Box>
					</Grid.Col>
					<Grid.Col className="form-stack-vertical" span={8}>
						<Box>
							<Box bg="var(--theme-primary-color-0)" p="sm">
								<Text fw={600} fz="sm" py="es">
									{t("PersonalInformation")}
								</Text>
							</Box>
							<ScrollArea scrollbars="y" type="never" h={height}>
								<Stack p="xs" gap={"mes"}>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Type")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SegmentedControl
												fullWidth
												color="var(--theme-primary-color-6)"
												value={form.values.identity_mode?.toUpperCase()}
												id="identity_mode"
												name="identity_mode"
												data={[
													{ label: t("NID"), value: "NID" },
													{ label: t("BRID"), value: "BRID" },
													{ label: t("HID"), value: "HID" },
												]}
												onChange={(val) => handleTypeChange(val)}
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
												tooltip={t("EnterPatientIdentity")}
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
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("FatherName")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												label=""
												tooltip={t("EnterFatherName")}
												placeholder={t("EnterFatherName")}
												name="father_name"
												id="father_name"
												nextField="father_name"
												value={form.values.father_name}
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
												tooltip={t("EnterMotherName")}
												placeholder={t("EnterMotherName")}
												name="mother_name"
												id="mother_name"
												nextField="identity"
												value={form.values.mother_name}
												required
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("GuardianName")}
												<RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												label=""
												tooltip={t("EnterGuardianName")}
												placeholder={t("EnterGuardianName")}
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
											<Text fz="sm">
												{t("GuardianMobile")}
												<RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												label=""
												tooltip={t("EnterGuardianName")}
												placeholder="+8801711111111"
												name="guardian_mobile"
												id="guardian_mobile"
												nextField="patient_relation"
												value={form.values.guardian_mobile}
												required
											/>
										</Grid.Col>
									</Grid>

									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("RelationWithPatient")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												label=""
												tooltip={t("EnterPatientRelation")}
												placeholder={t("EnterPatientRelation")}
												name="patient_relation"
												id="patient_relation"
												nextField="profession"
												value={form.values.patient_relation}
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
												tooltip={t("EnterProfession")}
												placeholder={t("EnterProfession")}
												name="profession"
												id="profession"
												nextField="present_address"
												value={form.values.profession}
												required
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Flex align="center" gap="es">
												<Text fz="sm">{t("Upazilla")}</Text>
											</Flex>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("EnterPatientUpazilla")}
												placeholder="Upazilla - District"
												name="upazilla_id"
												id="upazilla_id"
												nextField="identity"
												value={form.values.upazilla_id}
												required
												dropdownValue={locations?.data?.map((location) => ({
													label: `${location.district || "District"} - ${location.name}`,
													value: location.id?.toString(),
												}))}
												searchable
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("PresentAddress")}
												<RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												label=""
												tooltip={t("EnterPresentAddress")}
												placeholder="12 street, 123456"
												name="address"
												id="address"
												nextField="permanent_address"
												value={form.values.address}
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
												tooltip={t("EnterPermanentAddress")}
												placeholder="12 street, 123456"
												name="permanent_address"
												id="permanent_address"
												nextField="dateOfBirth"
												value={form.values.permanentAddress}
												required
											/>
										</Grid.Col>
									</Grid>

									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Nationality")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("NationalityValidateMessage")}
												placeholder={t("Nationality")}
												name="country_id"
												id="country_id"
												value={form.values.country_id}
												dropdownValue={countryDropdown}
											/>
										</Grid.Col>
									</Grid>
								</Stack>
							</ScrollArea>
						</Box>
					</Grid.Col>
				</Grid>
			</Box>
			<IpdActionButtons
				form={form}
				isSubmitting={isSubmitting}
				entities={entities}
				handleSubmit={handleSubmit}
				type="admission"
				item={item}
			/>
			<DoctorsRoomDrawer form={form} opened={openedDoctorsRoom} close={closeDoctorsRoom} />
		</Box>
	);
}
