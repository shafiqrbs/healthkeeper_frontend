import { Box, Text, Grid, Group, Image, Flex, Table, Divider, Stack } from "@mantine/core";
import React, { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { t } from "i18next";
import Barcode from "react-barcode";
import { capitalizeWords, formatDate, formatDateTimeAmPm } from "@utils/index";
import DefaultCustomReport from "@hospital-components/print-formats/lab-reports/custom/DefaultCustomReport";
import SystemLabReport from "@hospital-components/print-formats/lab-reports/custom/SystemLabReport";
import XrayReport from "@hospital-components/print-formats/lab-reports/custom/XrayReport";
import CTScanReport from "@hospital-components/print-formats/lab-reports/custom/CTScanReport";
import GeneXperExtraPulmonaryReport from "@hospital-components/print-formats/lab-reports/custom/GeneXperExtraPulmonaryReport";

const LabGroupReportA4BN = forwardRef(({ data, preview = false }, ref) => {
	const reportData = JSON.parse(data?.invoiceParticular?.json_report || "{}");
	const patientInfo = data?.entity || {};
	const report = data?.invoiceParticular || {};
	const { hospitalConfigData } = useHospitalConfigData();
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	const renderImagePreview = (imageArray, fallbackSrc = null) => {
		if (imageArray.length > 0) {
			const imageUrl = URL.createObjectURL(imageArray[0]);
			return (
				<Flex h={80} justify={"center"} align={"center"} mt={"xs"}>
					<Image h={80} w={80} fit="cover" src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
				</Flex>
			);
		} else if (fallbackSrc) {
			return (
				<Flex h={80} justify={"center"} align={"center"} mt={"xs"}>
					<Image h={80} w={80} fit="cover" src={fallbackSrc} />
				</Flex>
			);
		}
		return null;
	};

	return (
		<Box display={preview ? "block" : "none"}>
			<Box>
				<Box
					ref={ref}
					p="md"
					w="210mm"
					height="297mm"
					className="watermark"
					ff="Arial, sans-serif"
					lh={1.5}
					fz={12}
				>
					<Stack h="287mm" bg="var(--mantine-color-body)" align="stretch" justify="space-between" gap="md">
						<Box>
							{/* =============== Lab Report Header ================ */}
							<Box mb="sm">
								<Grid gutter="md">
									<Grid.Col span={4}>
										<Group ml="md" justify="flex-end" align="right" h="100%">
											<Image src={GLogo} alt="logo" width={80} height={80} />
										</Group>
									</Grid.Col>
									<Grid.Col span={4}>
										<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
											{hospitalConfigData?.organization_name || "Hospital"}
										</Text>
										<Text ta="center" size="sm" c="gray" mt="2">
											{hospitalConfigData?.address}
										</Text>
									</Grid.Col>
									<Grid.Col span={4}>
										<Group mr="md" justify="flex-start" align="center" h="100%">
											<Image src={TBLogo} alt="logo" width={80} height={80} />
										</Group>
									</Grid.Col>
								</Grid>
							</Box>

							{/* =============== Patient Information Section ================ */}
							<Box mb="md">
								<Box p="md">
									<Box bd="1px solid var(--theme-tertiary-color-8)">
										<Table
											withColumnBorders
											verticalSpacing={0}
											horizontalSpacing={0}
											striped={false}
											highlightOnHover={false}
											style={{ margin: 0, padding: 0 }}
										>
											<Table.Tbody>
												<Table.Tr>
													<Table.Td w={"25%"} align={"left"}>
														{report?.uid ? (
															<Barcode
																fontSize="8"
																width="1"
																height="32"
																value={report.uid}
															/>
														) : null}
													</Table.Td>
													<Table.Td w={"50%"} align={"center"}>
														<Text fz={"xl"}>{report?.name} Report</Text>
													</Table.Td>
													<Table.Td w={"25%"} align={"right"}>
														{patientInfo?.patient_id ? (
															<Barcode
																fontSize="8"
																height="32"
																width="1"
																value={patientInfo.patient_id}
															/>
														) : null}
													</Table.Td>
												</Table.Tr>
											</Table.Tbody>
										</Table>
									</Box>
									<Box>
										<Table
											withColumnBorders
											verticalSpacing={6}
											horizontalSpacing={6}
											striped={false}
											highlightOnHover={false}
											style={{
												borderCollapse: "collapse",
												width: "100%",
												border: "1px solid var(--theme-tertiary-color-8)",
											}}
										>
											<Table.Tbody>
												<Table.Tr>
													<Table.Td>
														<Grid columns={18} gap={0} gutter="xs">
															<Grid.Col span={6} py={0}>
																<Text size="xs">{t("Lab ID")}</Text>
															</Grid.Col>
															<Grid.Col span={12} py={0}>
																<Text size="xs">
																	{getValue(report?.lab_no || report?.uid)}
																</Text>
															</Grid.Col>
															<Grid.Col span={6} py={0}>
																<Text size="xs">{t("PatientId")}</Text>
															</Grid.Col>
															<Grid.Col span={12} py={0}>
																<Text size="xs">
																	{getValue(patientInfo?.patient_id || "")}
																</Text>
															</Grid.Col>
															<Grid.Col span={6} py={0}>
																<Text size="xs">{t("Name")}</Text>
															</Grid.Col>
															<Grid.Col span={12} py={0}>
																<Text size="xs">
																	{getValue(patientInfo?.name || "")}
																</Text>
															</Grid.Col>
															<Grid.Col span={6} py={0}>
																<Text size="xs">{t("Mobile")}</Text>
															</Grid.Col>
															<Grid.Col span={12} py={0}>
																<Text size="xs">
																	{getValue(patientInfo?.mobile || "")}
																</Text>
															</Grid.Col>
														</Grid>
													</Table.Td>
													<Table.Td>
														<Grid columns={18} gutter="sm">
															<Grid.Col span={6} py={0}>
																<Text size="xs">{t("Received on")}</Text>
															</Grid.Col>
															<Grid.Col span={12} py={0}>
																<Text size="xs">
																	{getValue(
																		formatDateTimeAmPm(report?.created_at) || ""
																	)}
																</Text>
															</Grid.Col>
															<Grid.Col span={6} py={0}>
																<Text size="xs">{t("Age")}</Text>
															</Grid.Col>
															<Grid.Col span={12} py={0}>
																<Text size="xs">
																	{patientInfo?.year > 0 &&
																		`${patientInfo.year} Years `}
																	{patientInfo?.month > 0 &&
																		`${patientInfo.month} Mon `}
																	{patientInfo?.day > 0 && `${patientInfo.day} Day`}
																</Text>
															</Grid.Col>
															<Grid.Col span={6} py={0}>
																<Text size="xs">{t("Gender")}</Text>
															</Grid.Col>
															<Grid.Col span={12} py={0}>
																{getValue(capitalizeWords(patientInfo?.gender) || "")}
															</Grid.Col>
															<Grid.Col span={6} py={0}>
																<Text size="xs">{t("Ref By.")}</Text>
															</Grid.Col>
															<Grid.Col span={12} py={0}>
																{patientInfo?.patient_mode_slug === "ipd" ? (
																	<Text size="xs">
																		{patientInfo?.patient_mode_name} -{" "}
																		{getValue(patientInfo?.admit_doctor_name || "")}
																	</Text>
																) : (
																	<Text size="xs">
																		{patientInfo?.patient_mode_name} -{" "}
																		{getValue(
																			patientInfo?.prescription_doctor_name || ""
																		)}
																	</Text>
																)}
															</Grid.Col>
														</Grid>
													</Table.Td>
												</Table.Tr>

												<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
													<Table.Td colSpan={"2"}>
														<strong>Name of Examination: </strong> {report?.report_name}
													</Table.Td>
												</Table.Tr>
											</Table.Tbody>
										</Table>
									</Box>
									<Box>
										<Box mt={"md"} h={"700"}>
											<Table
												withColumnBorders
												verticalSpacing={0}
												horizontalSpacing={0}
												striped={false}
												highlightOnHover={false}
												style={{
													margin: 0,
													padding: 0,
													borderCollapse: "collapse",
													width: "100%",
													border: "1px solid var(--theme-tertiary-color-8)",
												}}
											>
												<Table.Thead>
													<Table.Tr
														style={{ border: "1px solid var(--theme-tertiary-color-8)" }}
													>
														<Table.Th w={"35%"} pl={4}>
															{t("Parameter")}
														</Table.Th>
														<Table.Th ta={"center"} w={"25%"} pl={4}>
															{t("Result")}
														</Table.Th>
														<Table.Th w={"40%"} pl={4}>
															{t("ReferenceValue")}
														</Table.Th>
													</Table.Tr>
												</Table.Thead>
												<Table.Tbody>
													{report?.items?.map((report, index) => (
														<>
															{report?.reports?.length > 1 && (
																<Table.Tr key={index}>
																	<Table.Td colSpan={3}>
																		<Text fz={"xs"} fw={"600"} pl={4}>
																			{report?.name}
																		</Text>
																	</Table.Td>
																</Table.Tr>
															)}
															{report?.reports?.map((item, index) => (
																item.is_parent === 1 ? (
																	<Table.Tr key={index} style={{ border: "1px solid var(--theme-tertiary-color-8)" }} >
																		<Table.Td colSPan={3} bg={'red'}>
																			<Text fw={'600'} pl={4}>
																				{item.name}
																			</Text>
																		</Table.Td>
																	</Table.Tr>
																) : (
																	<Table.Tr key={index}>
																		<Table.Td>
																			<Text  pl={4}>
																				{item.name}
																			</Text>
																		</Table.Td>
																		<Table.Td>
																			<Text  pl={4}>
																				{item.result} {item.unit}
																			</Text>
																		</Table.Td>
																		<Table.Td>
																			<Text  pl={4}>
																				{item.reference_value}
																			</Text>
																		</Table.Td>
																	</Table.Tr>
																)

															))}
														</>
													))}
												</Table.Tbody>
											</Table>
											{report?.comment && (
												<Box pt={0}>
													<Text fw="bold" size="xs" mb="xs" mt={"md"}>
														{t("Comment")}
													</Text>
													<Box p="xs" bd="1px solid #ddd">
														<Text size="xs">{report?.comment || ""}</Text>
													</Box>
												</Box>
											)}
										</Box>
										{/* =============== Additional Information Section ================ */}

										<Box p="md" pt={0} pb={0}>
											<Grid columns={12} gutter="xs">
												<Grid.Col span={4}>
													<Box>
														<Text fw="bold" ta="center">
															Medical Technologist(Lab)
														</Text>
													</Box>
												</Grid.Col>
												<Grid.Col span={4}></Grid.Col>
												<Grid.Col span={4}>
													<Box>
														<Text fw="bold" mb="sm" ta="center">
															Clinical Pathologist
														</Text>
													</Box>
												</Grid.Col>
											</Grid>
										</Box>
										{/* =============== Doctor Information and Signature ================ */}
									</Box>
								</Box>
							</Box>

							{/* =============== Doctor Information and Signature ================ */}
						</Box>
					</Stack>
				</Box>
			</Box>
		</Box>
	);
});

LabGroupReportA4BN.displayName = "LabGroupReportA4BN";

export default LabGroupReportA4BN;
