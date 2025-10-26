import { Box, Text, Grid, Group, Image, Flex, Table, Badge, Stack, Divider } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import { formatDate } from "@/common/utils";
import "@/index.css";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { t } from "i18next";
import Barcode from "react-barcode";

const LabReportA4EN = forwardRef(({ data, preview = false }, ref) => {
	const patientInfo = data || {};
	const jsonContent = JSON.parse(patientInfo?.json_content || "{}");
	const labResults = jsonContent?.lab_results || [];
	const { hospitalConfigData } = useHospitalConfigData();

	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	const getStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case "normal":
			case "negative":
				return "green";
			case "abnormal":
			case "positive":
				return "red";
			case "borderline":
				return "yellow";
			default:
				return "gray";
		}
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
								<Group ml="md" align="center" h="100%">
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

								<Text ta="center" fw="bold" size="lg" c="#1e40af">
									{t("Laboratory Report")}
								</Text>
								<Text ta="center" size="sm" c="gray">
									{t("প্যাথলজি রিপোর্ট")}
								</Text>
							</Grid.Col>
							<Grid.Col span={4}>
								<Group mr="md" justify="flex-end" align="center" h="100%">
									<Image src={TBLogo} alt="logo" width={80} height={80} />
								</Group>
							</Grid.Col>
						</Grid>
					</Box>

					{/* =============== Patient Information Section ================ */}
					<Box mb="md">
						<Box bd="2px solid #333" p="md" style={{ borderRadius: "6px" }}>
							<Text fw="bold" size="md" mb="sm" c="#1e40af" ta="center">
								{t("Patient Information")} / {t("রোগীর তথ্য")}
							</Text>
							<Grid columns={12} gutter="sm">
								<Grid.Col span={3}>
									<Text size="xs" fw={600} c="dark">
										{t("Report Number")}:
									</Text>
									<Text size="sm" fw={500}>
										{getValue(patientInfo?.report_id || patientInfo?.invoice || "")}
									</Text>
								</Grid.Col>
								<Grid.Col span={3}>
									<Text size="xs" fw={600} c="dark">
										{t("Patient ID")}:
									</Text>
									<Text size="sm" fw={500}>
										{getValue(patientInfo?.patient_id || "")}
									</Text>
								</Grid.Col>
								<Grid.Col span={3}>
									<Text size="xs" fw={600} c="dark">
										{t("Name")}:
									</Text>
									<Text size="sm" fw={500}>
										{getValue(patientInfo?.name, "")}
									</Text>
								</Grid.Col>
								<Grid.Col span={3}>
									<Text size="xs" fw={600} c="dark">
										{t("Mobile")}:
									</Text>
									<Text size="sm" fw={500}>
										{getValue(patientInfo?.mobile || "")}
									</Text>
								</Grid.Col>

								<Grid.Col span={3}>
									<Text size="xs" fw={600} c="dark">
										{t("Age")}:
									</Text>
									<Text size="sm" fw={500}>
										{patientInfo?.year || 0} Y {patientInfo?.month || 0} M {patientInfo?.day || 0} D
									</Text>
								</Grid.Col>
								<Grid.Col span={3}>
									<Text size="xs" fw={600} c="dark">
										{t("Gender")}:
									</Text>
									<Text size="sm" fw={500}>
										{patientInfo?.gender &&
											patientInfo.gender[0].toUpperCase() + patientInfo.gender.slice(1)}
									</Text>
								</Grid.Col>
								<Grid.Col span={3}>
									<Text size="xs" fw={600} c="dark">
										{t("Date of Birth")}:
									</Text>
									<Text size="sm" fw={500}>
										{patientInfo?.dob || ""}
									</Text>
								</Grid.Col>
								<Grid.Col span={3}>
									<Text size="xs" fw={600} c="dark">
										{t("Report Date")}:
									</Text>
									<Text size="sm" fw={500}>
										{formatDate(new Date(patientInfo?.created || new Date()))}
									</Text>
								</Grid.Col>

								{/* Additional Patient Information */}
								{(patientInfo?.address || patientInfo?.emergency_contact) && (
									<>
										<Grid.Col span={6}>
											<Text size="xs" fw={600} c="dark">
												{t("Address")}:
											</Text>
											<Text size="sm" fw={500}>
												{getValue(patientInfo?.address || "")}
											</Text>
										</Grid.Col>
										<Grid.Col span={6}>
											<Text size="xs" fw={600} c="dark">
												{t("Emergency Contact")}:
											</Text>
											<Text size="sm" fw={500}>
												{getValue(patientInfo?.emergency_contact || "")}
											</Text>
										</Grid.Col>
									</>
								)}

								{patientInfo?.health_id && (
									<Grid.Col span={6}>
										<Text size="xs" fw={600} c="dark">
											{t("Health ID")}:
										</Text>
										<Text size="sm" fw={500}>
											{getValue(patientInfo?.health_id || "")}
										</Text>
									</Grid.Col>
								)}
							</Grid>
						</Box>
					</Box>

					{/* =============== Lab Test Results Section ================ */}
					<Box mb="md">
						<Text fw="bold" size="lg" mb="sm" c="#1e40af">
							{t("Laboratory Test Results")} / {t("ল্যাবরেটরি টেস্ট রেজাল্ট")}
						</Text>

						{labResults.length > 0 ? (
							<Box bd="2px solid #333" style={{ borderRadius: "6px", overflow: "hidden" }}>
								<Table
									striped
									highlightOnHover
									withTableBorder
									withColumnBorders
									style={{
										borderCollapse: "collapse",
										width: "100%",
									}}
								>
									<Table.Thead>
										<Table.Tr style={{ backgroundColor: "#1e40af" }}>
											<Table.Th
												style={{
													border: "1px solid #333",
													padding: "12px 8px",
													backgroundColor: "#1e40af",
													color: "white",
													fontWeight: "bold",
												}}
											>
												<Text size="sm" fw={700} c="white">
													{t("Test Name")} / {t("টেস্টের নাম")}
												</Text>
											</Table.Th>
											<Table.Th
												style={{
													border: "1px solid #333",
													padding: "12px 8px",
													backgroundColor: "#1e40af",
													color: "white",
													fontWeight: "bold",
												}}
											>
												<Text size="sm" fw={700} c="white">
													{t("Result")} / {t("ফলাফল")}
												</Text>
											</Table.Th>
											<Table.Th
												style={{
													border: "1px solid #333",
													padding: "12px 8px",
													backgroundColor: "#1e40af",
													color: "white",
													fontWeight: "bold",
												}}
											>
												<Text size="sm" fw={700} c="white">
													{t("Unit")} / {t("একক")}
												</Text>
											</Table.Th>
											<Table.Th
												style={{
													border: "1px solid #333",
													padding: "12px 8px",
													backgroundColor: "#1e40af",
													color: "white",
													fontWeight: "bold",
												}}
											>
												<Text size="sm" fw={700} c="white">
													{t("Reference Range")} / {t("সাধারণ সীমা")}
												</Text>
											</Table.Th>
											<Table.Th
												style={{
													border: "1px solid #333",
													padding: "12px 8px",
													backgroundColor: "#1e40af",
													color: "white",
													fontWeight: "bold",
												}}
											>
												<Text size="sm" fw={700} c="white">
													{t("Status")} / {t("অবস্থা")}
												</Text>
											</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{labResults.map((result, index) => (
											<Table.Tr
												key={index}
												style={{
													backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
												}}
											>
												<Table.Td
													style={{
														border: "1px solid #333",
														padding: "10px 8px",
														verticalAlign: "top",
													}}
												>
													<Text size="sm" fw={600}>
														{result.test_name || result.name || `Test ${index + 1}`}
													</Text>
												</Table.Td>
												<Table.Td
													style={{
														border: "1px solid #333",
														padding: "10px 8px",
														verticalAlign: "top",
													}}
												>
													<Text size="sm" fw={500}>
														{result.result || result.value || "-"}
													</Text>
												</Table.Td>
												<Table.Td
													style={{
														border: "1px solid #333",
														padding: "10px 8px",
														verticalAlign: "top",
													}}
												>
													<Text size="sm">{result.unit || "-"}</Text>
												</Table.Td>
												<Table.Td
													style={{
														border: "1px solid #333",
														padding: "10px 8px",
														verticalAlign: "top",
													}}
												>
													<Text size="sm">
														{result.reference_range || result.normal_range || "-"}
													</Text>
												</Table.Td>
												<Table.Td
													style={{
														border: "1px solid #333",
														padding: "10px 8px",
														verticalAlign: "top",
													}}
												>
													<Badge
														color={getStatusColor(result.status)}
														size="sm"
														style={{ fontSize: "11px" }}
													>
														{result.status || "Normal"}
													</Badge>
												</Table.Td>
											</Table.Tr>
										))}
									</Table.Tbody>
								</Table>
							</Box>
						) : (
							<Box p="md" ta="center" c="gray">
								<Text size="sm">
									{t("No lab results available")} / {t("কোন ল্যাব রেজাল্ট পাওয়া যায়নি")}
								</Text>
							</Box>
						)}
					</Box>

					{/* =============== Laboratory Information Section ================ */}
					<Box mb="md">
						<Box bd="2px solid #333" p="md" style={{ borderRadius: "6px" }}>
							<Text fw="bold" size="md" mb="sm" c="#1e40af" ta="center">
								{t("Laboratory Information")} / {t("ল্যাবরেটরি তথ্য")}
							</Text>
							<Grid columns={12} gutter="sm">
								<Grid.Col span={4}>
									<Text size="xs" fw={600} c="dark">
										{t("Laboratory Name")}:
									</Text>
									<Text size="sm" fw={500}>
										{getValue(
											jsonContent?.lab_name ||
												hospitalConfigData?.organization_name ||
												"Hospital Laboratory"
										)}
									</Text>
								</Grid.Col>
								<Grid.Col span={4}>
									<Text size="xs" fw={600} c="dark">
										{t("Technician")}:
									</Text>
									<Text size="sm" fw={500}>
										{getValue(
											jsonContent?.technician_name ||
												patientInfo?.technician_name ||
												"Lab Technician"
										)}
									</Text>
								</Grid.Col>
								<Grid.Col span={4}>
									<Text size="xs" fw={600} c="dark">
										{t("Test Date")}:
									</Text>
									<Text size="sm" fw={500}>
										{formatDate(
											new Date(jsonContent?.test_date || patientInfo?.created || new Date())
										)}
									</Text>
								</Grid.Col>
								<Grid.Col span={4}>
									<Text size="xs" fw={600} c="dark">
										{t("Sample ID")}:
									</Text>
									<Text size="sm" fw={500}>
										{getValue(jsonContent?.sample_id || patientInfo?.sample_id || "")}
									</Text>
								</Grid.Col>
								<Grid.Col span={4}>
									<Text size="xs" fw={600} c="dark">
										{t("Lab ID")}:
									</Text>
									<Text size="sm" fw={500}>
										{getValue(jsonContent?.lab_id || patientInfo?.lab_id || "")}
									</Text>
								</Grid.Col>
								<Grid.Col span={4}>
									<Text size="xs" fw={600} c="dark">
										{t("Equipment Used")}:
									</Text>
									<Text size="sm" fw={500}>
										{getValue(jsonContent?.equipment || "Standard Lab Equipment")}
									</Text>
								</Grid.Col>
							</Grid>
						</Box>
					</Box>

					{/* =============== Additional Information Section ================ */}
					{(jsonContent?.notes || jsonContent?.comments) && (
						<Box mb="md">
							<Text fw="bold" size="md" mb="sm" c="#1e40af">
								{t("Additional Information")} / {t("অতিরিক্ত তথ্য")}
							</Text>
							<Box p="sm" bd="2px solid #ddd" style={{ borderRadius: "6px" }}>
								<Text size="sm">{jsonContent?.notes || jsonContent?.comments || ""}</Text>
							</Box>
						</Box>
					)}

					{/* =============== Doctor Information and Signature ================ */}
					<Box mb="md">
						<Grid columns={12} gutter="md">
							<Grid.Col span={6}>
								<Box p="md" bd="2px solid #333" style={{ borderRadius: "6px" }}>
									<Text fw="bold" size="md" mb="sm" c="#1e40af" ta="center">
										{t("Reported By")} / {t("রিপোর্ট করেছেন")}
									</Text>
									<Stack gap="xs">
										<Box>
											<Text size="xs" fw={600} c="dark">
												{t("Doctor Name")}:
											</Text>
											<Text size="sm" fw={600}>
												{patientInfo?.doctor_name || "Dr. Name"}
											</Text>
										</Box>
										<Box>
											<Text size="xs" fw={600} c="dark">
												{t("Designation")}:
											</Text>
											<Text size="sm" fw={500}>
												{patientInfo?.designation_name || "Pathologist"}
											</Text>
										</Box>
										<Box>
											<Text size="xs" fw={600} c="dark">
												{t("Employee ID")}:
											</Text>
											<Text size="sm" fw={500}>
												{getValue(patientInfo?.employee_id)}
											</Text>
										</Box>
										<Box>
											<Text size="xs" fw={600} c="dark">
												{t("License Number")}:
											</Text>
											<Text size="sm" fw={500}>
												{getValue(patientInfo?.license_number || jsonContent?.license_number)}
											</Text>
										</Box>
									</Stack>
								</Box>
							</Grid.Col>
							<Grid.Col span={6}>
								<Box p="md" bd="2px solid #333" style={{ borderRadius: "6px" }}>
									<Text fw="bold" size="md" mb="sm" c="#1e40af" ta="center">
										{t("Signature")} / {t("স্বাক্ষর")}
									</Text>
									<Box h={80} ta="center" bd="1px dashed #ccc" style={{ borderRadius: "4px" }}>
										{renderImagePreview([], patientInfo?.signature_path)}
									</Box>
									<Text size="xs" ta="center" c="gray" mt="xs">
										{t("Digital Signature")} / {t("ডিজিটাল স্বাক্ষর")}
									</Text>
								</Box>
							</Grid.Col>
						</Grid>
					</Box>

					{/* =============== Footer Information ================ */}
					<Box ta="center" mt="lg">
						<Divider mb="md" />

						{/* Report Generation Info */}
						<Box mb="md" p="sm" bd="1px solid #ddd" style={{ borderRadius: "4px" }}>
							<Text size="sm" c="gray" mb="xs">
								{t("Report Generated On")}: {formatDate(new Date())}
							</Text>
							<Text size="xs" c="gray" mb="xs">
								{t("Report ID")}: {getValue(patientInfo?.report_id || patientInfo?.invoice || "")}
							</Text>
							<Text size="xs" c="gray" mb="xs">
								{t("This is a computer generated report")} / {t("এটি একটি কম্পিউটার জেনারেটেড রিপোর্ট")}
							</Text>
							<Text size="xs" c="gray">
								{t("For any queries, contact")}: {hospitalConfigData?.hotline || "0987634523"}
							</Text>
						</Box>

						{/* Barcode and QR Code */}
						<Grid columns={12} gutter="md" mb="md">
							<Grid.Col span={6}>
								<Box ta="center">
									<Text size="xs" fw={600} mb="xs">
										{t("Barcode")} / {t("বারকোড")}
									</Text>
									<Barcode
										fontSize="8"
										width="1"
										height="25"
										value={
											patientInfo?.barcode ||
											patientInfo?.report_id ||
											patientInfo?.invoice ||
											"LAB-REPORT"
										}
									/>
								</Box>
							</Grid.Col>
							<Grid.Col span={6}>
								<Box ta="center">
									<Text size="xs" fw={600} mb="xs">
										{t("QR Code")} / {t("কিউআর কোড")}
									</Text>
									<Box ta="center"></Box>
								</Box>
							</Grid.Col>
						</Grid>

						{/* Hospital Footer */}
						<Box mt="md" p="xs" bd="1px solid #333" style={{ borderRadius: "4px" }}>
							<Text size="xs" c="dark" fw={600}>
								{hospitalConfigData?.organization_name || "Hospital"}
							</Text>
							<Text size="xxs" c="gray">
								{hospitalConfigData?.address || "Uttara, Dhaka, Bangladesh"}
							</Text>
							<Text size="xxs" c="gray">
								{t("Phone")}: {hospitalConfigData?.hotline || "0987634523"} |{t("Email")}:{" "}
								{hospitalConfigData?.email || "info@hospital.com"}
							</Text>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
});

LabReportA4EN.displayName = "LabReportA4EN";

export default LabReportA4EN;
