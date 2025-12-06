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
import useAppLocalStore from "@hooks/useAppLocalStore";

const referredModes = [
	{ value: "room", label: "Room" },
	{ value: "admission", label: "Admission" },
	{ value: "hospital", label: "Hospital" },
];

export default function PatientReferredAction({ module = "emergency", invoiceId, form }) {
	const { features } = useAppLocalStore();

	const dispatch = useDispatch();
	const { t } = useTranslation();
	const roomReferredForm = useForm({
		initialValues: {
			referred_mode: "room",
			hospital: "",
			opd_room_id: "",
			comment: "",
		},
		validate: {
			comment: hasLength({ min: 1 }),
		},
	});
	const [openedRoomReferred, { open: openRoomReferred, close: closeRoomReferred }] = useDisclosure(false);

	const referredModeValue = roomReferredForm.values.referred_mode;
	const isRoomModeSelected = referredModeValue === "room";
	const isHospitalModeSelected = referredModeValue === "hospital";
	// =============== show hospital field only when hospital mode is selected ================
	const shouldShowHospitalField = isHospitalModeSelected;
	// =============== show room field only when room mode is selected ================
	const shouldShowRoomField = isRoomModeSelected;

	const { data: referredRoomsOptions } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_OPD_REFERRED_ROOM.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_OPD_REFERRED_ROOM.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_OPD_REFERRED_ROOM.UTILITY,
	});

	const { data: hospitalsOption } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.HOSPITAL.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.HOSPITAL.TYPE },
		utility: HOSPITAL_DROPDOWNS.HOSPITAL.UTILITY,
	});

	const handleHospitalChange = (selectedName) => {
		const selectedHospital = hospitalsOption?.find((hospital) => hospital.label === selectedName) || null;

		roomReferredForm.setFieldValue("hospital", selectedHospital?.value || selectedName);
	};

	const handleRoomReferredSubmit = (values) => {
		handleConfirmSubmission({ ...values });
		closeRoomReferred();
		form.setFieldValue("comment", values.comment);
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
					roomReferredForm.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				roomReferredForm.reset();
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
					{t("Referred")}
				</Button>
			</Button.Group>
			{/* --------- room referred drawer section ---------- */}
			<CompactDrawer
				save={handleRoomReferredSubmit}
				form={roomReferredForm}
				opened={openedRoomReferred}
				close={closeRoomReferred}
				position="right"
				size="50%"
				keepMounted={false}
				bg="var(--mantine-color-white)"
				title={t("ReferredTo")}
			>
				<Grid align="center" columns={20}>
					<Grid.Col span={7}>
						<Text fz="sm">
							{t("ReferredTo")}
							<RequiredAsterisk />
						</Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<SelectForm
							form={roomReferredForm}
							label=""
							id="referred_mode"
							name="referred_mode"
							dropdownValue={referredModes}
							value={roomReferredForm.values.referred_mode}
							defaultValue="Room"
							placeholder={t("ReferredTo")}
							tooltip={t("EnterMeditationDurationMode")}
							withCheckIcon={false}
						/>
					</Grid.Col>
					{shouldShowHospitalField && (
						<>
							<Grid.Col span={7}>
								<Text fz="sm">
									{t("Hospital")}
									<RequiredAsterisk />
								</Text>
							</Grid.Col>
							<Grid.Col span={13}>
								<InputAutoComplete
									tooltip={t("HospitalValidateMessage")}
									label=""
									data={hospitalsOption}
									value={roomReferredForm.values.referredTo}
									changeValue={handleHospitalChange}
									placeholder={t("ReferredTo")}
									required
									nextField="referred_name"
									form={roomReferredForm}
									name="hospital"
									mt={0}
									id="hospital"
								/>
							</Grid.Col>
						</>
					)}
					{shouldShowRoomField && (
						<>
							<Grid.Col span={7}>
								<Text fz="sm">
									{t("Room")}
									<RequiredAsterisk />
								</Text>
							</Grid.Col>
							<Grid.Col span={13}>
								<SelectForm
									dropdownValue={referredRoomsOptions}
									value={roomReferredForm.values.opd_room_id}
									changeValue={(selectedRoomId) =>
										roomReferredForm.setFieldValue("opd_room_id", selectedRoomId)
									}
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
							</Grid.Col>
						</>
					)}
					<Grid.Col span={7}>
						<Text fz="sm">
							{t("Comment")}
							<RequiredAsterisk />
						</Text>
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
