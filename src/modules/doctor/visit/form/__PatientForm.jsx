import PhoneNumber from "@components/form-builders/PhoneNumberInput";
import InputForm from "@components/form-builders/InputForm";
import { Box, Flex, Grid, ScrollArea, SegmentedControl, Stack, Tabs, Text } from "@mantine/core";
import { useState } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { IconChevronRight, IconCirclePlusFilled } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import tabClass from "@assets/css/Tab.module.css";
import { useTranslation } from "react-i18next";
import DatePickerForm from "@components/form-builders/DatePicker";
import InputNumberForm from "@components/form-builders/InputNumberForm";

export default function PatientForm({ form, handleSubmit }) {
	const { mainAreaHeight } = useOutletContext();
	const [gender, setGender] = useState("male");
	const [ageType, setAgeType] = useState("year");
	const { t } = useTranslation();

	return (
		<Box w="100%" bg="white" py="xxs" style={{ borderRadius: "4px" }}>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Text px="sm" fw={600} fz="sm" pb="xs">
					{t("patientInformation")}
				</Text>
				<Tabs
					className={tabClass.list}
					variant="pills"
					color="var(--theme-primary-color-6)"
					defaultValue="new"
					bg="var(--theme-secondary-color-0)"
				>
					<Tabs.List p="sm">
						<Flex w="100%" justify="space-between">
							<Tabs.Tab w="32%" value="new">
								{t("new")}
							</Tabs.Tab>
							<Tabs.Tab w="32%" value="report">
								{t("report")}
							</Tabs.Tab>
							<Tabs.Tab w="32%" value="re-visit">
								{t("reVisit")}
							</Tabs.Tab>
						</Flex>
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
									<Flex align="center" gap="xs">
										<Text fz="sm">{t("booked")}-05</Text>{" "}
										<IconChevronRight size="16px" />
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

								<Flex className="form-action-header full-bleed">
									<Text fz="sm">{t("marketing")}</Text>
								</Flex>

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("referredName")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											label=""
											placeholder="John Doe"
											name="referredName"
											id="referredName"
											nextField="marketingEx"
											value={form.values.referredName}
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

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("marketingEx")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputNumberForm
											form={form}
											label=""
											placeholder="101"
											name="marketingEx"
											id="marketingEx"
											nextField="isConfirm"
											value={form.values.marketingEx}
											required
										/>
									</Grid.Col>
								</Grid>
							</Stack>
						</ScrollArea>
					</Tabs.Panel>
				</Tabs>
			</form>
		</Box>
	);
}
