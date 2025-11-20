import {HOSPITAL_DATA_ROUTES, PHARMACY_DATA_ROUTES} from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import {ActionIcon, Box, Divider, Grid, Group, List, Paper, Stack, Text, Title,Button} from "@mantine/core";
import {useEffect, useMemo, useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import {IconTrash} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import {showEntityData} from "@/app/store/core/crudThunk";
import {successNotification} from "@components/notification/successNotification";
import {errorNotification} from "@components/notification/errorNotification";
import {getDataWithoutStore} from "@/services/apiService";

export default function Dashboard() {
	const ipdRef = useRef(null);
	const { mainAreaHeight } = useOutletContext();
	const { t } = useTranslation();
	const { id } = useParams();
	const [vitalRecordList, setVitalRecordList] = useState([]);
	const [insulinRecordList, setInsulinRecordList] = useState([]);
	const ipdId = id;

	const printIPDFull = useReactToPrint({
		documentTitle: `ipd-${Date.now().toLocaleString()}`,
		content: () => ipdRef.current,
	});

	const { data: ipdData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${ipdId}`,
	});

	// =============== parse IPD data and handle null cases ================
	const ipd = ipdData?.data;
	const invoiceParticulars = ipd?.invoice_particular || [];
	const prescriptionMedicine = ipd?.prescription_medicine || [];

	const handleReleaseMode = (mode) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmApproved(mode),
		});
	};

	async function handleBarcodeTag(barcode,reportId) {

		setBarcodeValue(reportId);
		requestAnimationFrame(printBarCodeValue);
	}

	const handleConfirmApproved = async (mode) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.RELEASE}/${id}/${mode}`,
		});
	}

/*	useEffect(() => {
		if (data) {
			setVitalRecordList(JSON.parse(ipd?.vital_chart_json || "[]"));
		}
	}, [ipd]);


	useEffect(() => {
		if (insulin) {
			setInsulinRecordList(JSON.parse(ipd?.insulin_chart_json || "[]"));
		}
	}, [ipd]);*/

