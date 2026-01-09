import {storeEntityData, updateEntityData} from "@/app/store/core/crudThunk";
import {ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR} from "@/constants";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { errorNotification } from "@components/notification/errorNotification";
import { successNotification } from "@components/notification/successNotification";
import { Box, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extensions";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import TextAreaForm from "@components/form-builders/TextAreaForm";

function Referred({ data }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const form = useForm({
		initialValues: { reason: "" },
		validate: {
			reason: (value) => {
				if (!value) return "Reason is required";
			},
		},
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { id } = useParams();
	const [refetchBillingKey, setRefetchBillingKey] = useState(0);

	const handleReferredSubmit = async (values) => {
		try {
			const result = await dispatch(
				updateEntityData({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PRESCRIPTION}/${data?.prescription_uid}`,
					data: values,
					module: "admission",
				})
			);
			if (updateEntityData.rejected.match(result)) {
				const fieldErrors = result.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(result)) {
				successNotification(t("UpdatedSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	};
	useEffect(() => {
		form.setValues({
			reason: data?.reason,
		});
	}, [data]);


	return (
		<Box bg="var(--mantine-color-white)" h={mainAreaHeight - 16} p="xs">
			<Box pr="xs" my="xs" h={240}>
				<Box component="form" h="100%" onSubmit={form.onSubmit(handleReferredSubmit)}>
					<Box className="tiptap-wrapper">
						<TextAreaForm
							mt="sm"
							label="Referred Reason"
							name="reason"
							form={form}
							value={form?.values?.reason}
							placeholder="Referred Reason"
							tooltip={t('Death date & time is required')}
						/>
					</Box>
					<Box mt="lg" style={{ display: "flex", justifyContent: "flex-end" }}>
						<Button size="sm" type="submit" bg="var(--theme-secondary-color-6)" loading={isSubmitting}>
							{t("Save")}
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default Referred;
