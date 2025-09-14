import { Button, Grid, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import CompactDrawer from "@components/drawers/CompactDrawer";
import { useDisclosure } from "@mantine/hooks";
import RequiredAsterisk from "@components/form-builders/RequiredAsterisk";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import SelectForm from "@components/form-builders/SelectForm";
import { hasLength, useForm } from "@mantine/form";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import InputAutoComplete from "@components/form-builders/InputAutoComplete";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { errorNotification } from "@/common/components/notification/errorNotification";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { successNotification } from "@/common/components/notification/successNotification";
import { useDispatch } from "react-redux";

export default function PatientReferredAction({ module = "emergency", invoiceId }) {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const roomReferredForm = useForm({
		initialValues: {
			opd_room_id: "",
			comment: "",
		},
		validate: {
			comment: hasLength({ min: 1 }),
		},
	});
	const admissionReferredForm = useForm({
		initialValues: {
			comment: "",
		},
		validate: {
			comment: hasLength({ min: 1 }),
		},
	});
	const referredForm = useForm({
		initialValues: {
			referred_id: null,
			referred_name: "",
			hospital: "",
			comment: "",
		},
		validate: {
			comment: hasLength({ min: 1 }),
		},
	});
	const [openedReferred, { open: openReferred, close: closeReferred }] = useDisclosure(false);
	const [openedAdmission, { open: openAdmission, close: closeAdmission }] = useDisclosure(false);
	const [openedRoomReferred, { open: openRoomReferred, close: closeRoomReferred }] = useDisclosure(false);

	const { data: roomsOptions } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_OPD_ROOM.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_OPD_ROOM.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_OPD_ROOM.UTILITY,
	});

	const { data: referredRoomsOptions } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_OPD_REFERRED_ROOM.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_OPD_REFERRED_ROOM.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_OPD_REFERRED_ROOM.UTILITY,
	});

	const { data: doctorsOption } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_DOCTOR.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_DOCTOR.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_DOCTOR.UTILITY,
	});

	const { data: hospitalsOption } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.HOSPITAL.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.HOSPITAL.TYPE },
		utility: HOSPITAL_DROPDOWNS.HOSPITAL.UTILITY,
	});

	// =============== handle doctor selection change ================
	const handleDoctorChange = (selectedName) => {
		const selectedDoctor = doctorsOption?.find((doctor) => doctor.label === selectedName) || null;

		referredForm.setFieldValue("referred_id", selectedDoctor?.value);
		referredForm.setFieldValue("referred_name", selectedDoctor?.label || selectedName);
	};

	const handleHospitalChange = (selectedName) => {
		const selectedHospital = hospitalsOption?.find((hospital) => hospital.label === selectedName) || null;

		referredForm.setFieldValue("hospital", selectedHospital?.value || selectedName);
	};

	const handleRoomReferredSubmit = (values) => {
		handleConfirmSubmission({ ...values, referred_mode: "room" });
		closeRoomReferred();
	};

	const handleAdmissionReferredSubmit = (values) => {
		handleConfirmSubmission({ ...values, referred_mode: "admission" });
		closeAdmission();
	};

	const handleReferredSubmit = (values) => {
		handleConfirmSubmission({ ...values, referred_mode: "referred" });
		closeReferred();
	};

	async function handleConfirmSubmission(values) {
		try {
			const value = {
				url: `${MASTER_DATA_ROUTES.API_ROUTES.OPERATIONAL_API.REFERRED}/${invoiceId}`,
				data: { ...values },
				module,
			};
			const resultAction = await dispatch(storeEntityData(value));
			if (storeEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					referredForm.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				referredForm.reset();
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	return (
		<>
			<Button.Group>
				<Button
					px="xs"
					variant="filled"
					color="var(--theme-warn-color-6)"
					bg="var(--theme-warn-color-6)"
					onClick={openRoomReferred}
				>
					{t("RoomReferred")}
				</Button>
				<Button
					px="xs"
					variant="filled"
					color="var(--theme-primary-color-6)"
					bg="var(--theme-primary-color-5)"
					onClick={openAdmission}
				>
					{t("Admission")}
				</Button>
				<Button
					px="xs"
					variant="filled"
					color="var(--theme-delete-color)"
					bg="var(--theme-delete-color)"
					onClick={openReferred}
				>
					{t("Referred")}
				</Button>
			</Button.Group>
			{/* ----------- referred drawer section --------- */}
			<CompactDrawer
				opened={openedReferred}
				close={closeReferred}
				position="right"
				size="30%"
				keepMounted={false}
				bg="white"
				title={t("Referred")}
				form={referredForm}
				save={handleReferredSubmit}
			>
				<Grid align="center" columns={20}>
					<Grid.Col span={7}>
						<Text fz="sm">{t("Hospital")}</Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<InputAutoComplete
							tooltip={t("HospitalValidateMessage")}
							label=""
							data={hospitalsOption}
							value={referredForm.values.hospital}
							changeValue={handleHospitalChange}
							placeholder={t("Hospital")}
							required
							nextField="referred_name"
							form={referredForm}
							name="hospital"
							mt={0}
							id="hospital"
						/>
					</Grid.Col>
					<Grid.Col span={7}>
						<Text fz="sm">{t("ReferredName")}</Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<InputAutoComplete
							tooltip={t("ReferredNameValidateMessage")}
							label=""
							data={doctorsOption}
							value={referredForm.values.referred_id}
							changeValue={handleDoctorChange}
							placeholder={t("ReferredName")}
							required
							nextField="name"
							form={referredForm}
							name="referred_name"
							mt={0}
							id="referred_name"
						/>
					</Grid.Col>
					<Grid.Col span={7}>
						<Text fz="sm">{t("Comment")}</Text> <RequiredAsterisk />
					</Grid.Col>
					<Grid.Col span={13}>
						<TextAreaForm
							tooltip={t("Comment")}
							label=""
							placeholder={t("DummyMessage")}
							nextField="name"
							form={referredForm}
							name="comment"
							mt={0}
							id="comment"
							required
							showRightSection={false}
							style={{ input: { height: 100 } }}
						/>
					</Grid.Col>
				</Grid>
			</CompactDrawer>
			{/* --------- admission drawer section ---------- */}
			<CompactDrawer
				opened={openedAdmission}
				close={closeAdmission}
				position="right"
				size="30%"
				keepMounted={false}
				bg="white"
				title={t("Admission")}
				form={admissionReferredForm}
				save={handleAdmissionReferredSubmit}
			>
				<Grid align="center" columns={20}>
					<Grid.Col span={7}>
						<Text fz="sm">{t("Comment")}</Text> <RequiredAsterisk />
					</Grid.Col>
					<Grid.Col span={13}>
						<TextAreaForm
							tooltip={t("Comment")}
							label=""
							placeholder={t("DummyMessage")}
							nextField="name"
							form={admissionReferredForm}
							name="comment"
							mt={0}
							id="comment"
							showRightSection={false}
							required
							style={{ input: { height: 100 } }}
						/>
					</Grid.Col>
				</Grid>
			</CompactDrawer>
			{/* --------- room referred drawer section ---------- */}
			<CompactDrawer
				save={handleRoomReferredSubmit}
				form={roomReferredForm}
				opened={openedRoomReferred}
				close={closeRoomReferred}
				position="right"
				size="30%"
				keepMounted={false}
				bg="white"
				title={t("RoomReferred")}
			>
				<Grid align="center" columns={20}>
					<Grid.Col span={7}>
						<Text fz="sm">{t("Room")}<RequiredAsterisk /></Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<SelectForm
							dropdownValue={referredRoomsOptions}
							value={roomReferredForm.values.opd_room_id}
							changeValue={(v) => roomReferredForm.setFieldValue("opd_room_id", v)}
							tooltip={t("RoomValidateMessage")}
							label=""
							placeholder={t("Room")}
							required
							nextField="comment"
							form={roomReferredForm}
							name="opd_room_id"
							mt={0}
							id="room_no"
						/>
					</Grid.Col>{" "}
					<Grid.Col span={7}>
						<Text fz="sm">{t("Comment")}<RequiredAsterisk /></Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<TextAreaForm
							tooltip={t("Comment")}
							label=""
							placeholder={t("DummyMessage")}
							nextField="comment"
							form={roomReferredForm}
							name="comment"
							mt={0}
							id="comment"
							showRightSection={false}
							required
							style={{ input: { height: 100 } }}
						/>
					</Grid.Col>
				</Grid>
			</CompactDrawer>
		</>
	);
}
