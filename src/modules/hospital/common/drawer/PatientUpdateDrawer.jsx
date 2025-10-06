import InputForm from "@components/form-builders/InputForm";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Button, Flex, Grid, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import SegmentedControlForm from "@components/form-builders/SegmentedControlForm";
import { MODULES_CORE } from "@/constants";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import SelectForm from "@components/form-builders/SelectForm";

const roomModule = MODULES_CORE.OPD_ROOM;

export default function PatientUpdateDrawer({ opened, close, type, data }) {
	const [records, setRecords] = useState([]);
	const dispatch = useDispatch();
	const form = useForm({
		initialValues: {
			name: "",
			mobile: "",
			identity: "",
			year: "",
			month: "",
			day: "",
			room_id: "",
		},
	});

	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();

	useEffect(() => {
		form.setFieldValue("name", data?.name || "");
		form.setFieldValue("mobile", data?.mobile || "");
		form.setFieldValue("identity", data?.nid || "");
		form.setFieldValue("year", data?.year || "");
		form.setFieldValue("month", data?.month || "");
		form.setFieldValue("day", data?.day || "");
		form.setFieldValue("gender", data?.gender || "");

		if (type === "opd") {
			form.setFieldValue("room_id", data?.room_id || "");
		}
	}, [data]);

	const handleSubmit = async (values) => {
		try {
			// if(type === "opd") {
			//      update(opd_url)
			// } else {
			//      update(emergency_url)
			// }
			console.log(values);
		} catch (error) {
			console.log(error);
		}
	};

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
								nextField="identity"
								value={form.values.mobile}
							/>
						</Grid.Col>
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
								onChange={(val) => form.setFieldValue("gender", val)}
								data={[
									{ label: t("Male"), value: "male" },
									{ label: t("Female"), value: "female" },
									{ label: t("Other"), value: "other" },
								]}
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
									placeholder="Days"
									tooltip={t("EnterDays")}
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
									readOnly={form.values.dob}
								/>
								<InputNumberForm
									form={form}
									label=""
									placeholder="Months"
									tooltip={t("EnterMonths")}
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
									readOnly={form.values.dob}
								/>

								<InputNumberForm
									form={form}
									label=""
									placeholder="Years"
									tooltip={t("EnterYears")}
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
									readOnly={form.values.dob}
								/>
							</Flex>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text fz="sm">{t("Identity")}</Text>
						</Grid.Col>
						<Grid.Col span={14}>
							<InputForm
								form={form}
								label=""
								tooltip={t("EnterPatientIdentity")}
								placeholder="1234567890"
								name="identity"
								id="identity"
								nextField="year"
								value={form.values.identity}
							/>
						</Grid.Col>
						{type === "opd" && (
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
						)}
					</Grid>

					<Flex gap="xs" justify="flex-end">
						<Button type="submit" bg="var(--theme-primary-color-6)" color="white">
							{t("Save")}
						</Button>
						<Button type="button" bg="var(--theme-tertiary-color-6)" color="white" onClick={close}>
							{t("Cancel")}
						</Button>
					</Flex>
				</Stack>
			</Box>
		</GlobalDrawer>
	);
}
