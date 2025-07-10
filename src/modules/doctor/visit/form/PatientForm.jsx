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

export default function PatientForm({ form, handleSubmit }) {
	const { mainAreaHeight } = useOutletContext();
	const [gender, setGender] = useState("male");
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
										<InputForm
											form={form}
											label=""
											tooltip={t("bookYourAppointment")}
											placeholder={t("appointment")}
											name="appointment"
											id="appointment"
											nextField="name"
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
											tooltip={t("enterPatientName")}
											placeholder={t("patientName")}
											required
											name="patientName"
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
											tooltip={t("enterPatientMobile")}
											placeholder={t("mobile")}
											required
											name="mobile"
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
											<InputForm
												form={form}
												placeholder={t("height")}
												name="height"
											/>
											<InputForm
												form={form}
												placeholder={t("weight")}
												name="weight"
											/>
											<InputForm
												form={form}
												placeholder={t("bp")}
												name="bp"
											/>
										</Flex>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("dateOfBirth")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											type="date"
											form={form}
											placeholder={t("dateOfBirth")}
											name="dateOfBirth"
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("age")}</Text>
									</Grid.Col>
									<Grid.Col span={6}>
										<Flex gap="les">
											<InputForm
												form={form}
												placeholder={t("age")}
												name="age"
											/>
										</Flex>
									</Grid.Col>
									<Grid.Col span={8}>
										<SegmentedControl
											fullWidth
											color="var(--theme-primary-color-6)"
											value={gender}
											onChange={setGender}
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
										<InputForm
											form={form}
											placeholder={t("nidBirthCertificate")}
											name="identity"
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
											placeholder={t("selectDistrict")}
											name="district"
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
											placeholder={t("address")}
											name="address"
										/>
									</Grid.Col>
								</Grid>

								<Flex
									c="var(--theme-primary-color-6)"
									align="center"
									justify="space-between"
									gap="xs"
								>
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
										<InputForm
											form={form}
											placeholder={t("roomNo")}
											name="roomNo"
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
											placeholder={t("specialization")}
											name="specialization"
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
											placeholder={t("doctorName")}
											name="doctorName"
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
											placeholder={t("diabetic")}
											name="diseaseProfile"
											rightSection={
												<IconCirclePlusFilled
													color="var(--theme-primary-color-6)"
													size="24px"
												/>
											}
										/>
									</Grid.Col>
								</Grid>

								<Flex c="var(--theme-primary-color-6)" align="center">
									<Text fz="sm">{t("marketing")}</Text>
								</Flex>

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">{t("referredName")}</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											placeholder={t("name")}
											name="referredName"
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
										<InputForm
											form={form}
											placeholder="101"
											name="marketingEx"
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
