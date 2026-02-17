import {Box, Stack, Table, Group, Text, ScrollArea, Highlight} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Checkbox } from "@mantine/core";
import ReportSubmission from "../ReportSubmission";
import { useOutletContext, useParams } from "react-router-dom";
import DatePickerForm from "@components/form-builders/DatePicker";
import { useTranslation } from "react-i18next";
import { modals } from "@mantine/modals";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch } from "react-redux";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { ERROR_NOTIFICATION_COLOR, MODULES, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { successNotification } from "@components/notification/successNotification";
import { formatDateForMySQL } from "@utils/index";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import {RichTextEditor} from "@mantine/tiptap";
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';

import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import {useEditor} from "@tiptap/react";
import {useEffect} from "react";


const module = MODULES.LAB_TEST;

// =============== sars cov2 results are now handled as individual boolean properties ===============
export default function HtmlReportEditor({
	diagnosticReport,
	refetchDiagnosticReport,
	refetchLabReport,
}) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};
	const is_completed = diagnosticReport?.process === "Done";
	const content = custom_report?.findings;
	const editor = useEditor({
		extensions: [StarterKit, Highlight, Superscript,
			SubScript,TextAlign.configure({ types: ['heading', 'paragraph'] })],
		content,
		shouldRerenderOnTransaction: true,
	});
	useEffect(() => {
		if (editor) {
			editor.commands.setContent(content);
		}
	}, [content, editor,reportId]);

	const form = useForm({
		initialValues: {
			findings: custom_report?.findings || "",
			comment: diagnosticReport?.comment || "",
		},
	});

	const handleSubmit = (values) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmModal(values),
		});
	};

	async function handleConfirmModal(values) {
		form.setFieldValue("findings", editor?.getHTML() || "");
		values["findings"] = editor?.getHTML() || ""

		try {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.UPDATE}/${reportId}`,
				data: {
					json_content: {
						...values,
						test_date: formatDateForMySQL(values.test_date),
					},
					comment: values.comment,
				},
				module,
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					console.error("Field Error occurred!", errorObject);
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				dispatch(setRefetchData({ module, refetching: true }));
				refetchDiagnosticReport();
				if (refetchLabReport && typeof refetchLabReport === "function") {
					refetchLabReport();
				}
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				return resultAction.payload?.data;
			}
			return false;
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	return (
		<Box className="border-top-none" px="sm" mt="xs">
			<ScrollArea  scrollbarSize={2} scrollbars="y">
				<Stack gap="md">
					<Box my="xs">
						<RichTextEditor editor={editor} variant="subtle" h={mainAreaHeight-260}>
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
					{/* =============== text date =============== */}
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} submissionFunc={handleConfirmModal} handleSubmit={handleSubmit} />
		</Box>
	);
}
