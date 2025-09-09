import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import Table from "./_Table";
import History from "./common/tabs/History";
import Investigation from "./common/tabs/Investigation";
import Medicine from "./common/tabs/Medicine";
import Advice from "./common/tabs/Advice";
import Instruction from "./common/tabs/Instruction";
import OT from "./common/tabs/OT";
import Charge from "./common/tabs/Charge";
import Billing from "./common/tabs/Billing";
import FinalBill from "./common/tabs/FinalBill";
import Discharge from "./common/tabs/Discharge";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useForm } from "@mantine/form";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";

export default function Index() {
	const form = useForm({
		dynamicFormData: {
			investigation: [],
		},
	});
	const { t } = useTranslation();
	const { id } = useParams();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const { data: ipdData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.VIEW}/${id}`,
	});

	const handleSubmit = async () => {
		try {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.UPDATE}/${id}`,
				data: {
					investigation: form.values.dynamicFormData?.investigation,
					mode: "investigation",
				},
				module: "admission",
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (resultAction.payload.success) {
				console.log(resultAction.payload.data);
				successNotification(resultAction.payload.message);
			} else {
				errorNotification(resultAction.payload.message);
			}
		} catch (err) {
			console.error(err);
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
						<Grid w="100%" columns={24}>
							<Grid.Col span={8} pos="relative" className="animate-ease-out">
								<Box px="sm" py="md" bg="white">
									<Text fw={600} fz="sm">
										{t("patientInformation")}
									</Text>
								</Box>
								<TabsWithSearch
									tabList={["list"]}
									tabPanels={[
										{
											tab: "list",
											component: <Table />,
										},
									]}
								/>
							</Grid.Col>
							<Grid.Col span={16} className="animate-ease-out">
								{id ? (
									<TabsWithSearch
										tabList={[
											"History",
											"Investigation",
											"Medicine",
											"Advice",
											"Instruction",
											"OT",
											"Charge",
											"Billing",
											"Final Bill",
											"Discharge",
										]}
										hideSearchbar
										tabPanels={[
											{
												tab: "History",
												component: <History />,
											},
											{
												tab: "Investigation",
												component: <Investigation form={form} handleSubmit={handleSubmit} />,
											},
											{
												tab: "Medicine",
												component: <Medicine />,
											},
											{
												tab: "Advice",
												component: <Advice />,
											},

											{
												tab: "Instruction",
												component: <Instruction />,
											},
											{
												tab: "OT",
												component: <OT />,
											},
											{
												tab: "Charge",
												component: <Charge />,
											},
											{
												tab: "Billing",
												component: <Billing />,
											},
											{
												tab: "Final Bill",
												component: <FinalBill />,
											},
											{
												tab: "Discharge",
												component: <Discharge />,
											},
										]}
									/>
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
					</Flex>
				</Box>
			)}
		</>
	);
}
