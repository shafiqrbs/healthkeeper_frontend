import {Box, Text, Grid, Group, Image, Flex, ScrollArea, Table, Card} from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import useDoaminHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { t } from "i18next";
import { IconBed, IconCoinTaka } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import {capitalizeWords} from "@utils/index";

const InvoiceSummaryReports = forwardRef((data, ref) => {
	const { hospitalConfigData } = useDoaminHospitalConfigData();
	const records = data || {};
	const collectionSummaryData = records.data?.summary[0] || [];
	const invoiceModeData = records?.data?.invoiceMode || [];
	const patientModeCollectionData = records?.data?.patientMode || [];
	const userCollectionData = records?.data?.userBase || [];
	const serviceGroups = records?.data?.serviceGroups || [];
	const serviceData = records?.data?.services || [];

	const totalModeCount = patientModeCollectionData?.reduce((sum, item) => sum + (item.patient ?? 0), 0);
	const totalModeAmount = patientModeCollectionData?.reduce((sum, item) => sum + (item.total ?? 0), 0);

	const totalInvoiceModeAmount = invoiceModeData?.reduce((sum, item) => sum + (item.total ?? 0), 0);

	const totalUserCount = userCollectionData?.reduce((sum, item) => sum + (item.total_count ?? 0), 0);
	const totalUserAmount = userCollectionData?.reduce((sum, item) => sum + (item.total ?? 0), 0);


	const totalServieCount = serviceData?.reduce((sum, item) => sum + (item.total_count ?? 0), 0);
	const totalServiceAmount = serviceData?.reduce((sum, item) => sum + (item.total ?? 0), 0);

	const totalServieGroupCount = serviceGroups?.reduce((sum, item) => sum + (item.total_count ?? 0), 0);
	const totalServiceGroupAmount = serviceGroups?.reduce((sum, item) => sum + (item.total ?? 0), 0);

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
					<Table
						style={{
							borderCollapse: "collapse",
							width: "100%",
							border: "1px solid var(--theme-tertiary-color-8)",
						}}
						className="customTable"
					>
						<Table.Tbody>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Td colSpan={"6"}>
								<Box>
									<Flex gap="md" justify="center">
										<Box>
											<Group ml="md" align="center" h="100%">
												<Image src={GLogo} alt="logo" width={60} height={60} />
											</Group>
										</Box>
										<Box>
											<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
												{hospitalConfigData?.organization_name || ""}
											</Text>
											<Text ta="center" size="sm" c="gray" mt="2">
												{hospitalConfigData?.address || ""}
											</Text>
											<Text ta="center" size="sm" c="gray" mb="2">
												{t("হটলাইন")} {hospitalConfigData?.hotline || ""}
											</Text>
											<Text ta="center" fw="bold" size="lg" c="#1e40af">
												{t("DailySummaryReports")}
											</Text>
										</Box>
										<Box>
											<Group mr="md" justify="flex-end" align="center" h="100%">
												<Image src={TBLogo} alt="logo" width={60} height={60} />
											</Group>
										</Box>
									</Flex>
								</Box>
							</Table.Td>
						</Table.Tr>
					</Table.Tbody>
					</Table>
				</Box>
				{/* =============== Daily Overview representation ================ */}
				<Box className="borderRadiusAll" mt="3xs" px="xs">
					<Flex justify="space-between" align="center" className="borderBottomDashed" py="3xs">
						<Text>{t("Patient")}</Text>
						<Flex align="center" gap="xs" w="80px">
							<IconBed color="var(--theme-primary-color-6)" />
							<Text fz="sm">{collectionSummaryData?.patient || 0}</Text>
						</Flex>
					</Flex>
					<Flex justify="space-between" align="center" py="3xs">
						<Text>{t("Collection")}</Text>
						<Flex align="center" gap="xs" w="80px">
							<IconCoinTaka color="var(--theme-primary-color-6)" />
							<Text fz="sm">{collectionSummaryData?.total || 0}</Text>
						</Flex>
					</Flex>
				</Box>
				<Box className="borderRadiusAll">
					<Card padding="lg" radius="sm">
						<Card.Section h={32} withBorder component="div" bg="var(--theme-primary-color-7)">
							<Flex align="center" h="100%" px="lg" justify="space-between">
								<Text pb={0} fz="sm" c="white" fw={500}>
									{t("TicketBaseCollections")}
								</Text>
							</Flex>
						</Card.Section>
					</Card>
					<Table>
						<Table.Thead>
							<Table.Tr py="xs" bg="var(--theme-secondary-color-0)">
								<Table.Td width={'60%'}>Patient Mode</Table.Td>
								<Table.Td width={'20%'}>Number of Patient</Table.Td>
								<Table.Td width={'20%'}> Amount</Table.Td>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{patientModeCollectionData && (
								patientModeCollectionData?.map((item, index) => (
									<Table.Tr key={item.id || index} py="xs">
										<Table.Td>{capitalizeWords(item?.name)}</Table.Td>
										<Table.Td>{item?.patient}</Table.Td>
										<Table.Td>{item?.total}</Table.Td>
									</Table.Tr>
								))
							)}
							<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
								<Table.Td>Total</Table.Td>
								<Table.Td>{totalModeCount}</Table.Td>
								<Table.Td>{totalModeAmount}</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>

				<Box className="borderRadiusAll">
					<Card padding="lg" radius="sm">
						<Card.Section h={32} withBorder component="div" bg="var(--theme-primary-color-7)">
							<Flex align="center" h="100%" px="lg" justify="space-between">
								<Text pb={0} fz="sm" c="white" fw={500}>
									{t("InvoiceModeCollections")}
								</Text>
							</Flex>
						</Card.Section>
					</Card>
					<Table>
						<Table.Thead>
							<Table.Tr py="xs" bg="var(--theme-secondary-color-0)">
								<Table.Td width={'80%'}>Invoice Mode</Table.Td>
								<Table.Td width={'20%'}> Amount</Table.Td>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{invoiceModeData && (
								invoiceModeData?.map((item, index) => (
									<Table.Tr key={item.id || index} py="xs">
										<Table.Td>{capitalizeWords(item?.name)}</Table.Td>
										<Table.Td>{item?.total}</Table.Td>
									</Table.Tr>
								))
							)}
							<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
								<Table.Td>Total</Table.Td>
								<Table.Td>{totalInvoiceModeAmount}</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>
				<Box className="borderRadiusAll">
					<Card padding="lg" radius="sm">
						<Card.Section h={32} withBorder component="div" bg="var(--theme-primary-color-7)">
							<Flex align="center" h="100%" px="lg" justify="space-between">
								<Text pb={0} fz="sm" c="white" fw={500}>
									{t("UserBaseCollections")}
								</Text>
							</Flex>
						</Card.Section>
					</Card>
					<Table>
						<Table.Thead bg="var(--theme-secondary-color-0)">
							<Table.Tr py="xs">
								<Table.Td width={'80%'}>Particular</Table.Td>
								<Table.Td>Amount</Table.Td>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{userCollectionData && (
								userCollectionData?.map((item, index) => (
									<Table.Tr key={item.id || index} py="xs">
										<Table.Td>{item?.name}</Table.Td>
										<Table.Td>{item?.total}</Table.Td>
									</Table.Tr>
								))
							)}
							<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
								<Table.Td>Total</Table.Td>
								<Table.Td>{totalUserAmount}</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>
				<Box className="borderRadiusAll">
					<Card padding="lg" radius="sm">
						<Card.Section h={32} withBorder component="div" bg="var(--theme-primary-color-7)">
							<Flex align="center" h="100%" px="lg" justify="space-between">
								<Text pb={0} fz="sm" c="white" fw={500}>
									{t("ServiceBaseCollections")}
								</Text>
							</Flex>
						</Card.Section>
					</Card>
					<Table>
						<Table.Thead bg="var(--theme-secondary-color-0)">
							<Table.Tr py="xs">
								<Table.Td width={'60%'}>Particular</Table.Td>
								<Table.Td width={'20%'}>Number of service</Table.Td>
								<Table.Td>Amount</Table.Td>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{serviceData && (
								serviceData?.map((item, index) => (
									<Table.Tr key={item.id || index} py="xs">
										<Table.Td>{item?.name}</Table.Td>
										<Table.Td>{item?.total_count}</Table.Td>
										<Table.Td>{item?.total}</Table.Td>
									</Table.Tr>
								))
							)}
							<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
								<Table.Td>Total</Table.Td>
								<Table.Td>{totalServieCount}</Table.Td>
								<Table.Td>{totalServiceAmount}</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>
				<Box className="borderRadiusAll">
					<Card padding="lg" radius="sm">
						<Card.Section h={32} withBorder component="div" bg="var(--theme-primary-color-7)">
							<Flex align="center" h="100%" px="lg" justify="space-between">
								<Text pb={0} fz="sm" c="white" fw={500}>
									{t("ServiceGroupBaseCollections")}
								</Text>
							</Flex>
						</Card.Section>
					</Card>
					<Table>
						<Table.Thead bg="var(--theme-secondary-color-0)">
							<Table.Tr py="xs">
								<Table.Td width={'88%'}>Particular</Table.Td>
								<Table.Td>Amount</Table.Td>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{serviceGroups && (
								serviceGroups?.map((item, index) => (
									<Table.Tr key={item.id || index} py="xs">
										<Table.Td>{item?.name}</Table.Td>
										<Table.Td>{item?.total}</Table.Td>
									</Table.Tr>
								))
							)}
							<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
								<Table.Td>Total</Table.Td>
								<Table.Td>{totalServiceGroupAmount}</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>
			</Box>
		</Box>
	);
});



InvoiceSummaryReports.displayName = "InvoiceSummaryReports";

export default InvoiceSummaryReports;
