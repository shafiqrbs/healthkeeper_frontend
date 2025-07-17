import { IconCalendar, IconPencil, IconUser, IconX } from "@tabler/icons-react";
import { Box, Flex, Grid, Text, ScrollArea, Button, ActionIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";

const patientList = [
	{
		id: 1,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 2,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 3,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 4,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 5,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 6,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 7,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 8,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 9,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 10,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 11,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 12,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 13,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 14,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 15,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 16,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
];

export default function PatientListEdit({ isOpenPatientInfo }) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const [selectPatient, setSelectPatient] = useState(patientList[1]);

	const handleSelectPatient = (patient) => {
		setSelectPatient(patient);
	};

	const handleEditClick = (id) => {
		navigate(`/doctor/prescription/edit/${id}`);
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
				<Text ta="center" fz="sm" fw={500}>
					S/N
				</Text>
				{isOpenPatientInfo && (
					<Text ta="center" fz="sm" fw={500}>
						Patient Name
					</Text>
				)}
			</Flex>
			<ScrollArea scrollbars="y" h={mainAreaHeight - 240}>
				{patientList.map((patient) => (
					<Grid
						columns={14}
						my="es"
						p="les"
						className="cursor-pointer"
						bg={
							selectPatient.id === patient.id
								? "var(--theme-primary-color-1)"
								: "var(--theme-secondary-color-0)"
						}
						onClick={() => handleSelectPatient(patient)}
					>
						<Grid.Col span={isOpenPatientInfo ? 1 : 14}>
							<Text fz="sm" fw={500} ta="center">
								{patient.id}.
							</Text>
						</Grid.Col>
						{isOpenPatientInfo && (
							<>
								<Grid.Col span={4}>
									<Flex align="center" gap="es">
										<IconCalendar size={16} stroke={1.5} />
										<Text fz="sm">{patient.date}</Text>
									</Flex>
									<Flex align="center" gap="es">
										<IconUser size={16} stroke={1.5} />
										<Text fz="sm">{patient.patientId}</Text>
									</Flex>
								</Grid.Col>
								<Grid.Col span={5}>
									<Text fz="sm">{patient.name}</Text>
									<Text fz="sm">{patient.mobile}</Text>
								</Grid.Col>
								<Grid.Col span={4}>
									<Flex align="center" h="100%" justify="flex-end" gap="les">
										{selectPatient.id === patient.id ? (
											<>
												<Button
													variant="filled"
													size="xs"
													bg="var(--theme-success-color-8)"
													aria-label="print"
													miw={76}
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
										) : (
											<>
												<Button
													variant="filled"
													size="xs"
													bg="var(--theme-primary-color-6)"
													aria-label="confirm"
													miw={76}
												>
													{t("confirm")}
												</Button>
												<ActionIcon variant="transparent" aria-label="close">
													<IconX size={16} stroke={1.5} color="var(--theme-error-color)" />
												</ActionIcon>
											</>
										)}
									</Flex>
								</Grid.Col>
							</>
						)}
					</Grid>
				))}
			</ScrollArea>
		</Box>
	);
}
