import { Box, Text, Grid, Group, Image, Flex, Table, Badge, Stack, Divider } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import { formatDate } from "@/common/utils";
import "@/index.css";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { t } from "i18next";
import Barcode from "react-barcode";

const LabReportA4BN = forwardRef(({ data, preview = false }, ref) => {

	const patientInfo = data?.entity || {};
	const report = data?.invoiceParticular || {};
	//console.log(patientInfo);
	console.log(report);
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
						<Box  p="md" style={{ borderRadius: "6px" }}>
							<Box bd="1px solid var(--theme-tertiary-color-8)">
							<Table withColumnBorders
								   verticalSpacing={0}
								   horizontalSpacing={0}
								   striped={false}
								   highlightOnHover={false}
								   style={{ margin: 0, padding: 0}}>
								<Table.Tbody>
									<Table.Tr>
										<Table.Td w={'33%'} align={'left'}>
											<Barcode
												fontSize="8"
												width="1"
												height="32"
												value={getValue(report?.uid|| "")}
											/>
										</Table.Td>
										<Table.Td w={'33%'} align={'center'}><Text fz={'xl'}>{report?.particular?.category?.name}</Text></Table.Td>
										<Table.Td w={'33%'} align={'right'}>
											<Barcode
												fontSize="8"
												height="32"
												width="1"
												value={getValue(patientInfo?.patient_id|| "")}
											/>
										</Table.Td>
									</Table.Tr>
								</Table.Tbody>
							</Table>
							</Box>
							<Box bd="1px solid var(--theme-tertiary-color-8)">
							<Table>
								<Table.Tbody>
									<Table.Tr>
										<Table.Td>
											<Grid columns={18} gap={0} gutter="xs">
												<Grid.Col span={6} py={0}>
													<Text size="xs">
														{t('IDNO')}
													</Text>
												</Grid.Col>
												<Grid.Col span={12} py={0}>
													<Text size="xs">
														{getValue(report?.uid|| "")}
													</Text>
												</Grid.Col>
												<Grid.Col span={6} py={0}>
													<Text size="xs">
														{t('PatientId')}
													</Text>
												</Grid.Col>
												<Grid.Col span={12} py={0}>
													<Text size="xs">
														{getValue(patientInfo?.patient_id|| "")}
													</Text>
												</Grid.Col>
												<Grid.Col span={6} py={0}>
													<Text size="xs">
														{t('Name')}
													</Text>
												</Grid.Col>
												<Grid.Col span={12} py={0}>
													<Text size="xs">
														{getValue(patientInfo?.name|| "")}
													</Text>
												</Grid.Col>
												<Grid.Col span={6} py={0}>
													<Text size="xs">
														{t('Mobile')}
													</Text>
												</Grid.Col>
												<Grid.Col span={12} py={0}>
													<Text size="xs">
														{getValue(patientInfo?.mobile|| "")}
													</Text>
												</Grid.Col>
											</Grid>
										</Table.Td>
										<Table.Td>
											<Grid columns={18} gutter="sm">
												<Grid.Col span={6} py={0}>
													<Text size="xs">
														{t('Created')}
													</Text>
												</Grid.Col>
												<Grid.Col span={12} py={0}>
													<Text size="xs">
														{getValue(report?.uid|| "")}
													</Text>
												</Grid.Col>
												<Grid.Col span={6} py={0}>
													<Text size="xs">
														{t('Collected')}
													</Text>
												</Grid.Col>
												<Grid.Col span={12} py={0}>
													<Text size="xs">
														{getValue(patientInfo?.patient_id|| "")}
													</Text>
												</Grid.Col>
												<Grid.Col span={6} py={0}>
													<Text size="xs">
														{t('Sample')}
													</Text>
												</Grid.Col>
												<Grid.Col span={12} py={0}>
													<Text size="xs">
														{getValue(patientInfo?.name|| "")}
													</Text>
												</Grid.Col>
												<Grid.Col span={6} py={0}>
													<Text size="xs">
														{t('Ref By.')}
													</Text>
												</Grid.Col>
												<Grid.Col span={12} py={0}>
													<Text size="xs">
														{getValue(patientInfo?.mobile|| "")}
													</Text>
												</Grid.Col>
											</Grid>
										</Table.Td>
									</Table.Tr>
								</Table.Tbody>
							</Table>
							</Box>
							<Box bd="1px solid var(--theme-tertiary-color-8)" mt={'md'}>
								<Table withColumnBorders
									   verticalSpacing={0}
									   horizontalSpacing={0}
									   striped={false}
									   highlightOnHover={false}
									   style={{ margin: 0, padding: 0}}>
									<Table.Thead>
										<Table.Tr>
											<Table.Th w={'30%'}  pl={4}>{t('Parameter')}</Table.Th>
											<Table.Th w={'20%'}  pl={4}>{t('Result')}</Table.Th>
											<Table.Th w={'20%'}  pl={4}>{t('Unit')}</Table.Th>
											<Table.Th w={'30%'}  pl={4}>{t('Reference')}</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{report?.reports?.map((item, index) => (
											<Table.Tr>
												<Table.Td>
													<Text fz={'xs'} pl={4}>{item.name}</Text>
												</Table.Td>
												<Table.Td>
													<Text fz={'xs'}  pl={4}>{item.result}</Text>
												</Table.Td>
												<Table.Td>
													<Text fz={'xs'}  pl={4}>{item.unit}</Text>
												</Table.Td>
												<Table.Td>
													<Text fz={'xs'}  pl={4}>{item.reference_value}</Text>
												</Table.Td>
											</Table.Tr>

										))}
									</Table.Tbody>
								</Table>
							</Box>
						</Box>
					</Box>

					{/* =============== Additional Information Section ================ */}
					<Box mb="md">
						<Text fw="bold" size="xs" mb="xs" c="#1e40af">
							{t("Comment")}
						</Text>
						<Box p="xs" bd="1px solid #ddd" style={{ borderRadius: "6px" }}>
							<Text size="xs">{report?.comment|| ""}</Text>
						</Box>
					</Box>
					{/* =============== Doctor Information and Signature ================ */}
					<Divider mb="md" />
					<Box mb="md">
						<Grid columns={12} gutter="xs">
							<Grid.Col span={4}>
								<Box>

									<Box h={60} ta="center" bd="1px dashed #ccc" style={{ borderRadius: "4px" }}>
										{renderImagePreview([], patientInfo?.signature_path)}
									</Box>
									<Text fw="bold" size="xs" mb="sm" c="#1e40af" ta="center">
										{report?.assign_labuser_name}
									</Text>
								</Box>
							</Grid.Col>
							<Grid.Col span={4}>

							</Grid.Col>
							<Grid.Col span={4}>
								<Box>
									<Box h={60} ta="center" bd="1px dashed #ccc" style={{ borderRadius: "4px" }}>
										{renderImagePreview([], patientInfo?.signature_path)}
									</Box>
									<Text fw="bold" size="xs" mb="sm" c="#1e40af" ta="center">
										{report?.assign_doctor_name}
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
