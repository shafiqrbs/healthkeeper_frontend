import DatePickerForm from "@components/form-builders/DatePicker";
import InputForm from "@components/form-builders/InputForm";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { Box, Flex, Grid, ScrollArea, SegmentedControl, Stack, Text } from "@mantine/core";
import { IconChevronRight, IconCirclePlusFilled } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import DoctorsRoomDrawer from "../../common/__DoctorsRoomDrawer";
import { useDisclosure } from "@mantine/hooks";

const DISEASE_PROFILE = ["Diabetic", "Hypertension", "Asthma", "Allergy", "Other"];

export default function EntityForm({ form, handleSubmit }) {
	const [gender, setGender] = useState("male");
	const [openedDoctorsRoom, { open: openDoctorsRoom, close: closeDoctorsRoom }] = useDisclosure(false);
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 290;

	const handleGenderChange = (val) => {
		setGender(val);
	};

	const handleTypeChange = (val) => {
		form.setFieldValue("patient_type", val);

		if (val === "admission") {
			form.setFieldValue("guardian_mobile", form.values.mobile);
		}
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
										<Text fz="sm">{t("Type")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<SegmentedControl
											fullWidth
											color="var(--theme-primary-color-6)"
											value={form.values.patient_type}
											id="patient_type"
											name="patient_type"
											onChange={(val) => handleTypeChange(val)}
											data={[
												{ label: t("General"), value: "general" },
												{ label: t("Emergency"), value: "emergency" },
												{ label: t("Admission"), value: "admission" },
											]}
										/>
									</Grid.Col>
								</Grid>
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

								<Flex className="form-action-header full-bleed">
									<Text fz="sm">{t("doctorInformation")}</Text>
									<Flex align="center" gap="xs" onClick={openDoctorsRoom} className="cursor-pointer">
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
											tooltip={t("enterPatientDiseaseProfile")}
											placeholder="Diabetic"
											name="diseaseProfile"
											id="diseaseProfile"
											nextField="referredName"
											value={form.values.diseaseProfile}
											required
											dropdownValue={DISEASE_PROFILE}
											rightSection={
												<IconCirclePlusFilled
													color="var(--theme-primary-color-6)"
													size="24px"
												/>
											}
										/>
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
								{form.values.patient_type === "admission" && (
									<>
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
									</>
								)}
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
										<Text fz="sm">{t("FMHName")}</Text>
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
										<Text fz="sm">{t("PresentAddress")}</Text>
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
							</Stack>
						</ScrollArea>
					</Box>
				</Grid.Col>
			</Grid>
			<DoctorsRoomDrawer form={form} opened={openedDoctorsRoom} close={closeDoctorsRoom} />
		</>
	);
}
