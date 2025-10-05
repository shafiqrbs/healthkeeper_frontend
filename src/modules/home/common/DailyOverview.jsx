import { Box, Flex, ScrollArea, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconBed, IconCoinTaka } from "@tabler/icons-react";
import CollectionTable from "../../hospital/common/CollectionTable";
import { MODULES_CORE } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { CONFIGURATION_ROUTES } from "@/constants/routes";
import { formatDate, getLoggedInUser, getUserRole } from "@utils/index";

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
];

// =============== column configurations for different table types ================
const userCollectionColumns = [
	{ key: "name", label: "name" },
	{ key: "patient", label: "patient" },
	{ key: "total", label: "total" },
];

const roomCollectionColumns = [
	{ key: "name", label: "name" },
	{ key: "patient", label: "patient" },
	{ key: "total", label: "total" },
];

const module = MODULES_CORE.DASHBOARD_DAILY_SUMMARY;

export default function DailyOverview() {
	const { t } = useTranslation();
	const records = useSelector((state) => state.crud[module].data);

	const collectionSummaryData = records.data?.summary[0] || {};
	const userCollectionData = records.data?.patientMode || [];
	const roomBaseCollectionData = records.data?.roomBase || [];

	return (
		<ScrollArea h={600} mt="sm">
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
			<CollectionTable data={userCollectionData} columns={userCollectionColumns} title="userCollection" />
			<CollectionTable data={roomBaseCollectionData} columns={roomCollectionColumns} title="roomCollection" />
		</ScrollArea>
	);
}
