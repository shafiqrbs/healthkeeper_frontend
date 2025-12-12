import { Box, Text, Grid, Group, Image, Table, Stack, Flex, SimpleGrid } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import { capitalizeWords } from "@/common/utils";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import Barcode from "react-barcode";
import { IconPhoneCall } from "@tabler/icons-react";
import DashedDivider from "@components/core-component/DashedDivider";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const FreeServiceFormBN = forwardRef(({ data, preview = false }, ref) => {
	const { user } = useAppLocalStore();

	const patientInfo = data || {};
	const { hospitalConfigData } = useHospitalConfigData();

	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	console.log(patientInfo);

	return (
		<Box display={preview ? "block" : "none"}>
			<style>
				{`@media print {
					#free-service table { border-collapse: collapse !important; }
					#free-service table, #free-service table th, #free-service table td { border: 1px solid #807e7e !important; }
				}`}
				{`@media  {
					#free-service table { border-collapse: collapse !important;border: 1px solid #807e7e !important; }
					#free-service table, #free-service table th, #free-service table td {  padding-top:0!important; padding-bottom:0!important; margin-top:0!important; margin-bottom:0!important; }
				}`}
			</style>
			<Stack
				id="free-service"
				ref={ref}
				w="210mm"
				mih="1122px"
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
				align="stretch"
				p="xs"
				justify="space-between"
				gap="xl"
			>
				<Box>
					<Box>
						<Table
							style={{
								borderCollapse: "collapse",
								width: "100%",
							}}
							className="customTable"
						>
							<Table.Tbody>
								<Table.Tr
									style={{ border: "1px solid var(--theme-tertiary-color-8)" }}
								>
									<Table.Td colSpan={"3"}>
										<Box mb="sm">
											<Flex gap="md" justify="center">
												<Box>
													<Group ml="md" align="center" h="100%">
														<Image
															src={GLogo}
															alt="logo"
															width={60}
															height={60}
														/>
													</Group>
												</Box>
												<Box>
													<Text
														ta="center"
														fw="bold"
														size="lg"
														c="#1e40af"
														mt="2"
													>
														{hospitalConfigData?.organization_name ||
															""}
													</Text>
													<Text ta="center" size="sm" c="gray" mt="2">
														{hospitalConfigData?.address || ""}
													</Text>
													<Text ta="center" size="sm" c="gray" mb="2">
														{t("হটলাইন")}{" "}
														{hospitalConfigData?.hotline || ""}
													</Text>
												</Box>
												<Box>
													<Group
														mr="md"
														justify="flex-end"
														align="center"
														h="100%"
													>
														<Image
															src={TBLogo}
															alt="logo"
															width={60}
															height={60}
														/>
													</Group>
												</Box>
											</Flex>
										</Box>
									</Table.Td>
								</Table.Tr>
								<Table.Tr
									style={{ border: "1px solid var(--theme-tertiary-color-8)" }}
								>
									<Table.Td colSpan={3}>
										<Text ta="center" py="mes" size="md" fw={600}>
											{t("ইউজার ফি মওকুফের জন্য আবেদন ফর্ম")}
										</Text>
									</Table.Td>
								</Table.Tr>
								<Table.Tr>
									<Table.Td colSpan={3}>
										<Box px="mes" pt="2xs" pb="sm">
											<Text>{t("বরাবর")}</Text>
											<Text>{t("উপ-পরিচালক")}</Text>
											<Text>{t("২৫০ শয্যা বিশিষ্ট টিবি হাসপাতাল")}</Text>
											<Text>{t("শ্যামলী, ঢাকা।")}</Text>

											<Text my="sm" fz={'xs'}>
												{t("বিষয়ঃ ইউজার ফি মওকুফের জন্য আবেদন।")}
											</Text>
											<Text fz={'xs'}>
												{t(
													"জনাব, উপরোক্ত বিষয়ের আলোকে আমি/ আমার রোগী/ গরিব ও দুস্থ/ মুক্তযোদ্ধা/ একাডেমিক/ সরকারি কর্মকর্তা কর্মচারী/ সরকারি কর্মকর্তা ও কর্মচারীর পোষ্য (প্রযোজ্যক্ষেত্রে), যাহার বিবরণ নিম্নরূপঃ"
												)}
											</Text>
										</Box>
									</Table.Td>
								</Table.Tr>
								<Table.Tr>
									<Table.Td>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("PatientID")}:
											</Text>
											<Text size="sm">
												{getValue(patientInfo?.patient_id || "")}
											</Text>
										</Group>
									</Table.Td>
									<Table.Td>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("AdmissionID")}:
											</Text>
											<Text size="sm">
												{getValue(patientInfo?.invoice || "")}
											</Text>
										</Group>
									</Table.Td>
									<Table.Td>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("PatientType")}:
											</Text>
											<Text size="sm">
												{getValue(patientInfo?.payment_mode_name, "")}
											</Text>
										</Group>
									</Table.Td>
								</Table.Tr>
								<Table.Tr>
									<Table.Td colspan={'2'}>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("Name")}:
											</Text>
											<Text size="sm">{getValue(patientInfo?.name, "")}</Text>
										</Group>
									</Table.Td>

									<Table.Td>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("Age")}:
											</Text>
											<Text size="xs">
												{patientInfo?.year || 0} Years{" "}
												{patientInfo?.month || 0} Mon{" "}
												{patientInfo?.day || 0} Day
											</Text>
										</Group>
									</Table.Td>
								</Table.Tr>

								<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Table.Td>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("Gender")}:
											</Text>
											<Text size="xs">
												{capitalizeWords(patientInfo?.gender || "")}
											</Text>
										</Group>
									</Table.Td>
									<Table.Td colspan={2}>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("Mobile")}:
											</Text>
											<Text size="xs">
												{getValue(patientInfo?.mobile, "")}
												{patientInfo?.guardian_mobile && (
													<>
														{" "}
														/{" "}
														{getValue(patientInfo?.guardian_mobile, "")}
													</>
												)}
											</Text>
										</Group>
									</Table.Td>
								</Table.Tr>
								<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Table.Td colSpan={3}>
										<Box  ml={'xs'} fz={'md'}>
											<span fz={'xl'}>List of Test Name:</span>
											{patientInfo?.invoice_particular?.map((item, index) => (
												<span key={index}>
    												{index + 1}. {item.item_name || t("Fee")}
													{index !== patientInfo.invoice_particular.length - 1 && ", "}
  												</span>
											))}
										</Box>
									</Table.Td>
								</Table.Tr>
								<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Table.Td colSpan={3}>
										<Grid columns={12} gutter="0" mt={'md'}>
											<Grid.Col span={6} align="left">
												<Text fz="xl">{t("আবেদনকারী")}</Text>
												<Text fz="xs" pb={'xs'} pt={'xl'}>
													Sign------------------
												</Text>
												<Text fz="xs" pb={'xs'}>
													নাম--------------------------
												</Text>
												<Text fz="xs" pb={'xs'}>
													মোবাইল-----------------------
												</Text>
												<Text fz="xs" pb={'xs'}>
													রোগীর সাথে সম্পর্ক---------------
												</Text>
											</Grid.Col>
											<Grid.Col span={6} align={"right"}>
												<Text size="sm" fw={600} mb="xs">
													<Text mt={"md"}>
														<br />
													</Text>
													<Text mt={"md"}>
														<br />
													</Text>

												</Text>
											</Grid.Col>
										</Grid>
									</Table.Td>
								</Table.Tr>
								<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Table.Td colSpan={3}>
										<SimpleGrid cols={3} spacing="xl" mt="xl">
											{/* Checked By */}
											<Box>
												<Box
													style={{
														borderBottom: "2px dashed #999",
														height: 40,
													}}
												/>
												<Text ta="center" size="sm" mt={4} fw={500}>

												</Text>
												<Text ta="center" size="xs" c="dimmed" pb={'xs'}>
													Approved By
												</Text>
											</Box>

											{/* Approved By */}
											<Box>
												<Box
													style={{
														borderBottom: "2px dashed #999",
														height: 40,
													}}
												/>
												<Text ta="center" size="sm" mt={4} fw={500}>

												</Text>
												<Text ta="center" size="xs" c="dimmed" pb={'xs'}>
													RP/RS By
												</Text>
											</Box>

											{/* Created By */}
											<Box>
												<Box
													style={{
														borderBottom: "2px dashed #999",
														height: 40,
													}}
												/>
												<Text ta="center" size="sm" mt={4} fw={500}>
													{/*{patientInfo?.created_by_name || "—"}*/}
												</Text>
												<Text ta="center" size="xs" c="dimmed" pb={'xs'}>
													Medicated of
												</Text>
											</Box>
										</SimpleGrid>
									</Table.Td>
								</Table.Tr>
							</Table.Tbody>
						</Table>
					</Box>


				</Box>

				{/* =============== payment summary table ================ */}
				<Box ta="left">
					<Box pos="relative" mt="xl" mb={'md'}>
						<Table
							withTableBorder
							withColumnBorders
							borderColor="var(--theme-tertiary-color-8)"
						>
							<Table.Thead>
								<Table.Tr
									style={{ border: "1px solid var(--theme-tertiary-color-8)" }}
								>
									<Table.Td colSpan={"6"}>
										<Flex gap="md" align="center" justify="center">
											<Flex>
												<Image
													src={GLogo}
													alt="logo"
													width={46}
													height={46}
												/>
												<Box pl={"xs"} pr={"xs"}>
													<Text
														ta="center"
														fw="bold"
														size="lg"
														c="#1e40af"
														mt="2"
													>
														{hospitalConfigData?.organization_name ||
															""}
													</Text>
													<Text ta="center" size="sm" c="gray" mt="2">
														{hospitalConfigData?.address || ""},
														<IconPhoneCall
															style={{ width: "12", height: "12" }}
															stroke={1.5}
														/>{" "}
														{(hospitalConfigData?.hotline &&
															` ${hospitalConfigData?.hotline}`) ||
															""}
													</Text>
												</Box>
												<Image
													src={TBLogo}
													alt="logo"
													width={46}
													height={46}
												/>
											</Flex>
										</Flex>
									</Table.Td>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								<Table.Tr>
									<Table.Td>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("PatientID")}:
											</Text>
											<Text size="sm">
												{getValue(patientInfo?.patient_id || "")}
											</Text>
										</Group>
									</Table.Td>
									<Table.Td>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("AdmissionID")}:
											</Text>
											<Text size="sm">
												{getValue(patientInfo?.invoice || "")}
											</Text>
										</Group>
									</Table.Td>
									<Table.Td>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("PatientType")}:
											</Text>
											<Text size="sm">
												{getValue(patientInfo?.payment_mode_name, "")}
											</Text>
										</Group>
									</Table.Td>
								</Table.Tr>
								<Table.Tr>
									<Table.Td>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("Name")}:
											</Text>
											<Text size="sm">{getValue(patientInfo?.name, "")}</Text>
										</Group>
									</Table.Td>
									<Table.Td>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("Gender")}:
											</Text>
											<Text size="xs">
												{capitalizeWords(patientInfo?.gender || "")}
											</Text>
										</Group>
									</Table.Td>
									<Table.Td>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("Age")}:
											</Text>
											<Text size="xs">
												{patientInfo?.year || 0} Years{" "}
												{patientInfo?.month || 0} Mon{" "}
												{patientInfo?.day || 0} Day
											</Text>
										</Group>
									</Table.Td>
								</Table.Tr>
								<Table.Tr>
									<Table.Th>{t("Particular")}</Table.Th>
									<Table.Th>{t("Room No")}</Table.Th>
								</Table.Tr>
								{patientInfo?.invoice_particular?.map((item, index) => (
									<Table.Tr key={index}>
										<Table.Td>{item?.item_name || t("Fee")}</Table.Td>
										<Table.Td>{item?.diagnostic_room_name}</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</Box>
				</Box>
			</Stack>
		</Box>
	);
});

FreeServiceFormBN.displayName = "FreeServiceFormBN";

export default FreeServiceFormBN;
