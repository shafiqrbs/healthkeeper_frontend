import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAdmissionFormInitialValues } from "../helpers/request";
import { useOutletContext, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import Table from "./_Table";
import EntityForm from "../form/EntityForm";
import { MODULES } from "@/constants";

const module = MODULES.ADMISSION;

export default function Index() {
	const { t } = useTranslation();
	const { id } = useParams();
	const form = useForm(getAdmissionFormInitialValues());
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" columns={25}>
							<Grid.Col span={isOpenPatientInfo ? 8 : 2} pos="relative" className="animate-ease-out">
								<Box px="sm" py="md" bg="white">
									<Text fw={600} fz="sm">
										{t("PatientInformation")}
									</Text>
								</Box>
								<TabsWithSearch
									tabList={["list"]}
									tabPanels={[
										{
											tab: "list",
											component: (
												<Table
													selectedId={id}
													isOpenPatientInfo={isOpenPatientInfo}
													setIsOpenPatientInfo={setIsOpenPatientInfo}
												/>
											),
										},
									]}
								/>
							</Grid.Col>
							<Grid.Col span={isOpenPatientInfo ? 17 : 23} className="animate-ease-out">
								<Grid columns={25} gutter="les">
									<Grid.Col span={25}>
										{id ? (
											<EntityForm form={form} module={module} />
										) : (
											<Flex
												justify="center"
												align="center"
												p="sm"
												pl={"md"}
												pr={"md"}
												bg="white"
												h={mainAreaHeight - 12}
											>
												<Text>No patient selected, please select a patient</Text>
											</Flex>
										)}
									</Grid.Col>
								</Grid>
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
