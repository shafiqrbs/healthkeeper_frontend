import { Box, Text, Grid, Group, Image, Flex, Table, Divider } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { t } from "i18next";
import Barcode from "react-barcode";
import { capitalizeWords, formatDate, formatDateTimeAmPm } from "@utils/index";

const LabReportA4BN = forwardRef(({ data, preview = false }, ref) => {
	const reportData = JSON.parse(data?.invoiceParticular?.json_report || "{}");
	console.log(reportData);
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
					mih="1122px"
					className="watermark"
					ff="Arial, sans-serif"
					lh={1.5}
					fz={12}
					bd="1px solid black"
				>
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
									{hospitalConfigData?.address || "Uttara"}
								</Text>
								<Text ta="center" size="sm" c="gray" mb="2">
									{t("হটলাইন")} {hospitalConfigData?.hotline || "0987634523"}
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
						<Box p="md" style={{ borderRadius: "6px" }}>
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
											<Table.Td w={"33%"} align={"left"}>
												{report?.uid ? (
													<Barcode fontSize="8" width="1" height="32" value={report.uid} />
												) : null}
											</Table.Td>
											<Table.Td w={"33%"} align={"center"}>
												<Text fz={"xl"}>{report?.particular?.category?.name} Report</Text>
											</Table.Td>
											<Table.Td w={"33%"} align={"right"}>
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
														<Text size="xs">{getValue(report?.uid || "")}</Text>
													</Grid.Col>
													<Grid.Col span={6} py={0}>
														<Text size="xs">{t("PatientId")}</Text>
													</Grid.Col>
													<Grid.Col span={12} py={0}>
														<Text size="xs">{getValue(patientInfo?.patient_id || "")}</Text>
													</Grid.Col>
													<Grid.Col span={6} py={0}>
														<Text size="xs">{t("Name")}</Text>
													</Grid.Col>
													<Grid.Col span={12} py={0}>
														<Text size="xs">{getValue(patientInfo?.name || "")}</Text>
													</Grid.Col>
													<Grid.Col span={6} py={0}>
														<Text size="xs">{t("Mobile")}</Text>
													</Grid.Col>
													<Grid.Col span={12} py={0}>
														<Text size="xs">{getValue(patientInfo?.mobile || "")}</Text>
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
															{getValue(formatDateTimeAmPm(report?.created_at) || "")}
														</Text>
													</Grid.Col>
													<Grid.Col span={6} py={0}>
														<Text size="xs">{t("Collected on")}</Text>
													</Grid.Col>
													<Grid.Col span={12} py={0}>
														<Text size="xs">
															{getValue(
																formatDateTimeAmPm(report?.collection_date) || ""
															)}
														</Text>
													</Grid.Col>
													<Grid.Col span={6} py={0}>
														<Text size="xs">{t("Age")}</Text>
													</Grid.Col>
													<Grid.Col span={12} py={0}>
														<Text size="xs">
															{patientInfo?.year || 0} Years {patientInfo?.month || 0} Mon{" "}
															{patientInfo?.day || 0} Day
														</Text>
													</Grid.Col>
													<Grid.Col span={6} py={0}>
														<Text size="xs">{t("Gender")}</Text>
													</Grid.Col>
													<Grid.Col span={12} py={0}>
														{getValue(capitalizeWords(patientInfo?.gender) || "")}
													</Grid.Col>
												</Grid>
											</Table.Td>
										</Table.Tr>
										<Table.Tr>
											<Table.Td>
												<Grid columns={18} gap={0} gutter="xs">
													<Grid.Col span={6} py={0}>
														<Text size="xs">{t("Specimen")}</Text>
													</Grid.Col>
													<Grid.Col span={12} py={0}>
														<Text size="xs">
															{getValue(report?.particular?.specimen || "")}
														</Text>
													</Grid.Col>
												</Grid>
											</Table.Td>
											<Table.Td>
												<Grid columns={18} gutter="sm">
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
																{getValue(patientInfo?.prescription_doctor_name || "")}
															</Text>
														)}
													</Grid.Col>
												</Grid>
											</Table.Td>
										</Table.Tr>
										<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
											<Table.Td colSpan={"2"}>
												<strong>Report Name:</strong> {report?.name}
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</Box>

							{data?.invoiceParticular?.particular?.slug === "covid-19" ? (
								<Box mt={"md"}>
									{/* =============== covid-19 report data table ================ */}
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
															<Text size="xs" fw="bold">
																{t("Specimen")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{reportData?.specimen
																	? JSON.parse(reportData.specimen).join(", ")
																	: "-"}
															</Text>
														</Grid.Col>
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("Test Type")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{getValue(
																	capitalizeWords(reportData?.test_type) || "-"
																)}
															</Text>
														</Grid.Col>
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("Preservative")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{reportData?.preservative
																	? JSON.parse(reportData.preservative).join(", ")
																	: "-"}
															</Text>
														</Grid.Col>
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("Type Patient")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{reportData?.type_patient
																	? JSON.parse(reportData.type_patient).join(", ")
																	: "-"}
															</Text>
														</Grid.Col>
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("COV Invalid")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{reportData?.cov_invalid !== undefined
																	? reportData.cov_invalid
																		? t("Yes")
																		: t("No")
																	: "-"}
															</Text>
														</Grid.Col>
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("Presumptive Positive")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{reportData?.presumptive_pos !== undefined
																	? reportData.presumptive_pos
																		? t("Yes")
																		: t("No")
																	: "-"}
															</Text>
														</Grid.Col>
													</Grid>
												</Table.Td>
												<Table.Td>
													<Grid columns={18} gap={0} gutter="xs">
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("Referral Center")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{getValue(reportData?.referral_center || "-")}
															</Text>
														</Grid.Col>
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("SARS-CoV Negative")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{reportData?.sars_covnegative !== undefined
																	? reportData.sars_covnegative
																		? t("Yes")
																		: t("No")
																	: "-"}
															</Text>
														</Grid.Col>
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("SARS-CoV Positive")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{reportData?.sars_cov_positive !== undefined
																	? reportData.sars_cov_positive
																		? t("Yes")
																		: t("No")
																	: "-"}
															</Text>
														</Grid.Col>
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("Gene Xpert Hospital")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{getValue(reportData?.gene_xpert_hospital || "-")}
															</Text>
														</Grid.Col>
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("Specimen ID Number")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{getValue(
																	reportData?.specimen_identification_number || "-"
																)}
															</Text>
														</Grid.Col>
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("Reference Lab Specimen ID")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{getValue(
																	reportData?.reference_laboratory_specimen_id || "-"
																)}
															</Text>
														</Grid.Col>
													</Grid>
												</Table.Td>
											</Table.Tr>
											<Table.Tr>
												<Table.Td>
													<Grid columns={18} gap={0} gutter="xs">
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("Date Specimen Collection")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{reportData?.date_specimen_collection
																	? formatDateTimeAmPm(
																			reportData.date_specimen_collection
																	  )
																	: "-"}
															</Text>
														</Grid.Col>
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("Date Specimen Received")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{reportData?.date_specimen_received
																	? formatDateTimeAmPm(
																			reportData.date_specimen_received
																	  )
																	: "-"}
															</Text>
														</Grid.Col>
													</Grid>
												</Table.Td>
												<Table.Td>
													<Grid columns={18} gap={0} gutter="xs">
														<Grid.Col span={6} py={0}>
															<Text size="xs" fw="bold">
																{t("Last COVID Test Date")}
															</Text>
														</Grid.Col>
														<Grid.Col span={12} py={0}>
															<Text size="xs">
																{reportData?.last_covid_test_date
																	? formatDateTimeAmPm(
																			reportData.last_covid_test_date
																	  )
																	: "-"}
															</Text>
														</Grid.Col>
													</Grid>
												</Table.Td>
											</Table.Tr>
											{reportData?.comment && (
												<Table.Tr>
													<Table.Td colSpan={2}>
														<Grid columns={18} gap={0} gutter="xs">
															<Grid.Col span={6} py={0}>
																<Text size="xs" fw="bold">
																	{t("Comment")}
																</Text>
															</Grid.Col>
															<Grid.Col span={12} py={0}>
																<Text size="xs">
																	{getValue(reportData?.comment || "-")}
																</Text>
															</Grid.Col>
														</Grid>
													</Table.Td>
												</Table.Tr>
											)}
										</Table.Tbody>
									</Table>
								</Box>
							) : data?.invoiceParticular?.particular?.slug === "gene-sputum" ? (
								<Box>Gene Sputum Report</Box>
							) : data?.invoiceParticular?.particular?.slug === "gene-pulmonary" ? (
								<Box>Gene Pulmonary Report</Box>
							) : data?.invoiceParticular?.particular?.slug === "ultrasonography" ? (
								<Box>Ultrasonography Report</Box>
							) : data?.invoiceParticular?.particular?.slug === "x-ray" ? (
								<Box>X-Ray Report</Box>
							) : data?.invoiceParticular?.particular?.slug === "sars-cov2" ? (
								<Box>SARS-CoV-2 Report</Box>
							) : data?.invoiceParticular?.particular?.slug === "gene-extra-sputum" ? (
								<Box>Gene Extra Sputum Report</Box>
							) : data?.invoiceParticular?.particular?.slug === "lpa" ? (
								<Box>LPA Report</Box>
							) : (
								<Box mt={"md"}>
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
											<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
												<Table.Th w={"30%"} pl={4}>
													{t("Parameter")}
												</Table.Th>
												<Table.Th w={"20%"} pl={4}>
													{t("TestResult")}
												</Table.Th>
												<Table.Th w={"20%"} pl={4}>
													{t("Unit")}
												</Table.Th>
												<Table.Th w={"30%"} pl={4}>
													{t("ReferenceValue")}
												</Table.Th>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{report?.reports?.map((item, index) => (
												<Table.Tr key={index}>
													<Table.Td>
														<Text fz={"xs"} pl={4}>
															{item.name}
														</Text>
													</Table.Td>
													<Table.Td>
														<Text fz={"xs"} pl={4}>
															{item.result}
														</Text>
													</Table.Td>
													<Table.Td>
														<Text fz={"xs"} pl={4}>
															{item.unit}
														</Text>
													</Table.Td>
													<Table.Td>
														<Text fz={"xs"} pl={4}>
															{item.reference_value}
														</Text>
													</Table.Td>
												</Table.Tr>
											))}
										</Table.Tbody>
									</Table>
								</Box>
							)}
						</Box>
					</Box>

					{/* =============== Additional Information Section ================ */}
					{report?.comment && (
						<Box p="md" pt={0}>
							<Text fw="bold" size="xs" mb="xs">
								{t("Comment")}
							</Text>
							<Box p="xs" bd="1px solid #ddd">
								<Text size="xs">{report?.comment || ""}</Text>
							</Box>
						</Box>
					)}
					{/* =============== Doctor Information and Signature ================ */}

					<Box p="md" pt={0} pb={0}>
						<Grid columns={12} gutter="xs">
							<Grid.Col span={4}>
								<Box>
									<Box h={40} ta="center">
										{/*{renderImagePreview([], patientInfo?.signature_path)}*/}
									</Box>
									<Text fw="bold" size="xs" mb="sm" ta="center">
										{report?.assign_labuser_name}
									</Text>
									<Text fw="bold" ta="center">
										Medical Technologist(Lab)
									</Text>
								</Box>
							</Grid.Col>
							<Grid.Col span={4}></Grid.Col>
							<Grid.Col span={4}>
								<Box>
									<Box h={40} ta="center">
										{/*{renderImagePreview([], patientInfo?.signature_path)}*/}
									</Box>
									<Text fw="bold" size="xs" mb="sm" ta="center">
										{report?.assign_doctor_name}
									</Text>
									<Text fw="bold" mb="sm" ta="center">
										Clinical Pathologist
									</Text>
								</Box>
							</Grid.Col>
						</Grid>
					</Box>

					{/* =============== Footer Information ================ */}
				</Box>
			</Box>
		</Box>
	);
});

LabReportA4BN.displayName = "LabReportA4BN";

export default LabReportA4BN;
