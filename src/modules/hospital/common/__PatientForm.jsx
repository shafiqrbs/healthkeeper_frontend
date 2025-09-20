import InputForm from "@components/form-builders/InputForm";
import {
	ActionIcon,
	Box,
	Button,
	Flex,
	Grid,
	Group,
	LoadingOverlay,
	Modal,
	ScrollArea,
	Select,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import {
	IconInfoCircle,
	IconSearch,
	IconAlertCircle,
	IconChevronRight,
	IconAdjustmentsCog,
	IconX,
} from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import DoctorsRoomDrawer from "./__DoctorsRoomDrawer";
import { useDisclosure, useIsFirstRender } from "@mantine/hooks";
import { calculateAge, calculateDetailedAge, getLoggedInUser, getUserRole } from "@/common/utils";
import Table from "../visit/_Table";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useDispatch, useSelector } from "react-redux";
import InputMaskForm from "@components/form-builders/InputMaskForm";
import SegmentedControlForm from "@components/form-builders/SegmentedControlForm";
import RequiredAsterisk from "@components/form-builders/RequiredAsterisk";
import NIDDataPreviewModal from "./NIDDataPreviewModal";
import InputMobileNumberForm from "@components/form-builders/InputMobileNumberForm";
import OPDFooter from "./OPDFooter";
import PrescriptionFooter from "./PrescriptionFooter";
import OpdRoomModal from "@modules/hospital/common/OpdRoomModal";
import { useForm } from "@mantine/form";
import GlobalDrawer from "@/common/components/drawers/GlobalDrawer";
import RoomCard from "./RoomCard";
import { getDataWithoutStore } from "@/services/apiService";
import PatientSearchResult from "./PatientSearchResult";
import { getPatientSearchByBRN, getPatientSearchByHID, getPatientSearchByNID } from "@/services/patientSearchService";

const LOCAL_STORAGE_KEY = "patientFormData";

const ALLOWED_MANAGER_ROLES = [
	"operator_manager",
	"admin_doctor",
	"admin_operator",
	"admin_administrator",
	"accounting_admin",
];
const ALLOWED_ADMIN_ROLES = ["admin_basic", "admin_hospital", "admin_administrator"];

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

