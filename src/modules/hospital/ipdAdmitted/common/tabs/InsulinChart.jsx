import { useDeferredValue, useMemo, useTransition, useState } from "react";
import { ActionIcon, Box, Button, Flex, Group, NumberInput, Paper, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import { useOutletContext, useParams } from "react-router-dom";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import DateSelector from "@components/form-builders/DateSelector";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { useTranslation } from "react-i18next";

export default function InsulinChart() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 68;
	// =============== local state for table records and transition helpers ===============
	const [vitalRecordList, setVitalRecordList] = useState([]);
	const [isPending, startTransition] = useTransition();
	const deferredVitalRecordList = useDeferredValue(vitalRecordList);

	// =============== form for insulin chart inputs ===============
	const form = useForm({
		initialValues: {
			date: "",
			fbs: undefined,
			insulinMorning: undefined, // before breakfast
			twoHAFB: undefined, // 2 hours after breakfast
			bl: undefined, // before lunch
			insulinNoon: undefined, // at lunch
			twoHAL: undefined, // 2 hours after lunch
			bd: undefined, // before dinner
			insulinNight: undefined, // at dinner
			twoHAD: undefined, // 2 hours after dinner
			sign: "",
		},
		validateInputOnBlur: true,
		validate: {},
	});

	const handleSubmitInsulin = async (data) => {
		const response = await dispatch(
			storeEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PATIENT_CHART}/${id}`,
				data: {
					insulin_chart_json: data,
				},
			})
		);
		if (storeEntityData.fulfilled.match(response)) {
			successNotification(t("InsulinChartAddedSuccessfully"));
			form.reset();
		} else {
			errorNotification(t("InsulinChartAddedFailed"));
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
			handleSubmitInsulin(vitalRecords);
		});
	};

	const handleDeleteVitalRecord = (id) => {
		setVitalRecordList((previous) => previous.filter((record) => record.id !== id));
	};

	const columns = useMemo(
		() => [
			{
				accessor: "date",
				title: "Date",
				render: ({ date }) => (date ? new Date(date).toLocaleDateString() : ""),
			},
			{
				accessor: "fbs",
				title: "FBS",
			},
			{
				accessor: "insulinMorning",
				title: "Insulin (B/F)",
			},
			{ accessor: "twoHAFB", title: "2HAFB" },
			{ accessor: "bl", title: "BL" },
			{ accessor: "insulinNoon", title: "Insulin (L)" },
			{ accessor: "twoHAL", title: "2HAL" },
			{ accessor: "bd", title: "BD" },
			{ accessor: "insulinNight", title: "Insulin (D)" },
			{ accessor: "twoHAD", title: "2HAD" },
			{ accessor: "sign", title: "Sign." },
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
				<Title order={4}>Insulin Chart</Title>
				<Text c="dimmed" size="sm">
					{isPending ? "saving..." : ""}
				</Text>
			</Group>

			<Box component="form" onSubmit={form.onSubmit(handleAddVitalRecord)} mb="-sm">
				<Flex flex="1" gap="xs">
					<Box>
						<DateSelector
							size="sm"
							value={form.values.date}
							onChange={(value) => form.setFieldValue("date", value)}
							placeholder="Date"
						/>
					</Box>

					<NumberInput key={form.key("fbs")} placeholder="FBS" {...form.getInputProps("fbs")} />

					<NumberInput
						key={form.key("insulinMorning")}
						placeholder="Insulin (B/F)"
						{...form.getInputProps("insulinMorning")}
					/>

					<NumberInput key={form.key("twoHAFB")} placeholder="2HAFB" {...form.getInputProps("twoHAFB")} />

					<NumberInput key={form.key("bl")} placeholder="BL" {...form.getInputProps("bl")} />

					<NumberInput
						key={form.key("insulinNoon")}
						placeholder="Insulin (L)"
						{...form.getInputProps("insulinNoon")}
					/>

					<NumberInput key={form.key("twoHAL")} placeholder="2HAL" {...form.getInputProps("twoHAL")} />

					<NumberInput key={form.key("bd")} placeholder="BD" {...form.getInputProps("bd")} />

					<NumberInput
						key={form.key("insulinNight")}
						placeholder="Insulin (D)"
						{...form.getInputProps("insulinNight")}
					/>

					<NumberInput key={form.key("twoHAD")} placeholder="2HAD" {...form.getInputProps("twoHAD")} />

					<TextInput key={form.key("sign")} placeholder="Sign" {...form.getInputProps("sign")} />

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
				noRecordsText="no insulin records added"
			/>
		</Paper>
	);
}
