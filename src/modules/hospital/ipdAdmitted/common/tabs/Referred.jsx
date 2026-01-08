import { storeEntityData } from "@/app/store/core/crudThunk";
import { ERROR_NOTIFICATION_COLOR } from "@/constants";
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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";

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

	const handleReferredSubmit = async () => {
		try {
			setIsSubmitting(true);
			if (!form.values?.reason) {
				errorNotification(t("PleaseFillAllFieldsToSubmit"), ERROR_NOTIFICATION_COLOR);
				setIsSubmitting(false);
				return;
			}
			const formValue = {
				invoiceId: id,
				patientId: data?.patient_id,
				reason: form.values?.reason,
				process: "referred",
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PROCESS}/${id}`,
				data: formValue,
				module: "admission",
			};

			const resultAction = await dispatch(storeEntityData(value)).unwrap();

			if (resultAction.status === 200) {
				successNotification(t("ReferredUpdatedSuccessfully"));
				// await refetchInvestigationData();
				setRefetchBillingKey(refetchBillingKey + 1);
				form.reset();
			} else {
				errorNotification(t("ReferredUpdateFailed"));
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const editor = useEditor({
		extensions: [
			StarterKit,
			Highlight,
			Superscript,
			Subscript,
			Placeholder.configure({ placeholder: "Enter the referred reason here..." }),
			TextAlign.configure({ types: ["heading", "paragraph"] }),
		],
		content: form.values.reason || "",
		shouldRerenderOnTransaction: true,
		onUpdate: ({ editor }) => {
			// =============== sync editor content to form field when editor changes ================
			const htmlContent = editor.getHTML();
			form.setFieldValue("reason", htmlContent);
		},
	});

	return (
		<Box bg="var(--mantine-color-white)" h={mainAreaHeight - 16} p="xs">
			<Box pr="xs" my="xs" h={240}>
				<Box component="form" h="100%" onSubmit={form.onSubmit(handleReferredSubmit)}>
					<Box className="tiptap-wrapper">
						<RichTextEditor editor={editor} variant="subtle">
							<RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
								<RichTextEditor.ControlsGroup>
									<RichTextEditor.Bold />
									<RichTextEditor.Italic />
									<RichTextEditor.Strikethrough />
									<RichTextEditor.ClearFormatting />
								</RichTextEditor.ControlsGroup>
								<RichTextEditor.ControlsGroup>
									<RichTextEditor.H1 />
									<RichTextEditor.H2 />
									<RichTextEditor.H3 />
									<RichTextEditor.H4 />
								</RichTextEditor.ControlsGroup>
								<RichTextEditor.ControlsGroup>
									<RichTextEditor.Blockquote />
									<RichTextEditor.Hr />
									<RichTextEditor.BulletList />
									<RichTextEditor.OrderedList />
								</RichTextEditor.ControlsGroup>
								<RichTextEditor.ControlsGroup>
									<RichTextEditor.AlignLeft />
									<RichTextEditor.AlignCenter />
									<RichTextEditor.AlignJustify />
									<RichTextEditor.AlignRight />
								</RichTextEditor.ControlsGroup>
							</RichTextEditor.Toolbar>
							<RichTextEditor.Content />
						</RichTextEditor>
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
