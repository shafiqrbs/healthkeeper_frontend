import GlobalDrawer from "@components/drawers/GlobalDrawer";
import {
	Box,
	Grid,
	Stack,
	Text,
	List,
	Divider,
	Paper,
	Title,
	Group,
	ScrollArea,
	Flex,
	Button,
	LoadingOverlay,
} from "@mantine/core";
import { useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import AdmissionFormBN from "@hospital-components/print-formats/admission/AdmissionFormBN";
import {capitalizeWords} from "@utils/index";

export default function IPDDetailsDrawer({ opened, close, selectedId }) {
	const ipdRef = useRef(null);
	const { mainAreaHeight } = useOutletContext();
	const { t } = useTranslation();
	const { id } = useParams();

	const ipdId = id || selectedId;

	const printIPDFull = useReactToPrint({
		documentTitle: `ipd-${Date.now().toLocaleString()}`,
		content: () => ipdRef.current,
	});

	const { data: ipdData, isLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${ipdId}`,
		ignore: !opened,
	});

	// =============== parse IPD data and handle null cases ================
	const ipd = ipdData?.data;
	const invoiceParticulars = ipd?.invoice_particular || [];
	const invoiceTransactions = ipd?.invoice_transaction || [];

	// =============== check if IPD data is available ================
	const isIPDDataAvailable = !!ipd;

	return (
		<GlobalDrawer opened={opened} close={close} title="Admission Details" size="100%">
			<Box pos="relative">
				<LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
				{isIPDDataAvailable ? (
					<ScrollArea scrollbars="y" type="hover" h={mainAreaHeight - 110}>
						<Grid columns={12} h="100%" w="100%" mt="xs">
							{/* =============== Column 1: Patient Information =============== */}
							<Grid.Col span={4} h="100%">
								<Paper withBorder p="lg" radius="sm" bg="var(--theme-tertiary-color-0)" h="100%">
									<Stack gap="md">
										<Box>
											<Title order={4} fw={700} mb="es">
												{ipd?.name || "-"}
											</Title>
											<Text  c="var(--theme-tertiary-color-7)">
												Created: {ipd?.created || "-"}
											</Text>
											<Text mt="les"  c="var(--theme-tertiary-color-7)">
												Patient ID: {ipd?.patient_id || "-"}
											</Text>
											<Text mt="les"  c="var(--theme-tertiary-color-7)">
												Invoice: {ipd?.invoice || "-"}
											</Text>
											<Text mt="les"  c="var(--theme-tertiary-color-7)">
												Health ID: {ipd?.health_id || "-"}
											</Text>
											<Group gap="xs" mb="es">
												<Text  c="var(--theme-tertiary-color-7)">
													Age:{" "}
													{ipd?.day
														? `${ipd.day} days`
														: ipd?.year
														? `${ipd.year} years`
														: "-"}
												</Text>
												<Text  c="var(--theme-tertiary-color-7)">
													| Gender:{" "}
													{ipd?.gender
														? ipd.gender.charAt(0).toUpperCase() + ipd.gender.slice(1)
														: "-"}
												</Text>
											</Group>
											<Text  c="var(--theme-tertiary-color-7)">
												Mobile: {ipd?.mobile || "-"}
											</Text>
											<Text  c="var(--theme-tertiary-color-7)">
												Guardian: {ipd?.guardian_name || "-"} ({ipd?.guardian_mobile || "-"})
											</Text>

											<Text  c="var(--theme-tertiary-color-7)">
												DOB: {ipd?.dob || "-"}
											</Text>
											<Text  c="var(--theme-tertiary-color-7)">
												Upazilla: {ipd?.upazila || "-"}
											</Text>
											<Text  c="var(--theme-tertiary-color-7)">
												District: {ipd?.district || "-"}
											</Text>
											<Text  c="var(--theme-tertiary-color-7)">
												Address: {ipd?.address || "-"}
											</Text>
										</Box>
										{/*<Divider
											mt="xs"
											label={
												<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
													Vitals
												</Text>
											}
											labelPosition="left"
										/>*/}
										{/*<Stack gap="3xs" mb="es">
											<Text fw={500} size="sm">
												B/P:{" "}
												<Text span fw={400}>
													{ipd?.bp || "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Weight:{" "}
												<Text span fw={400}>
													{ipd?.weight ? `${ipd.weight} kg` : "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Height:{" "}
												<Text span fw={400}>
													{ipd?.height ? `${ipd.height} cm` : "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Temperature:{" "}
												<Text span fw={400}>
													{ipd?.temperature || "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Pulse:{" "}
												<Text span fw={400}>
													{ipd?.pulse || "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Blood Sugar:{" "}
												<Text span fw={400}>
													{ipd?.blood_sugar || "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Blood Group:{" "}
												<Text span fw={400}>
													{ipd?.blood_group || "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Oxygen:{" "}
												<Text span fw={400}>
													{ipd?.oxygen || "-"}
												</Text>
											</Text>
										</Stack>*/}
									</Stack>
								</Paper>
							</Grid.Col>

							{/* =============== Column 2: Room & Doctor Information =============== */}
							<Grid.Col span={4} h="100%">
								<Paper withBorder p="lg" radius="sm" bg="var(--mantine-color-white)" h="100%">
									<Stack gap="md">
										<Divider
											label={
												<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
													Room Information
												</Text>
											}
											labelPosition="left"
										/>
										<Stack gap="3xs" mb="es">
											<Text fw={500} size="sm">
												Room/Cabin:{" "}
												<Text span fw={400}>
													{ipd?.room_name || "-"}
												</Text>
											</Text>
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
											<Text fw={500} size="sm">
												Process:{" "}
												<Text span fw={400}>
													{capitalizeWords(ipd?.process) || "-"}
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
											<Text fw={500} size="sm">
												Patient Relation:{" "}
												<Text span fw={400}>
													{ipd?.religion_name || "-"}
												</Text>
											</Text>
										</Stack>
									</Stack>
								</Paper>
							</Grid.Col>

							{/* =============== Column 3: Financial & Medical Information =============== */}
							<Grid.Col span={4} h="100%">
								<Paper withBorder p="lg" radius="sm" bg="var(--theme-tertiary-color-0)" h="100%">
									<Stack gap="lg" h="100%">
										<Divider
											mt="xs"
											label={
												<Text size="xs" c="var(--theme-tertiary-color-7)">
													Patient Details
												</Text>
											}
											labelPosition="left"
										/>
										<Stack gap="3xs" mb="es">
											<Text fw={500} size="sm">
												Release Mode:{" "}
												<Text span fw={400}>
													{capitalizeWords(ipd?.release_mode) || "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Admission Date:{" "}
												<Text span fw={400}>
													{ipd?.admission_date || "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Release Date:{" "}
												<Text span fw={400}>
													{ipd?.release_date || "-"}
												</Text>
											</Text>
											{/*<Text fw={500} size="sm">
												Comment:{" "}
												<Text span fw={400}>
													{ipd?.comment || "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Advice:{" "}
												<Text span fw={400}>
													{ipd?.advice || "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Doctor Comment:{" "}
												<Text span fw={400}>
													{ipd?.doctor_comment || "-"}
												</Text>
											</Text>*/}
											<Text fw={500} size="sm">
												Disease Profile:{" "}
												<Text span fw={400}>
													{ipd?.diseases_profile || "-"}
												</Text>
											</Text>
											{ipd?.release_mode === 'death' && (
												<Text fw={500} size="sm">
													Death Date & Time:{" "}
													<Text span fw={400}>
														{ipd?.death_date_time || "-"}
													</Text>
												</Text>
											)}
											<Text fw={500} size="sm">
												About of Death:{" "}
												<Text span fw={400}>
													{ipd?.about_death || "-"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Case of Death:{" "}
												<Text span fw={400}>
													{ipd?.cause_death || "-"}
												</Text>
											</Text>

										</Stack>
									</Stack>
								</Paper>
							</Grid.Col>
						</Grid>
					</ScrollArea>
				) : (
					<Stack p="xl" ta="center" h={mainAreaHeight - 110} justify="center" gap={0} align="center">
						<Text size="lg" c="var(--theme-tertiary-color-7)" fw={500} mb="md">
							IPD data not available for this patient
						</Text>
						<Text size="sm" c="var(--theme-tertiary-color-6)">
							Please check if the IPD record exists and is properly configured.
						</Text>
					</Stack>
				)}
				{/*{isIPDDataAvailable && (
					<Flex justify="flex-end" mt="xs" gap="3xs">
						 <Button variant="filled" color="var(--theme-tertiary-color-6)">
							{t("Share")}
						</Button>
						<Button variant="filled" color="var(--theme-print-color)" onClick={printIPDFull}>
							{t("Print")}
						</Button>
					</Flex>
				)}*/}
			</Box>
			{ipdData?.data && <AdmissionFormBN data={ipdData?.data} ref={ipdRef} />}
		</GlobalDrawer>
	);
}
