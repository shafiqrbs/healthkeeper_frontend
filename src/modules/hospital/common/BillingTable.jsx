import {Box, Flex, Grid, Stack, Text} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { getDataWithoutStore } from "@/services/apiService";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { ScrollArea } from "@mantine/core";
import { Table } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {useOutletContext} from "react-router-dom";
import CustomDivider from "@components/core-component/CustomDivider";
import {IconBuildingHospital, IconCalendarWeek, IconUser} from "@tabler/icons-react";
import {formatDate} from "@utils/index";

export default function BillingTable({ entity }) {
	const { t } = useTranslation();
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [invoiceDetailsOpened, { open: openInvoiceDetails, close: closeInvoiceDetails }] = useDisclosure(false);
	const { mainAreaHeight } = useOutletContext();
	//const transactions = entity?.invoice_transaction;
	const transactions = entity?.invoice_particular;
	const item = entity;

	const handleDetailsView = async (transactionId) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.PRINT}/${transactionId}`,
		});
		setSelectedInvoice(res.data);
		requestAnimationFrame(openInvoiceDetails);
	};


	return (

		<Stack justify="space-between" h="calc(100% - 50px)" gap="0">
			<Box>
				{item && (
					<Grid columns={12} key={item.id} my="xs" bg={"var(--theme-secondary-color-2)"} px="xs" gutter="xs">
						<Grid.Col span={12}><Text fz="sm">{item.name}</Text></Grid.Col>
						<CustomDivider />
						<Grid.Col span={6}>
							<Flex align="center" gap="3xs">
								<IconCalendarWeek size={16} stroke={1.5} />
								<Text fz="sm" className="activate-link text-nowrap">
									{formatDate(item?.admission_date)}
								</Text>
							</Flex>
							<Flex align="center" gap="3xs">
								<IconUser size={16} stroke={1.5} />
								<Text fz="sm">{item.patient_id}</Text>
							</Flex>
							<Flex align="center" gap="3xs">
								<IconBuildingHospital size={16} stroke={1.5} />
								<Text fz="sm">{item.invoice}</Text>
							</Flex>
						</Grid.Col>
						<Grid.Col span={6}>
							<Flex justify="space-between" align="center" gap="3xs">
								<Box>
									<Text fz="sm">{item.mobile}</Text>
									<Text fz="sm">{item.payment_mode_name}</Text>
								</Box>
							</Flex>
							<Flex align="center" gap="3xs">
								<Text fz="sm">Year: {item.year}</Text>
							</Flex>
						</Grid.Col>
					</Grid>
				)}
				<ScrollArea h={mainAreaHeight-280}>
				<Table
					style={{
						borderCollapse: "collapse",
						width: "100%",
					}}
					className="customTable"
				>
					<Table.Thead>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-2)" }}>
							<Table.Th>S/N</Table.Th>
							<Table.Th>Name</Table.Th>
							<Table.Th ta={'center'}>Unit</Table.Th>
							<Table.Th ta={'right'}>Refund</Table.Th>
							<Table.Th ta={'right'}>Amount</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{transactions?.length > 0 &&
						transactions.map((item, index) => (
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-2)" }}>
							<Table.Td>{index + 1}.</Table.Td>
							<Table.Td>{item?.name}</Table.Td>
							<Table.Td ta={'center'}>{item?.quantity}</Table.Td>
							<Table.Td ta={'right'}>{item?.refund_amount}</Table.Td>
							<Table.Td ta={'right'}>{item?.sub_total-item?.refund_amount}</Table.Td>
						</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				</ScrollArea>
			</Box>
			<Box p="xs">
				<Flex justify="space-between" bg="var(--theme-primary-color-8)" py="les" px="3xs">
					<Text c="white" fw={600}>Total Charge</Text>
					<Text c="white" fw={600}>
						<Box fw={600} component="span" c="white">
							৳
						</Box>{" "}
						{entity?.total}
					</Text>
				</Flex>
				<Flex justify="space-between" bg="var(--theme-secondary-color-8)" py="les" px="3xs">
					<Text c="white" fw={600}>Total Payment</Text>
					<Text c="white" fw={600}>
						<Box fw={600} component="span" c="white">
							৳
						</Box>{" "}
						{entity?.amount}
					</Text>
				</Flex>
				<Flex justify="space-between" bg="orange" py="les" px="3xs">
					<Text c="white" fw={600}> {Number(entity?.total) >= Number(entity?.amount) ? 'Receivable':'Payable'}</Text>
					<Text c="white" fw={600}>
						<Box fw={600} component="span" c="white">
							৳
						</Box>{" "}
						{Number(entity?.total)- Number(entity?.amount)}
					</Text>
				</Flex>
			</Box>

		</Stack>

	);
}
