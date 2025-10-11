import InputForm from "@components/form-builders/InputForm";
import {
	ActionIcon,
	Box,
	Button,
	Flex,
	Grid,
	LoadingOverlay,
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
import { IconRestore, IconSearch, IconX } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DoctorsRoomDrawer from "./__DoctorsRoomDrawer";
import { useDisclosure, useHotkeys, useIsFirstRender } from "@mantine/hooks";
import { calculateAge, calculateDetailedAge } from "@/common/utils";
import Table from "../visit/_Table";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import NIDDataPreviewModal from "./NIDDataPreviewModal";
import { useReactToPrint } from "react-to-print";
import IPDA4 from "@components/print-formats/ipd/IPDA4";
import IPDPos from "@components/print-formats/ipd/IPDPos";
import { useForm } from "@mantine/form";
import RequiredAsterisk from "@/common/components/form-builders/RequiredAsterisk";
import SelectForm from "@/common/components/form-builders/SelectForm";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { getDataWithoutStore } from "@/services/apiService";
import PatientSearchResult from "./PatientSearchResult";
import DateSelectorForm from "@components/form-builders/DateSelectorForm";

// =============== sample user data for emergency patient ================
const USER_NID_DATA = {
	verifyToken: "a9a98eac-68c4-4dd1-9cb9-8127a5b44833",
	citizenData: {
		mobile: null,
		fullName_English: "Md KarimI Mia",
		motherName_English: "",
		motherName_Bangla: "মোসাঃ ….. বেগম",
		fatherName_English: "",
		fatherName_Bangla: "মোঃ আঃ ……….",
		permanentHouseholdNoText: null,
		dob: "1986-05-10",
		bin_BRN: null,
		gender: 1,
		fullName_Bangla: "মোঃ ….. ইসলাম",
		presentHouseholdNoText: null,
		citizen_nid: "1234567890",
		permanentHouseholdNo: {
			division: "Dhaka",
			district: "Narayanganj",
			upazilla: "Sonargaon",
			unionOrWard: null,
			mouzaOrMoholla: "Pailopara",
			villageOrRoad: "Cengakandini",
			houseOrHoldingNo: "",
			address_line: null,
		},
		presentHouseholdNo: {
			division: "Dhaka",
			district: "Narayanganj",
			upazilla: "Sonargaon",
			unionOrWard: "Baridhi",
			mouzaOrMoholla: "Pailopara",
			villageOrRoad: "Cengakandini",
			houseOrHoldingNo: "",
			address_line: null,
		},
	},
};

const LOCAL_STORAGE_KEY = "emergencyPatientFormData";

export default function EmergencyPatientForm({
	resetKey,
	setResetKey,
	form,
	module,
	isSubmitting,
	handleSubmit,
	showUserData,
	setShowUserData,
	hospitalConfigData
}) {
	const { mainAreaHeight } = useOutletContext();
	const searchForm = useForm({
		initialValues: {
			type: "PID",
			term: "",
		},
	});
	const [openedDoctorsRoom, { close: closeDoctorsRoom }] = useDisclosure(false);
	const [opened, { close }] = useDisclosure(false);
	const [patientSearchResults, setPatientSearchResults] = useState([]);
	const [showPatientDropdown, setShowPatientDropdown] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [visible, setVisible] = useState(false);
	const searchContainerRef = useRef(null);

	useEffect(() => {
		const type = form.values.ageType || "year";
		const formattedDOB = new Date(form.values.dob)
			.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
			.replace(/\//g, "-");
		const formattedAge = calculateAge(formattedDOB, type);
		form.setFieldValue("age", formattedAge);

		// Calculate detailed age from date of birth
		if (form.values.dob) {
			const detailedAge = calculateDetailedAge(formattedDOB);
			form.setFieldValue("year", detailedAge.years);
			form.setFieldValue("month", detailedAge.months);
			form.setFieldValue("day", detailedAge.days);
		}
	}, [JSON.stringify(form.values.dob)]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
				setShowPatientDropdown(false);
				setPatientSearchResults([]);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		document.getElementById("patientName")?.focus();
	}, []);

	const handlePatientInfoSearch = async (values) => {
		try {
			const formValue = {
				...values,
				term: searchForm.values.term,
			};

			// If PID is selected, show patient dropdown with mock data
			if (searchForm.values.type === "PID") {
				setIsSearching(true);
				// Simulate API call delay

				const patients = await getDataWithoutStore({
					url: MASTER_DATA_ROUTES.API_ROUTES.OPERATIONAL_API.PATIENT_SEARCH,
					params: { term: searchForm.values.term },
				});

				setPatientSearchResults(patients?.data || []);
				setShowPatientDropdown(true);
				setIsSearching(false);
			} else {
				// For other search types, use the original behavior
				console.info(formValue);
			}
		} catch (err) {
			console.error(err);
			setIsSearching(false);
		}
	};

	const handlePatientSelect = async (patientId) => {
		setVisible(true);
		const patient = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.VIEW}/${patientId}`,
		});

		// Fill the form with selected patient data
		form.setFieldValue("name", patient?.data?.name);
		form.setFieldValue("mobile", patient?.data?.mobile);
		form.setFieldValue("dob", patient?.data?.dob ? new Date(patient.data.dob) : null);
		form.setFieldValue("customer_id", patient?.data?.id);
		// Close the dropdown
		setShowPatientDropdown(false);
		setPatientSearchResults([]);
		// Clear the search term
		searchForm.setFieldValue("term", "");
		setVisible(false);
	};

	const getSearchPlaceholder = () => {
		if (searchForm.values.type === "PID") {
			return "Search with your phone number, date of birth...";
		}
		return "Search";
	};

	return (
		<Box w="100%" bg="white" py="xxs" style={{ borderRadius: "4px" }}>
			<Box
				ref={searchContainerRef}
				component="form"
				onSubmit={searchForm.onSubmit(handlePatientInfoSearch)}
				w="100%"
				style={{ position: "relative" }}
				px="sm"
				pb="les"
			>
				<TextInput
					w="100%"
					placeholder={getSearchPlaceholder()}
					type="search"
					name="term"
					value={searchForm.values.term}
					leftSectionWidth={100}
					onChange={(e) => searchForm.setFieldValue("term", e.target.value)}
					styles={{ input: { paddingInlineStart: "110px", width: "100%" } }}
					leftSection={
						<Select
							bd="none"
							onChange={(value) => {
								searchForm.setFieldValue("type", value);
								// Close dropdown when type changes
								setShowPatientDropdown(false);
								setPatientSearchResults([]);
							}}
							name="type"
							styles={{ input: { paddingInlineStart: "30px", paddingInlineEnd: "10px" } }}
							placeholder="Select"
							data={["PID", "PresID", "HID", "NID", "BRID"]}
							value={searchForm.values.type}
						/>
					}
					rightSection={
						<ActionIcon
							disabled={!searchForm.values?.term}
							type="submit"
							bg="var(--theme-primary-color-6)"
							loading={isSearching}
						>
							<IconSearch size={16} />
						</ActionIcon>
					}
				/>

				{/* Patient Search Dropdown */}
				{showPatientDropdown && (
					<PatientSearchResult results={patientSearchResults} handlePatientSelect={handlePatientSelect} />
				)}
			</Box>
			<Form
				form={form}
				module={module}
				visible={visible}
				setVisible={setVisible}
				isSubmitting={isSubmitting}
				handleSubmit={handleSubmit}
				showUserData={showUserData}
				resetKey={resetKey}
				setResetKey={setResetKey}
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
	visible,
	setVisible,
	resetKey,
	setResetKey
}) {
	const dispatch = useDispatch();
	const [configuredDueAmount, setConfiguredDueAmount] = useState(0);
	const [printData, setPrintData] = useState(null);
	const [pendingPrint, setPendingPrint] = useState(null); // "a4" | "pos" | null
	const ipdDocumentA4Ref = useRef(null);
	const ipdDocumentPosRef = useRef(null);
	const { hospitalConfigData: globalConfig } = useHospitalConfigData();
	const hospitalConfigData = globalConfig?.hospital_config;
	const printA4 = useReactToPrint({ content: () => ipdDocumentA4Ref.current });
	const printPos = useReactToPrint({ content: () => ipdDocumentPosRef.current });

	const [openedNIDDataPreview, { open: openNIDDataPreview, close: closeNIDDataPreview }] = useDisclosure(false);
	const [userNidData] = useState(USER_NID_DATA);
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - heightOffset;
	const firstRender = useIsFirstRender();
	console.log(hospitalConfigData)
	const enteredAmount = Number(form?.values?.amount ?? 0);
	const remainingBalance = configuredDueAmount - enteredAmount;
	const isReturn = remainingBalance < 0;
	const displayLabelKey = isReturn ? "Return" : "Due";
	const displayAmount = Math.abs(remainingBalance);

	const locations = useSelector((state) => state.crud.locations.data);

	useEffect(() => {
		dispatch(getIndexEntityData({ module: "locations", url: HOSPITAL_DATA_ROUTES.API_ROUTES.LOCATIONS.INDEX }));
	}, []);

	// Run print only after data is updated
	useEffect(() => {
		if (!printData || !pendingPrint) return;

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
	console.log(hospitalConfigData);
	const handlePrint = async (type) => {
		const res = await handleSubmit();

		if (res?.status === 200) {
			setPrintData(res?.data);
			setPendingPrint(type);
		}
	};

	const handleContentChange = () => {
		setShowUserData(false);
	};

	const handleReset = () => {
		setResetKey((prev) => prev + 1);
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
					if (key === "appointment" || key === "dob") {
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

	// =============== handle HSID search and populate form fields ================
	const handleNIDSearch = () => {
		if (!form.values.identity) {
			showNotificationComponent(t("PleaseEnterNID"), "red", "lightgray", "", true, 700, true);
			return;
		}
		setShowUserData(true);
		setVisible(true);
		setTimeout(() => {
			form.setFieldValue(
				"guardian_name",
				userNidData.citizenData.fatherName_English || userNidData.citizenData.motherName_English
			);
			form.setFieldValue("district", userNidData.citizenData.presentHouseholdNo.district);
			form.setFieldValue(
				"address",
				`${userNidData.citizenData.presentHouseholdNo.division}, ${userNidData.citizenData.presentHouseholdNo.district}, ${userNidData.citizenData.presentHouseholdNo.upazilla}, ${userNidData.citizenData.presentHouseholdNo.unionOrWard}, ${userNidData.citizenData.presentHouseholdNo.mouzaOrMoholla}, ${userNidData.citizenData.presentHouseholdNo.villageOrRoad}, ${userNidData.citizenData.presentHouseholdNo.houseOrHoldingNo}`
			);
			setVisible(false);
		}, 1000);
	};

	return (
		<>
			<Box pos="relative">
				<LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
				{showTitle && (
					<Flex bg="var(--theme-primary-color-0)" align="center" gap="xs" p="sm">
						<Text fw={600} fz="sm">
							{t("PatientInformation")}
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
											<Flex gap="es">
												<Text fz="sm">{t("PatientName")}</Text>
												<RequiredAsterisk />
											</Flex>
										</Grid.Col>
										<Grid.Col span={14} pb={0}>
											<InputForm
												form={form}
												label=""
												tooltip={t("EnterPatientName")}
												placeholder="Md. Abdul"
												name="name"
												id="PatientName"
												nextField="mobile"
												value={form.values.name}
												required
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt={"xs"}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Mobile")}</Text>
										</Grid.Col>
										<Grid.Col span={14} pb={0}>
											<InputNumberForm
												form={form}
												label=""
												tooltip={t("EnterPatientMobile")}
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
											<Text fz="sm">{t("Gender")}</Text>
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
											<DateSelectorForm
												key={
													form.values.dob
														? new Date(form.values.dob).toISOString()
														: "dob-empty"
												}
												form={form}
												placeholder="01-01-2020"
												tooltip={t("EnterPatientDateOfBirth")}
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
											<Flex>
												<Text fz="sm">{t("Age")}</Text>
												<RequiredAsterisk />
											</Flex>
										</Grid.Col>
										<Grid.Col span={14}>
											<Flex gap="xs">
												<InputNumberForm
													form={form}
													label=""
													placeholder="Years"
													tooltip={t("EnterYears")}
													name="year"
													id="year"
													nextField="month"
													min={0}
													max={150}
													readOnly={form.values.dob}
												/>
												<InputNumberForm
													form={form}
													label=""
													placeholder="Months"
													tooltip={t("EnterPatientMonths")}
													name="month"
													id="month"
													nextField="day"
													min={0}
													max={11}
													readOnly={form.values.dob}
												/>
												<InputNumberForm
													form={form}
													label=""
													placeholder="Days"
													tooltip={t("EnterPatientDays")}
													name="day"
													id="day"
													nextField="upazilla_id"
													min={0}
													max={31}
													readOnly={form.values.dob}
												/>

											</Flex>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Flex align="center" gap="es">
												<Text fz="sm">{t("Upazilla")}</Text> <RequiredAsterisk />
											</Flex>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												key={`${resetKey}-upazilla_id`}
												form={form}
												tooltip={t("EnterPatientUpazilla")}
												placeholder="Upazilla - District"
												name="upazilla_id"
												id="upazilla_id"
												nextField="identity"
												value={form.values.upazilla_id}
												required
												dropdownValue={locations?.data?.map((location) => ({
													label: `${location.district} - ${location.name}`,
													value: location.id?.toString(),
												}))}
												searchable
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Type")}</Text>
										</Grid.Col>
										<Grid.Col span={14} py="es">
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
										<Grid.Col span={14}>
											<InputNumberForm
												form={form}
												label=""
												placeholder="1234567890"
												tooltip={t("EnterPatientIdentity")}
												name="identity"
												id="identity"
												nextField="guardian_name"
												value={form.values.identity}
												handleChange={handleContentChange}
												rightSection={
													<ActionIcon
														onClick={handleNIDSearch}
														bg="var(--theme-secondary-color-6)"
													>
														<IconSearch size={"16"} />
													</ActionIcon>
												}
												required
											/>
										</Grid.Col>
									</Grid>
									{showUserData && (
										<Grid align="center" columns={20}>
											<Grid.Col span={6}>
												<Text fz="sm">{t("HID")}</Text>
											</Grid.Col>
											<Grid.Col span={14}>
												<Text
													className="cursor-pointer user-none"
													onClick={openNIDDataPreview}
													fz="sm"
													c="var(--theme-primary-color-6)"
												>
													{form.values.hid || "HID432343"}
												</Text>
											</Grid.Col>
										</Grid>
									)}

									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("GuardianName")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												label=""
												tooltip={t("EnterGuardianName")}
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
												tooltip={t("EnterGuardianMobile")}
												placeholder="+880 1717171717"
												name="guardian_mobile"
												id="guardian_mobile"
												nextField="address"
												value={form.values.guardian_mobile}
												required
											/>
										</Grid.Col>
									</Grid>

									<Grid columns={20}>
										<Grid.Col span={6}></Grid.Col>
										<Grid.Col span={14}>
											{form.values.patient_payment_mode_id !== "30" && (
												<InputForm
													form={form}
													pt={0}
													label=""
													tooltip={t("EnterFreeIdentificationId")}
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
												value={form?.values?.configuredDueAmount || ""}
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
					<Box pl="xs" pr="xs">
						<Button.Group>
							<Button
								w="100%"
								bg="var(--theme-reset-btn-color)"
								leftSection={<IconRestore size={16} />}
								onClick={handleReset}
								disabled={isSubmitting}
							>
								<Stack gap={0} align="center" justify="center">
									<Text>{t("Reset")}</Text>
									<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
										(alt + r)
									</Text>
								</Stack>
							</Button>
							<Button
								w="100%"
								bg="var(--theme-prescription-btn-color)"
								disabled={isSubmitting}
								onClick={() => handlePrint("a4")}
							>
								<Stack gap={0} align="center" justify="center">
									<Text>{t("Prescription")}</Text>
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
								id="EntityFormSubmit"
							>
								<Stack gap={0} align="center" justify="center">
									<Text>{t("POS")}</Text>
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
				<NIDDataPreviewModal
					opened={openedNIDDataPreview}
					close={closeNIDDataPreview}
					userNidData={userNidData}
				/>
			</Box>
			<IPDA4 data={printData} ref={ipdDocumentA4Ref} />
			<IPDPos data={printData} ref={ipdDocumentPosRef} />
		</>
	);
}
