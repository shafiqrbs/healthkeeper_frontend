import InputForm from "@components/form-builders/InputForm";
import {
	ActionIcon,
	Box,
	Button,
	Divider,
	FileInput,
	Flex,
	Grid,
	Group,
	Modal,
	ScrollArea,
	SegmentedControl,
	Stack,
	Text,
} from "@mantine/core";
import { useEffect, useState, useMemo } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { IconArrowRight, IconInfoCircle, IconSearch, IconUpload } from "@tabler/icons-react";
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
import InputMaskForm from "@components/form-builders/InputMaskForm";
const LOCAL_STORAGE_KEY = "patientFormData";

export default function PatientForm({ form, selectedRoom, module }) {
	const { mainAreaHeight } = useOutletContext();
	const { t } = useTranslation();
	const [openedDoctorsRoom, { close: closeDoctorsRoom }] = useDisclosure(false);
	const [opened, { open, close }] = useDisclosure(false);

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
	const height = mainAreaHeight - heightOffset - 132;
	const firstRender = useIsFirstRender();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch();
	const [updateKey, setUpdateKey] = useState(0);

	const handleDobChange = () => {
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
	};
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
				// ignore parse errors
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

	const handleSubmit = async () => {
		if (!form.validate().hasErrors) {
			setIsSubmitting(true);

			try {
				const createdBy = JSON.parse(localStorage.getItem("user"));
				const options = { year: "numeric", month: "2-digit", day: "2-digit" };

				const formValue = {
					...form.values,
					created_by_id: createdBy?.id,
					dob: new Date(form.values.dob).toLocaleDateString("en-CA", options),
					appointment: new Date(form.values.appointment).toLocaleDateString("en-CA", options),
				};

				const data = {
					url: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.CREATE,
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
					setUpdateKey((prev) => prev + 1);
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
						{t("PatientInformation")}
					</Text>
				</Flex>
			)}
			<Grid columns={24} gutter="sm">
				<Grid.Col span={12}>
					<ScrollArea h={height}>
						<Stack mih={height} className="form-stack-vertical">
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
									<InputMaskForm
										name="dob"
										id="dob"
										value={form.values.dob}
										form={form}
										label=""
										tooltip={t("enterPatientBirthDate")}
										placeholder="DD-MM-YYYY"
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
									</Flex>
								</Grid.Col>
							</Grid>
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
										rightSection={
											<ActionIcon bg="var(--theme-secondary-color-6)">
												<IconSearch size={"16"} />
											</ActionIcon>
										}
										required
									/>
								</Grid.Col>
							</Grid>
						</Stack>
					</ScrollArea>
				</Grid.Col>
				<Grid.Col span={12}>
					<ScrollArea h={height}>
						<Stack mih={height} className="form-stack-vertical">
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
										value={form.values.patient_payment_mode_id}
										id="patient_payment_mode_id"
										name="patient_payment_mode_id"
										onChange={(val) => form.setFieldValue("patient_payment_mode_id", val)}
										data={[
											{ label: t("General"), value: "30" },
											{ label: t("FreedomFighter"), value: "31" },
											{ label: t("Disabled"), value: "32" },
											{ label: t("GovtService"), value: "43" },
										]}
									/>
								</Grid.Col>
							</Grid>
							<Grid columns={20}>
								<Grid.Col span={6} mt="xs"></Grid.Col>
								<Grid.Col span={14}>
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
						</Stack>
					</ScrollArea>
				</Grid.Col>
			</Grid>
			<Box>
				<_ActionButtons form={form} module={module} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
			</Box>
		</Box>
	);
}
