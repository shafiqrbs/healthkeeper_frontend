import InputForm from "@components/form-builders/InputForm";
import {
	ActionIcon,
	Box,
	Button,
	Divider,
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
import { IconArrowRight, IconInfoCircle, IconRestore, IconSearch, IconUpload } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DoctorsRoomDrawer from "./__DoctorsRoomDrawer";
import { useDisclosure, useHotkeys, useIsFirstRender } from "@mantine/hooks";
import { DISTRICT_LIST } from "@/constants";
import { calculateAge, calculateDetailedAge } from "@/common/utils";
import Table from "../visit/_Table";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@/common/components/core-component/showNotificationComponent";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useDispatch } from "react-redux";
import DateSelectorForm from "@components/form-builders/DateSelectorForm";
import InputMaskForm from "@components/form-builders/InputMaskForm";
import PaymentMethodsCarousel from "@modules/hospital/common/PaymentMethodsCarousel";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import { useReactToPrint } from "react-to-print";

const LOCAL_STORAGE_KEY = "patientFormData";

export default function EmergencyPatientForm({ form, module }) {
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
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - heightOffset;
	const firstRender = useIsFirstRender();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch();
	const { hospitalConfigData } = useHospitalConfigData();

	const configuredDueAmount = Number(hospitalConfigData?.[`${type}_fee`]?.[`${type}_fee_price`] ?? 0);
	const enteredAmount = Number(form?.values?.amount ?? 0);
	const remainingBalance = configuredDueAmount - enteredAmount;
	const isReturn = remainingBalance < 0;
	const displayLabelKey = isReturn ? "Return" : "Due";
	const displayAmount = Math.abs(remainingBalance);

	const selectPaymentMethod = (method) => {
		form.setFieldValue("paymentMethod", method.value);
		setPaymentMethod(method);
	};
	const handleReset = () => {
		form.reset();
		setPaymentMethod(PAYMENT_METHODS[0]);
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	};

	const handlePrintPrescriptionA4 = useReactToPrint({
		content: () => prescriptionA4Ref.current,
	});

	const handlePrescriptionPosPrint = useReactToPrint({
		content: () => prescriptionPosRef.current,
	});

	useHotkeys([
		["alt+r", handleReset],
		["alt+4", handlePrintPrescriptionA4],
		["alt+p", handlePrescriptionPosPrint],
	]);

	const [updateKey, setUpdateKey] = useState(0);
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
				showNotificationComponent(t("PleaseFillAllFields"), "red", "lightgray", true, 1000, true);
			}
		}
	};
	const handleTypeChange = (val) => {
		form.setFieldValue("identity_mode", val);
	};
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
												<ActionIcon bg="var(--theme-secondary-color-6)">
													<IconSearch size={"16"} />
												</ActionIcon>
											}
											required
										/>
									</Grid.Col>
									<Grid.Col span={5}>
										<Text ta="right" pr={"xs"}>
											{form.values.healthID || t("HSID000000")}
										</Text>
									</Grid.Col>
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
						<Button
							onClick={handlePrescriptionPosPrint}
							w="100%"
							bg="var(--theme-pos-btn-color)"
							disabled={isSubmitting}
							type="button"
						>
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
		</Box>
	);
}
