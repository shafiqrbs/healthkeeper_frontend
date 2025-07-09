import PhoneNumber from "@components/form-builders/PhoneNumberInput";
import InputForm from "@components/form-builders/InputForm";
import { Box, Flex, Grid, ScrollArea, SegmentedControl, Stack, Tabs, Text } from "@mantine/core";
import { useState } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { IconChevronRight } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";

export default function PatientForm({ form, handleSubmit }) {
	const { mainAreaHeight } = useOutletContext();
	const [gender, setGender] = useState("male");

	return (
		<Box w="100%" bg="white" py="xxs" style={{ borderRadius: "4px" }}>
			<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 34}>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Text px="sm" fw={600} fz="sm" pb="xs">
						Patient Information
					</Text>
					<Tabs
						variant="pills"
						color="var(--theme-primary-color-6)"
						defaultValue="new"
						bg="var(--theme-secondary-color-0)"
					>
						<Tabs.List p="sm">
							<Flex w="100%" justify="space-between">
								<Tabs.Tab w="32%" value="new">
									New
								</Tabs.Tab>
								<Tabs.Tab w="32%" value="report">
									Report
								</Tabs.Tab>
								<Tabs.Tab w="32%" value="re-visit">
									Re-Visit
								</Tabs.Tab>
							</Flex>
						</Tabs.List>

						<Tabs.Panel value="new" mt="sm">
							<Stack
								bd="3px solid white"
								bg="var(--theme-secondary-color-0)"
								style={{ borderRadius: "4px" }}
								px="sm"
								gap="xs"
							>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Appointment</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											tooltip="Book your appointment"
											placeholder="Appointment"
											required
											name="appointment"
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Patient Name</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											tooltip="Enter the patient's name"
											placeholder="Patient Name"
											required
											name="patientName"
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Mobile</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<PhoneNumber
											form={form}
											tooltip="Enter the patient's mobile number"
											placeholder="Mobile"
											required
											name="mobile"
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Gender</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<SegmentedControl
											color="var(--theme-primary-color-6)"
											value={gender}
											onChange={setGender}
											data={[
												{ label: "Male", value: "male" },
												{ label: "Female", value: "female" },
												{ label: "Other", value: "other" },
											]}
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Status</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<Flex gap="les">
											<InputForm
												form={form}
												placeholder="Height"
												name="height"
											/>
											<InputForm
												form={form}
												placeholder="Weight"
												name="weight"
											/>
											<InputForm form={form} placeholder="B/P" name="B/P" />
										</Flex>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Date of Birth</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<Flex gap="les">
											<InputForm
												form={form}
												placeholder="Date of Birth"
												name="dateOfBirth"
											/>
											<InputForm form={form} placeholder="Age" name="age" />
											<InputForm
												form={form}
												placeholder="Years"
												name="years"
											/>
										</Flex>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Identity</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											placeholder="NID/Birth Certificate"
											name="identity"
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">District</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<SelectForm
											form={form}
											placeholder="Select District"
											name="district"
											data={[
												"Pirojpur",
												"Dhaka",
												"Chittagong",
												"Rajshahi",
												"Sylhet",
												"Mymensingh",
												"Rangpur",
												"Barisal",
												"Khulna",
											]}
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Address</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<TextAreaForm
											form={form}
											placeholder="Address"
											name="address"
										/>
									</Grid.Col>
								</Grid>

								<Flex
									c="var(--theme-primary-color-6)"
									align="center"
									justify="space-between"
									gap="xs"
								>
									<Text fz="sm">Doctor Information</Text>
									<Flex align="center" gap="xs">
										<Text fz="sm">Booked-05</Text>{" "}
										<IconChevronRight size="16px" />
									</Flex>
								</Flex>

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Room No.</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											placeholder="Room No."
											name="roomNo"
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Specialization</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											placeholder="Specialization"
											name="specialization"
										/>
									</Grid.Col>
								</Grid>
								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Doctor Name</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											placeholder="Doctor Name"
											name="doctorName"
										/>
									</Grid.Col>
								</Grid>

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Disease Profile</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											placeholder="Diabetic"
											name="diseaseProfile"
										/>
									</Grid.Col>
								</Grid>

								<Flex c="var(--theme-primary-color-6)" align="center">
									<Text fz="sm">Marketing</Text>
								</Flex>

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Referred Name</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											placeholder="Name"
											name="referredName"
										/>
									</Grid.Col>
								</Grid>

								<Grid align="center" columns={20}>
									<Grid.Col span={6}>
										<Text fz="sm">Marketing Ex.</Text>
									</Grid.Col>
									<Grid.Col span={14}>
										<InputForm
											form={form}
											placeholder="101"
											name="marketingEx"
										/>
									</Grid.Col>
								</Grid>
							</Stack>
						</Tabs.Panel>
					</Tabs>
				</form>
			</ScrollArea>
		</Box>
	);
}
