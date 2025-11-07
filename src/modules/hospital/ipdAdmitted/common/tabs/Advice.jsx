import TabSubHeading from "@hospital-components/TabSubHeading";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { Badge, Box, Flex, Grid, LoadingOverlay, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useOutletContext, useParams } from "react-router-dom";
import TabsActionButtons from "@hospital-components/TabsActionButtons";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES_CORE } from "@/constants";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@/common/components/notification/successNotification";
import { errorNotification } from "@/common/components/notification/errorNotification";
import { useDispatch } from "react-redux";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Advice() {
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const { id } = useParams();
	const { t } = useTranslation();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm({
		initialValues: {
			advice: "",
		},
	});

	const {
		data: adviceData,
		refetch: refetchAdviceData,
		isLoading,
	} = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.TRANSACTION}/${id}`,
		params: {
			mode: "advice",
		},
	});

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			const formValue = {
				json_content: [{ name: "Advice", value: form.values?.advice }],
				ipd_module: "advice",
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PROCESS}/${id}`,
				data: formValue,
				params: {
					mode: "advice",
				},
				module: MODULES_CORE.ADVICE,
			};

			const resultAction = await dispatch(storeEntityData(value)).unwrap();

			if (resultAction.status === 200) {
				successNotification(t("AdviceAddedSuccessfully"));
				await refetchAdviceData();
				form.reset();
			} else {
				errorNotification(t("AdviceAddedFailed"));
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Box h={mainAreaHeight - 63} p="xs">
			<Grid columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%" } }}>
				<Grid.Col span={8} h="100%">
					<TabSubHeading title="Advice" bg="var(--theme-primary-color-0)" />
					<Box bg="var(--theme-primary-color-0)" p="3xs" h={mainAreaHeight - 63 - 70}>
						<TextAreaForm
							label=""
							placeholder="Complaining of high fever, sore throat, and body ache since yesterday."
							rows={10}
							className="borderRadiusAll"
							form={form}
							name="advice"
							showRightSection={false}
							style={{ input: { height: mainAreaHeight - 63 - 140 }, label: { marginBottom: "4px" } }}
						/>
						<TabsActionButtons
							isSubmitting={isSubmitting}
							handleReset={() => {}}
							handleSave={handleSubmit}
						/>
					</Box>
				</Grid.Col>
				<Grid.Col span={16}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Advice Details" />
						<Box p="xs" pos="relative" h={mainAreaHeight - 138}>
							<LoadingOverlay
								visible={isLoading}
								zIndex={1000}
								overlayProps={{ radius: "sm", blur: 2 }}
							/>
							{adviceData?.data?.length === 0 && (
								<Flex h="100%" justify="center" align="center">
									<Text fz="sm">{t("NoDataAvailable")}</Text>
								</Flex>
							)}
							{adviceData?.data?.map((item, index) => (
								<Flex key={index} gap="xs" mb="3xs">
									<Text>{index + 1}.</Text>
									<Box w="100%">
										<Badge variant="light" size="md" color="var(--theme-secondary-color-7)">
											{item.created}
										</Badge>
										<Box mt="es" fz="sm">
											{item?.invoice_particular?.map((particular, idx) => (
												<Flex key={idx} justify="space-between" align="center">
													<Text fz="xs">
														{idx + 1}. {particular.name}
													</Text>
												</Flex>
											))}
										</Box>
									</Box>
								</Flex>
							))}
						</Box>
					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
