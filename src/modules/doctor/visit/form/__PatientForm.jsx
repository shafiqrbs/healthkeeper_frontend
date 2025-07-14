import PhoneNumber from "@components/form-builders/PhoneNumberInput";
import InputForm from "@components/form-builders/InputForm";
import { Box, Flex, FloatingIndicator, Grid, ScrollArea, SegmentedControl, Stack, Tabs, Text } from "@mantine/core";
import { useState } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { IconChevronRight, IconCirclePlusFilled } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import tabClass from "@assets/css/Tab.module.css";
import { useTranslation } from "react-i18next";
import DatePickerForm from "@components/form-builders/DatePicker";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DoctorsRoomDrawer from "../__DoctorsRoomDrawer";
import { useDisclosure } from "@mantine/hooks";

export default function PatientForm({ form, handleSubmit }) {
	const { mainAreaHeight } = useOutletContext();
	const [gender, setGender] = useState("male");
	const [ageType, setAgeType] = useState("year");
	const { t } = useTranslation();

	const [rootRef, setRootRef] = useState(null);
	const [tabValue, setTabValue] = useState("new");
	const [controlsRefs, setControlsRefs] = useState({});
	const [openedDoctorsRoom, { open: openDoctorsRoom, close: closeDoctorsRoom }] = useDisclosure(false);

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const handleOpenDoctorsRoom = () => {
		openDoctorsRoom();
	};

	return (
		<Box w="100%" bg="white" py="xxs" style={{ borderRadius: "4px" }}>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Text px="sm" fw={600} fz="sm" pb="xs">
					{t("patientInformation")}
				</Text>
				<Tabs variant="none" value={tabValue} onChange={setTabValue}>
					<Tabs.List px="sm" py="xxxs" className={tabClass.list} ref={setRootRef}>
						<Flex w="100%" justify="space-between">
							<Tabs.Tab w="32%" value="new" ref={setControlRef("new")} className={tabClass.tab}>
								{t("new")}
							</Tabs.Tab>
							<Tabs.Tab w="32%" value="report" ref={setControlRef("report")} className={tabClass.tab}>
								{t("report")}
							</Tabs.Tab>
							<Tabs.Tab w="32%" value="re-visit" ref={setControlRef("re-visit")} className={tabClass.tab}>
								{t("reVisit")}
							</Tabs.Tab>
						</Flex>
						<FloatingIndicator
							target={tabValue ? controlsRefs[tabValue] : null}
							parent={rootRef}
							className={tabClass.indicator}
						/>
					</Tabs.List>

					<Tabs.Panel value="new">
						<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 120}>
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
											onChange={setGender}
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
											<InputNumberForm
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
												placeholder="20"
												tooltip={t("enterPatientAge")}
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
											onChange={setAgeType}
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
											data={[
												"Pirojpur",
												"Dhaka",
												"Chittagong",
												"Rajshahi",
												"Sylhet",
												"Mymensingh",
												"Rangpur",
												"Barisal",
												"Khulna",
											]}
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
									<Flex
										align="center"
										gap="xs"
										onClick={handleOpenDoctorsRoom}
										style={{ cursor: "pointer" }}
									>
										<Text fz="sm">{t("booked")}-05</Text> <IconChevronRight size="16px" />
									</Flex>
								</Flex>

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("roomNo")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputNumberForm
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
									<Grid.Col span={14}>
										<InputForm
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
									<Grid.Col span={14}>
										<InputForm
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
										<InputForm
											form={form}
											label=""
											tooltip={t("enterPatientDiseaseProfile")}
											placeholder="Diabetic"
											name="diseaseProfile"
											id="diseaseProfile"
											nextField="referredName"
											value={form.values.diseaseProfile}
											required
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
					</Tabs.Panel>
				</Tabs>
			</form>
			<DoctorsRoomDrawer opened={openedDoctorsRoom} close={closeDoctorsRoom} />
		</Box>
	);
}
