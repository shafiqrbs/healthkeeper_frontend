import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import { Box, Button, Flex, SegmentedControl, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import PatientListWithActions from "./PatientListWithActions";

export default function PatientInformation({ isOpenPatientInfo, setIsOpenPatientInfo, setPatientData }) {
	const { t } = useTranslation();

	return (
		<Box onMouseEnter={() => setIsOpenPatientInfo(true)} onMouseLeave={() => setIsOpenPatientInfo(false)}>
			<Flex justify={isOpenPatientInfo ? "space-between" : "center"} align="center" bg="white" py="xxxs" px="xs">
				{isOpenPatientInfo ? (
					<>
						<Text className="text-nowrap">{t("patientInformation")}</Text>
						<SegmentedControl
							size="xs"
							color="var(--theme-primary-color-6)"
							data={["List", "New"]}
							styles={{
								root: { backgroundColor: "var(--theme-tertiary-color-1)" },
								control: { width: "60px" },
							}}
						/>
					</>
				) : (
					<Button variant="filled" bg="var(--theme-primary-color-6)" w="100%" size="xs" aria-label="list">
						{t("List")}
					</Button>
				)}
			</Flex>
			<TabsWithSearch
				tabList={["new", "report", "reVisit"]}
				expand={isOpenPatientInfo}
				tabPanels={[
					{
						tab: "new",
						component: (
							<PatientListWithActions
								isOpenPatientInfo={isOpenPatientInfo}
								setIsOpenPatientInfo={setIsOpenPatientInfo}
								setPatientData={setPatientData}
								action="edit"
							/>
						),
					},
					{
						tab: "report",
						component: (
							<PatientListWithActions
								isOpenPatientInfo={isOpenPatientInfo}
								setPatientData={setPatientData}
								action="report"
							/>
						),
						activeColor: "var(--theme-secondary-color-6)",
					},
					{
						tab: "reVisit",
						component: (
							<PatientListWithActions
								isOpenPatientInfo={isOpenPatientInfo}
								setPatientData={setPatientData}
								action="reVisit"
							/>
						),
						activeColor: "var(--theme-warn-color-6)",
					},
				]}
			/>
		</Box>
	);
}
