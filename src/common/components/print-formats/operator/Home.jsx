import { Box, Text, Grid, Group, Image, Flex, ScrollArea } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import useDoaminHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { t } from "i18next";
import { IconBed, IconCoinTaka } from "@tabler/icons-react";
import CollectionTable from "@modules/hospital/common/CollectionTable";

const Home = forwardRef((data, ref) => {
	const { hospitalConfigData } = useDoaminHospitalConfigData();

	const records = data || {};

	const collectionSummaryData = records.data?.summary[0] || {};
	const userCollectionData = records.data?.patientMode || [];
	const roomBaseCollectionData = records.data?.roomBase || [];

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
								{t("Prescription")}
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
					<CollectionTable
						stripedColor="var(--theme-tertiary-color-2)"
						data={userCollectionData}
						columns={userCollectionColumns}
						title="userCollection"
					/>
					<CollectionTable
						stripedColor="var(--theme-tertiary-color-2)"
						data={roomBaseCollectionData}
						columns={roomCollectionColumns}
						title="roomCollection"
					/>
				</ScrollArea>
			</Box>
		</Box>
	);
});

Home.displayName = "Home";

export default Home;
