import InputForm from "@components/form-builders/InputForm";
import {
	ActionIcon,
	Box,
	Button,
	Divider,
	Flex,
	Grid,
	Modal,
	ScrollArea,
	SegmentedControl,
	Stack,
	Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { IconArrowRight, IconInfoCircle, IconSearch } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DoctorsRoomDrawer from "./__DoctorsRoomDrawer";
import { useDisclosure, useHotkeys, useIsFirstRender } from "@mantine/hooks";
import { calculateAge, calculateDetailedAge } from "@/common/utils";
import Table from "../visit/_Table";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@/common/components/core-component/showNotificationComponent";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useDispatch } from "react-redux";
import InputMaskForm from "@components/form-builders/InputMaskForm";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import NIDDataPreviewModal from "./NIDDataPreviewModal";

const LOCAL_STORAGE_KEY = "emergencyPatientFormData";

// =============== sample user data for emergency patient ================
const USER_EMERGENCY_DATA = {
	verifyToken: "emergency-12345-abcde-67890-fghij",
	citizenData: {
		mobile: "+880 1717171717",
		fullName_English: "Patient",
		motherName_English: "Patient's Mother",
		motherName_Bangla: "রোগীর মা",
		fatherName_English: "Patient's Father",
		fatherName_Bangla: "রোগীর বাবা",
		permanentHouseholdNoText: null,
		dob: "1990-01-01",
		bin_BRN: null,
		gender: 1,
		fullName_Bangla: "রোগী",
		presentHouseholdNoText: null,
		citizen_nid: "1234567890",
		permanentHouseholdNo: {
			division: "Dhaka",
			district: "Dhaka",
			upazilla: "Dhaka City",
			unionOrWard: "Ward",
			mouzaOrMoholla: "Area",
			villageOrRoad: "Street",
			houseOrHoldingNo: "123",
			address_line: "Address Line",
		},
		presentHouseholdNo: {
			division: "Dhaka",
			district: "Dhaka",
			upazilla: "Dhaka City",
			unionOrWard: "Ward",
			mouzaOrMoholla: "Area",
			villageOrRoad: "Street",
			houseOrHoldingNo: "123",
			address_line: "Address Line",
		},
	},
};

export default function EmergencyPatientForm({ form, module }) {
	const { mainAreaHeight } = useOutletContext();
	const { t } = useTranslation();
	const [openedDoctorsRoom, { close: closeDoctorsRoom }] = useDisclosure(false);
	const [opened, { open, close }] = useDisclosure(false);

	useEffect(() => {
		const type = form.values.ageType || "year";
		const formattedAge = calculateAge(form.values.dob, type);
		form.setFieldValue("age", formattedAge);

		// =============== calculate detailed age from date of birth ================
		if (form.values.dob) {
			const detailedAge = calculateDetailedAge(form.values.dob);
			form.setFieldValue("year", detailedAge.years);
			form.setFieldValue("month", detailedAge.months);
			form.setFieldValue("day", detailedAge.days);
		}
	}, [form.values.dob]);

	useEffect(() => {
		document.getElementById("patientName").focus();
	}, []);

	const handleOpenViewOverview = () => {
		open();
	};

	return (
		<Box w="100%" bg="white" py="xxs" style={{ borderRadius: "4px" }}>
			<form>
				<Flex align="center" gap="xs" justify="space-between" px="sm" pb="xs">
					<Text fw={600} fz="sm">
						{t("patientInformation")}
					</Text>
					<Flex gap="xs">
						<SegmentedControl
							size="xs"
							color="var(--theme-primary-color-6)"
							data={["New", "Re-Visit"]}
							styles={{
								root: { backgroundColor: "var(--theme-tertiary-color-1)" },
								control: { width: "60px" },
							}}
						/>
						<Button
							onClick={handleOpenViewOverview}
							size="xs"
							radius="es"
							rightSection={<IconArrowRight size={16} />}
							bg="var(--theme-success-color)"
							c="white"
						>
							{t("VisitTable")}
						</Button>
					</Flex>
				</Flex>
				<Form form={form} module={module} />
			</form>
			<DoctorsRoomDrawer form={form} opened={openedDoctorsRoom} close={closeDoctorsRoom} />
			<Modal opened={opened} onClose={close} size="100%" centered>
				<Table module={module} height={mainAreaHeight - 220} />
			</Modal>
		</Box>
	);
}

export function Form({ form, showTitle = false, heightOffset = 72, module, type = "emergency" }) {
	const [openedHSIDDataPreview, { open: openHSIDDataPreview, close: closeHSIDDataPreview }] = useDisclosure(false);
	const [showUserData, setShowUserData] = useState(false);
	const [userEmergencyData] = useState(USER_EMERGENCY_DATA);
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - heightOffset;
	const firstRender = useIsFirstRender();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch();
	const { hospitalConfigData } = useHospitalConfigData();
	console.log(hospitalConfigData);
	const configuredDueAmount = Number(hospitalConfigData?.[`${type}_fee`]?.[`${type}_fee_price`] ?? 0);
	const enteredAmount = Number(form?.values?.amount ?? 0);
	const remainingBalance = configuredDueAmount - enteredAmount;
	const displayAmount = Math.abs(remainingBalance);

	const handleReset = () => {
		form.reset();
		localStorage.removeItem(LOCAL_STORAGE_KEY);
		setShowUserData(false);
	};

	useHotkeys([["alt+r", handleReset]]);

	// =============== save to localStorage on every form change ================
	useEffect(() => {
		if (!firstRender) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(form.values));
		}
	}, [form.values]);

	useEffect(() => {
		const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (saved && firstRender) {
			try {
				const parsed = JSON.parse(saved);
				Object.entries(parsed).forEach(([key, value]) => {
					// =============== handle date fields - convert string back to Date object ================
					if (key === "appointment") {
						if (value && typeof value === "string") {
							form.setFieldValue(key, new Date(value));
						} else {
							form.setFieldValue(key, value);
						}
					} else {
						form.setFieldValue(key, value || "");
					}
				});
			} catch (err) {
				// =============== ignore parse errors ================
				console.error("Failed to parse saved form data:", err);
			}
		}
	}, [firstRender]);

	const handleGenderChange = (val) => {
		form.setFieldValue("gender", val);
	};

	const handleTypeChange = (val) => {
		form.setFieldValue("identity_mode", val);
	};

	const handleDobChange = () => {
		const type = form.values.ageType || "year";
		const formattedAge = calculateAge(form.values.dob, type);
		form.setFieldValue("age", formattedAge);

		// =============== calculate detailed age from date of birth ================
		if (form.values.dob) {
			const detailedAge = calculateDetailedAge(form.values.dob);
			form.setFieldValue("year", detailedAge.years);
			form.setFieldValue("month", detailedAge.months);
			form.setFieldValue("day", detailedAge.days);
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

	const handleSubmit = async () => {
		if (!form.validate().hasErrors) {
			setIsSubmitting(true);

			if (!form.values.amount && form.values.patient_payment_mode_id == "30") {
				showNotificationComponent(t("Amount is required"), "red", "lightgray", true, 1000, true);
				setIsSubmitting(false);
				return {};
			}

			try {
				const createdBy = JSON.parse(localStorage.getItem("user"));
				const options = { year: "numeric", month: "2-digit", day: "2-digit" };
				const [day, month, year] = form.values.dob.split("-").map(Number);
				const dateObj = new Date(year, month - 1, day);

				const today = new Date();

				// strict validation: check if JS normalized it
				const isValid =
					dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day;

				// check if future date
				if (dateObj > today) {
					showNotificationComponent(
						t("Date of birth can't be future date"),
						"red",
						"lightgray",
						true,
						1000,
						true
					);
					setIsSubmitting(false);
					return {};
				}

				const formValue = {
					...form.values,
					created_by_id: createdBy?.id,
					dob: isValid ? dateObj.toLocaleDateString("en-CA", options) : "invalid",
					appointment: new Date(form.values.appointment).toLocaleDateString("en-CA", options),
				};

				const data = {
					url: HOSPITAL_DATA_ROUTES.API_ROUTES.EMERGENCY.CREATE,
					data: formValue,
					module,
				};

				const resultAction = await dispatch(storeEntityData(data));

				if (storeEntityData.rejected.match(resultAction)) {
					showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 1000, true);
				} else {
					showNotificationComponent(
						t("Emergency saved successfully"),
						"green",
						"lightgray",
						true,
						1000,
						true
					);
					setRefetchData({ module, refetching: true });
					form.reset();
					localStorage.removeItem(LOCAL_STORAGE_KEY);
					setShowUserData(false);
				}
			} catch (error) {
				console.error("Error submitting emergency:", error);
				showNotificationComponent(t("Something went wrong"), "red", "lightgray", true, 1000, true);
			} finally {
				setIsSubmitting(false);
			}
		} else {
			if (Object.keys(form.errors)?.length > 0 && form.isDirty()) {
				console.error(form.errors);
				showNotificationComponent(t("PleaseFillAllFields"), "red", "lightgray", true, 1000, true);
			}
		}
	};

	return (
		<Box>
			{showTitle && (
				<Flex bg="var(--theme-primary-color-0)" align="center" gap="xs" p="sm">
					<Text fw={600} fz="sm">
						{t("patientInformation")}
					</Text>
				</Flex>
			)}
			<Box>
				<Grid columns={12} gutter="sm">
					<Grid.Col span={12}>
						<ScrollArea h={height - 92}>
							<Stack mih={height} className="form-stack-vertical">
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
										<Text fz="sm">{t("NIDBirthCertificate")}</Text>
									</Grid.Col>
									<Grid.Col span={9}>
										<InputNumberForm
											form={form}
											label=""
											placeholder="1234567890"
											tooltip={t("enterPatientIdentity")}
											name="identity"
											id="identity"
											nextField="address"
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
									<Grid.Col span={20}>
										<Divider />
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("patientName")}</Text>
									</Grid.Col>
									<Grid.Col span={14} pb={0}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterPatientName")}
											placeholder="Md. Abdul"
											name="name"
											id="patientName"
											nextField="dob"
											value={form.values.name}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20} mt={"xs"}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("mobile")}</Text>
									</Grid.Col>
									<Grid.Col span={14} pb={0}>
										<InputForm
											form={form}
											label=""
											tooltip={t("enterPatientMobile")}
											placeholder="+880 1717171717"
											name="mobile"
											id="mobile"
											nextField="district"
											value={form.values.mobile}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("gender")}</Text>
									</Grid.Col>
									<Grid.Col span={14} pb={0}>
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
										<Text fz="sm">{t("dateOfBirth")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputMaskForm
											name="dob"
											id="dob"
											value={form.values.dob}
											form={form}
											label=""
											tooltip={t("enterPatientBirthDate")}
											placeholder="00-00-0000"
											nextField="days"
											maskInput="00-00-0000"
											required={false}
											onChange={handleDobChange}
											rightSection={<IconInfoCircle size={16} opacity={0.5} />}
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
												tooltip={t("years")}
												name="year"
												id="year"
												nextField="month"
												min={0}
												max={150}
												leftSection={
													<Text fz="sm" px="sm">
														{t("Y")}
													</Text>
												}
											/>
											<InputNumberForm
												form={form}
												label=""
												placeholder="Months"
												tooltip={t("months")}
												name="month"
												id="month"
												nextField="day"
												min={0}
												max={11}
												leftSection={
													<Text fz="sm" px="sm">
														{t("M")}
													</Text>
												}
											/>
											<InputNumberForm
												form={form}
												label=""
												placeholder="Days"
												tooltip={t("days")}
												name="day"
												id="day"
												nextField="mobile"
												min={0}
												max={31}
												leftSection={
													<Text fz="sm" px="sm">
														{t("D")}
													</Text>
												}
											/>
										</Flex>
									</Grid.Col>
								</Grid>
								<Grid columns={20}>
									<Grid.Col span={6} mt="xs">
										<Text fz="sm">{t("FreeFor")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<SegmentedControl
											fullWidth
											color="var(--theme-primary-color-6)"
											value={form.values.patient_payment_mode_id}
											id="patient_payment_mode_id"
											name="patient_payment_mode_id"
											onChange={(val) => form.setFieldValue("patient_payment_mode_id", val)}
											data={[
												{ label: t("General"), value: "30" },
												{ label: t("FreedomFighter"), value: "31" },
												{ label: t("GovtService"), value: "32" },
												{ label: t("Disabled"), value: "44" },
											]}
										/>
										{form.values.patient_payment_mode_id !== "30" && (
											<InputForm
												form={form}
												label=""
												mt="xxs"
												tooltip={t("enterFreeIdentificationId")}
												placeholder="Enter Free ID"
												name="free_identification_id"
												id="free_identification_id"
												nextField="file"
												value={form.values.free_identification_id || ""}
											/>
										)}
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
											placeholder="EnterFather/Mother/Husband/Brother"
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
										<Text fz="sm">{t("GuardianMobile")}</Text>
									</Grid.Col>
									<Grid.Col span={14} pb={0}>
										<InputForm
											form={form}
											label=""
											tooltip={t("EnterPatientMobile")}
											placeholder="+880 1717171717"
											name="mobile"
											id="mobile"
											nextField="district"
											value={form.values.mobile}
											required
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20} mt={"xs"}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("address")}</Text>
									</Grid.Col>
									<Grid.Col span={14} pb={0}>
										<TextAreaForm
											form={form}
											label=""
											tooltip={t("enterPatientAddress")}
											placeholder="12 street, 123456"
											name="address"
											id="address"
											nextField="comment"
											value={form.values.address}
											required
										/>
									</Grid.Col>
								</Grid>
							</Stack>
						</ScrollArea>
					</Grid.Col>
				</Grid>
				<Stack gap={0} justify="space-between">
					<Box p="sm" bg="white">
						<Grid columns={24}>
							<Grid.Col span={8} bg="var(--theme-secondary-color-0)" px="xs">
								<Box>
									<Flex gap="xss" align="center" justify="space-between">
										<Text>{t("Fee")}</Text>
										<Box px="xs" py="les">
											<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
												৳ {Number(displayAmount || 0).toLocaleString()}
											</Text>
										</Box>
									</Flex>
								</Box>
							</Grid.Col>
							<Grid.Col span={8} bg="var(--theme-secondary-color-0)" px="xs">
								<Flex align="center" justify="space-between">
									<Box>
										<InputNumberForm
											id="amount"
											form={form}
											tooltip={t("enterAmount")}
											placeholder={t("Amount")}
											name="amount"
											required
										/>
									</Box>
								</Flex>
							</Grid.Col>
							<Grid.Col span={8} bg="var(--theme-secondary-color-0)" px="xs">
								<Box>
									<Flex gap="xss" align="center" justify="space-between">
										<Text>{t("Return")}</Text>
										<Box px="xs" py="les">
											<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
												৳ {Number(displayAmount || 0).toLocaleString()}
											</Text>
										</Box>
									</Flex>
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</Stack>
				<Box pl={"xs"} pr={"xs"}>
					<Button.Group>
						<Button w="100%" bg="var(--theme-prescription-btn-color)" disabled={isSubmitting}>
							<Stack gap={0} align="center" justify="center">
								<Text>{t("prescription")}</Text>
								<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
									(alt + 3)
								</Text>
							</Stack>
						</Button>
						<Button w="100%" bg="var(--theme-pos-btn-color)" disabled={isSubmitting} type="button">
							<Stack gap={0} align="center" justify="center">
								<Text>{t("Pos")}</Text>
								<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
									(alt + p)
								</Text>
							</Stack>
						</Button>
						<Button
							w="100%"
							bg="var(--theme-save-btn-color)"
							onClick={handleSubmit}
							loading={isSubmitting}
							disabled={isSubmitting}
						>
							<Stack gap={0} align="center" justify="center">
								<Text>{t("Save")}</Text>
								<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
									(alt + s)
								</Text>
							</Stack>
						</Button>
					</Button.Group>
				</Box>
			</Box>
			<NIDDataPreviewModal
				opened={openedHSIDDataPreview}
				close={closeHSIDDataPreview}
				userNidData={userEmergencyData}
			/>
		</Box>
	);
}
