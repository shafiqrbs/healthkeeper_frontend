import InputForm from "@components/form-builders/InputForm";
import {
	ActionIcon,
	Box,
	Button,
	FileInput,
	Flex,
	Grid,
	Modal,
	ScrollArea,
	SegmentedControl,
	Stack,
	Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { IconArrowRight, IconUpload } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DatePickerForm from "@components/form-builders/DatePicker";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DoctorsRoomDrawer from "./__DoctorsRoomDrawer";
import { useDisclosure, useIsFirstRender } from "@mantine/hooks";
import { DISTRICT_LIST } from "@/constants";
import { calculateAge, calculateDetailedAge } from "@/common/utils";
import _ActionButtons from "./_ActionButtons";
import Table from "../visit/_Table";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@/common/components/core-component/showNotificationComponent";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import DateSelectorForm from "@components/form-builders/DateSelectorForm";

const LOCAL_STORAGE_KEY = "patientFormData";

export default function PatientForm({ form, module }) {
	const { mainAreaHeight } = useOutletContext();
	const { t } = useTranslation();
	const [openedDoctorsRoom, { close: closeDoctorsRoom }] = useDisclosure(false);
	const [opened, { open, close }] = useDisclosure(false);

	useEffect(() => {
		const type = form.values.ageType || "year";
		const formattedAge = calculateAge(form.values.dob, type);
		form.setFieldValue("age", formattedAge);

		// Calculate detailed age from date of birth
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
							{t("Visit Table")}
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

export function Form({ form, showTitle = false, heightOffset = 116, module }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - heightOffset - 176;
	const firstRender = useIsFirstRender();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch();

	// save to localStorage on every form change
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
					// handle date fields - convert string back to Date object
					if (key === "dob" || key === "appointment") {
						if (value && typeof value === "string") {
							form.setFieldValue(key, new Date(value));
						} else {
							form.setFieldValue(key, value);
						}
					} else {
						form.setFieldValue(key, value);
					}
				});
			} catch (err) {
				// ignore parse errors
				console.error("Failed to parse saved form data:", err);
			}
		}
	}, [firstRender]);

	const handleGenderChange = (val) => {
		form.setFieldValue("gender", val);
	};

	const handleTypeChange = (val) => {
		form.setFieldValue("patient_type", val);

		if (val === "admission") {
			form.setFieldValue("guardian_mobile", form.values.mobile);
		}
	};

	// handle manual age field updates
	const handleAgeFieldChange = (field, value) => {
		form.setFieldValue(field, value);

		// update the total age field when any of the detailed age fields change
		const year = form.values.year || 0;
		const month = form.values.month || 0;
		const day = form.values.day || 0;

		// calculate total age in years (approximate)
		const totalAgeInYears = year + month / 12 + day / 365;
		form.setFieldValue("age", Math.floor(totalAgeInYears));
	};

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
					localStorage.removeItem(LOCAL_STORAGE_KEY);
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

	return (
		<Box>
			{showTitle && (
				<Flex bg="var(--theme-primary-color-0)" align="center" gap="xs" p="sm">
					<Text fw={600} fz="sm">
						{t("patientInformation")}
					</Text>
				</Flex>
			)}
			<Grid columns={24} gutter="sm">
				<Grid.Col span={12}>
					<ScrollArea h={height}>
						<Stack mih={height} className="form-stack-vertical">
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
										]}
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
										placeholder="Md. Abdul"
										name="name"
										id="patientName"
										nextField="dob"
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
									<DateSelectorForm
										form={form}
										label=""
										placeholder="23-06-2025"
										tooltip={t("enterPatientDateOfBirth")}
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
											tooltip={t("years")}
											name="year"
											id="year"
											nextField="month"
											value={form.values.year}
											min={0}
											max={150}
											leftSection={
												<Text fz="sm" px="sm">
													{t("Y")}
												</Text>
											}
											onChange={(value) => handleAgeFieldChange("year", value)}
										/>
										<InputNumberForm
											form={form}
											label=""
											placeholder="Months"
											tooltip={t("months")}
											name="month"
											id="month"
											nextField="day"
											value={form.values.month}
											min={0}
											max={11}
											leftSection={
												<Text fz="sm" px="sm">
													{t("M")}
												</Text>
											}
											onChange={(value) => handleAgeFieldChange("month", value)}
										/>
										<InputNumberForm
											form={form}
											label=""
											placeholder="Days"
											tooltip={t("days")}
											name="day"
											id="day"
											nextField="mobile"
											value={form.values.day}
											min={0}
											max={31}
											leftSection={
												<Text fz="sm" px="sm">
													{t("D")}
												</Text>
											}
											onChange={(value) => handleAgeFieldChange("day", value)}
										/>
									</Flex>
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
										nextField="district"
										value={form.values.mobile}
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
						</Stack>
					</ScrollArea>
				</Grid.Col>
				<Grid.Col span={12}>
					<ScrollArea h={height}>
						<Stack mih={height} className="form-stack-vertical">
							{/* {form.values.patient_type === "admission" && (
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
							)} */}

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
											nextField="file"
											value={form.values.comment || ""}
										/>
									)}
								</Grid.Col>
							</Grid>

							<Grid align="center" columns={20}>
								<Grid.Col span={6}>
									<Text fz="sm">{t("FileUpload")}</Text>
								</Grid.Col>
								<Grid.Col span={14}>
									<FileInput
										id="file"
										name="file"
										rightSection={
											<ActionIcon bg="var(--theme-primary-color-6)" color="white">
												<IconUpload size="16px" stroke={1.5} />
											</ActionIcon>
										}
										placeholder="Upload your file"
										rightSectionPointerEvents="none"
									/>
								</Grid.Col>
							</Grid>
						</Stack>
					</ScrollArea>
				</Grid.Col>
				<Grid.Col span={24} mt="-sm">
					<_ActionButtons
						form={form}
						module={module}
						handleSubmit={handleSubmit}
						isSubmitting={isSubmitting}
					/>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
