import { Box, Text, Grid, Group, Image, Flex, ScrollArea, Table } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import useDoaminHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { t } from "i18next";
import { IconBed, IconCoinTaka } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const Home = forwardRef((data, ref) => {
	const { hospitalConfigData } = useDoaminHospitalConfigData();

	const records = data || {};

	const collectionSummaryData = records.data?.summary[0] || {};
	const userCollectionData = records.data?.patientMode || [];
	const roomBaseCollectionData = records.data?.roomBase || [];
	const userBasedCollectionData = records.data?.userBase || [];
	const paymentCollectionData = records.data?.paymentMode || [];
	const doctorCollectionData = records.data?.doctorMode || [];

	const collectionColumn = [
		{ key: "name", label: "name" },
		{ key: "patient", label: "patient" },
		{ key: "total", label: "total" },
	];

	return (
		<Box display="none">
			<Box
				ref={ref}
				p="md"
				w="210mm"
				mih="1122px"
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
				bd="1px solid black"
			>
				{/* =============== header section with doctor information in bengali and english ================ */}
				<Box mb="sm">
					<Grid gutter="md">
						<Grid.Col span={4}>
							<Group ml="md" align="center" h="100%">
								<Image src={GLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
						<Grid.Col span={4}>
							<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
								{hospitalConfigData?.organization_name || "Hospital"}
							</Text>
							<Text ta="center" size="sm" c="gray" mt="2">
								{hospitalConfigData?.address || "Uttara"}
							</Text>
							<Text ta="center" size="sm" c="gray" mb="2">
								{t("হটলাইন")} {hospitalConfigData?.hotline || "0987634523"}
							</Text>

							<Text ta="center" fw="bold" size="lg" c="#1e40af">
								{t("DailySummaryReports")}
							</Text>
						</Grid.Col>
						<Grid.Col span={4}>
							<Group mr="md" justify="flex-end" align="center" h="100%">
								<Image src={TBLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== Daily Overview representation ================ */}
				<ScrollArea mt="sm" h="auto">
					<Box className="borderRadiusAll" mt="xxxs" px="xs">
						<Flex justify="space-between" align="center" className="borderBottomDashed" py="xxxs">
							<Text>{t("Patient")}</Text>
							<Flex align="center" gap="xs" w="80px">
								<IconBed color="var(--theme-primary-color-6)" />
								<Text fz="sm">{collectionSummaryData?.patient || 0}</Text>
							</Flex>
						</Flex>
						<Flex justify="space-between" align="center" py="xxxs">
							<Text>{t("Collection")}</Text>
							<Flex align="center" gap="xs" w="80px">
								<IconCoinTaka color="var(--theme-primary-color-6)" />
								<Text fz="sm">{collectionSummaryData?.total || 0}</Text>
							</Flex>
						</Flex>
					</Box>
					<PrintingTable data={userCollectionData} columns={collectionColumn} title="UserCollection" />
					<PrintingTable data={roomBaseCollectionData} columns={collectionColumn} title="RoomCollection" />
					<PrintingTable data={userBasedCollectionData} columns={collectionColumn} title="UserCollection" />
					<PrintingTable
						data={paymentCollectionData}
						columns={collectionColumn}
						title="PaymentModeCollection"
					/>
					<PrintingTable
						data={doctorCollectionData}
						columns={collectionColumn}
						title="DoctorModeCollection"
					/>
				</ScrollArea>
			</Box>
		</Box>
	);
});

function PrintingTable({ data, columns, title }) {
	const { t } = useTranslation();

	const rows = data?.map((item, index) => (
		<Table.Tr key={item.id || index} py="xs">
			{columns?.map((column, colIndex) => {
				const isLastColumn = columns.length - 1 === colIndex;
				return (
					<Table.Td fz="xs" py="es" align={isLastColumn ? "right" : "left"} key={colIndex}>
						{isLastColumn ? (
							<Flex align="center" gap="xxxs" justify="flex-end">
								<IconCoinTaka size={16} color="var(--theme-primary-color-6)" />
								<Text fz="sm">{item[column.key] || "0"}</Text>
							</Flex>
						) : (
							<>{item[column.key] || "-"}</>
						)}
					</Table.Td>
				);
			})}
		</Table.Tr>
	));

	return (
		<Box my="lg">
			{title && (
				<Box mb="xxxs">
					<Text fz="sm" fw={600}>
						{t(title)}
					</Text>
				</Box>
			)}
			<Box className="borderRadiusAll">
				<Table stickyHeader striped stripedColor="var(--theme-primary-color-0)">
					<Table.Thead>
						<Table.Tr py="xs">
							{columns?.map((column, index) => {
								const isLastColumn = columns.length - 1 === index;
								return (
									<Table.Th
										key={index}
										tt="capitalize"
										width={'350px'}
										ta={isLastColumn ? "right" : "left"}
										align={isLastColumn ? "right" : "left"}
									>
										{t(column.label)}
									</Table.Th>
								);
							})}
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{rows}</Table.Tbody>
				</Table>
			</Box>
		</Box>
	);
}

Home.displayName = "Home";

export default Home;
