import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAdmissionFormInitialValues } from "../helpers/request";
import { useOutletContext } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Badge, Box, Flex, Grid, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import PatientListAdmission from "../../common/PatientListAdmission";
import EntityForm from "../form/EntityForm";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";
import { useDispatch } from "react-redux";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@/common/components/core-component/showNotificationComponent";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { notifications } from "@mantine/notifications";
import ConfirmFooter from "../../common/ConfirmFooter";

const module = MODULES.ADMISSION;
const LOCAL_STORAGE_KEY = "patientFormData";

export default function ConfirmIndex() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const form = useForm(getAdmissionFormInitialValues());
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!form.validate().hasErrors) {
			setIsSubmitting(true);

			try {
				const createdBy = JSON.parse(localStorage.getItem("user"));

				const formValue = {
					...form.values,
					created_by_id: createdBy?.id,
				};

				const data = {
					url: HOSPITAL_DATA_ROUTES.API_ROUTES.VISIT.CREATE,
					data: formValue,
					module,
				};

				const resultAction = await dispatch(storeEntityData(data));

				if (storeEntityData.rejected.match(resultAction)) {
					showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 700, true);
				} else {
					showNotificationComponent(t("Visit saved successfully"), "green", "lightgray", true, 700, true);
					setRefetchData({ module, refetching: true });
					form.reset();
					localStorage.removeItem(LOCAL_STORAGE_KEY);
				}
			} catch (error) {
				console.error("Error submitting visit:", error);
				showNotificationComponent(t("Something went wrong"), "red", "lightgray", true, 700, true);
			} finally {
				setIsSubmitting(false);
			}
		} else {
			if (Object.keys(form.errors)?.length > 0 && form.isDirty()) {
				console.error(form.errors);
				notifications.show({
					title: "Error",
					message: "Please fill all the fields",
					color: "red",
					position: "top-right",
				});
			}
		}
	};

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
								<Box px="sm" py="md" bg="var(--mantine-color-white)">
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
												<PatientListAdmission
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
										<EntityForm form={form} />
									</Grid.Col>
									<Grid.Col span={25}>
										<Box p="xs" bg="var(--mantine-color-white)">
											<Text fw={600} mb="sm">
												{t("Invoice")}
											</Text>
											<Flex gap="xl">
												<Flex gap="xs" mb="3xs" align="center">
													<Box>
														<Badge
															variant="light"
															size="md"
															color="var(--theme-secondary-color-7)"
														>
															12/12/2025
														</Badge>
														<Box mt="les">
															<Text mt="es" fz="sm">
																<strong>Admission Fee:</strong> 30 taka
															</Text>
															<Text mt="es" fz="sm">
																<strong>Minimum Room:</strong> 3
															</Text>
														</Box>
														<Text mt="es" fz="sm">
															<strong>Total:</strong> (30 x 3) = 90 taka
														</Text>
													</Box>
												</Flex>
												<Flex gap="xs" mb="3xs" align="center">
													<Box>
														<Badge
															variant="light"
															size="md"
															color="var(--theme-secondary-color-7)"
														>
															Approved
														</Badge>
														<Box mt="les">
															<Text mt="es" fz="sm">
																<strong>Doctor:</strong> Shafiqul Islam
															</Text>
															<Text mt="es" fz="sm">
																<strong>Nurse:</strong> Jane Doe
															</Text>
														</Box>
														<Text mt="es" fz="sm">
															<strong>Status:</strong> Approved
														</Text>
													</Box>
												</Flex>
											</Flex>
										</Box>
									</Grid.Col>
									<Grid.Col span={25}>
										<ConfirmFooter
											form={form}
											isSubmitting={isSubmitting}
											handleSubmit={handleSubmit}
										/>
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
