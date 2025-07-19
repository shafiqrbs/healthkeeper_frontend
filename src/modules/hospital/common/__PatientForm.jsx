import PhoneNumber from "@components/form-builders/PhoneNumberInput";
import InputForm from "@components/form-builders/InputForm";
import { Box, Flex, Grid, ScrollArea, SegmentedControl, Stack, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { IconChevronRight, IconCirclePlusFilled } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DatePickerForm from "@components/form-builders/DatePicker";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DoctorsRoomDrawer from "./__DoctorsRoomDrawer";
import { useDisclosure } from "@mantine/hooks";
import { DISEASE_PROFILE, DISTRICT_LIST } from "@/constants";
import { calculateAge } from "@/common/utils";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";

export default function __PatientForm({ form, handleSubmit }) {
	const { t } = useTranslation();
	const [openedDoctorsRoom, { open: openDoctorsRoom, close: closeDoctorsRoom }] = useDisclosure(false);

	useEffect(() => {
		const type = form.values.ageType || "year";
		const formattedAge = calculateAge(form.values.dateOfBirth, type);
		form.setFieldValue("age", formattedAge);
	}, [form.values.dateOfBirth, form.values.ageType]);

	return (
		<Box w="100%" bg="white" py="xxs" style={{ borderRadius: "4px" }}>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Text px="sm" fw={600} fz="sm" pb="xs">
					{t("patientInformation")}
				</Text>
				<TabsWithSearch
					hideSearchbar={true}
					tabList={["new", "report", "reVisit"]}
					tabPanels={[
						{
							tab: "new",
							component: (
								<Form form={form} handleSubmit={handleSubmit} openDoctorsRoom={openDoctorsRoom} />
							),
						},
						{
							tab: "report",
							component: <Box>Report</Box>,
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

function Form({ form, handleSubmit, openDoctorsRoom }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const [gender, setGender] = useState("male");

	const handleOpenDoctorsRoom = () => {
		openDoctorsRoom();
	};

	const handleGenderChange = (val) => {
		setGender(val);
		form.setFieldValue("gender", val);
	};

	return (
		<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 116}>
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
							name="patientName"
							id="patientName"
							nextField="mobile"
							value={form.values.patientName}
							required
						/>
					</Grid.Col>
				</Grid>
				<Grid align="center" columns={20}>
					<Grid.Col span={6}>
						<Text fz="sm">{t("mobile")}</Text>
					</Grid.Col>
					<Grid.Col span={14}>
						<PhoneNumber
							form={form}
							label=""
							tooltip={t("enterPatientMobile")}
							placeholder="01717171717"
							name="mobile"
							id="mobile"
							nextField="gender"
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
						<Text fz="sm">{t("dateOfBirth")}</Text>
					</Grid.Col>
					<Grid.Col span={14}>
						<DatePickerForm
							form={form}
							label=""
							placeholder="23-06-2025"
							tooltip={t("enterPatientDateOfBirth")}
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
					<Grid.Col span={6}>
						<Flex gap="les">
							<InputNumberForm
								form={form}
								label=""
								readOnly={true}
								placeholder="20"
								tooltip={t("totalAge")}
								name="age"
								id="age"
								nextField="ageType"
								value={form.values.age}
								required
							/>
						</Flex>
					</Grid.Col>
					<Grid.Col span={8}>
						<SegmentedControl
							fullWidth
							color="var(--theme-primary-color-6)"
							value={form.values.ageType}
							defaultValue="year"
							onChange={(val) => form.setFieldValue("ageType", val)}
							data={[
								{ label: t("day"), value: "day" },
								{ label: t("mon"), value: "month" },
								{ label: t("year"), value: "year" },
							]}
						/>
					</Grid.Col>
				</Grid>

				<Grid align="center" columns={20}>
					<Grid.Col span={6}>
						<Text fz="sm">{t("identity")}</Text>
					</Grid.Col>
					<Grid.Col span={14}>
						<InputNumberForm
							form={form}
							label=""
							placeholder="1234567890"
							tooltip={t("enterPatientIdentity")}
							name="identity"
							id="identity"
							nextField="district"
							value={form.values.identity}
							required
						/>
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
							tooltip={t("enterPatientDistrict")}
							placeholder="Dhaka"
							name="district"
							id="district"
							nextField="address"
							value={form.values.district}
							required
							dropdownValue={DISTRICT_LIST}
						/>
					</Grid.Col>
				</Grid>
				<Grid align="center" columns={20}>
					<Grid.Col span={6}>
						<Text fz="sm">{t("address")}</Text>
					</Grid.Col>
					<Grid.Col span={14}>
						<TextAreaForm
							form={form}
							label=""
							tooltip={t("enterPatientAddress")}
							placeholder="12 street, 123456"
							name="address"
							id="address"
							nextField="roomNo"
							value={form.values.address}
							required
						/>
					</Grid.Col>
				</Grid>

				<Flex className="form-action-header full-bleed">
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
				</Grid>
			</Stack>
		</ScrollArea>
	);
}
