import { Button, Grid, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import CompactDrawer from "@components/drawers/CompactDrawer";
import { useDisclosure } from "@mantine/hooks";
import RequiredAsterisk from "@components/form-builders/RequiredAsterisk";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import SelectForm from "@components/form-builders/SelectForm";
import { useForm } from "@mantine/form";
import { getPatientReportFormInitialValues } from "../prescription/helpers/request";

const roomsOptions = [
	{ value: "101", label: "101" },
	{ value: "102", label: "102" },
	{ value: "103", label: "103" },
	{ value: "104", label: "104" },
	{ value: "105", label: "105" },
];

const referredOptions = [
	{ value: "Dr. John Doe", label: "Dr. John Doe" },
	{ value: "Dr. Jane Smith", label: "Dr. Jane Smith" },
	{ value: "Dr. Jim Beam", label: "Dr. Jim Beam" },
];

export default function PatientReferredAction() {
	const { t } = useTranslation();
	const form = useForm(getPatientReportFormInitialValues());
	const [openedReferred, { open: openReferred, close: closeReferred }] = useDisclosure(false);
	const [openedAdmission, { open: openAdmission, close: closeAdmission }] = useDisclosure(false);
	const [openedRoomReferred, { open: openRoomReferred, close: closeRoomReferred }] = useDisclosure(false);

	const handleSubmit = (values) => {
		if (values === "referred") {
			const formValues = {
				referred_name: form.values.referred_name,
				comment: form.values.referred_comment,
			};
			console.log(formValues);
			closeReferred();
		} else if (values === "admission") {
			const formValues = {
				comment: form.values.admission_comment,
			};
			console.log(formValues);
			closeAdmission();
		} else if (values === "room_referred") {
			const formValues = {
				room_no: form.values.room_no,
				comment: form.values.room_comment,
			};
			console.log(formValues);
			closeRoomReferred();
		}
	};

	return (
		<>
			<Button.Group>
				<Button
					w="30%"
					px="xs"
					variant="filled"
					color="var(--theme-primary-color-6)"
					bg="var(--theme-primary-color-6)"
					onClick={openReferred}
				>
					{t("Referred")}
				</Button>
				<Button
					w="32%"
					px="xs"
					variant="filled"
					color="var(--theme-primary-color-6)"
					bg="var(--theme-secondary-color-5)"
					onClick={openAdmission}
				>
					{t("Admission")}
				</Button>
				<Button
					w="38%"
					px="xs"
					variant="filled"
					color="var(--theme-primary-color-6)"
					bg="var(--theme-secondary-color-8)"
					onClick={openRoomReferred}
				>
					{t("RoomReferred")}
				</Button>
			</Button.Group>
			{/* ----------- referred drawer section --------- */}
			<CompactDrawer
				opened={openedReferred}
				close={closeReferred}
				save={() => handleSubmit("referred")}
				position="right"
				size="30%"
				keepMounted={false}
				bg="white"
				title={t("Referred")}
			>
				<Grid align="center" columns={20}>
					<Grid.Col span={7}>
						<Text fz="sm">
							{t("ReferredName")} <RequiredAsterisk />
						</Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<SelectForm
							tooltip={t("ReferredNameValidateMessage")}
							label=""
							dropdownValue={referredOptions}
							value={form.values.referred_name}
							changeValue={(v) => form.setFieldValue("referred_name", v)}
							placeholder={t("ReferredName")}
							required={true}
							nextField="name"
							form={form}
							name="referred_name"
							mt={0}
							id="referred_name"
						/>
					</Grid.Col>
					<Grid.Col span={7}>
						<Text fz="sm">{t("Comment")}</Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<TextAreaForm
							tooltip={t("Comment")}
							label=""
							placeholder={t("DummyMessage")}
							nextField="name"
							form={form}
							name="referred_comment"
							mt={0}
							id="comment"
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
				save={() => handleSubmit("admission")}
				position="right"
				size="30%"
				keepMounted={false}
				bg="white"
				title={t("Admission")}
			>
				<Grid align="center" columns={20}>
					<Grid.Col span={7}>
						<Text fz="sm">{t("Comment")}</Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<TextAreaForm
							tooltip={t("Comment")}
							label=""
							placeholder={t("DummyMessage")}
							nextField="name"
							form={form}
							name="admission_comment"
							mt={0}
							id="comment"
							showRightSection={false}
							style={{ input: { height: 100 } }}
						/>
					</Grid.Col>
				</Grid>
			</CompactDrawer>
			{/* --------- room referred drawer section ---------- */}
			<CompactDrawer
				opened={openedRoomReferred}
				close={closeRoomReferred}
				save={() => handleSubmit("room_referred")}
				position="right"
				size="30%"
				keepMounted={false}
				bg="white"
				title={t("RoomReferred")}
			>
				<Grid align="center" columns={20}>
					<Grid.Col span={7}>
						<Text fz="sm">
							{t("RoomNo")} <RequiredAsterisk />
						</Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<SelectForm
							dropdownValue={roomsOptions}
							value={form.values.room_no}
							changeValue={(v) => form.setFieldValue("room_no", v)}
							tooltip={t("RoomNoValidateMessage")}
							label=""
							placeholder={t("RoomNo")}
							required={true}
							nextField="name"
							form={form}
							name="room_no"
							mt={0}
							id="room_no"
						/>
					</Grid.Col>{" "}
					<Grid.Col span={7}>
						<Text fz="sm">{t("Comment")}</Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<TextAreaForm
							tooltip={t("Comment")}
							label=""
							placeholder={t("DummyMessage")}
							nextField="name"
							form={form}
							name="room_comment"
							mt={0}
							id="comment"
							showRightSection={false}
							style={{ input: { height: 100 } }}
						/>
					</Grid.Col>
				</Grid>
			</CompactDrawer>
		</>
	);
}
