import { Box, Flex, ScrollArea, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconBed, IconCoinTaka } from "@tabler/icons-react";
import CollectionTable from "../../hospital/common/CollectionTable";
import { MODULES_CORE } from "@/constants";
import { useSelector } from "react-redux";

// =============== column configurations for different table types ================
const collectionColumns = [
	{ key: "name", label: "name" },
	{ key: "patient", label: "patient" },
	{ key: "total", label: "total" },
];

const module = MODULES_CORE.DASHBOARD_DAILY_SUMMARY;

export default function DailyOverview({ height }) {

	const { t } = useTranslation();
	const records = useSelector((state) => state.crud[module].data);
	const collectionSummaryData = records.data?.summary[0] || {};
	const patientModeCollectionData = records.data?.patientMode || [];
	const roomBaseCollectionData = records.data?.roomBase || [];

	const userBasedCollectionData = records.data?.userBase || [];
	const paymentCollectionData = records.data?.paymentMode || [];
	const doctorCollectionData = records.data?.doctorMode || [];
	const serviceData = records.data?.services || [];

	return (
		<ScrollArea h={height - 72} m="sm">
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
			<CollectionTable data={patientModeCollectionData} columns={collectionColumns} title="UserCollection" />
			{/*<CollectionTable data={roomBaseCollectionData} columns={collectionColumns} title="RoomCollection" />*/}
			<CollectionTable data={userBasedCollectionData} columns={collectionColumns} title="UserCollection" />
			<CollectionTable data={serviceData} columns={collectionColumns} title="ServiceBaseCollection" />
			{/*<CollectionTable data={paymentCollectionData} columns={collectionColumns} title="PaymentModeCollection" />*/}
			{/*<CollectionTable data={doctorCollectionData} columns={collectionColumns} title="DoctorModeCollection" />*/}
		</ScrollArea>
	);
}
