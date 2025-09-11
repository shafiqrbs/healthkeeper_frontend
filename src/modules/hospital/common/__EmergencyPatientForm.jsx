import InputForm from "@components/form-builders/InputForm";
import {
	ActionIcon,
	Box,
	Button,
	Flex,
	Grid,
	Modal,
	ScrollArea,
	SegmentedControl,
	Select,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { IconArrowRight, IconInfoCircle, IconSearch } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DoctorsRoomDrawer from "./__DoctorsRoomDrawer";
import { useDisclosure, useHotkeys, useIsFirstRender } from "@mantine/hooks";
import { calculateAge, calculateDetailedAge } from "@/common/utils";
import Table from "../visit/_Table";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import InputMaskForm from "@components/form-builders/InputMaskForm";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import NIDDataPreviewModal from "./NIDDataPreviewModal";
import { useReactToPrint } from "react-to-print";
import IPDA4 from "@components/print-formats/ipd/IPDA4";
import IPDPos from "@components/print-formats/ipd/IPDPos";
import { useForm } from "@mantine/form";

// =============== sample user data for emergency patient ================
const USER_EMERGENCY_DATA = {
	verifyToken: "emergency-12345-abcde-67890-fghij",
	citizenData: {
		mobile: "+880 1717171717",
		fullName_English: "Patient",
		motherName_English: "Patient's Mother",
		motherName_Bangla: "রোগীর মা",
		fatherName_English: "Patient's Father",
		fatherName_Bangla: "রোগীর বাবা",
		permanentHouseholdNoText: null,
		dob: "1990-01-01",
		bin_BRN: null,
		gender: 1,
		fullName_Bangla: "রোগী",
		presentHouseholdNoText: null,
		citizen_nid: "1234567890",
		permanentHouseholdNo: {
			division: "Dhaka",
			district: "Dhaka",
			upazilla: "Dhaka City",
			unionOrWard: "Ward",
			mouzaOrMoholla: "Area",
			villageOrRoad: "Street",
			houseOrHoldingNo: "123",
			address_line: "Address Line",
		},
		presentHouseholdNo: {
			division: "Dhaka",
			district: "Dhaka",
			upazilla: "Dhaka City",
			unionOrWard: "Ward",
			mouzaOrMoholla: "Area",
			villageOrRoad: "Street",
			houseOrHoldingNo: "123",
			address_line: "Address Line",
		},
	},
};

const LOCAL_STORAGE_KEY = "emergencyPatientFormData";

export default function EmergencyPatientForm({
	form,
	module,
	isSubmitting,
	handleSubmit,
	showUserData,
	setShowUserData,
}) {
	const { mainAreaHeight } = useOutletContext();
	const { t } = useTranslation();
	const searchForm = useForm({
		initialValues: {
			type: "PID",
			term: "",
		},
	});
	const [openedDoctorsRoom, { close: closeDoctorsRoom }] = useDisclosure(false);
	const [opened, { open, close }] = useDisclosure(false);

	useEffect(() => {
		const type = form.values.ageType || "year";
		const formattedAge = calculateAge(form.values.dob, type);
		form.setFieldValue("age", formattedAge);

		// =============== calculate detailed age from date of birth ================
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

	const handlePatientInfoSearch = (values) => {
		try {
			const formValue = {
				...values,
				term: searchForm.values.term,
			};
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Box w="100%" bg="white" py="xxs" style={{ borderRadius: "4px" }}>
			<Flex
				component="form"
				align="center"
				justify="space-between"
				onSubmit={searchForm.onSubmit(handlePatientInfoSearch)}
				gap="les"
				px="sm"
				pb="les"
			>
				<TextInput
					w={330}
					placeholder="Search"
					type="search"
					name="term"
					value={searchForm.values.term}
					leftSectionWidth={100}
					onChange={(e) => searchForm.setFieldValue("term", e.target.value)}
					styles={{ input: { paddingInlineStart: "110px" } }}
					leftSection={
						<Select
							bd="none"
							onChange={(value) => searchForm.setFieldValue("type", value)}
							name="type"
							styles={{ input: { paddingInlineStart: "30px", paddingInlineEnd: "10px" } }}
							placeholder="Select"
							data={["PID", "PresID", "HID", "NID", "BRID"]}
							value={searchForm.values.type}
						/>
					}
					rightSection={
						<ActionIcon type="submit" bg="var(--theme-primary-color-6)">
							<IconSearch size={16} />
						</ActionIcon>
					}
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
			<Form
				form={form}
				module={module}
				isSubmitting={isSubmitting}
				handleSubmit={handleSubmit}
				showUserData={showUserData}
				setShowUserData={setShowUserData}
			/>
			<DoctorsRoomDrawer form={form} opened={openedDoctorsRoom} close={closeDoctorsRoom} />
			<Modal opened={opened} onClose={close} size="100%" centered>
				<Table module={module} height={mainAreaHeight - 220} />
			</Modal>
		</Box>
	);
}

export function Form({
	form,
	showTitle = false,
	heightOffset = 72,
	isSubmitting,
	type = "emergency",
	handleSubmit,
	showUserData,
	setShowUserData,
}) {
	const [configuredDueAmount, setConfiguredDueAmount] = useState(0);
	const [printData, setPrintData] = useState(null);
	const [pendingPrint, setPendingPrint] = useState(null); // "a4" | "pos" | null

	const ipdDocumentA4Ref = useRef(null);
	const ipdDocumentPosRef = useRef(null);

	const printA4 = useReactToPrint({ content: () => ipdDocumentA4Ref.current });
	const printPos = useReactToPrint({ content: () => ipdDocumentPosRef.current });

	const [openedHSIDDataPreview, { open: openHSIDDataPreview, close: closeHSIDDataPreview }] = useDisclosure(false);

	const [userEmergencyData] = useState(USER_EMERGENCY_DATA);
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - heightOffset;
	const firstRender = useIsFirstRender();
	const { hospitalConfigData } = useHospitalConfigData();

	const enteredAmount = Number(form?.values?.amount ?? 0);
	const remainingBalance = configuredDueAmount - enteredAmount;
	const isReturn = remainingBalance < 0;
	const displayLabelKey = isReturn ? "Return" : "Due";
	const displayAmount = Math.abs(remainingBalance);

	// Run print only after data is updated
	useEffect(() => {
		console.log("Hit there 2");
		if (!printData || !pendingPrint) return;
		console.log("Hit there 3");

		if (pendingPrint === "a4") printA4();
		if (pendingPrint === "pos") printPos();

		setPendingPrint(null);
	}, [printData, pendingPrint]);

	useEffect(() => {
		const price =
			form.values.patient_payment_mode_id !== "30" // only for general payment will be applicable
				? 0
				: Number(hospitalConfigData?.[`${type}_fee`]?.[`${type}_fee_price`] ?? 0);
		setConfiguredDueAmount(price);
		form.setFieldValue("amount", price);
	}, [form.values.patient_payment_mode_id, hospitalConfigData, type]);

	const handlePrint = async (type) => {
		const res = await handleSubmit();

		if (res?.status === 200) {
			setPrintData(res?.data);
			console.log("Hit there");
			setPendingPrint(type);
		}
	};

	const handleReset = () => {
		form.reset();
		localStorage.removeItem(LOCAL_STORAGE_KEY);
		setShowUserData(false);
	};

	useHotkeys([["alt+r", handleReset]]);

	// =============== save to localStorage on every form change ================
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
					// =============== handle date fields - convert string back to Date object ================
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
				// =============== ignore parse errors ================
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

	const handleDobChange = () => {
		const type = form.values.ageType || "year";
		const formattedAge = calculateAge(form.values.dob, type);
		form.setFieldValue("age", formattedAge);

		// =============== calculate detailed age from date of birth ================
		if (form.values.dob) {
			const detailedAge = calculateDetailedAge(form.values.dob);
			form.setFieldValue("year", detailedAge.years);
			form.setFieldValue("month", detailedAge.months);
			form.setFieldValue("day", detailedAge.days);
		}
	};

	// =============== handle HSID search and populate form fields ================
	const handleHSIDSearch = () => {
		if (!form.values.identity) {
			showNotificationComponent(t("PleaseEnterIdentity"), "red", "lightgray", true, 1000, true);
			return;
		}
		setShowUserData(true);

		// =============== populate form fields with emergency data ================
		setTimeout(() => {
			form.setFieldValue("name", userEmergencyData.citizenData.fullName_English);
			form.setFieldValue("mobile", userEmergencyData.citizenData.mobile);
			form.setFieldValue("gender", userEmergencyData.citizenData.gender === 1 ? "male" : "female");
			form.setFieldValue("dob", "01-01-1990");
			form.setFieldValue(
				"guardian_name",
				userEmergencyData.citizenData.fatherName_English || userEmergencyData.citizenData.motherName_English
			);
			form.setFieldValue(
				"address",
				`${userEmergencyData.citizenData.presentHouseholdNo.division}, ${userEmergencyData.citizenData.presentHouseholdNo.district}, ${userEmergencyData.citizenData.presentHouseholdNo.upazilla}, ${userEmergencyData.citizenData.presentHouseholdNo.unionOrWard}, ${userEmergencyData.citizenData.presentHouseholdNo.mouzaOrMoholla}, ${userEmergencyData.citizenData.presentHouseholdNo.villageOrRoad}, ${userEmergencyData.citizenData.presentHouseholdNo.houseOrHoldingNo}`
			);

			// =============== trigger age calculation ================
			handleDobChange();
		}, 500);
	};

	return (
		<>
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
								<Stack className="form-stack-vertical">
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
												nextField="mobile"
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
												nextField="dob"
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
											<Text fz="sm">{t("DateOfBirth")}</Text>
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
												nextField="day"
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
													nextField="month"
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
													nextField="year"
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
													nextField="identity"
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
											<Text fz="sm">
												{form.values.identity_mode === "NID"
													? t("NID")
													: form.values.identity_mode === "BRID"
													? t("BRID")
													: t("HID")}
											</Text>
										</Grid.Col>
										<Grid.Col span={9}>
											<InputNumberForm
												form={form}
												label=""
												placeholder="1234567890"
												tooltip={t("enterPatientIdentity")}
												name="identity"
												id="identity"
												nextField="guardian_name"
												value={form.values.identity}
												rightSection={
													<ActionIcon
														onClick={handleHSIDSearch}
														bg="var(--theme-secondary-color-6)"
													>
														<IconSearch size={"16"} />
													</ActionIcon>
												}
												required
											/>
										</Grid.Col>
										{showUserData && (
											<Grid.Col span={5}>
												<Text
													ta="right"
													onClick={openHSIDDataPreview}
													pr="xs"
													fz="sm"
													className="cursor-pointer user-none"
													c="var(--theme-primary-color-6)"
												>
													{form.values.healthID || t("HSID000000")}
												</Text>
											</Grid.Col>
										)}
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
											<Text fz="sm">{t("GuardianMobile")}</Text>
										</Grid.Col>
										<Grid.Col span={14} pb={0}>
											<InputForm
												form={form}
												label=""
												tooltip={t("EnterPatientMobile")}
												placeholder="+880 1717171717"
												name="guardian_mobile"
												id="guardian_mobile"
												nextField="address"
												value={form.values.guardian_mobile}
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
												nextField="amount"
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
													{ label: t("Disabled"), value: "29" },
													{ label: t("GovtService"), value: "32" },
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
													nextField="amount"
													value={form.values.free_identification_id || ""}
												/>
											)}
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
													৳ {Number(configuredDueAmount || 0).toLocaleString()}
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
												tooltip={t("EnterAmount")}
												placeholder={t("Amount")}
												name="amount"
												nextField="EntityFormSubmit"
												required
											/>
										</Box>
									</Flex>
								</Grid.Col>
								<Grid.Col span={8} bg="var(--theme-secondary-color-0)" px="xs">
									<Box>
										<Flex gap="xss" align="center" justify="space-between">
											<Text>{t(displayLabelKey)}</Text>
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
							<Button
								w="100%"
								bg="var(--theme-prescription-btn-color)"
								disabled={isSubmitting}
								onClick={() => handlePrint("a4")}
							>
								<Stack gap={0} align="center" justify="center">
									<Text>{t("prescription")}</Text>
									<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
										(alt + 3)
									</Text>
								</Stack>
							</Button>
							<Button
								w="100%"
								bg="var(--theme-pos-btn-color)"
								disabled={isSubmitting}
								type="button"
								onClick={() => handlePrint("pos")}
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
								id="EntityFormSubmit"
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
				<NIDDataPreviewModal
					opened={openedHSIDDataPreview}
					close={closeHSIDDataPreview}
					userNidData={userEmergencyData}
				/>
			</Box>
			<IPDA4 data={printData} ref={ipdDocumentA4Ref} />
			<IPDPos data={printData} ref={ipdDocumentPosRef} />
		</>
	);
}
