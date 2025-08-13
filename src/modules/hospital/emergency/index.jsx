import { Box, Flex, Grid } from "@mantine/core";
import Navigation from "@components/layout/Navigation";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { useOutletContext } from "react-router-dom";
import Form from "./form/_Form";
import VisitTable from "./_Table";
import ActionButtons from "../common/_ActionButtons";
import { useForm } from "@mantine/form";
import { getVendorFormInitialValues } from "./helpers/request";
import { useTranslation } from "react-i18next";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { useState } from "react";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";
import { useDispatch } from "react-redux";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@/common/components/core-component/showNotificationComponent";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { notifications } from "@mantine/notifications";

const module = MODULES.EMERGENCY;
const LOCAL_STORAGE_KEY = "patientFormData";

export default function Index() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const form = useForm(getVendorFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
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
					showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 1000, true);
				} else {
					showNotificationComponent(t("Visit saved successfully"), "green", "lightgray", true, 1000, true);
					setRefetchData({ module, refetching: true });
					form.reset();
					localStorage.removeItem(LOCAL_STORAGE_KEY);
				}
			} catch (error) {
				console.error("Error submitting visit:", error);
				showNotificationComponent(t("Something went wrong"), "red", "lightgray", true, 1000, true);
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
						<Grid w="100%" columns={24}>
							<Grid.Col span={8}>
								<Form form={form} />
							</Grid.Col>
							<Grid.Col span={16}>
								<VisitTable />
								<ActionButtons form={form} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
