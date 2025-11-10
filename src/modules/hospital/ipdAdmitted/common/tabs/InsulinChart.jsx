import { useDeferredValue, useMemo, useTransition, useState, useEffect } from "react";
import { ActionIcon, Box, Button, Flex, Group, Paper, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import { useOutletContext, useParams } from "react-router-dom";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import DateSelectorForm from "@components/form-builders/DateSelectorForm";
import InputForm from "@components/form-builders/InputForm";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { useTranslation } from "react-i18next";

export default function InsulinChart({ data, refetch }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 68;
	// =============== local state for table records and transition helpers ===============
	const [vitalRecordList, setVitalRecordList] = useState([]);
	const [isPending, startTransition] = useTransition();
	const deferredVitalRecordList = useDeferredValue(vitalRecordList);
	const [resetKey, setResetKey] = useState(0);

	// =============== load existing insulin records from api data ===============
	useEffect(() => {
		if (data) {
			setVitalRecordList(JSON.parse(data?.insulin_chart_json || "[]"));
		}
	}, [data]);

	// =============== form for insulin chart inputs ===============
	const form = useForm({
		initialValues: {
			date: "",
			fbs: null,
			insulinMorning: null, // before breakfast
			twoHAFB: null, // 2 hours after breakfast
			bl: null, // before lunch
			insulinNoon: null, // at lunch
			twoHAL: null, // 2 hours after lunch
			bd: null, // before dinner
			insulinNight: null, // at dinner
			twoHAD: null, // 2 hours after dinner
			sign: "",
		},
		validate: {
			fbs: (value) => {
				if (!value) {
					return t("FBSIsRequired");
				}
				return null;
			},
			insulinMorning: (value) => {
				if (!value) {
					return t("InsulinMorningIsRequired");
				}
				return null;
			},
			twoHAFB: (value) => {
				if (!value) {
					return t("2HAFBIsRequired");
				}
				return null;
			},
			bl: (value) => {
				if (!value) {
					return t("BLIsRequired");
				}
				return null;
			},
			insulinNoon: (value) => {
				if (!value) {
					return t("InsulinNoonIsRequired");
				}
				return null;
			},
			twoHAL: (value) => {
				if (!value) {
					return t("2HALIsRequired");
				}
				return null;
			},
			bd: (value) => {
				if (!value) {
					return t("BDIsRequired");
				}
				return null;
			},
			insulinNight: (value) => {
				if (!value) {
					return t("InsulinNightIsRequired");
				}
				return null;
			},
			twoHAD: (value) => {
				if (!value) {
					return t("2HADIsRequired");
				}
				return null;
			},
			sign: (value) => {
				if (!value) {
					return t("SignIsRequired");
				}
				return null;
			},
		},
	});

	const handleSubmitInsulin = async (values) => {
		const response = await dispatch(
			storeEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PATIENT_CHART}/${id}`,
				data: {
					insulin_chart_json: values,
					vital_chart_json: JSON.parse(data?.vital_chart_json || "[]"),
				},
				module: "e_fresh",
			})
		);
		if (storeEntityData.fulfilled.match(response)) {
			successNotification(t("InsulinChartAddedSuccessfully"));
			form.reset();
			setResetKey((prev) => prev + 1);
			if (typeof refetch === "function") {
				refetch();
			}
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
							id="insulin-date"
							tooltip={t("EnterDate")}
							size="xs"
							form={form}
							name="date"
							placeholder="Date"
							nextField="fbs"
						/>
					</Box>

					<InputNumberForm
						id="fbs"
						size="xs"
						key={form.key("fbs")}
						tooltip={t("EnterFBS")}
						placeholder="FBS"
						name="fbs"
						form={form}
						min={0}
						nextField="insulinMorning"
					/>

					<InputNumberForm
						id="insulinMorning"
						size="xs"
						key={form.key("insulinMorning")}
						tooltip={t("EnterInsulinMorning")}
						placeholder="Insulin (B/F)"
						name="insulinMorning"
						form={form}
						min={0}
						nextField="twoHAFB"
					/>

					<InputNumberForm
						id="twoHAFB"
						size="xs"
						key={form.key("twoHAFB")}
						tooltip={t("Enter2HAFB")}
						placeholder="2HAFB"
						name="twoHAFB"
						form={form}
						min={0}
						nextField="bl"
					/>

					<InputNumberForm
						id="bl"
						size="xs"
						key={form.key("bl")}
						tooltip={t("EnterBL")}
						placeholder="BL"
						name="bl"
						form={form}
						min={0}
						nextField="insulinNoon"
					/>

					<InputNumberForm
						id="insulinNoon"
						size="xs"
						key={form.key("insulinNoon")}
						tooltip={t("EnterInsulinNoon")}
						placeholder="Insulin (L)"
						name="insulinNoon"
						form={form}
						min={0}
						nextField="twoHAL"
					/>

					<InputNumberForm
						id="twoHAL"
						size="xs"
						key={form.key("twoHAL")}
						tooltip={t("Enter2HAL")}
						placeholder="2HAL"
						name="twoHAL"
						form={form}
						min={0}
						nextField="bd"
					/>

					<InputNumberForm
						id="bd"
						size="xs"
						key={form.key("bd")}
						tooltip={t("EnterBD")}
						placeholder="BD"
						name="bd"
						form={form}
						min={0}
						nextField="insulinNight"
					/>

					<InputNumberForm
						id="insulinNight"
						size="xs"
						key={form.key("insulinNight")}
						tooltip={t("EnterInsulinNight")}
						placeholder="Insulin (D)"
						name="insulinNight"
						form={form}
						min={0}
						nextField="twoHAD"
					/>

					<InputNumberForm
						id="twoHAD"
						size="xs"
						key={form.key("twoHAD")}
						tooltip={t("Enter2HAD")}
						placeholder="2HAD"
						name="twoHAD"
						form={form}
						min={0}
						nextField="sign"
					/>

					<InputForm
						id="sign"
						size="xs"
						key={form.key("sign")}
						tooltip={t("EnterSign")}
						placeholder="Sign"
						name="sign"
						form={form}
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
				noRecordsText="no insulin records added"
			/>
		</Paper>
	);
}
