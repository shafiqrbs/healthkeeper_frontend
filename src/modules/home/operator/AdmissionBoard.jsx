import { Box, Button, Card,Tabs, Progress,Divider, Flex, Grid, Stack, Text,ScrollArea,Badge,Table } from "@mantine/core";
import {
	IconBed,
	IconBuildingHospital,
	IconChecklist,
	IconClipboardText,
	IconMailForward,
	IconMicroscope,
	IconPackageExport,
	IconStethoscope,
	IconTestPipe,
	IconTestPipe2,
	IconWallet,
	IconHome
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useAppLocalStore from "@hooks/useAppLocalStore";
import OperatorOverview from "@modules/home/operator/OperatorOverview";
import DailyOverview from "@modules/home/common/DailyOverview";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import {useRef} from "react";
import {useReactToPrint} from "react-to-print";



export default function AdmissionBoard() {
	const { userRoles } = useAppLocalStore();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const { data: records, isLoading } = useDataWithoutStore({
		url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.ADMISSION_OVERVIEW
	});


	const patientStatus = records?.data?.patientStatus;
	const stats = records?.data?.stats;
	const bedData = records?.data.bedCabin.bed;
	const cabinData = records?.data?.bedCabin.cabin;
	console.log(cabinData);


	const renderKPI = (item) => {
		const total = item.occupied_count + item.empty_count;
		const occupancyRate = Math.round((item.occupied_count / total) * 100);
		return (
			<Card radius="xs" shadow="sm" withBorder key={item.type}>
				<Text size="sm" c="dimmed">{item.type.charAt(0).toUpperCase() + item.type.slice(1)} Occupancy</Text>
				<Text size="xl" fw={700}>{item.occupied_count} / {total}</Text>
				<Progress value={occupancyRate} mt="sm" radius="xl" />
			</Card>
		);
	};


	const renderCards = (data) => (
		<ScrollArea h={420}>
			<Table
				withTableBorder
				withColumnBorders
				striped
				highlightOnHover
				verticalSpacing="sm"
			>
				<Table.Thead>
					<Table.Tr>
						<Table.Th Th ta="center">S/N</Table.Th>
						<Table.Th>Patient Type</Table.Th>
						<Table.Th>Gender</Table.Th>
						<Table.Th>Payment</Table.Th>
						<Table.Th ta="center">Total</Table.Th>
						<Table.Th ta="center">Occupied</Table.Th>
						<Table.Th ta="center">Empty</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{data?.map((item, index) => (
						<Table.Tr key={index}>
							<Table.Td Th ta="center">{index + 1}</Table.Td>
							<Table.Td>
								<Text fw={500}>
									{item.patient ?? "—"}
								</Text>
							</Table.Td>

							<Table.Td>
								<Badge size="sm" variant="light">
									{item.gender}
								</Badge>
							</Table.Td>
							<Table.Td>
								<Badge
									size="sm"
									color={item.payment === "Paying" ? "green" : "orange"}
									variant="light"
								>
									{item.payment}
								</Badge>
							</Table.Td>
							<Table.Td ta="center">
								<Text fw={700}>{item.total_count}</Text>
							</Table.Td>
							<Table.Td ta="center">
								<Text fw={700}>{item.occupied_count}</Text>
							</Table.Td>
							<Table.Td ta="center">
								<Text fw={700}>{item.empty_count}</Text>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</ScrollArea>
	);

	return (
		<Grid columns={40} gutter={{ base: "md" }}>
			<Grid.Col span={40}>
				<Card padding="lg" radius="sm" h="100%">
					<Card.Section
						h={32}
						withBorder
						component="div"
						bg="var(--theme-primary-color-7)"
					>
						<Flex align="center" h="100%" px="lg">
							<Text pb={0} fz="sm" c="white" fw={500}>
								{t("quickBrowse")}
							</Text>
						</Flex>
					</Card.Section>
					<Stack gap="md" p="md">
						<Text size="xl" fw={600}>Hospital Bed & Cabin Dashboard</Text>

						{/* KPI Cards */}
						<Grid columns={40} gutter={{ base: "md" }}>
							<Grid.Col span={20}>
								<Grid>
									{stats?.map((item) => (
										<Grid.Col span={6} key={item.type}>
											{renderKPI(item)}
										</Grid.Col>
									))}
								</Grid>
							</Grid.Col>
							<Grid.Col span={20}>
								<Grid>
									<Grid.Col span={4}>
										<Card radius="xs" bg="var(--mantine-color-green-0)" shadow="sm" withBorder >
											<Text size="sm"  c="green" fw={600} ta="center">ADMISSION</Text>
											<Text size="xl" fw={700} ta="center">{patientStatus?.patient_admission}</Text>
										</Card>
									</Grid.Col>
									<Grid.Col span={4}>
										<Card radius="xs" bg="var(--mantine-color-red-0)" shadow="sm" withBorder >
											<Text size="sm" c="red"  fw={600} ta="center">DISCHARGED</Text>
											<Text size="xl" fw={700} ta="center">{patientStatus?.patient_discharged}</Text>
										</Card>
									</Grid.Col>
									<Grid.Col span={4}>
										<Card radius="xs" bg="var(--mantine-color-blue-0)" shadow="sm" withBorder>
											<Text size="sm" c="blue" fw={600}  ta="center">ACTIVE PATIENT</Text>
											<Text size="xl" fw={700} ta="center">{patientStatus?.patient_total}</Text>
										</Card>
									</Grid.Col>
								</Grid>
							</Grid.Col>
						</Grid>

						{/* Bed & Cabin Tabs */}
						<Tabs defaultValue="bed" radius="lg" w={'100%'}>
							<Tabs.List>
								<Tabs.Tab value="bed" leftSection={<IconBed size={16} />}>Beds</Tabs.Tab>
								<Tabs.Tab value="cabin" leftSection={<IconHome size={16} />}>Cabins</Tabs.Tab>
							</Tabs.List>
							<Tabs.Panel value="bed" pt="md">
								{renderCards(bedData)}
							</Tabs.Panel>
							<Tabs.Panel value="cabin" pt="md">
								{renderCards(cabinData)}
							</Tabs.Panel>
						</Tabs>
					</Stack>
				</Card>
			</Grid.Col>
		</Grid>
	);
}
