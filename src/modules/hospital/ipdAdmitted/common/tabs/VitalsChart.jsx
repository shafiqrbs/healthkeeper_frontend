import { useDeferredValue, useMemo, useTransition, useState } from "react";
import { ActionIcon, Box, Button, Flex, Group, NumberInput, Paper, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import { useOutletContext } from "react-router-dom";
import { IconPercentage, IconPlus, IconTrash } from "@tabler/icons-react";

export default function VitalsChart() {
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

	const handleAddVitalRecord = (values) => {
		startTransition(() => {
			setVitalRecordList((previous) => [
				...previous,
				{
					id: Date.now(),
					recordedAt: new Date().toISOString(),
					...values,
				},
			]);
		});
		form.reset();
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

			<Box component="form" onSubmit={form.onSubmit(handleAddVitalRecord)} mb="-sm">
				<Flex flex="1" gap="xs">
					<TextInput
						key={form.key("bloodPressure")}
						placeholder="120/80"
						{...form.getInputProps("bloodPressure")}
					/>

					<NumberInput key={form.key("pulseRate")} placeholder="Pulse" {...form.getInputProps("pulseRate")} />

					<NumberInput
						key={form.key("saturationWithoutOxygen")}
						placeholder="EnterSatWithoutO2"
						min={0}
						max={100}
						clampBehavior="strict"
						rightSection={<IconPercentage size={16} />}
						{...form.getInputProps("saturationWithoutOxygen")}
					/>

					<NumberInput
						key={form.key("saturationWithOxygen")}
						placeholder="SatWithO2"
						min={0}
						max={100}
						rightSection={<IconPercentage size={16} />}
						clampBehavior="strict"
						{...form.getInputProps("saturationWithOxygen")}
					/>
					<NumberInput
						key={form.key("oxygenFlowRateLiters")}
						placeholder="Liter"
						min={0}
						max={60}
						step={0.5}
						clampBehavior="strict"
						{...form.getInputProps("oxygenFlowRateLiters")}
					/>

					<NumberInput
						key={form.key("respirationRate")}
						placeholder="EnterRespiration"
						min={0}
						max={80}
						clampBehavior="strict"
						{...form.getInputProps("respirationRate")}
					/>

					<NumberInput
						key={form.key("temperatureFahrenheit")}
						placeholder="EnterTemperature"
						min={0}
						max={110}
						decimalScale={1}
						step={0.1}
						clampBehavior="strict"
						{...form.getInputProps("temperatureFahrenheit")}
					/>

					<Button w={140} type="submit" variant="filled" leftSection={<IconPlus size={16} />}>
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
