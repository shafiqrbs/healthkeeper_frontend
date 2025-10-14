import { IconCalendar, IconPencil, IconPrinter, IconUser, IconX } from "@tabler/icons-react";
import { Box, Flex, Grid, Text, ScrollArea, Button, ActionIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { setInsertType } from "@/app/store/core/crudSlice";
import { useDispatch } from "react-redux";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { MODULES } from "@/constants";
import Prescription from "@/common/components/print-formats/prescription/PrescriptionFullBN";
import { useReactToPrint } from "react-to-print";

const module = MODULES.VISIT;

export default function PatientListWithActions({ isOpenPatientInfo = true, setPatientData, action = "edit" }) {
	const prescriptionA4Ref = useRef(null);
	const params = useParams();
	const [patientList, setPatientList] = useState([]);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const [selectPatient, setSelectPatient] = useState({});
	const navigate = useNavigate();
	const [prescriptionData, setPrescriptionData] = useState({});

	const fetchData = async () => {
		const value = {
			url: HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX,
			module,
		};
		try {
			const result = await dispatch(getIndexEntityData(value));
			if (result.payload) {
				const newData = result.payload?.data?.data || [];
				setPatientList(newData);
				setSelectPatient(newData.find((patient) => patient?.id == params?.prescriptionId));
				setPatientData(newData.find((patient) => patient?.id == params?.prescriptionId));
			}
		} catch (err) {
			console.error("Unexpected error:", err);
		}
	};

	const fetchPrescriptionData = async () => {
		const value = {
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${params?.prescriptionId}`,
			module,
		};

		try {
			const result = await dispatch(getIndexEntityData(value));
			if (result.payload) {
				setPrescriptionData({
					...result.payload?.data?.data,
					json_content: JSON.parse(result.payload?.data?.data?.json_content || "{}") || {},
				});
			}
		} catch (err) {
			console.error("Unexpected error:", err);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		fetchPrescriptionData();
	}, [params]);

	const handlePrintPrescriptionA4 = useReactToPrint({
		content: () => prescriptionA4Ref.current,
	});

	const handleSelectPatient = (patient) => {
		setSelectPatient(patient);
		setPatientData(patient);
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX}/${patient.id}`);
	};

	const handleEditClick = (id) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.UPDATE}/${id}`);
		dispatch(
			setInsertType({
				insertType: "edit",
				module: "prescription",
			})
		);
	};

	const renderActionButtons = (patient) => {
		if (action === "report") {
			return (
				<>
					<Button variant="filled" size="xs" bg="var(--theme-secondary-color-6)" aria-label="report" miw={76}>
						{t("report")}
					</Button>
					<ActionIcon variant="transparent" bg="white" aria-label="close">
						<IconPrinter size={16} stroke={1.5} color="var(--theme-secondary-color-6)" />
					</ActionIcon>
				</>
			);
		} else if (action === "reVisit") {
			return (
				<>
					<Button variant="filled" size="xs" bg="var(--theme-warn-color-6)" aria-label="confirm" miw={76}>
						{t("reVisit")}
					</Button>
					<ActionIcon variant="transparent" bg="white" aria-label="close">
						<IconX size={16} stroke={1.5} color="var(--theme-error-color)" />
					</ActionIcon>
				</>
			);
		} else if (action === "edit" && selectPatient?.id !== patient?.id) {
			return (
				<>
					<Button variant="filled" size="xs" bg="var(--theme-primary-color-6)" aria-label="confirm" miw={76}>
						{t("confirm")}
					</Button>
					<ActionIcon onClick={() => handleEditClick(patient.id)} variant="solid" bg="white">
						<IconX size={16} stroke={1.5} color="var(--theme-error-color)" />
					</ActionIcon>
				</>
			);
		}

		return null;
	};

	return (
		<Box pos="relative">
			<Flex
				gap="sm"
				p="les"
				c="white"
				bg="var(--theme-primary-color-6)"
				justify={isOpenPatientInfo ? "" : "center"}
				mt="xxxs"
			>
				{isOpenPatientInfo && (
					<Text ta="center" fz="sm" fw={500}>
						S/N
					</Text>
				)}
				<Text ta="center" fz="sm" fw={500}>
					Patient Name
				</Text>
			</Flex>
			<ScrollArea scrollbars="y" h={mainAreaHeight - 230}>
				{patientList?.map((patient) => (
					<Grid
						key={patient.id}
						columns={14}
						my="es"
						p="les"
						className="cursor-pointer"
						bg={
							selectPatient?.id === patient?.id
								? "var(--theme-primary-color-1)"
								: "var(--theme-tertiary-color-0)"
						}
						onClick={() => handleSelectPatient(patient)}
					>
						{isOpenPatientInfo ? (
							<>
								<Grid.Col span={1}>
									<Text fz="sm" fw={500} ta="center">
										{patient.id}.
									</Text>
								</Grid.Col>
								<Grid.Col span={5}>
									<Flex align="center" gap="es">
										<IconCalendar size={16} stroke={1.5} />
										<Text fz="sm">{patient.appointment || "No Appointment"}</Text>
									</Flex>
									<Flex align="center" gap="es">
										<IconUser size={16} stroke={1.5} />
										<Text fz="sm">{patient.patient_id || "-"}</Text>
									</Flex>
								</Grid.Col>
								<Grid.Col span={5}>
									<Text fz="sm">{patient.name}</Text>
									<Text fz="sm">{patient.mobile}</Text>
								</Grid.Col>
								<Grid.Col span={3}>
									<Flex align="center" h="100%" justify="flex-end" gap="les">
										{selectPatient?.id === patient?.id && action === "edit" && (
											<>
												<Button
													variant="filled"
													size="xs"
													bg="var(--theme-secondary-color-8)"
													aria-label="print"
													miw={76}
													onClick={handlePrintPrescriptionA4}
												>
													{t("Print")}
												</Button>
												<ActionIcon
													onClick={() => handleEditClick(patient.id)}
													variant="solid"
													bg="white"
												>
													<IconPencil
														size={16}
														stroke={1.5}
														color="var(--theme-primary-color-6)"
													/>
												</ActionIcon>
											</>
										)}
										{renderActionButtons(patient)}
									</Flex>
								</Grid.Col>
							</>
						) : (
							<Grid.Col span={14}>
								<Flex align="center" gap="es">
									<IconCalendar size={16} stroke={1.5} />
									<Text fz="sm">{patient.appointment || "No Appointment"}</Text>
								</Flex>
								<Flex align="center" gap="es">
									<IconUser size={16} stroke={1.5} />
									<Text fz="sm">{patient.patient_id}</Text>
								</Flex>
							</Grid.Col>
						)}
					</Grid>
				))}
			</ScrollArea>
			<Prescription ref={prescriptionA4Ref} data={prescriptionData} />
		</Box>
	);
}
