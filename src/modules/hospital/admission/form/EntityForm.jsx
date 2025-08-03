import DatePickerForm from "@components/form-builders/DatePicker";
import InputForm from "@components/form-builders/InputForm";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { Box, Flex, Grid, ScrollArea, SegmentedControl, Stack, Text } from "@mantine/core";
import { IconChevronRight, IconCirclePlusFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

export default function EntityForm({ form, handleSubmit, openDoctorsRoom }) {
	const { t } = useTranslation();
	const { height } = useOutletContext();

	return (
		<Grid columns={24} gutter="les">
			{/* <Grid.Col span={12}>
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
											onChange={(value) => handleAgeFieldChange("ageYear", value)}
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
											onChange={(value) => handleAgeFieldChange("ageMonth", value)}
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
										tooltip={t("enterPatientDistrict")}
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
									<Text fz="sm">{t("NIDBirthCertificate")}</Text>
								</Grid.Col>
								<Grid.Col span={14}>
									<InputNumberForm
										form={form}
										label=""
										placeholder="1234567890"
										tooltip={t("enterPatientIdentity")}
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
											mt="xxs"
											tooltip={t("enterComment")}
											placeholder="Enter comment"
											name="comment"
											id="comment"
											value={form.values.comment || ""}
										/>
									)}
								</Grid.Col>
							</Grid>

							<Flex className="form-action-header full-bleed">
								<Text fz="sm">{t("doctorInformation")}</Text>
								<Flex
									align="center"
									gap="xs"
									onClick={handleOpenDoctorsRoom}
									className="cursor-pointer"
								>
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
										rightSection={
											<IconCirclePlusFilled color="var(--theme-primary-color-6)" size="24px" />
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
				</Box>
			</Grid.Col> */}
		</Grid>
	);
}
