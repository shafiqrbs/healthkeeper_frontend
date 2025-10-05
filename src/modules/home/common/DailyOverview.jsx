import { Box, Flex, ScrollArea, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconBed, IconCoinTaka } from "@tabler/icons-react";
import CollectionTable from "../../hospital/common/CollectionTable";
import { MODULES_CORE } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { CONFIGURATION_ROUTES } from "@/constants/routes";
import {formatDate, getLoggedInUser, getUserRole} from "@utils/index";

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
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const records = useSelector((state) => state.crud[module].data);
	const user = getLoggedInUser();
	const roles = getUserRole();

	console.log(roles)
	const collectionSummaryData = records.data?.summary || [];
	const userCollectionData = records.data?.patientMode || [];
	const roomBaseCollectionData = records.data?.roomBase || [];
	useEffect(() => {
		if (Object.keys(records?.data || {})?.length === 0) {
			dispatch(
				getIndexEntityData({ module,
					url: CONFIGURATION_ROUTES.API_ROUTES.HOSPITAL_CONFIG.OPD_DASHBOARD,
					params:{
						'created': formatDate(new Date()),
						'created_by_id': roles.includes('operator_manager') ? undefined:user?.id
					}
				})
			);
		}
	}, [dispatch]);

	return (
		<ScrollArea mt="sm">
			<Box className="borderRadiusAll" mt="xxxs" px="xs">
				{collectionOverviewData.map((item, index) => (
					<Flex
						key={index}
						justify="space-between"
						align="center"
						className={index !== collectionOverviewData.length - 1 ? "borderBottomDashed" : ""}
						py="xxxs"
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
	);
}
