import InputForm from "@components/form-builders/InputForm";
import { Box, Flex, Grid, ScrollArea, SegmentedControl, Stack, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DatePickerForm from "@components/form-builders/DatePicker";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DoctorsRoomDrawer from "./__DoctorsRoomDrawer";
import { useDisclosure, useIsFirstRender } from "@mantine/hooks";
import { DISTRICT_LIST } from "@/constants";
import { calculateAge, calculateDetailedAge } from "@/common/utils";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";

const LOCAL_STORAGE_KEY = "patientFormData";

export default function PatientForm({ form }) {
	const firstRender = useIsFirstRender();
	const { t } = useTranslation();
	const [openedDoctorsRoom, { close: closeDoctorsRoom }] = useDisclosure(false);

	// Load from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (saved && firstRender) {
			try {
				const parsed = JSON.parse(saved);
				Object.entries(parsed).forEach(([key, value]) => {
					// Handle date fields - convert string back to Date object
					if (key === "dateOfBirth" || key === "appointment") {
						if (value && typeof value === "string") {
							form.setFieldValue(key, new Date(value));
						} else {
							form.setFieldValue(key, value);
						}
					} else {
						form.setFieldValue(key, value);
					}
				});
			} catch (e) {
				// Ignore parse errors
				console.warn("Failed to parse saved form data:", e);
			}
		}
	}, [firstRender]);

	// Save to localStorage on every form change
	useEffect(() => {
		if (!firstRender) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(form.values));
		}
	}, [form.values]);

	useEffect(() => {
		const type = form.values.ageType || "year";
		const formattedAge = calculateAge(form.values.dateOfBirth, type);
		form.setFieldValue("age", formattedAge);

		// Calculate detailed age from date of birth
		if (form.values.dateOfBirth) {
			const detailedAge = calculateDetailedAge(form.values.dateOfBirth);
			form.setFieldValue("ageYear", detailedAge.years);
			form.setFieldValue("ageMonth", detailedAge.months);
			form.setFieldValue("ageDay", detailedAge.days);
		}
	}, [form.values.dateOfBirth]);

	useEffect(() => {
		document.getElementById("patientName").focus();
	}, []);

	return (
		<Box w="100%" bg="var(--mantine-color-white)" py="2xs" style={{ borderRadius: "4px" }}>
			<form>
				<Flex align="center" gap="xs" justify="space-between" px="sm" pb="xs">
					<Text fw={600} fz="sm">
						{t("patientInformation")}
					</Text>
				</Flex>
				<TabsWithSearch
					hideSearchbar={true}
					tabList={["new", "reVisit"]}
					tabPanels={[
						{
							tab: "new",
							component: <Form form={form} />,
						},
						{
							tab: "reVisit",
							component: <Box>Re-Visit</Box>,
						},
					]}
				/>
			</form>
			<DoctorsRoomDrawer form={form} opened={openedDoctorsRoom} close={closeDoctorsRoom} />
		</Box>
	);
}

