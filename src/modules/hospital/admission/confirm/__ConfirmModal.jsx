import { useNavigate, useOutletContext } from "react-router-dom";

import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Button, Flex, Grid, ScrollArea, SegmentedControl, Stack, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import { useState } from "react";
import Cabin from "../common/Cabin";
import { useTranslation } from "react-i18next";
import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import SelectForm from "@components/form-builders/SelectForm";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import Bed from "../common/Bed";

const DEPARTMENT = [
	{
		id: 1,
		label: "Female Word",
		value: "female",
	},
	{
		id: 2,
		label: "Male Ward",
		value: "male",
	},
];

const UNITS = [
	{
		label: "RMU-1",
		value: "RMU-1",
	},
	{
		label: "RMU-2",
		value: "RMU-2",
	},
	{
		label: "RMU-3",
		value: "RMU-3",
	},
];

const CONSULTANTS = [
	{
		label: "Dr. Shafiqul Islam",
		value: "Dr. Shafiqul Islam",
	},
	{
		label: "Dr. Shihab Islam",
		value: "Dr. Shihab Islam",
	},
];

const DOCTORS = [
	{
		label: "Dr. Shafiqul Islam",
		value: "Dr. Shafiqul Islam",
	},
	{
		label: "Dr. Shihab Islam",
		value: "Dr. Shihab Islam",
	},
];

const DESIGNATION = [
	{
		label: "Cardiologist",
		value: "cardiologist",
	},
	{
		label: "Neurologist",
		value: "neurologist",
	},
];

export default function ConfirmModal({ opened, close, form }) {
	const navigate = useNavigate();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 140;
	const [selectedRoom, setSelectedRoom] = useState(null);
	const { t } = useTranslation();

	const handleRoomClick = (room) => {
		form.setFieldValue("roomNo", room);
		setSelectedRoom(room);
	};

	const handleTypeChange = (val) => {
		form.setFieldValue("roomType", val);
	};

	const handleSubmit = (values) => {
		console.log(values);
	};

	const handleAdmissionConfirmation = () => {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.ADMISSION.CONFIRM, { replace: true });
	};

	return (
		<GlobalDrawer opened={opened} close={close} title="Confirm Admission" size="90%">
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Box py="sm">
					<Grid columns={24}>
						<Grid.Col span={8}>
							{/* <Flex p="xs" gap="xs" bg="var(--theme-primary-color-0)" mb="sm">
								<TextInput
									leftSection={<IconSearch size={18} />}
									name="searchPatient"
									placeholder="Mr. Rafiqul Alam"
									w="100%"
								/>
								<Button miw={100}>Process</Button>
							</Flex> */}
							<TabsWithSearch
								tabList={["Cabin", "Bed"]}
								searchbarContainerBg="var(--theme-primary-color-1)"
								tabWidth="48%"
								tabPanels={[
									{
										tab: "Cabin",
										component: (
											<Cabin selectedRoom={selectedRoom} handleRoomClick={handleRoomClick} />
										),
									},
									{
										tab: "Bed",
										component: (
											<Bed selectedRoom={selectedRoom} handleRoomClick={handleRoomClick} />
										),
									},
								]}
							/>
						</Grid.Col>
						<Grid.Col span={8}>
							<ScrollArea h={height}>
								<Stack mih={height} className="form-stack-vertical">
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("RoomType")}:</Text>
										</Grid.Col>
										<Grid.Col span={14}>{}</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("RoomNo")}:</Text>
										</Grid.Col>
										<Grid.Col span={14}>{}</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("ReferredDoctor")}:</Text>
										</Grid.Col>
										<Grid.Col span={14}>{}</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Designation")}:</Text>
										</Grid.Col>
										<Grid.Col span={14}>{}</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Comment")}:</Text>
										</Grid.Col>
										<Grid.Col span={14}>{}</Grid.Col>
									</Grid>
								</Stack>
							</ScrollArea>
						</Grid.Col>
						<Grid.Col span={8}>
							<ScrollArea h={height}>
								<Stack mih={height} className="form-stack-vertical">
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("UnitName")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												label=""
												tooltip={t("EnterUnitName")}
												placeholder="R1234"
												name="unitName"
												id="unitName"
												value={form.values.unitName}
												dropdownValue={UNITS}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Department")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												label=""
												tooltip={t("EnterDepartment")}
												placeholder="Cardiology"
												name="department"
												id="department"
												value={form.values.department}
												dropdownValue={DEPARTMENT}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("AssignConsultant")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												label=""
												tooltip={t("EnterAssignConsultant")}
												placeholder="Dr. Shafiqul Islam"
												name="assignConsultant"
												id="assignConsultant"
												value={form.values.assignConsultant}
												dropdownValue={CONSULTANTS}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("AssignDoctor")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												label=""
												tooltip={t("EnterAssignDoctor")}
												placeholder="Dr. Shafiqul Islam"
												name="assignDoctor"
												id="assignDoctor"
												value={form.values.assignDoctor}
												dropdownValue={DOCTORS}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">{t("Comment")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<TextAreaForm
												form={form}
												label=""
												tooltip={t("EnterComment")}
												placeholder="Comment"
												name="comment2"
												id="comment2"
												nextField="dob"
												value={form.values.comment2}
												style={{ input: { height: "120px" } }}
											/>
										</Grid.Col>
									</Grid>
								</Stack>
							</ScrollArea>
						</Grid.Col>
						<Grid.Col span={24}>
							<Flex gap="xs" justify="flex-end">
								<Button type="button" bg="var(--theme-secondary-color-6)" color="white">
									{t("Print")}
								</Button>
								<Button type="submit" bg="var(--theme-primary-color-6)" color="white">
									{t("Confirm")}
								</Button>
								<Button type="button" bg="var(--theme-tertiary-color-6)" color="white" onClick={close}>
									{t("Cancel")}
								</Button>
								{/* <Button
									type="button"
									onClick={handleAdmissionConfirmation}
									bg="var(--theme-primary-color-6)"
									color="white"
								>
									{t("AdmissionConfirmation")}
								</Button> */}
							</Flex>
						</Grid.Col>
					</Grid>
				</Box>
			</form>
		</GlobalDrawer>
	);
}
