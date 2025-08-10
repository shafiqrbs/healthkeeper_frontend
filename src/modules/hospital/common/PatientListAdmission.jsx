import { useNavigate, useOutletContext } from "react-router-dom";
import { IconCalendarWeek, IconUser } from "@tabler/icons-react";
import { Box, Flex, Grid, Text, ScrollArea, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useState } from "react";

const data = [
	{ id: 1, date: "2025-01-01", patients: 234, name: "Shafiqul Islam", mobile: "+8801700099911" },
	{ id: 2, date: "2025-01-02", patients: 235, name: "Rafiqul Islam", mobile: "+8801700099911" },
	{ id: 3, date: "2025-01-03", patients: 236, name: "Safiqul Islam", mobile: "+8801700099911" },
	{ id: 4, date: "2025-01-04", patients: 237, name: "Latiful Islam", mobile: "+8801700099911" },
	{ id: 5, date: "2025-01-05", patients: 238, name: "Mehraz Islam", mobile: "+8801700099911" },
	{ id: 6, date: "2025-01-06", patients: 239, name: "Nazmul Islam", mobile: "+8801700099911" },
	{ id: 7, date: "2025-01-07", patients: 240, name: "Omar Islam", mobile: "+8801700099911" },
	{ id: 8, date: "2025-01-08", patients: 241, name: "Pavel Islam", mobile: "+8801700099911" },
];

export default function PatientListAdmission({ isOpenPatientInfo, setIsOpenPatientInfo }) {
	const [selectedPatient, setSelectedPatient] = useState(data[1]);
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();

	const handleAdmissionOverview = () => {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.ADMISSION_LIST.INDEX);
	};

	const selectPatient = (patient) => {
		setSelectedPatient(patient);
	};

	return (
		<Box>
			<Flex gap="sm" p="les" c="white" bg="var(--theme-primary-color-6)" mt="xxxs">
				<Text ta="center" fz="sm" fw={500}>
					S/N
				</Text>
				<Text ta="center" fz="sm" fw={500}>
					Patient Name
				</Text>
			</Flex>
			<ScrollArea bg="white" h={mainAreaHeight - 164} scrollbars="y" px="xxxs">
				{data.map((item) => (
					<Grid
						columns={12}
						key={item.id}
						onClick={() => selectPatient(item)}
						my="xs"
						bg={
							selectedPatient.id === item.id
								? "var(--theme-primary-color-0)"
								: "var(--theme-tertiary-color-0)"
						}
						px="xs"
						gutter="xs"
					>
						<Grid.Col span={4}>
							<Flex align="center" gap="xxxs">
								<IconCalendarWeek size={16} stroke={1.5} />
								<Text fz="sm">{item.date}</Text>
							</Flex>
							<Flex align="center" gap="xxxs">
								<IconUser size={16} stroke={1.5} />
								<Text fz="sm">{item.patients}</Text>
							</Flex>
						</Grid.Col>
						<Grid.Col span={8}>
							<Flex justify="space-between" align="center">
								<Box>
									<Text fz="sm">{item.name}</Text>
									<Text fz="sm">{item.mobile}</Text>
								</Box>
								<Button.Group>
									<Button
										bg="var(--theme-primary-color-6)"
										c="white"
										size="xs"
										bd="1px solid var(--theme-tertiary-color-3)"
										onClick={handleAdmissionOverview}
									>
										{t("Admission")}
									</Button>
								</Button.Group>
							</Flex>
						</Grid.Col>
					</Grid>
				))}
			</ScrollArea>
		</Box>
	);
}
