import InputForm from "@components/form-builders/InputForm";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Button, Flex, Grid, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { ERROR_NOTIFICATION_COLOR, MODULES, MODULES_CORE, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import SelectForm from "@components/form-builders/SelectForm";
import { successNotification } from "@components/notification/successNotification";
import useVendorDataStoreIntoLocalStorage from "@hooks/local-storage/useVendorDataStoreIntoLocalStorage";
import { setInsertType } from "@/app/store/core/crudSlice";
import { errorNotification } from "@components/notification/errorNotification";
import {calculateAge, calculateDetailedAge, formatDOB} from "@utils/index";
import {showNotificationComponent} from "@components/core-component/showNotificationComponent";
import DateSelectorForm from "@components/form-builders/DateSelectorForm";

const roomModule = MODULES_CORE.OPD_ROOM;
const module = MODULES.VISIT;

export default function PatientUpdateDrawer({ opened, close, type, data }) {
	const [records, setRecords] = useState([]);
	const dispatch = useDispatch();

	const form = useForm({
		initialValues: {
			name: "",
			mobile: "",
			nid: type === "opd" ? "" : undefined,
			year: "",
			month: "",
			day: "",
			room_id: "",
		},
		validate: {
			name: (value) => {
				if (!value) return "Name is required";
				return null;
			},
			gender: (value) => {
				if (!value) return "Gender is required";
				return null;
			},
			day: (_, values) => {
				const isEmpty = (v) => v === "" || v === null || v === undefined;
				return isEmpty(values?.day) && isEmpty(values?.month) && isEmpty(values?.year)
					? "Age is required"
					: null;
			},
			month: (_, values) => {
				const isEmpty = (v) => v === "" || v === null || v === undefined;
				return isEmpty(values?.day) && isEmpty(values?.month) && isEmpty(values?.year)
					? "Age is required"
					: null;
			},
			year: (_, values) => {
				const isEmpty = (v) => v === "" || v === null || v === undefined;
				return isEmpty(values?.day) && isEmpty(values?.month) && isEmpty(values?.year)
					? "Age is required"
					: null;
			},
			room_id: (value) => {
				if (!value && type === "opd") return "Room is required";
				return null;
			},
		},
	});

	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();

	useEffect(() => {
		form.setFieldValue("name", data?.name || "");
	//	form.setFieldValue("dob", data?.date_of_birth ? new Date(data.date_of_birth) : null);
		form.setFieldValue("mobile", data?.mobile || "");
		form.setFieldValue("nid", data?.nid || "");
		form.setFieldValue("year", data?.year || "");
		form.setFieldValue("month", data?.month || "");
		form.setFieldValue("day", data?.day || "");
		form.setFieldValue("gender", data?.gender || "");

		if (type === "opd") {
			form.setFieldValue("room_id", data?.room_id || "");
		}
	}, [data]);

	/*const handleDobChange = () => {
		const type = form.values.ageType || "year";
		const formattedDOB = formatDOB(form.values.dob);
		const formattedAge = calculateAge(formattedDOB, type);
		form.setFieldValue("age", formattedAge);

		// Calculate detailed age from date of birth
		if (form.values.dob) {
			const detailedAge = calculateDetailedAge(formattedDOB);
			form.setFieldValue("year", detailedAge.years);
			form.setFieldValue("month", detailedAge.months);
			form.setFieldValue("day", detailedAge.days);
		}
	};
	useEffect(() => {
		handleDobChange();
	}, [JSON.stringify(form.values.dob)]);*/

	async function handleSubmit(values) {
		try {
			const formattedDOB = formatDOB(form.values.dob);
			const options = { year: "numeric", month: "2-digit", day: "2-digit" };
			const [day, month, year] = formattedDOB.split("-").map(Number);
			const dateObj = new Date(year, month - 1, day);

			const today = new Date();

			// strict validation: check if JS normalized it
			const isValid =
				dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day;

			// check if future date
			if (dateObj > today) {
				showNotificationComponent(t("DateOfBirthCantBeFutureDate"), "red", "lightgray", true, 700, true);
				setIsSubmitting(false);
				return {};
			}

		//	const dob = isValid ? dateObj.toLocaleDateString("en-CA", options) : "invalid";

			const formValue = {
				...form.values
			};
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.UPDATE}/${data?.id}`,
				data: formValue,
				module,
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;

				// Check if there are field validation errors and dynamically set them
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
					});
					// Display the errors using your form's `setErrors` function dynamically
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				setTimeout(() => {
					useVendorDataStoreIntoLocalStorage();
					form.reset();
					dispatch(setInsertType({ insertType: "create", module }));
					close(); // close the drawer
				}, 700);
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	const filteredAndSortedRecords = useMemo(() => {
		if (!records || records.length === 0) return [];
		// sort by invoice_count in ascending order
		return [...records]?.sort((a, b) => (a?.invoice_count || 0) - (b?.invoice_count || 0));
	}, [records]);

	const fetchData = async () => {
		const value = {
			url: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.VISITING_ROOM,
			module: roomModule,
		};
		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			const roomData = result?.data?.data?.ipdRooms || [];
			setRecords(roomData);
		} catch (err) {
			console.error("Unexpected error:", err);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<GlobalDrawer opened={opened} close={close} title="Patient Update" size="35%">
			<Box component="form" onSubmit={form.onSubmit(handleSubmit)} pt="lg">
				<Stack mih={mainAreaHeight - 100} justify="space-between">
					<Grid align="center" columns={20}>
						{type === "opd" ? (
							<>
								<Grid.Col span={6}>
									<Text fz="sm">{t("Room")}</Text>
								</Grid.Col>
								<Grid.Col span={14}>
									<SelectForm
										form={form}
										label=""
										tooltip={t("EnterPatientRoom")}
										placeholder="1234567890"
										name="room_id"
										id="room_id"
										value={form.values.room_id}
										dropdownValue={filteredAndSortedRecords?.map((item) => ({
											label: item?.name,
											value: item?.id?.toString(),
										}))}
										clearable={false}
									/>
								</Grid.Col>
							</>
						):(
							<>
								<Grid.Col span={6}>
									<Text fz="sm">{t("Name")}</Text>
								</Grid.Col>
								<Grid.Col span={14}>
									<InputForm
										form={form}
										label=""
										tooltip={t("EnterPatientName")}
										placeholder="Md. Abdul"
										name="name"
										id="name"
										nextField="mobile"
										value={form.values.name}
									/>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fz="sm">{t("Age")}</Text>
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
										/>
										<InputNumberForm
											form={form}
											label=""
											placeholder="Months"
											tooltip={t("EnterMonths")}
											name="month"
											id="month"
											nextField="day"
											min={0}
											max={11}
										/>
										<InputNumberForm
											form={form}
											label=""
											placeholder="Days"
											tooltip={t("EnterDays")}
											name="day"
											id="day"
											nextField="month"
											min={0}
											max={31}
										/>
									</Flex>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fz="sm">{t("Gender")}</Text>
								</Grid.Col>
								<Grid.Col span={14} py="es">
									<SelectForm
										form={form}
										label=""
										tooltip={t("EnterPatientGender")}
										placeholder="Male"
										name="gender"
										id="gender"
										value={form.values.gender}
										dropdownValue={[
											{ label: t("Male"), value: "male" },
											{ label: t("Female"), value: "female" },
											{ label: t("Other"), value: "other" },
										]}
										clearable={false}
									/>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fz="sm">{t("Mobile")}</Text>
								</Grid.Col>
								<Grid.Col span={14}>
									<InputForm
										form={form}
										label=""
										tooltip={t("EnterPatientMobile")}
										placeholder="+880 1700000000"
										name="mobile"
										id="mobile"
										nextField="nid"
										value={form.values.mobile}
									/>
								</Grid.Col>
								<Grid.Col span={6}>
									<Text fz="sm">{t("NID")}</Text>
								</Grid.Col>
								<Grid.Col span={14}>
									<InputForm
										form={form}
										label=""
										tooltip={t("EnterPatientIdentity")}
										placeholder="1234567890"
										name="nid"
										id="nid"
										value={form.values.identity}
									/>
								</Grid.Col>
							</>
							)}

					</Grid>

					<Flex gap="xs" justify="flex-end">

						<Button type="button" variant={'outline'}  color="var(--theme-tertiary-color-6)" onClick={close}>
							{t("Cancel")}
						</Button>
						<Button type="submit" bg="var(--theme-primary-color-6)" color="white">
							{t("Save")}
						</Button>
					</Flex>
				</Stack>
			</Box>
		</GlobalDrawer>
	);
}