export default function PatientForm({
	form,
	module,
	type = "opd_ticket",
	setSelectedRoom,
	handleRoomClick,
	filteredAndSortedRecords,
	selectedRoom,
}) {
	const searchForm = useForm({
		initialValues: {
			type: "PID",
			term: "",
		},
	});

	const [visible, setVisible] = useState(false);
	const { mainAreaHeight } = useOutletContext();
	const [openedDoctorsRoom, { close: closeDoctorsRoom }] = useDisclosure(false);
	const [opened, { close }] = useDisclosure(false);

	// Patient search states
	const [patientSearchResults, setPatientSearchResults] = useState([]);
	const [showPatientDropdown, setShowPatientDropdown] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const searchContainerRef = useRef(null);

	useEffect(() => {
		document.getElementById("patientName").focus();
	}, []);

	// Handle click outside to close dropdown
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

	const handlePatientInfoSearch = async (values) => {
		try {
			const formValue = {
				...values,
				term: searchForm.values.term,
			};

			setIsSearching(true);
			// If PID is selected, show patient dropdown with mock data
			if (searchForm.values.type === "PID") {
				// Simulate API call delay

				const patients = await getDataWithoutStore({
					url: MASTER_DATA_ROUTES.API_ROUTES.OPERATIONAL_API.PATIENT_SEARCH,
					params: { term: searchForm.values.term },
				});

				setPatientSearchResults(patients?.data || []);
				setShowPatientDropdown(true);
				setIsSearching(false);
			} else if (searchForm.values.type === "HID") {
				const patients = await getPatientSearchByHID(searchForm.values.term);
				console.log(patients);

				// setPatientSearchResults(patients?.data || []);
				// setShowPatientDropdown(true);
			} else if (searchForm.values.type === "NID") {
				const patients = await getPatientSearchByNID(searchForm.values.term);
				console.log(patients);

				// setPatientSearchResults(patients?.data || []);
				// setShowPatientDropdown(true);
			} else if (searchForm.values.type === "BRID") {
				const patients = await getPatientSearchByBRN(searchForm.values.term);
				console.log(patients);

				// setPatientSearchResults(patients?.data || []);
				// setShowPatientDropdown(true);
			} else {
				// For other search types, use the original behavior
				console.info(formValue);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsSearching(false);
		}
	};

	const handlePatientSelect = async (patientId, selectedPatient) => {
		setVisible(true);
		const patient = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.VIEW}/${patientId}`,
		});

		// Fill the form with selected patient data
		form.setFieldValue("name", patient?.data?.name);
		form.setFieldValue("mobile", patient?.data?.mobile);
		form.setFieldValue("dob", patient?.data?.dob);
		form.setFieldValue("address", patient?.data?.address);
		form.setFieldValue("customer_id", selectedPatient?.customer_id || "");
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
			<Flex align="center" gap="xs" justify="space-between" px="sm" pb="les">
				<Box
					ref={searchContainerRef}
					component="form"
					onSubmit={searchForm.onSubmit(handlePatientInfoSearch)}
					w="100%"
					style={{ position: "relative" }}
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
							showPatientDropdown ? (
								<ActionIcon
									type="button"
									bg="var(--theme-error-color)"
									onClick={(e) => {
										e.stopPropagation();
										setShowPatientDropdown(false);
									}}
								>
									<IconX size={16} />
								</ActionIcon>
							) : (
								<ActionIcon type="submit" bg="var(--theme-primary-color-6)" loading={isSearching}>
									<IconSearch size={16} />
								</ActionIcon>
							)
						}
					/>

					{/* Patient Search Dropdown */}
					{showPatientDropdown && (
						<PatientSearchResult results={patientSearchResults} handlePatientSelect={handlePatientSelect} />
					)}
				</Box>
			</Flex>
			<Form
				form={form}
				module={module}
				type={type}
				handleRoomClick={handleRoomClick}
				filteredAndSortedRecords={filteredAndSortedRecords}
				selectedRoom={selectedRoom}
				visible={visible}
				setVisible={setVisible}
			/>
			<DoctorsRoomDrawer
				form={form}
				opened={openedDoctorsRoom}
				close={closeDoctorsRoom}
				setSelectedRoom={setSelectedRoom}
			/>
			<Modal opened={opened} onClose={close} size="100%" centered withCloseButton={false}>
				<Table module={module} closeTable={close} height={mainAreaHeight - 220} availableClose />
			</Modal>
		</Box>
	);
}

export function Form({
	form,
	showTitle = false,
	heightOffset = 116,
	module,
	type = "opd_ticket",
	handleRoomClick,
	filteredAndSortedRecords,
	selectedRoom,
	visible,
	setVisible,
}) {
	const [openedNIDDataPreview, { open: openNIDDataPreview, close: closeNIDDataPreview }] = useDisclosure(false);
	const [openedRoomError, { open: openRoomError, close: closeRoomError }] = useDisclosure(false);
	const [openedRoom, { open: openRoom, close: closeRoom }] = useDisclosure(false);
	const [openedOpdRoom, { open: openOpdRoom, close: closeOpdRoom }] = useDisclosure(false);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - heightOffset - 132;
	const firstRender = useIsFirstRender();
	const [userNidData] = useState(USER_NID_DATA);
	const [showUserData, setShowUserData] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const userRoles = getUserRole();
	const locations = useSelector((state) => state.crud.locations.data);

	useEffect(() => {
		dispatch(getIndexEntityData({ module: "locations", url: HOSPITAL_DATA_ROUTES.API_ROUTES.LOCATIONS.INDEX }));
	}, []);

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

	useEffect(() => {
		handleDobChange();
	}, [form.values.dob]);

	useEffect(() => {
		form.setFieldValue("guardian_mobile", form.values.mobile);
	}, [form.values.mobile]);

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

	const handleContentChange = () => {
		setShowUserData(false);
	};

	const handleNIDSearch = () => {
		if (!form.values.identity) {
			showNotificationComponent(t("PleaseEnterNID"), "red", "lightgray", true, 1000, true);
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

	const handleGenderChange = (val) => {
		form.setFieldValue("gender", val);
	};

	const handleTypeChange = (val) => {
		form.setFieldValue("identity_mode", val);
	};

	const handleSubmit = async () => {
		if (!form.validate().hasErrors) {
			setIsSubmitting(true);

			if (!form.values.room_id) {
				openRoomError();
				setIsSubmitting(false);
				return {};
			}

			if (!form.values.amount && form.values.patient_payment_mode_id === "30") {
				showNotificationComponent(t("AmountsRequired"), "red", "lightgray", true, 1000, true);
				setIsSubmitting(false);
				return {};
			}

			try {
				const createdBy = JSON.parse(localStorage.getItem("user"));
				const options = { year: "numeric", month: "2-digit", day: "2-digit" };
				const [day, month, year] = form.values.dob.split("-").map(Number);
				const dateObj = new Date(year, month - 1, day);

				const today = new Date();

				// strict validation: check if JS normalized it
				const isValid =
					dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day;

				// check if future date
				if (dateObj > today) {
					showNotificationComponent(t("DateOfBirthCantBeFutureDate"), "red", "lightgray", true, 1000, true);
					setIsSubmitting(false);
					return {};
				}

				const dob = isValid ? dateObj.toLocaleDateString("en-CA", options) : "invalid";

				const formValue = {
					...form.values,
					created_by_id: createdBy?.id,
					dob,
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
					return {};
				} else {
					showNotificationComponent(t("VisitSavedSuccessfully"), "green", "lightgray", true, 1000, true);
					setRefetchData({ module, refetching: true });
					const selectedRoom = form.values.room_id;
					setShowUserData(false);
					form.reset();
					localStorage.removeItem(LOCAL_STORAGE_KEY);
					form.setFieldValue("room_id", selectedRoom);
					return resultAction.payload.data;
				}
			} catch (error) {
				console.error("Error submitting visit:", error);
				showNotificationComponent(t("SomethingWentWrong"), "red", "lightgray", true, 1000, true);
				return {};
			} finally {
				setIsSubmitting(false);
			}
		} else {
			if (Object.keys(form.errors)?.length > 0 && form.isDirty()) {
				console.error(form.errors);
				showNotificationComponent(t("PleaseFillAllFieldsToSubmit"), "red", "lightgray", true, 1000, true);
			}
			return {};
		}
	};

	return (
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
				<ScrollArea h={mainAreaHeight - 180}>
					<Stack mih={height} className="form-stack-vertical">
						<Flex className="form-action-header full-bleed">
							<Text fz="sm">{t("OPDRoom")}</Text>
							<Flex align="center" gap="xs" className="cursor-pointer">
								<Group>
									{userRoles.some((role) => ALLOWED_MANAGER_ROLES.includes(role)) && (
										<Button
											variant="light"
											onClick={openOpdRoom}
											size={"xs"}
											leftSection={<IconAdjustmentsCog size="16px" />}
										>
											Manage
										</Button>
									)}
									<Button
										size={"xs"}
										onClick={openRoom}
										color="var('--theme-primary-color-2')"
										rightSection={<IconChevronRight size="16px" />}
									>
										{selectedRoom?.name}
									</Button>
								</Group>
							</Flex>
						</Flex>
						<Grid align="center" columns={20}>
							<Grid.Col span={6}>
								<Flex align="center" gap="es">
									<Text fz="sm">{t("PatientName")}</Text>
									<RequiredAsterisk />
								</Flex>
							</Grid.Col>
							<Grid.Col span={14}>
								<InputForm
									form={form}
									label=""
									tooltip={t("enterPatientName")}
									placeholder="Md. Abdul"
									name="name"
									id="patientName"
									nextField="mobile"
									value={form.values.name}
									// required
								/>
							</Grid.Col>
						</Grid>
						<Grid align="center" columns={20}>
							<Grid.Col span={6}>
								<Flex align="center" gap="es">
									<Text fz="sm">{t("Mobile")}</Text>
									<RequiredAsterisk />
								</Flex>
							</Grid.Col>
							<Grid.Col span={14}>
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
							<Grid.Col span={14} py="es">
								<SegmentedControlForm
									fullWidth
									color="var(--theme-primary-color-6)"
									value={form.values.gender}
									id="gender"
									name="gender"
									nextField="dob"
									onChange={(val) => handleGenderChange(val)}
									data={[
										{ label: t("Male"), value: "male" },
										{ label: t("Female"), value: "female" },
										{ label: t("Other"), value: "other" },
									]}
								/>
							</Grid.Col>
						</Grid>
						<Grid align="center" columns={20}>
							<Grid.Col span={6}>
								<Flex align="center" gap="es">
									<Text fz="sm">{t("DateOfBirth")}</Text>
								</Flex>
							</Grid.Col>
							<Grid.Col span={14}>
								<InputMaskForm
									name="dob"
									id="dob"
									value={form.values?.dob}
									form={form}
									label=""
									tooltip={t("EnterPatientBirthDate")}
									placeholder="DD-MM-YYYY"
									nextField="day"
									maskInput="00-00-0000"
									rightSection={<IconInfoCircle size={16} opacity={0.5} />}
								/>
							</Grid.Col>
						</Grid>
						<Grid align="center" columns={20}>
							<Grid.Col span={6}>
								<Text fz="sm">{t("Age")}</Text>
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
								<Flex align="center" gap="es">
									<Text fz="sm">{t("Upazilla")}</Text> <RequiredAsterisk />
								</Flex>
							</Grid.Col>
							<Grid.Col span={14}>
								<SelectForm
									form={form}
									tooltip={t("EnterPatientUpazilla")}
									placeholder="District - Upazilla"
									name="upazilla_id"
									id="upazilla_id"
									nextField="identity"
									value={form.values.upazilla_id}
									required
									dropdownValue={locations?.data?.map((location) => ({
										label: `${location.district || "District"} - ${location.name}`,
										value: location.id?.toString(),
									}))}
									searchable
								/>
							</Grid.Col>
						</Grid>
						<Grid align="center" columns={20}>
							<Grid.Col span={6}>
								<Flex align="center" gap="es">
									<Text fz="sm">{t("Type")}</Text>
									<RequiredAsterisk />
								</Flex>
							</Grid.Col>
							<Grid.Col span={14} py="es">
								<SegmentedControlForm
									fullWidth
									color="var(--theme-primary-color-6)"
									value={form.values.identity_mode}
									id="identity_mode"
									name="identity_mode"
									nextField="identity"
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
										<ActionIcon onClick={handleNIDSearch} bg="var(--theme-secondary-color-6)">
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
									placeholder={t("EnterFatherMotherHusbandBrother")}
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
								<InputMobileNumberForm
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
						<Grid align="center" columns={20}>
							<Grid.Col span={6}>
								<Text fz="sm">{t("address")}</Text>
							</Grid.Col>
							<Grid.Col span={14}>
								<TextAreaForm
									form={form}
									label=""
									tooltip={t("EnterPatientAddress")}
									placeholder="12 street, 123456"
									name="address"
									id="address"
									nextField="free_identification_id"
									value={form.values.address}
									required
								/>
							</Grid.Col>
						</Grid>
						<Grid columns={20}>
							<Grid.Col span={20} pt="es">
								<SegmentedControlForm
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
										{ label: t("MDR"), value: "50" },
									]}
								/>
							</Grid.Col>
							<Grid.Col span={6}></Grid.Col>
							<Grid.Col span={14}>
								{form.values.patient_payment_mode_id !== "30" && (
									<InputForm
										form={form}
										pt={0}
										label=""
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
			</Box>
			{type === "opd_ticket" ? (
				<OPDFooter form={form} isSubmitting={isSubmitting} handleSubmit={handleSubmit} type="opd_ticket" />
			) : (
				<PrescriptionFooter
					form={form}
					isSubmitting={isSubmitting}
					handleSubmit={handleSubmit}
					type="prescription"
				/>
			)}
			<NIDDataPreviewModal opened={openedNIDDataPreview} close={closeNIDDataPreview} userNidData={userNidData} />

			{/* ============== required room selection =============== */}
			<Modal
				opened={openedRoomError}
				onClose={closeRoomError}
				size="md"
				title={
					<Flex align="center" gap="xs">
						<IconAlertCircle size={20} color="var(--theme-error-color)" />
						<Text fw={600} fz="lg">
							{t("Room Selection Required")}
						</Text>
					</Flex>
				}
				styles={{
					title: {
						borderBottom: "1px solid var(--mantine-color-gray-3)",
						paddingBottom: "var(--mantine-spacing-xs)",
						marginBottom: "var(--mantine-spacing-md)",
					},
				}}
			>
				<Stack gap="md">
					{/* =============== main error message with icon =============== */}
					<Flex
						align="center"
						gap="sm"
						p="md"
						bg="var(--mantine-color-red-0)"
						style={{ borderRadius: "8px", border: "1px solid var(--mantine-color-red-2)" }}
					>
						<IconAlertCircle size={24} color="var(--theme-error-color)" />
						<Box>
							<Text fw={600} c="var(--theme-error-color)" fz="md">
								{t("Please select a room")}
							</Text>
							<Text c="dimmed" fz="sm" mt={4}>
								{t("A room must be selected to continue with the patient registration")}
							</Text>
						</Box>
					</Flex>

					{/* =============== helpful information section =============== */}
					<Box
						p="md"
						bg="var(--mantine-color-blue-0)"
						style={{ borderRadius: "8px", border: "1px solid var(--mantine-color-blue-2)" }}
					>
						<Text fw={600} c="var(--mantine-color-blue-7)" fz="sm" mb="xs">
							{t("Why is this required?")}
						</Text>
						<Text c="dimmed" fz="sm" lh={1.5}>
							{t(
								"Room selection helps in proper patient management, billing, and resource allocation. It ensures patients are assigned to appropriate care areas."
							)}
						</Text>
					</Box>

					{/* =============== action buttons =============== */}
					<Flex gap="sm" justify="flex-end" pt="xs">
						<Button variant="light" onClick={closeRoomError} color="gray">
							{t("Close")}
						</Button>
						<Button
							onClick={() => {
								closeRoomError();
								// you can add logic here to open room selection drawer/form
							}}
							color="var(--theme-primary-color-6)"
						>
							{t("Select Room")}
						</Button>
					</Flex>
				</Stack>
			</Modal>

			<GlobalDrawer
				opened={openedRoom}
				close={closeRoom}
				title="Select a Room"
				size="20%"
				bg="var(--theme-primary-color-0)"
				keepMounted
			>
				<ScrollArea h={mainAreaHeight - 70} scrollbars="y" mt="xs" p="xs" bg="white">
					{filteredAndSortedRecords?.map((item, index) => (
						<RoomCard
							key={index}
							room={item}
							selectedRoom={selectedRoom}
							handleRoomClick={handleRoomClick}
							closeRoom={closeRoom}
						/>
					))}
				</ScrollArea>
			</GlobalDrawer>
			<Modal opened={openedOpdRoom} onClose={closeOpdRoom} size="100%" centered withCloseButton={false}>
				<OpdRoomModal closeOpdRoom={closeOpdRoom} closeTable={close} height={mainAreaHeight - 220} />
			</Modal>
		</Box>
	);
}
