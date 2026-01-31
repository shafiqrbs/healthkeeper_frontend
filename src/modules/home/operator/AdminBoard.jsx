import { ActionIcon, Box, Card, Grid, Modal, Text } from "@mantine/core";
import {
	IconChartAreaLineFilled,

} from "@tabler/icons-react";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { useDisclosure } from "@mantine/hooks";
import DashboardOverviewChart from "@components/charts/DashboardOverviewChart";
import InvoiceSummary from "@modules/hospital/reports/items/InvoiceSummary";

const OVERVIEW_CHART_SECTION = [
	{ key: "monthlyOpd", label: "OPD", color: "yellow.7" },
	{ key: "monthlyEmergency", label: "Emergency", color: "cyan.7" },
	{ key: "monthlyIpd", label: "Admission", color: "blue.7" },
	{ key: "monthlyDischarged", label: "Discharged", color: "teal.7" },
];

export default function AdminBoard({ height }) {
	const [ opened, { open, close } ] = useDisclosure(false);
	const { data: records } = useDataWithoutStore({
		url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.DASHBOARD_OVERVIEW
	});
	const monthlyOverview = records?.data?.monthlyOverview ?? records?.monthlyOverview ?? null;


	const patientStatus = records?.data?.patientStatus;

	const collectionSummaryData = records?.data?.summary[ 0 ] || {};
	const refundTotal = records?.data?.refundTotal || 0;
	const waiverTotal = records?.data?.waiver_amount || 0;

	const formatMoney = (value) =>
		new Intl.NumberFormat("en-BD", {
			minimumFractionDigits: 0,
		}).format(value);

	return (
		<>
			<ActionIcon size={50} onClick={open} styles={{ root: { right: 0, position: "absolute", top: "50%", zIndex: 99, borderTopRightRadius: 0, borderBottomRightRadius: 0 } }}>
				<IconChartAreaLineFilled color="white" />
			</ActionIcon>
			<Box mt={'xs'}>
				<Grid columns={40} gutter={{ base: "md" }}>
					<Grid.Col span={20}>
						<Grid columns={12} gutter={{ base: "md" }}>
							<Grid.Col span={4}>
								<Card radius="xs" bg="var(--mantine-color-green-0)" shadow="sm" withBorder >
									<Text size="sm" c="green" fw={600} ta="center">Grand total</Text>
									<Text size="xl" fw={700} ta="center">TK. {formatMoney(collectionSummaryData?.total - refundTotal?.refund) || 0}</Text>
								</Card>
							</Grid.Col>
							<Grid.Col span={4}>
								<Card radius="xs" bg="var(--mantine-color-purple-0)" shadow="sm" withBorder >
									<Text size="sm" c="purple" fw={600} ta="center">Refund</Text>
									<Text size="xl" fw={700} ta="center">TK. {formatMoney(refundTotal?.refund) || 0}</Text>
								</Card>
							</Grid.Col>
							<Grid.Col span={4}>
								<Card radius="xs" bg="var(--mantine-color-orange-0)" shadow="sm" withBorder >
									<Text size="sm" c="orange" fw={600} ta="center">Waiver</Text>
									<Text size="xl" fw={700} ta="center">TK. {formatMoney(waiverTotal) || 0}</Text>
								</Card>
							</Grid.Col>
							{/*{patientModeCollectionData &&
								patientModeCollectionData?.map((item, index) => (
									<Grid.Col span={4} key={item.id || index}>
									<Card radius="xs" bg="var(--mantine-color-red-0)" shadow="sm" withBorder >
									<Text size="sm" c="red"  fw={600} ta="center">{capitalizeWords(item?.name)}</Text>
									<Text size="xl" fw={700} ta="center">{item?.total_count}|{item?.total}</Text>
									</Card>
									</Grid.Col>
								))}*/}
						</Grid>
					</Grid.Col>
					<Grid.Col span={20}>
						<Grid gutter={{ base: "md" }}>
							<Grid.Col span={4}>
								<Card radius="xs" bg="var(--mantine-color-green-0)" shadow="sm" withBorder >
									<Text size="sm" c="green" fw={600} ta="center">ADMISSION</Text>
									<Text size="xl" fw={700} ta="center">{patientStatus?.patient_admission}</Text>
								</Card>
							</Grid.Col>
							<Grid.Col span={4}>
								<Card radius="xs" bg="var(--mantine-color-red-0)" shadow="sm" withBorder >
									<Text size="sm" c="red" fw={600} ta="center">DISCHARGED</Text>
									<Text size="xl" fw={700} ta="center">{patientStatus?.patient_discharged}</Text>
								</Card>
							</Grid.Col>
							<Grid.Col span={4}>
								<Card radius="xs" bg="var(--mantine-color-blue-0)" shadow="sm" withBorder>
									<Text size="sm" c="blue" fw={600} ta="center">ACTIVE PATIENT</Text>
									<Text size="xl" fw={700} ta="center">{patientStatus?.patient_total}</Text>
								</Card>
							</Grid.Col>
						</Grid>
					</Grid.Col>
				</Grid>
			</Box>
			<Grid columns={40} gutter={{ base: "md" }}>
				{OVERVIEW_CHART_SECTION.map((section) => (
					<Grid.Col key={section.key} span={20}>
						<DashboardOverviewChart
							data={monthlyOverview?.[ section.key ] ?? []}
							sectionLabel={section.label}
							color={section.color}
							mainAreaHeight={height}
						/>
					</Grid.Col>
				))}
			</Grid>

			<Modal size="85%" opened={opened} onClose={close} title="Collection Overview" centered>
				<Card padding="lg" radius="sm" h="100%">
					<InvoiceSummary mainAreaHeight={height} />
				</Card>
			</Modal>
		</>
	);
}
