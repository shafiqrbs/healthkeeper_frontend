import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "./helpers/request";
import { useOutletContext } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid } from "@mantine/core";
import PatientReport from "../common/PatientReport";
import AddMedicineForm from "../common/AddMedicineForm";
import Form from "./form/_Form";
import BaseTabs from "@components/tabs/BaseTabs";
import useParticularsData from "@/common/hooks/useParticularsData";
import { useElementSize } from "@mantine/hooks";

export default function Index() {
	const { t } = useTranslation();
	const form = useForm(getPrescriptionFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);
	const [patientData, setPatientData] = useState({});
	const { ref, width } = useElementSize();

	const [tabValue, setTabValue] = useState("All");

	const { particularsData } = useParticularsData();

	const tabList = particularsData?.entities?.map((item) => `${item.name} ${item.id}`);

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" columns={25}>
							<Grid.Col span={isOpenPatientInfo ? 8 : 3} pos="relative" className="animate-ease-out">
								<Form
									form={form}
									isOpenPatientInfo={isOpenPatientInfo}
									setIsOpenPatientInfo={setIsOpenPatientInfo}
									setPatientData={setPatientData}
								/>
							</Grid.Col>
							<Grid.Col span={isOpenPatientInfo ? 17 : 22} className="animate-ease-out">
								<Grid columns={25} gutter="les">
									<Grid.Col span={25}>
										<BaseTabs
											tabValue={tabValue}
											setTabValue={setTabValue}
											tabList={["All", ...tabList]}
											width={width}
										/>
									</Grid.Col>
									<Flex ref={ref}>
										<Grid.Col span={9}>
											<PatientReport patientData={patientData} tabValue={tabValue} />
										</Grid.Col>
										<Grid.Col span={16}>
											<AddMedicineForm />
										</Grid.Col>
									</Flex>
								</Grid>
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
