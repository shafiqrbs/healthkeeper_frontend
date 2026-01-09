import { Box, Button, Flex, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import SelectForm from "@components/form-builders/SelectForm";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DateTimePickerForm from "@components/form-builders/DateTimePicker";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import {useEffect} from "react";
import {formatDate, formatDateTime} from "@utils/index";

export default function DeathCertificate({ data,refetch }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const { diseasesProfile } = useAppLocalStore();

	const diseaseOptions = diseasesProfile?.map((disease) => ({
		value: disease.name,
		label: disease.name,
	}));
	console.log( data?.cause_death);
	const form = useForm({
		initialValues: {
			diseases_profile: '',
			cause_death:'',
			about_death:'',
			death_date_time: new Date(),
		},

		validate: {
			diseases_profile: (value) => {
				if (!value) {
					return t("DiseasesProfileRequired");
				}
				return null;
			},
			about_death: (value) => {
				if (!value) {
					return t("AboutDeathRequired");
				}
				return null;
			},
			cause_death: (value) => {
				if (!value) {
					return t("CauseofDeathRequired");
				}
				return null;
			},
			death_date_time: (value) => {
				if (!value) {
					return t("DeathDateTimeRequired");
				}
				return null;
			},
		},
	});

	useEffect(() => {
		form.setValues({
			diseases_profile: data?.diseases_profile,
			cause_death: data?.cause_death,
			about_death: data?.about_death,
			death_date_time: new Date(),
		});
	}, [data]);

	const handleSubmit = async (values) => {
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
				refetch()
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	};

	return (
		<Box bg="var(--mantine-color-white" p="xl" component="form" onSubmit={form.onSubmit(handleSubmit)}>
			<Text size="lg" fw={600} mb="md">
				Death Certificate
			</Text>
			<Box h={mainAreaHeight - 200}>
				<SelectForm
					mt="sm"
					form={form}
					value={form?.values?.diseases_profile}
					name="diseases_profile"
					tooltip="Diseases profile is required"
					label="Diseases profile"
					placeholder="Select Diseases profile"
					dropdownValue={diseaseOptions}
				/>
				<TextAreaForm
					mt="sm"
					label="About Death"
					name="about_death"
					form={form}
					value={form?.values?.about_death}
					placeholder="About Death"
					tooltip={t("Death date & time is required")}
				/>
				<TextAreaForm
					mt="sm"
					label="Cause of death"
					name="cause_death"
					form={form}
					value={form?.values?.cause_death}
					placeholder="Cause of death"
					tooltip={t("Cause of death is required")}
				/>
				<DateTimePickerForm
					mt="sm"
					value={form?.values?.death_date_time}
					tooltip="Death date & time is required"
					label="Death Date & Time"
					name="death_date_time"
					form={form}
					placeholder="Death Date & Time"
				/>
			</Box>
			<Box>
				<Flex gap="sm" justify="flex-end" mt="md">
					<Button type="button" bg="var(--theme-secondary-color-6)" color="white">
						Cancel
					</Button>
					<Button type="submit" bg="var(--theme-primary-color-6)" color="white">
						Save
					</Button>
				</Flex>
			</Box>
		</Box>
	);
}
