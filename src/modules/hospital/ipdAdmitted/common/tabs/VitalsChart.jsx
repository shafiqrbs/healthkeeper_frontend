import { useDeferredValue, useMemo, useTransition, useState, useEffect, useRef } from "react";
import { ActionIcon, Box, Button, Flex, Group, Paper, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { TimeInput } from "@mantine/dates";
import { DataTable } from "mantine-datatable";

import tableCss from "@assets/css/TableAdmin.module.css";
import { useOutletContext, useParams } from "react-router-dom";
import { IconClock, IconPercentage, IconPlus, IconTrash } from "@tabler/icons-react";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { useTranslation } from "react-i18next";
import InputForm from "@components/form-builders/InputForm";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import inputCss from "@assets/css/InputField.module.css";
import DateSelectorForm from "@components/form-builders/DateSelectorForm";
import { getUUID } from "@utils/index";

export default function VitalsChart({ data, refetch }) {
	const [resetKey, setResetKey] = useState(0);
	const ref = useRef(null);
	const { id } = useParams();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 68;
	// =============== local state for table records and transition helpers ===============
	const [vitalRecordList, setVitalRecordList] = useState([]);
	const [isPending, startTransition] = useTransition();
	const deferredVitalRecordList = useDeferredValue(vitalRecordList);

	useEffect(() => {
		if (data) {
			setVitalRecordList(JSON.parse(data?.vital_chart_json || "[]"));
		}
	}, [data]);

	// =============== form for inline vital inputs ===============
	const form = useForm({
		initialValues: {
			date: "",
			time: "",
			bloodPressure: "",
			pulseRate: null,
			saturationWithoutOxygen: null,
			saturationWithOxygen: null,
			oxygenFlowRateLiters: null,
			respirationRate: null,
			temperatureFahrenheit: null,
		},
		validate: {
			date: (value) => {
				if (!value) {
					return t("Enter Date");
				}
				return null;
			},
			time: (value) => {
				if (!value) {
					return t("Enter Time");
				}
				return null;
			},

			/*bloodPressure: (value) => {
				if (!value) {
					return "Blood pressure is required";
				}
				return null;
			},
			pulseRate: (value) => {
				if (!value) {
					return "Pulse rate must be a number";
				}
				return null;
			},
			saturationWithoutOxygen: (value) => {
				if (!value) {
					return "Saturation without oxygen is required";
				}
				return null;
			},
			saturationWithOxygen: (value) => {
				if (!value) {
					return "Saturation with oxygen is required";
				}
				return null;
			},
			oxygenFlowRateLiters: (value) => {
				if (!value) {
					return "Oxygen flow rate is required";
				}
				return null;
			},
			respirationRate: (value) => {
				if (!value) {
					return "Respiration rate is required";
				}
				return null;
			},
			temperatureFahrenheit: (value) => {
				if (!value) {
					return "Temperature is required";
				}
				return null;
			},*/
		},
	});

	const handleVitalSubmit = async (values) => {
		const response = await dispatch(
			storeEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PATIENT_CHART}/${id}`,
				data: {
					vital_chart_json: values,
					insulin_chart_json: JSON.parse(data?.insulin_chart_json || "[]"),
				},
				module: "e_fresh",
			})
		);
		if (storeEntityData.fulfilled.match(response)) {
			successNotification(t("VitalChartAddedSuccessfully"));
			form.reset();
			setResetKey((prev) => prev + 1);
			refetch();
		} else {
			errorNotification(t("VitalChartAddedFailed"));
		}
	};

	const handleAddVitalRecord = (values) => {
		startTransition(() => {
			const vitalRecords = [
				...vitalRecordList,
				{
					id: getUUID(),
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
			{
				accessor: "createdAt",
				title: "Created",
				render: ({ createdAt }) => new Date(createdAt).toLocaleString(),
			},
			{ accessor: "time", title: "Time" },
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

	const pickerControl = (
		<ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
			<IconClock size={16} stroke={1.5} />
		</ActionIcon>
	);

	return (
		<Paper p="md" radius="md" withBorder>
			<Group justify="space-between" mb="sm">
				<Title order={4}>Vitals</Title>
				<Text c="dimmed" size="sm">
					{isPending ? "saving..." : ""}
				</Text>
			</Group>

			<Box
				bg="var(--theme-secondary-color-0)"
				p="xs"
				component="form"
				onSubmit={form.onSubmit(handleAddVitalRecord)}
				mb="-sm"
			>
				<Flex flex="1" gap="xs" key={resetKey}>
					<Box>
						<DateSelectorForm
							id="vital-date"
							tooltip={t("EnterDate")}
							size="xs"
							form={form}
							name="date"
							placeholder="Date"
							nextField="time"
						/>
					</Box>
					<Box>
						<TimeInput
							ref={ref}
							classNames={inputCss}
							id="time"
							size="xs"
							format="12h"
							value={form.values.time}
							onChange={(event) => form.setFieldValue("time", event.currentTarget.value)}
							placeholder="Time"
							nextField="bloodPressure"
							rightSection={pickerControl}
						/>
					</Box>
					<InputForm
						id="bloodPressure"
						size="xs"
						key={form.key("bloodPressure")}
						placeholder="120/80"
						name="bloodPressure"
						tooltip={t("EnterBloodPressure")}
						form={form}
						nextField="pulseRate"
					/>

					<InputNumberForm
						id="pulseRate"
						size="xs"
						key={form.key("pulseRate")}
						placeholder="Pulse"
						name="pulseRate"
						form={form}
						rightSection={<IconPercentage size={16} />}
						tooltip={t("EnterPulseRate")}
						nextField="saturationWithoutOxygen"
					/>

					<InputNumberForm
						size="xs"
						id="saturationWithoutOxygen"
						key={form.key("saturationWithoutOxygen")}
						placeholder="EnterSatWithoutO2"
						name="saturationWithoutOxygen"
						form={form}
						min={0}
						rightSection={<IconPercentage size={16} />}
						tooltip={t("EnterSaturationWithoutOxygen")}
						nextField="saturationWithOxygen"
					/>

					<InputNumberForm
						size="xs"
						id="saturationWithOxygen"
						key={form.key("saturationWithOxygen")}
						placeholder="SatWithO2"
						name="saturationWithOxygen"
						form={form}
						min={0}
						rightSection={<IconPercentage size={16} />}
						tooltip={t("EnterSaturationWithOxygen")}
						nextField="oxygenFlowRateLiters"
					/>
					<InputNumberForm
						size="xs"
						id="oxygenFlowRateLiters"
						key={form.key("oxygenFlowRateLiters")}
						placeholder="Liter"
						name="oxygenFlowRateLiters"
						form={form}
						min={0}
						rightSection={<IconPercentage size={16} />}
						tooltip={t("EnterOxygenFlowRateLiters")}
						nextField="respirationRate"
					/>

					<InputNumberForm
						size="xs"
						id="respirationRate"
						key={form.key("respirationRate")}
						placeholder="EnterRespiration"
						name="respirationRate"
						form={form}
						min={0}
						rightSection={<IconPercentage size={16} />}
						tooltip={t("EnterRespirationRate")}
						nextField="temperatureFahrenheit"
					/>

					<InputNumberForm
						size="xs"
						id="temperatureFahrenheit"
						key={form.key("temperatureFahrenheit")}
						placeholder="EnterTemperature"
						name="temperatureFahrenheit"
						form={form}
						min={0}
						rightSection={<IconPercentage size={16} />}
						tooltip={t("EnterTemperature")}
						nextField="EntityFormSubmit"
					/>

					<Button
						id="EntityFormSubmit"
						size="xs"
						w={140}
						type="submit"
						variant="filled"
						leftSection={<IconPlus size={16} />}
					>
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
