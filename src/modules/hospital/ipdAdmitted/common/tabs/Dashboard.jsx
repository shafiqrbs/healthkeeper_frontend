import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { Box, Divider, Grid, Group, List, Paper, Stack, Text, Title } from "@mantine/core";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

export default function Dashboard() {
	const ipdRef = useRef(null);
	const { mainAreaHeight } = useOutletContext();
	const { t } = useTranslation();
	const { id } = useParams();

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
	const invoiceTransactions = ipd?.invoice_transaction || [];

	// =============== check if IPD data is available ================
	return (
		<Box>
			<Grid columns={12} h="100%" w="100%">
				{/* =============== Column 1: Patient Information =============== */}
				<Grid.Col span={4} h="100%">
					<Paper withBorder p="lg" radius="sm" bg="var(--theme-tertiary-color-0)" h="100%">
						<Stack gap="md">
							<Box>
								<Title order={4} fw={700} mb="es">
									{ipd?.name || "-"}
								</Title>
								<Text mt="les" size="xs" c="var(--theme-tertiary-color-7)">
									Patient ID: {ipd?.patient_id || "-"}
								</Text>
								<Text mt="les" size="xs" c="var(--theme-tertiary-color-7)">
									Invoice: {ipd?.invoice || "-"}
								</Text>
								<Text mt="les" size="xs" c="var(--theme-tertiary-color-7)">
									Health ID: {ipd?.health_id || "-"}
								</Text>
								<Group gap="xs" mb="es">
									<Text size="xs" c="var(--theme-tertiary-color-7)">
										Age: {ipd?.day ? `${ipd.day} days` : ipd?.year ? `${ipd.year} years` : "-"}
									</Text>
									<Text size="xs" c="var(--theme-tertiary-color-7)">
										| Gender:{" "}
										{ipd?.gender ? ipd.gender.charAt(0).toUpperCase() + ipd.gender.slice(1) : "-"}
									</Text>
								</Group>
								<Text size="xs" c="var(--theme-tertiary-color-7)">
									Mobile: {ipd?.mobile || "-"}
								</Text>
								<Text size="xs" c="var(--theme-tertiary-color-7)">
									Guardian: {ipd?.guardian_name || "-"} ({ipd?.guardian_mobile || "-"})
								</Text>
								<Text size="xs" c="var(--theme-tertiary-color-7)">
									Date: {ipd?.created || "-"}
								</Text>
								<Text size="xs" c="var(--theme-tertiary-color-7)">
									DOB: {ipd?.dob || "-"}
								</Text>
								<Text size="xs" c="var(--theme-tertiary-color-7)">
									Address: {ipd?.address || "-"}
								</Text>
								<Text size="xs" c="var(--theme-tertiary-color-7)">
									Father: {ipd?.father_name || "-"}
								</Text>
								<Text size="xs" c="var(--theme-tertiary-color-7)">
									Mother: {ipd?.mother_name || "-"}
								</Text>
							</Box>
							<Divider
								mt="xs"
								label={
									<Text size="xs" c="var(--theme-tertiary-color-7)" fw={500}>
										Vitals
									</Text>
								}
								labelPosition="left"
							/>
							<Stack gap="3xs" mb="es">
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
							</Stack>
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
									Room:{" "}
									<Text span fw={400}>
										{ipd?.room_name || "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Cabin No:{" "}
									<Text span fw={400}>
										{ipd?.cabin_no || "-"}
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
								<Text fw={500} size="sm">
									Barcode:{" "}
									<Text span fw={400}>
										{ipd?.barcode || "-"}
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
							<Box>
								<Group align="center" mb="xs">
									<Title order={5} fw={600} c="var(--theme-tertiary-color-9)">
										Invoice Particulars
									</Title>
								</Group>
								{invoiceParticulars.length > 0 ? (
									<List type="ordered" size="sm" pl="md" spacing="es">
										{invoiceParticulars.map((item, index) => (
											<List.Item key={index}>
												{item.item_name || "Unnamed Item"}
												<Text size="xs" mt="es" c="var(--theme-tertiary-color-7)">
													Quantity: {item.quantity || 0} | Price:{" "}
													{item.price ? `৳${item.price}` : "-"} | Sub Total:{" "}
													{item.sub_total ? `৳${item.sub_total}` : "-"}
												</Text>
											</List.Item>
										))}
									</List>
								) : (
									<Text size="sm" c="var(--theme-tertiary-color-7)" fs="italic">
										No invoice particulars found
									</Text>
								)}
							</Box>
							<Divider
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
							/>
							{invoiceTransactions.length > 0 ? (
								<List size="sm" pl="sm" spacing="es">
									{invoiceTransactions.map((transaction, index) => (
										<List.Item key={index}>
											Mode: {transaction.mode} | Created: {transaction.created} | By:{" "}
											{transaction.created_by_id}
										</List.Item>
									))}
								</List>
							) : (
								<Text size="sm" c="var(--theme-tertiary-color-7)" fs="italic">
									No transaction history found
								</Text>
							)}
							<Divider
								mt="xs"
								label={
									<Text size="xs" c="var(--theme-tertiary-color-7)">
										Medical Details
									</Text>
								}
								labelPosition="left"
							/>
							<Stack gap="3xs" mb="es">
								<Text fw={500} size="sm">
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
								</Text>
								<Text fw={500} size="sm">
									Disease:{" "}
									<Text span fw={400}>
										{ipd?.disease || "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Case of Death:{" "}
									<Text span fw={400}>
										{ipd?.case_of_death || "-"}
									</Text>
								</Text>
								<Text fw={500} size="sm">
									Patient Relation:{" "}
									<Text span fw={400}>
										{ipd?.patient_relation || "-"}
									</Text>
								</Text>
							</Stack>
						</Stack>
					</Paper>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
