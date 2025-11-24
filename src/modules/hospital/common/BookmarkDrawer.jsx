import { getIndexEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { ActionIcon, Box, Flex, Grid, ScrollArea, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import TreatmentAddMedicineForm from "@hospital-components/__TreatmentAddMedicineForm";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { MODULES_CORE } from "@/constants";
import { setRefetchData } from "@/app/store/core/crudSlice";
import InputForm from "@components/form-builders/InputForm";
import { useForm } from "@mantine/form";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";

const module = MODULES_CORE.TREATMENT_TEMPLATES;

export default function BookmarkDrawer({ opened, close }) {
	const { prescriptionId, treatmentId } = useParams();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const treatmentData = useSelector((state) => state.crud.treatment.data);
	const refetching = useSelector((state) => state.crud[module]?.refetching);
	const [medicines, setMedicines] = useState([]);
	const navigate = useNavigate();

	const form = useForm({
		initialValues: {
			particular_type_master_id: 24,
			treatment_mode_id: "",
			name: "",
		},
		validate: {
			name: (value) => {
				if (value?.trim()?.length === 0) {
					return t("NameIsRequired");
				}
				return null;
			},
		},
	});

	const { data: getTreatmentModes } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_TREATMENT_MODE.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_TREATMENT_MODE.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_TREATMENT_MODE.UTILITY,
	});

	useEffect(() => {
		if (getTreatmentModes?.length > 0) {
			form.setFieldValue(
				"treatment_mode_id",
				getTreatmentModes.find((mode) => mode.slug === "opd-treatment")?.value
			);
		}
	}, [getTreatmentModes]);

	// =============== refetch data when refetching state changes ================
	useEffect(() => {
		dispatch(
			getIndexEntityData({
				url: MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_TEMPLATES.INDEX,
				params: {
					particular_type: "treatment-template",
					treatment_mode: "opd-treatment",
				},
				module: "treatment",
			})
		);
	}, [refetching, dispatch]);

	const addTreatmentTemplate = async (values) => {
		if (form.values.name?.length === 0) {
			errorNotification(t("NameIsRequired"), ERROR_NOTIFICATION_COLOR);
			return;
		}

		const value = {
			url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.CREATE,
			data: values,
			module,
		};
		const resultAction = await dispatch(storeEntityData(value));
		if (storeEntityData.rejected.match(resultAction)) {
			errorNotification(resultAction.payload.message, ERROR_NOTIFICATION_COLOR);
		}
		if (storeEntityData.fulfilled.match(resultAction)) {
			form.setFieldValue("name", "");
			dispatch(setRefetchData({ module, refetching: true }));
			successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
		}
	};

	const handleTabClick = (tabItem) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX}/${prescriptionId}/${tabItem.id}`);
	};

	return (
		<GlobalDrawer size="100%" opened={opened} close={close} title="Treatment template for medicine">
			<Grid columns={12} gutter="xs">
				<Grid.Col span={3}>
					<ScrollArea bg="var(--theme-tertiary-color-0)" mt="sm" h={mainAreaHeight - 80} scrollbars="y">
						<Box px="sm" py="sm">
							<Flex
								gap="les"
								align="center"
								w="100%"
								component="form"
								onSubmit={form.onSubmit(addTreatmentTemplate)}
							>
								<InputForm
									form={form}
									placeholder={t("AddTemplateName")}
									rightSectionPointerEvents="all"
									nextField="EntityFormSubmit"
									id="name"
									name="name"
									tooltip={t("TemplateNameIsRequired")}
									styles={{ root: { width: "100%" } }}
									value={form.values.name}
									onChange={(e) => form.setFieldValue("name", e.target.value)}
								/>
								<ActionIcon size="lg" type="submit" id="EntityFormSubmit">
									<IconPlus size={16} />
								</ActionIcon>
							</Flex>
							<Box mt="sm">
								{treatmentData?.data?.map((tabItem, index) => (
									<Box
										px="xs"
										key={index}
										className={`cursor-pointer`}
										variant="default"
										onClick={() => handleTabClick(tabItem)}
										bg={
											treatmentId === tabItem?.id?.toString()
												? "var(--mantine-color-gray-1)"
												: "var(--mantine-color-white)"
										}
									>
										<Text
											c={
												treatmentId === tabItem?.id?.toString()
													? "var(--theme-primary-color-8)"
													: "var(--mantine-color-black)"
											}
											size="sm"
											py="3xs"
											fw={500}
										>
											{t(tabItem?.name)}
										</Text>
									</Box>
								))}
							</Box>
						</Box>
					</ScrollArea>
				</Grid.Col>
				<Grid.Col span={9}>
					{treatmentId ? (
						<Box mt="sm">
							<TreatmentAddMedicineForm
								medicines={medicines}
								module={module}
								setMedicines={setMedicines}
							/>
						</Box>
					) : (
						<Flex h="100%" w="100%" ta="center" align="center" justify="center" mt="sm">
							<Text fz="sm" c="var(--theme-secondary-color)">
								{t("NoTreatmentSelected")}
							</Text>
						</Flex>
					)}
				</Grid.Col>
			</Grid>
		</GlobalDrawer>
	);
}
