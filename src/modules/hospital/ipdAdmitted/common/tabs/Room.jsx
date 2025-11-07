import TabSubHeading from "@hospital-components/TabSubHeading";
import { Badge, Box, Flex, Grid, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useOutletContext, useParams } from "react-router-dom";
import TabsActionButtons from "@hospital-components/TabsActionButtons";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { useDispatch, useSelector } from "react-redux";
import SelectForm from "@components/form-builders/SelectForm";
import { useTranslation } from "react-i18next";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useEffect, useCallback } from "react";

const roomDetails = [
	{
		id: 1,
		label: "Patient presents with persistent headache and dizziness for 3 days.",
		date: "25-06-25",
	},
	{
		id: 2,
		label: "Complaining of high fever, sore throat, and body ache since yesterday.",
		date: "26-06-25",
	},
	{
		id: 3,
		label: "Severe abdominal pain in the lower right quadrant since morning.",
		date: "27-06-25",
	},
	{
		id: 4,
		label: "Severe abdominal pain in the lower right quadrant since morning.",
		date: "28-06-25",
	},
];

const PER_PAGE = 100;

export default function Room() {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const { id } = useParams();

	const form = useForm({
		initialValues: {
			roomType: "",
			room: "",
			roomNo: "",
			gender: "",
			days: "",
		},
		validate: {
			roomType: (value) => {
				if (!value) return "Room type is required";
			},
			room: (value) => {
				if (!value) return "Room is required";
			},
			days: (value) => {
				if (!value) return "Days is required";
			},
		},
	});

	const cabinListData = useSelector((state) => state.crud.cabin?.data?.data);

	const bedListData = useSelector((state) => state.crud.bed?.data?.data);

	// =============== generate filtered room options based on roomType, gender, and room selections ================
	const getFilteredRoomOptions = () => {
		if (!form.values.roomType || !form.values.gender || !form.values.room) {
			return [];
		}

		const currentData = form.values.roomType === "cabin" ? cabinListData : bedListData;

		if (!currentData || !Array.isArray(currentData)) {
			return [];
		}

		return currentData
			.filter((item) => {
				// =============== filter by room type ================
				const matchesRoomType = item.particular_type_slug === form.values.roomType;

				// =============== filter by gender (if gender_mode_name exists) ================
				const matchesGender =
					!item.gender_mode_name || item.gender_mode_name.toLowerCase() === form.values.gender.toLowerCase();

				// =============== filter by payment mode ================
				const matchesPaymentMode =
					!item.payment_mode_name || item.payment_mode_name.toLowerCase() === form.values.room.toLowerCase();

				// =============== only show available rooms ================
				// const isAvailable = item.is_available === 1;

				return matchesRoomType && matchesGender && matchesPaymentMode;
			})
			.map((item) => ({
				value: item.id.toString(),
				label: item.display_name || item.name,
			}));
	};

	const filteredRoomOptions = getFilteredRoomOptions();

	console.log(filteredRoomOptions);

	const fetchData = useCallback((roomType = "cabin") => {
		if (roomType === "cabin") {
			dispatch(
				getIndexEntityData({
					url: MASTER_DATA_ROUTES.API_ROUTES.CABIN.INDEX,
					module: "cabin",
					params: { particular_type: "cabin", term: "", page: 1, offset: PER_PAGE },
				})
			);
		} else if (roomType === "bed") {
			dispatch(
				getIndexEntityData({
					url: MASTER_DATA_ROUTES.API_ROUTES.BED.INDEX,
					module: "bed",
					params: { particular_type: "bed", term: "", page: 1, offset: PER_PAGE },
				})
			);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, []);

	// =============== fetch data when roomType changes ================
	useEffect(() => {
		if (form.values.roomType) {
			fetchData(form.values.roomType);
		}
	}, [form.values.roomType]);

	// =============== reset roomNo when filter fields change ================
	useEffect(() => {
		form.setFieldValue("roomNo", "");
	}, [form.values.roomType, form.values.gender, form.values.room]);

	const handleSubmit = async (values) => {
		try {
			const formValue = {
				json_content: { id: null, name: "Room", value: values?.roomNo, days: values?.days },
				ipd_module: "room",
			};

			console.log(formValue);
			return;
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.UPDATE}/${id}`,
				data: formValue,
				module: "admission",
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (resultAction.payload.success) {
				console.log(resultAction.payload.data);
				successNotification(resultAction.payload.message);
			} else {
				errorNotification(resultAction.payload.message);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Box h={mainAreaHeight - 63} p="xs">
			<Grid columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%" } }}>
				<Grid.Col span={8} h="100%">
					<TabSubHeading title="Room" bg="var(--theme-primary-color-0)" />
					<Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
						<Stack h={mainAreaHeight - 130} justify="space-between" gap={0}>
							<Box bg="var(--theme-primary-color-0)" p="3xs" h={mainAreaHeight - 63 - 70}>
								<SelectForm
									form={form}
									label={t("RoomType")}
									name="roomType"
									id="roomType"
									nextField="room"
									value={form.values.roomType}
									dropdownValue={[
										{ value: "cabin", label: t("Cabin") },
										{ value: "bed", label: t("Bed") },
									]}
								/>
								<SelectForm
									form={form}
									label={t("Gender")}
									name="gender"
									id="gender"
									nextField="room"
									value={form.values.gender}
									dropdownValue={[
										{ value: "male", label: t("Male") },
										{ value: "female", label: t("Female") },
										{ value: "other", label: t("Other") },
									]}
								/>

								<SelectForm
									form={form}
									label={t("Room")}
									name="room"
									id="room"
									nextField="roomNo"
									value={form.values.room}
									dropdownValue={[
										{ label: "Paying", value: "paying" },
										{ label: "Non-Paying", value: "non-paying" },
									]}
								/>
								<Flex gap="xs">
									<SelectForm
										searchable
										form={form}
										label={t("RoomNo")}
										name="roomNo"
										id="roomNo"
										value={form.values.roomNo}
										dropdownValue={filteredRoomOptions.map((item) => ({
											value: item.value,
											label: item.label,
										}))}
										disabled={!form.values.roomType || !form.values.gender || !form.values.room}
									/>
									<InputNumberForm
										w="140px"
										tooltip={t("EnterDays")}
										placeholder={t("EnterDays")}
										label={t("Day/s")}
										form={form}
										name="days"
										value={form.values.days}
										id="days"
									/>
								</Flex>
							</Box>
							<TabsActionButtons handleReset={() => {}} />
						</Stack>
					</Box>
				</Grid.Col>
				<Grid.Col span={16}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Room Details" />
						<Box p="xs">
							{roomDetails.map((item) => (
								<Flex key={item.id} gap="xs" mb="3xs">
									<Text>{item.id}.</Text>
									<Box>
										<Badge variant="light" size="md" color="var(--theme-secondary-color-7)">
											{item.date}
										</Badge>
										<Text mt="es" fz="sm">
											{item.label}
										</Text>
									</Box>
								</Flex>
							))}
						</Box>
					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