export function Form({ form, showTitle = false, heightOffset = 116 }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - heightOffset;
	const [gender, setGender] = useState("male");

	const handleGenderChange = (val) => {
		setGender(val);
		form.setFieldValue("gender", val);
	};

	// Handle manual age field updates
	const handleAgeFieldChange = (field, value) => {
		form.setFieldValue(field, value);

		// Update the total age field when any of the detailed age fields change
		const year = form.values.ageYear || 0;
		const month = form.values.ageMonth || 0;
		const day = form.values.ageDay || 0;

		// Calculate total age in years (approximate)
		const totalAgeInYears = year + month / 12 + day / 365;
		form.setFieldValue("age", Math.floor(totalAgeInYears));
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
			<ScrollArea scrollbars="y" type="never" h={height}>
				<Stack className="form-stack-vertical">
					<Grid align="center" columns={20}>
						<Grid.Col span={6}>
							<Text fz="sm">{t("appointment")}</Text>
						</Grid.Col>
						<Grid.Col span={14}>
							<DatePickerForm
								form={form}
								label=""
								tooltip={t("bookYourAppointment")}
								placeholder="23-06-2025"
								name="appointment"
								id="appointment"
								nextField="patientName"
								value={form.values.appointment}
								required
								disable
							/>
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
								placeholder="John Doe"
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
							<Text fz="sm">{t("mobile")}</Text>
						</Grid.Col>
						<Grid.Col span={14}>
							<InputForm
								form={form}
								label=""
								tooltip={t("enterPatientMobile")}
								placeholder="+880 1717171717"
								name="mobile"
								id="mobile"
								nextField="dateOfBirth"
								value={form.values.mobile}
								required
							/>
						</Grid.Col>
					</Grid>
					<Grid align="center" columns={20}>
						<Grid.Col span={6}>
							<Text fz="sm">{t("DateOfBirth")}</Text>
						</Grid.Col>
						<Grid.Col span={14}>
							<DatePickerForm
								form={form}
								label=""
								placeholder="23-06-2025"
								tooltip={t("EnterPatientDateOfBirth")}
								name="dateOfBirth"
								id="dateOfBirth"
								nextField="age"
								value={form.values.dateOfBirth}
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
									placeholder="Y"
									tooltip={t("Years")}
									name="ageYear"
									id="ageYear"
									nextField="ageMonth"
									value={form.values.ageYear}
									min={0}
									max={150}
									onChange={(value) => handleAgeFieldChange("ageYear", value)}
								/>
								<InputNumberForm
									form={form}
									label=""
									placeholder="M"
									tooltip={t("Months")}
									name="ageMonth"
									id="ageMonth"
									nextField="ageDay"
									value={form.values.ageMonth}
									min={0}
									max={11}
									onChange={(value) => handleAgeFieldChange("ageMonth", value)}
								/>
								<InputNumberForm
									form={form}
									label=""
									placeholder="D"
									tooltip={t("Days")}
									name="ageDay"
									id="ageDay"
									nextField="district"
									value={form.values.ageDay}
									min={0}
									max={31}
									onChange={(value) => handleAgeFieldChange("ageDay", value)}
								/>
							</Flex>
						</Grid.Col>
					</Grid>
					<Grid align="center" columns={20}>
						<Grid.Col span={6}>
							<Text fz="sm">{t("district")}</Text>
						</Grid.Col>
						<Grid.Col span={14}>
							<SelectForm
								form={form}
								label=""
								tooltip={t("EnterPatientDistrict")}
								placeholder="Dhaka"
								name="district"
								id="district"
								nextField="identity"
								value={form.values.district}
								required
								dropdownValue={DISTRICT_LIST}
								searchable
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

					{/*				<Grid align="center" columns={20}>
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
					</Grid>*/}

					<Grid align="center" columns={20}>
						<Grid.Col span={6}>
							<Text fz="sm">{t("NIDBirthCertificate")}</Text>
						</Grid.Col>
						<Grid.Col span={14}>
							<InputNumberForm
								form={form}
								label=""
								placeholder="1234567890"
								tooltip={t("EnterPatientIdentity")}
								name="identity"
								id="identity"
								nextField="address"
								value={form.values.identity}
								required
							/>
						</Grid.Col>
					</Grid>

					<Grid align="center" columns={20}>
						<Grid.Col span={6}>
							<Text fz="sm">{t("Address")}</Text>
						</Grid.Col>
						<Grid.Col span={14}>
							<TextAreaForm
								form={form}
								label=""
								tooltip={t("EnterPatientAddress")}
								placeholder="12 street, 123456"
								name="address"
								id="address"
								nextField="comment"
								value={form.values.address}
								required
							/>
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
								value={form.values.freeFor}
								id="freeFor"
								name="freeFor"
								onChange={(val) => form.setFieldValue("freeFor", val)}
								data={[
									{ label: t("No"), value: "" },
									{ label: t("FreedomFighter"), value: "FreedomFighter" },
									{ label: t("Disabled"), value: "Disabled" },
									{ label: t("GovtService"), value: "GovtService" },
								]}
							/>
							{form.values.freeFor && (
								<TextAreaForm
									form={form}
									label=""
									mt="2xs"
									tooltip={t("EnterComment")}
									placeholder="Enter comment"
									name="comment"
									id="comment"
									value={form.values.comment || ""}
								/>
							)}
						</Grid.Col>
					</Grid>

					{/* <Flex className="form-action-header full-bleed">
						<Text fz="sm">{t("doctorInformation")}</Text>
						<Flex align="center" gap="xs" onClick={handleOpenDoctorsRoom} className="cursor-pointer">
							<Text fz="sm">{t("booked")}-05</Text> <IconChevronRight size="16px" />
						</Flex>
					</Flex>

					<Grid align="center" columns={20}>
						<Grid.Col span={6}>
							<Text fz="sm">{t("roomNo")}</Text>
						</Grid.Col>
						<Grid.Col span={14} onClick={openDoctorsRoom}>
							<InputNumberForm
								readOnly={true}
								form={form}
								label=""
								tooltip={t("enterPatientRoomNo")}
								placeholder="101"
								name="roomNo"
								id="roomNo"
								nextField="specialization"
								value={form.values.roomNo}
								required
							/>
						</Grid.Col>
					</Grid>
					<Grid align="center" columns={20}>
						<Grid.Col span={6}>
							<Text fz="sm">{t("specialization")}</Text>
						</Grid.Col>
						<Grid.Col span={14} onClick={openDoctorsRoom}>
							<InputForm
								readOnly={true}
								form={form}
								label=""
								tooltip={t("enterPatientSpecialization")}
								placeholder="Cardiologist"
								name="specialization"
								id="specialization"
								nextField="doctorName"
								value={form.values.specialization}
								required
							/>
						</Grid.Col>
					</Grid>
					<Grid align="center" columns={20}>
						<Grid.Col span={6}>
							<Text fz="sm">{t("doctorName")}</Text>
						</Grid.Col>
						<Grid.Col span={14} onClick={openDoctorsRoom}>
							<InputForm
								readOnly={true}
								form={form}
								label=""
								tooltip={t("enterPatientDoctorName")}
								placeholder="Dr. John Doe"
								name="doctorName"
								id="doctorName"
								nextField="diseaseProfile"
								value={form.values.doctorName}
								required
							/>
						</Grid.Col>
					</Grid>

					<Grid align="center" columns={20}>
						<Grid.Col span={6}>
							<Text fz="sm">{t("diseaseProfile")}</Text>
						</Grid.Col>
						<Grid.Col span={14}>
							<SelectForm
								form={form}
								label=""
								tooltip={t("enterPatientDiseaseProfile")}
								placeholder="Diabetic"
								name="diseaseProfile"
								id="diseaseProfile"
								nextField="referredName"
								value={form.values.diseaseProfile}
								required
								dropdownValue={DISEASE_PROFILE}
								rightSection={<IconCirclePlusFilled color="var(--theme-primary-color-6)" size="24px" />}
							/>
						</Grid.Col>
					</Grid> */}
				</Stack>
			</ScrollArea>
		</Box>
	);
}