//	console.log(vitalRecordList)

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

	// =============== check if IPD data is available ================
	return (
		<Box>
			<Grid columns={12} h="100%" w="100%">
				{/* =============== Column 1: Patient Information =============== */}
				<Grid.Col span={4} h="100%">
					<Paper withBorder p="lg" radius="sm" bg="var(--theme-tertiary-color-0)" h="100%">
						<Stack gap="3xs">
							<Title order={4} fw={700} mb="es">
								{ipd?.name || "-"}
							</Title>
							<Text mt="les" size="sm" c="var(--theme-tertiary-color-7)">
								Patient ID: {ipd?.patient_id || "-"}
							</Text>
							<Text mt="les" size="sm" c="var(--theme-tertiary-color-7)">
								Invoice: {ipd?.invoice || "-"}
							</Text>
							<Text mt="les" size="sm" c="var(--theme-tertiary-color-7)">
								Health ID: {ipd?.health_id || "-"}
							</Text>
							<Group  mb="es">
								<Text size="sm" c="var(--theme-tertiary-color-7)">
									Age: {ipd?.day ? `${ipd.day} days` : ipd?.year ? `${ipd.year} years` : "-"}
								</Text>
								<Text size="sm" c="var(--theme-tertiary-color-7)">
									| Gender:{" "}
									{ipd?.gender ? ipd.gender.charAt(0).toUpperCase() + ipd.gender.slice(1) : "-"}
								</Text>
							</Group>
							<Text size="sm" c="var(--theme-tertiary-color-7)">
								Mobile: {ipd?.mobile || "-"}
							</Text>
							<Text size="sm" c="var(--theme-tertiary-color-7)">
								Religion: {ipd?.religion_name || "-"}
							</Text>
							<Text size="sm" c="var(--theme-tertiary-color-7)">
								Guardian: {ipd?.guardian_name || "-"} ({ipd?.guardian_mobile || "-"})
							</Text>
							<Text size="sm" c="var(--theme-tertiary-color-7)">
								Date: {ipd?.created || "-"}
							</Text>
							<Text size="sm" c="var(--theme-tertiary-color-7)">
								DOB: {ipd?.dob || "-"}
							</Text>
							<Text size="sm" c="var(--theme-tertiary-color-7)">
								Address: {ipd?.address || "-"}
							</Text>
							<Text size="sm" c="var(--theme-tertiary-color-7)">
								Father: {ipd?.father_name || "-"}
							</Text>
						</Stack>
						<Divider
							mt="xs"
							label={
								<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
									Additional Information
								</Text>
							}
							labelPosition="left"
						/>
						<Stack gap="3xs" mb="es">
							<Text fw={500} size="sm">
								Process:{" "}
								<Text span fw={400}>
									{ipd?.process || "-"}
								</Text>
							</Text>
							<Text fw={500} size="sm">
								Is Admission:{" "}
								<Text span fw={400}>
									{ipd?.is_admission ? "Yes" : "No"}
								</Text>
							</Text>
							<Text fw={500} size="sm">
								Created By:{" "}
								<Text span fw={400}>
									{ipd?.created_by_name || "-"}
								</Text>
							</Text>
							<Text fw={500} size="sm">
								Identity Mode:{" "}
								<Text span fw={400}>
									{ipd?.identity_mode || "-"}
								</Text>
							</Text>
							<Text fw={500} size="sm">
								NID:{" "}
								<Text span fw={400}>
									{ipd?.nid || "-"}
								</Text>
							</Text>

						</Stack>
					</Paper>
				</Grid.Col>

				{/* =============== Column 2: Room & Doctor Information =============== */}
				<Grid.Col span={4} h="100%">
					<Paper withBorder p="lg" radius="sm" bg="var(--mantine-color-white)" h="100%">

						<Stack gap="md" mb={'md'}>
							<Group justify="center">
								<Button  onClick={() => handleReleaseMode('discharge')} > For Discharge </Button>

								<Button variant="default" onClick={() => handleReleaseMode('death')} >For Death</Button>

								<Button variant="light" onClick={() => handleReleaseMode('referred')} >For Referred
								</Button>
							</Group>
						</Stack>

						<Stack gap="md">
							<Divider
								label={
									<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
										Room/Cabin Status
									</Text>
								}
								labelPosition="left"
							/>
							<Stack gap="3xs" mb="es" bg="var(--theme-secondary-color-1)" p={'xs'} >
								<Text fw={500} size="sm">
									Room/Cabin:{" "}
									<Text span fw={400}>
										{ipd?.room_name || "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Admission:{" "}
									<Text span fw={400}>
										{ipd?.admission_day || "-"} Days
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Consume:{" "}
									<Text span fw={400}>
										{ipd?.consume_day || "-"} Days
									</Text>
								</Text>

								<Text fw={500} size="sm">
									Remaining:{" "}
									<Text span size={'xl'} fw={400}>
										{
											ipd?.admission_day != null &&
											ipd?.consume_day != null && (
												ipd.admission_day < ipd.consume_day
													? `(${Math.abs(ipd.admission_day - ipd.consume_day)})`
													: Math.abs(ipd.admission_day - ipd.consume_day)
											)
										}
										 Days
									</Text>
								</Text>
							</Stack>
							<Divider
								label={
									<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
										Room/Cabin Information
									</Text>
								}
								labelPosition="left"
							/>
							<Stack gap="3xs" mb="es">

								<Text fw={500} size="sm">
									Mode:{" "}
									<Text span fw={400}>
										{ipd?.mode_name || "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Payment Mode:{" "}
									<Text span fw={400}>
										{ipd?.payment_mode_name || "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Patient Mode:{" "}
									<Text span fw={400}>
										{ipd?.parent_patient_mode_name || "-"}
									</Text>
								</Text>
							</Stack>
							<Divider
								mt="xs"
								label={
									<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
										Doctor Information
									</Text>
								}
								labelPosition="left"
							/>
							<Stack gap="3xs" mb="es">
								<Text fw={500} size="sm">
									Admit Consultant:{" "}
									<Text span fw={400}>
										{ipd?.admit_consultant_name || "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Admit Doctor:{" "}
									<Text span fw={400}>
										{ipd?.admit_doctor_name || "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Unit:{" "}
									<Text span fw={400}>
										{ipd?.admit_unit_name || "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Department:{" "}
									<Text span fw={400}>
										{ipd?.admit_department_name || "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Prescription Doctor:{" "}
									<Text span fw={400}>
										{ipd?.prescription_doctor_name || "-"}
									</Text>
								</Text>
							</Stack>

						</Stack>
					</Paper>
				</Grid.Col>

				{/* =============== Column 3: Financial & Medical Information =============== */}
				<Grid.Col span={4} h="100%">
					<Paper withBorder p="lg" radius="sm" bg="white" h="100%">
						<Stack gap="lg" h="100%">
							<Box>

								<Divider
									label={
										<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
											Medicine History
										</Text>
									}
									labelPosition="left"
								/>
								{prescriptionMedicine.length > 0 ? (
									prescriptionMedicine.map((item, index) => (
										<Grid columns={12} key={index}>
											<Grid.Col span={9}>
												<Text>{index + 1}. {item.medicine_name}</Text>
												<Text size="xs" >{item.dose_details}</Text>
											</Grid.Col>
											<Grid.Col span={3}>
												<Text size="xs" >
												{item.is_active ? 'Active':'Omit'}
												</Text>
											</Grid.Col>
										</Grid>
									))
								) : (
									<Text size="sm" c="var(--theme-tertiary-color-7)" fs="italic">
										No Medicine Found
									</Text>
								)}
							</Box>
							<Box>
								<Divider
									mt="xs"
									label={
										<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
											Investigations
										</Text>
									}
									labelPosition="left"
								/>
								{invoiceParticulars.length > 0 ? (
									invoiceParticulars.map((item, index) => (
											<Grid columns={12} key={index}>
												<Grid.Col span={9}>
													{index + 1}. {item.item_name}
												</Grid.Col>
												<Grid.Col span={3}>
													<Text size="xs" > {item.process}</Text>
												</Grid.Col>
											</Grid>
										))
								) : (
									<Text size="sm" c="var(--theme-tertiary-color-7)" fs="italic">
										No invoice particulars found
									</Text>
								)}
							</Box>
							{/*<Divider
								mt="xs"
								label={
									<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
										Payment Information
									</Text>
								}
								labelPosition="left"
							/>
							<Stack gap="3xs" mb="es">
								<Text fw={500} size="sm">
									Sub Total:{" "}
									<Text span fw={400}>
										{ipd?.sub_total ? `৳${ipd.sub_total}` : "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Total:{" "}
									<Text span fw={400}>
										{ipd?.total ? `৳${ipd.total}` : "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Due:{" "}
									<Text span fw={400}>
										{ipd?.due ? `৳${ipd.due}` : "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Payment Status:{" "}
									<Text span fw={400}>
										{ipd?.payment_status || "-"}
									</Text>
								</Text>
							</Stack>
							<Divider
								mt="xs"
								label={
									<Text size="xs" c="var(--theme-tertiary-color-7)">
										Transaction History
									</Text>
								}
								labelPosition="left"
							/>*/}
						</Stack>
					</Paper>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
