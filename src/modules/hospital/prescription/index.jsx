import { useState } from "react";
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

export default function Index() {
	const { t } = useTranslation();
	const form = useForm(getPrescriptionFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);
	const [patientData, setPatientData] = useState({});

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
									<Grid.Col span={9}>
										<PatientReport patientData={patientData} />
									</Grid.Col>
									<Grid.Col span={16}>
										<AddMedicineForm />
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
