import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "./helpers/request";
import { useOutletContext } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid } from "@mantine/core";
import PatientInformation from "./common/PatientInformation";
import PatientReport from "./common/PatientReport";
import AddMedicineForm from "./common/AddMedicineForm";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export default function PrescriptionIndex() {
	const { t } = useTranslation();
	const form = useForm(getPrescriptionFormInitialValues(t));
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
							<Grid.Col span={isOpenPatientInfo ? 8 : 2} pos="relative" className="animate-2ms-ease-out">
								<Box
									className="right-arrow-button"
									onClick={() => setIsOpenPatientInfo(!isOpenPatientInfo)}
								>
									{isOpenPatientInfo ? <IconChevronLeft size={20} /> : <IconChevronRight size={20} />}
								</Box>
								<PatientInformation
									isOpenPatientInfo={isOpenPatientInfo}
									setIsOpenPatientInfo={setIsOpenPatientInfo}
								/>
							</Grid.Col>
							<Grid.Col span={isOpenPatientInfo ? 17 : 23} className="animate-2ms-ease-out">
								<Grid columns={25} gutter="les">
									<Grid.Col span={9}>
										<PatientReport />
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
