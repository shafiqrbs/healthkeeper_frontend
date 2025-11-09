import {Box, Text, Grid, Group, Image, Table, Flex, Stack,Button} from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import {formatDate, getLoggedInUser} from "@/common/utils";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import Rx from "@assets/images/rx.png";
import Barcode from "react-barcode";
import {IconPointFilled} from "@tabler/icons-react";
import {capitalizeWords} from "@utils/index";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const AdmissionFormBN = forwardRef(({ data, preview = false }, ref) => {
	const user = getLoggedInUser();

	const admissionData = data || {};
	const patientInfo = data || {};
	const jsonContent = JSON.parse(patientInfo?.json_content || "{}");
	const patientReport = jsonContent?.patient_report || {};
	const order = patientReport?.order || {};
	const patientExamination = patientReport?.patient_examination || {};
	const medicines = jsonContent?.medicines || [];
	const exEmergencies = jsonContent?.exEmergency || [];
	const { hospitalConfigData } = useHospitalConfigData();
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	return (
		<Box display={preview ? "block" : "none"}>
			<Stack
				ref={ref}
				p="48px"
				w="210mm"
				mih="1122px"
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
				align="stretch"
				justify="space-between"
				style={{
					border: "1px solid var(--theme-tertiary-color-8)",
				}}
			>
				<Box>
				<Table
					style={{
						borderCollapse: "collapse",
						width: "100%",
						border: "1px solid var(--theme-tertiary-color-8)",
					}}
					className="customTable">
					<Table.Tbody>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Td colSpan={"3"}>
								<Box mb="sm">
									<Flex gap="md" justify="center">
										<Box>
											<Group ml="md" align="center" h="100%">
												<Image src={GLogo} alt="logo" width={60} height={60} />
											</Group>
										</Box>
										<Box>
											<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
												{hospitalConfigData?.organization_name || ""}
											</Text>
											<Text ta="center" size="sm" c="gray" mt="2">
												{hospitalConfigData?.address || ""}
											</Text>
											<Text ta="center" size="sm" c="gray" mb="2">
												{t("হটলাইন")} {hospitalConfigData?.hotline || ""}
											</Text>
										</Box>
										<Box>
											<Group mr="md" justify="flex-end" align="center" h="100%">
												<Image src={TBLogo} alt="logo" width={60} height={60} />
											</Group>
										</Box>
									</Flex>
								</Box>
							</Table.Td>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Td colSpan={3} style={{ textAlign: "center", padding: 0 }}>
								<Text size="md" fw={600} >
									{t("AdmissionForm & Disease Details")} - {patientInfo?.parent_patient_mode_name}
								</Text>
							</Table.Td>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Td>
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("PatientID")}:
									</Text>
									<Text size="sm">{getValue(patientInfo?.patient_id || "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td>
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("AdmissionID")}:
									</Text>
									<Text size="sm">{getValue(patientInfo?.invoice || "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td>
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("PatientType")}:
									</Text>
									<Text size="sm">{getValue(patientInfo?.payment_mode_name, "")}</Text>
								</Group>
							</Table.Td>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Name")}:
									</Text>
									<Text size="sm">{getValue(patientInfo?.name, "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Gender")}:
									</Text>
									<Text size="xs">{capitalizeWords(patientInfo?.gender || "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td>
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Age")}:
									</Text>
									<Text size="xs">
										{patientInfo?.year || 0} Years {patientInfo?.month || 0} Mon{" "}
										{patientInfo?.day || 0} Day
									</Text>
								</Group>
							</Table.Td>

						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Td>
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("F/M/H")}:
									</Text>
									<Text size="xs">{getValue(patientInfo?.father_name, "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Religion")}:
									</Text>
									<Text size="sm">{getValue(patientInfo?.religion_name, "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Weight")}:
									</Text>
									<Text size="sm">{getValue(patientInfo?.weight, "")}</Text>
								</Group>
							</Table.Td>

						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>

							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("DOB")}:
									</Text>
									<Text size="xs">{getValue(patientInfo?.dob, "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("NID/Birth")}:
									</Text>
									<Text size="xs">{getValue(patientInfo?.nid, "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Add. Date")}:
									</Text>
									<Text size="sm">{getValue(patientInfo?.admission_date, "")}</Text>
								</Group>
							</Table.Td>
						</Table.Tr>

						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("GuardianName")}:
									</Text>
									<Text size="xs">{getValue(patientInfo?.guardian_name, "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Relation")}:
									</Text>
									<Text size="xs">{getValue(patientInfo?.patient_relation, "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td colspan={2}>
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Mobile")}:
									</Text>
									<Text size="xs">{getValue(patientInfo?.mobile, "")}
										{patientInfo?.guardian_mobile && (
											<> / {getValue(patientInfo?.guardian_mobile, "")}</>
										)}</Text>
								</Group>
							</Table.Td>

						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Bed/Cabin")}:
									</Text>
									<Text size="sm">{getValue(patientInfo?.room_name, "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Unit")}:
									</Text>
									<Text size="xs">{getValue(patientInfo?.admit_unit_name, "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td>
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("Department")}:
									</Text>
									<Text size="xs">{getValue(patientInfo?.admit_department_name, "")}</Text>
								</Group>
							</Table.Td>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Td colspan={2}>
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("ConsultantDoctor")}:
									</Text>
									<Text size="sm">{getValue(patientInfo?.admit_consultant_name, "")}</Text>
								</Group>
							</Table.Td>
							<Table.Td >
								<Group gap="xs">
									<Text size="xs" fw={600}>
										{t("UnitDoctor")}:
									</Text>
									<Text size="xs">{getValue(patientInfo?.admit_doctor_name, "")}</Text>
								</Group>
							</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
				</Box>
				<Box ta="center">
					<Table
						style={{
							borderCollapse: "collapse",
							width: "100%",
						}}
						className="customTable">
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<Grid columns={12} gutter="0">
										<Grid.Col span={6}  align="left">
											<Text fz="xl" mt={'80'}>AdmittedBy</Text>
											<Text fz="xs">{admissionData?.created_by_name || "N/A"}</Text>
											<Text fz="xs">{admissionData?.designation_name || "N/A"}</Text>
										</Grid.Col>
										<Grid.Col span={6} align={'right'}>
											<Text size="sm" fw={600} mb="xs">
												<Text mt={'60'}>{t("Signature")}-----------------------------------------------</Text>
												<Text mt={'md'}>Name-----------------------------------------------</Text>
												<Text mt={'md'}>Designation-----------------------------------------------</Text>
											</Text>
										</Grid.Col>
									</Grid>
								</Table.Td>
							</Table.Tr>

						</Table.Tbody>
					</Table>
					<Text size="xs" c="gray" mt="xs">
						{patientInfo?.patient_id && (
							<Barcode
								fontSize={"12"}
								width={"1"}
								height={"24"}
								value={patientInfo?.patient_id}
							/>
						)}
					</Text>
					<Text size="xs" c="gray" mt="xs">
						<strong>{t("প্রিন্ট")}: </strong>
						{user?.name}
					</Text>
					<Text fz={8}>
						{t("প্রিন্টের সময়")}: {new Date().toLocaleString()}
					</Text>
				</Box>

			</Stack>
		</Box>
	);
});

AdmissionFormBN.displayName = "AdmissionFormBN";

export default AdmissionFormBN;
