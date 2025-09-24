import EmergencyPatientForm from "../../common/__EmergencyPatientForm";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { getVendorFormInitialValues } from "../helpers/request";
import { useState } from "react";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useDispatch } from "react-redux";
import { formatDOB, getLoggedInUser } from "@/common/utils";

const LOCAL_STORAGE_KEY = "emergencyPatientFormData";

export default function _Form({ module }) {
	const dispatch = useDispatch();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { t } = useTranslation();
	const form = useForm(getVendorFormInitialValues(t));
	const [showUserData, setShowUserData] = useState(false);
	const [resetKey, setResetKey] = useState(0);
	const handleSubmit = async () => {
		if (!form.validate().hasErrors) {
			setIsSubmitting(true);

			if (!form.values.amount && form.values.patient_payment_mode_id == "30") {
				showNotificationComponent(t("AmountsRequired"), "red", "lightgray", true, 700, true);
				setIsSubmitting(false);
				return {};
			}

			try {
				const createdBy = getLoggedInUser();
				const options = { year: "numeric", month: "2-digit", day: "2-digit" };
				const formattedDOB = formatDOB(form.values.dob);
				const [day, month, year] = formattedDOB.split("-").map(Number);
				const dateObj = new Date(year, month - 1, day);

				const today = new Date();

				// strict validation: check if JS normalized it
				const isValid =
					dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day;

				// check if future date
				if (dateObj > today) {
					showNotificationComponent(t("DateOfBirthCantBeFutureDate"), "red", "lightgray", true, 700, true);
					setIsSubmitting(false);
					return {};
				}

				const formValue = {
					...form.values,
					created_by_id: createdBy?.id,
					dob: isValid ? dateObj.toLocaleDateString("en-CA", options) : "invalid",
					appointment: new Date(form.values.appointment).toLocaleDateString("en-CA", options),
				};

				const data = {
					url: HOSPITAL_DATA_ROUTES.API_ROUTES.EMERGENCY.CREATE,
					data: formValue,
					module,
				};

				const resultAction = await dispatch(storeEntityData(data));

				if (storeEntityData.rejected.match(resultAction)) {
					showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 700, true);
					return {};
				} else {
					showNotificationComponent(t("Emergency saved successfully"), "green", "lightgray", true, 700, true);
					setRefetchData({ module, refetching: true });
					form.reset();
					localStorage.removeItem(LOCAL_STORAGE_KEY);
					setResetKey((prev) => prev + 1);
					setShowUserData(false);
					return resultAction.payload.data;
				}
			} catch (error) {
				console.error("Error submitting emergency:", error);
				showNotificationComponent(t("SomethingWentWrong"), "red", "lightgray", true, 700, true);
				return {};
			} finally {
				setIsSubmitting(false);
			}
		} else {
			if (Object.keys(form.errors)?.length > 0 && form.isDirty()) {
				console.error(form.errors);
				showNotificationComponent(t("PleaseFillAllFieldsToSubmit"), "red", "lightgray", true, 700, true);
			}
			return {};
		}
	};

	return (
		<EmergencyPatientForm
			form={form}
			module={module}
			handleSubmit={handleSubmit}
			isSubmitting={isSubmitting}
			showUserData={showUserData}
			setShowUserData={setShowUserData}
			resetKey={resetKey}
			setResetKey={setResetKey}
		/>
	);
}
