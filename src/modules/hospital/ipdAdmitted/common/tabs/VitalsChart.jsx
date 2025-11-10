import { useDeferredValue, useMemo, useTransition, useState } from "react";
import { ActionIcon, Box, Button, Flex, Group, NumberInput, Paper, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { TimeInput } from '@mantine/dates';
import { DataTable } from "mantine-datatable";

import tableCss from "@assets/css/TableAdmin.module.css";
import { useOutletContext, useParams } from "react-router-dom";
import { IconPercentage, IconPlus, IconTrash } from "@tabler/icons-react";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { useTranslation } from "react-i18next";
import DateSelector from "@components/form-builders/DateSelector";

export default function VitalsChart() {
	const { id } = useParams();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 68;
	// =============== local state for table records and transition helpers ===============
	const [vitalRecordList, setVitalRecordList] = useState([]);
	const [isPending, startTransition] = useTransition();
	const deferredVitalRecordList = useDeferredValue(vitalRecordList);

	// =============== form for inline vital inputs ===============
	const form = useForm({
		initialValues: {
			bloodPressure: "",
			pulseRate: undefined,
			saturationWithoutOxygen: undefined,
			saturationWithOxygen: undefined,
			oxygenFlowRateLiters: undefined,
			respirationRate: undefined,
			temperatureFahrenheit: undefined,
		},
		validateInputOnBlur: true,
		validate: {},
	});

	const handleVitalSubmit = async (data) => {
		const response = await dispatch(
			storeEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PATIENT_CHART}/${id}`,
				data: {
					vital_chart_json: data,
				},
			})
		);
		if (storeEntityData.fulfilled.match(response)) {
			successNotification(t("VitalChartAddedSuccessfully"));
			form.reset();
		} else {
			errorNotification(t("VitalChartAddedFailed"));
		}
	};

	const handleAddVitalRecord = (values) => {
		startTransition(() => {
			const vitalRecords = [
				...vitalRecordList,
				{
					id: crypto.randomUUID(),
					createdAt: new Date().toISOString(),
					...values,
				},
			];
			setVitalRecordList(vitalRecords);
			handleVitalSubmit(vitalRecords);
		});
	};

	const handleDeleteVitalRecord = (id) => {
		setVitalRecordList((previous) => previous.filter((record) => record.id !== id));
	};

	const columns = useMemo(
		() => [
			// {
			// 	accessor: "recordedAt",
			// 	title: "Created",
			// 	render: ({ recordedAt }) => new Date(recordedAt).toLocaleString(),
			// },
			{ accessor: "bloodPressure", title: "BP (mm of Hg)" },
			{ accessor: "pulseRate", title: "Pulse (Beat/Minute)" },
			{ accessor: "saturationWithoutOxygen", title: "SatWithoutO2 (%)" },
			{
				accessor: "saturationWithOxygen",
				title: "SatWithO2 (%)",
			},
			{
				accessor: "oxygenFlowRateLiters",
				title: "O2 Flow (L/min)",
			},
			{ accessor: "respirationRate", title: "Respiration (Breath/Minute)" },
			{ accessor: "temperatureFahrenheit", title: "Temperature (°F)" },
			{
				accessor: "actions",
				title: "Actions",
				render: ({ id }) => (
					<ActionIcon variant="transparent" color="red" size="xs" onClick={() => handleDeleteVitalRecord(id)}>
						<IconTrash />
					</ActionIcon>
				),
			},
		],
		[]
	);

	return (
		<Paper p="md" radius="md" withBorder>
			<Group justify="space-between" mb="sm">
				<Title order={4}>Vitals</Title>
				<Text c="dimmed" size="sm">
					{isPending ? "saving..." : ""}
				</Text>
			</Group>

			<Box bg="var(--theme-secondary-color-0)" p={'xs'} component="form" onSubmit={form.onSubmit(handleAddVitalRecord)} mb="-sm">
				<Flex flex="1" gap="xs">
					<Box>
						<DateSelector
							size="sm"
							value={form.values.date}
							onChange={(value) => form.setFieldValue("date", value)}
							placeholder="Date"
						/>
					</Box>
					<Box>
						<TimeInput
							size="xs"
							format="12h"
							value={form.values.time}
							onChange={(value) => form.setFieldValue("time", value)}
							placeholder="Time"
						/>
					</Box>
					<TextInput
						pattern="[0-9/]*"
						size="xs"
						key={form.key("bloodPressure")}
						placeholder="120/80"
						{...form.getInputProps("bloodPressure")}
					/>

					<TextInput
						pattern="[0-9/]*"
						size="xs"
						key={form.key("pulseRate")}
						placeholder="Pulse" {...form.getInputProps("pulseRate")}
					/>

					<TextInput
						size="xs"
						key={form.key("saturationWithoutOxygen")}
						placeholder="EnterSatWithoutO2"
						min={0}
						max={100}
						clampBehavior="strict"
						rightSection={<IconPercentage size={16} />}
						{...form.getInputProps("saturationWithoutOxygen")}
					/>

					<TextInput
						size="xs"
						key={form.key("saturationWithOxygen")}
						placeholder="SatWithO2"
						min={0}
						max={100}
						rightSection={<IconPercentage size={16} />}
						clampBehavior="strict"
						{...form.getInputProps("saturationWithOxygen")}
					/>
					<TextInput
						size="xs"
						key={form.key("oxygenFlowRateLiters")}
						placeholder="Liter"
						min={0}
						max={60}
						step={0.5}
						clampBehavior="strict"
						rightSection={<IconPercentage size={16} />}
						{...form.getInputProps("oxygenFlowRateLiters")}
					/>

					<TextInput
						size="xs"
						key={form.key("respirationRate")}
						placeholder="EnterRespiration"
						min={0}
						max={80}
						clampBehavior="strict"
						rightSection={<IconPercentage size={16} />}
						{...form.getInputProps("respirationRate")}
					/>

					<TextInput
						size="xs"
						key={form.key("temperatureFahrenheit")}
						placeholder="EnterTemperature"
						min={0}
						max={110}
						decimalScale={1}
						step={0.1}
						clampBehavior="strict"
						rightSection={<IconPercentage size={16} />}
						{...form.getInputProps("temperatureFahrenheit")}
					/>

					<Button size="xs" w={140} type="submit" variant="filled" leftSection={<IconPlus size={16} />}>
						Add
					</Button>
				</Flex>
			</Box>

			<DataTable
				striped
				highlightOnHover
				classNames={{
					root: tableCss.root,
					table: tableCss.table,
					body: tableCss.body,
					header: tableCss.header,
					footer: tableCss.footer,
					pagination: tableCss.pagination,
				}}
				mt="md"
				minHeight={160}
				withBorder
				records={deferredVitalRecordList}
				columns={columns}
				loaderSize="xs"
				loaderColor="grape"
				height={height - 72}
				noRecordsText="no vital records added"
			/>
		</Paper>
	);
}
