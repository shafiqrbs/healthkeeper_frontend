import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Flex, ScrollArea, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconBed, IconCoinTaka } from "@tabler/icons-react";
import CollectionTable from "../CollectionTable";
import { useOutletContext } from "react-router-dom";

const collectionOverviewData = [
	{
		label: "totalPatient",
		value: 25,
		icon: IconBed,
	},
	{
		label: "totalCollection",
		value: 50000,
		icon: IconCoinTaka,
	},
	{
		label: "returnAmount",
		value: 25000,
		icon: IconCoinTaka,
	},
];

const userCollectionData = [
	{ id: 70, patient: "20 Per", name: "MD Nazmul Hossain", amount: 2200 },
	{ id: 39, patient: "20 Per", name: "MD Nazmul Hossain", amount: 2200 },
	{ id: 56, patient: "20 Per", name: "MD Nazmul Hossain", amount: 2200 },
	{ id: 58, patient: "20 Per", name: "MD Nazmul Hossain", amount: 2200 },
];

const roomBaseCollectionData = [
	{ id: 70, patient: "20 Per", room: "Room 1", amount: 2200 },
	{ id: 39, patient: "20 Per", room: "Room 1", amount: 2200 },
	{ id: 56, patient: "20 Per", room: "Room 1", amount: 2200 },
	{ id: 58, patient: "20 Per", room: "Room 1", amount: 2200 },
];

// =============== column configurations for different table types ================
const userCollectionColumns = [
	{ key: "name", label: "name" },
	{ key: "patient", label: "patient" },
	{ key: "amount", label: "amount" },
];

const roomCollectionColumns = [
	{ key: "room", label: "room" },
	{ key: "patient", label: "patient" },
	{ key: "amount", label: "amount" },
];

export default function OverviewDrawer({ opened, close }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();

	return (
		<GlobalDrawer opened={opened} close={close} title="Overview" size="30%">
			<ScrollArea mt="sm" h={mainAreaHeight - 80}>
				<Box bg="var(--theme-primary-color-0)" py="3xs" px="xs" style={{ borderRadius: "4px" }}>
					<Text fz="sm" fw={600}>
						{t("collectionOverview")}
					</Text>
				</Box>
				<Box className="borderRadiusAll" mt="3xs" px="xs">
					{collectionOverviewData.map((item, index) => (
						<Flex
							key={index}
							justify="space-between"
							align="center"
							className={index !== collectionOverviewData.length - 1 ? "borderBottomDashed" : ""}
							py="3xs"
						>
							<Text>{t(item.label)}</Text>
							<Flex align="center" gap="xs" w="80px">
								<item.icon color="var(--theme-primary-color-6)" />
								<Text fz="sm">{item.value}</Text>
							</Flex>
						</Flex>
					))}
				</Box>
				<CollectionTable data={userCollectionData} columns={userCollectionColumns} title="userCollection" />
				<CollectionTable data={roomBaseCollectionData} columns={roomCollectionColumns} title="roomCollection" />
			</ScrollArea>
		</GlobalDrawer>
	);
}
