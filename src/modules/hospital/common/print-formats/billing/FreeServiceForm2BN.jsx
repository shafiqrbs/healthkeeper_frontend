import { Box, Text, Grid, Group, Image, Table, Stack, Flex } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import { capitalizeWords } from "@/common/utils";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";

const FreeServiceForm2BN = forwardRef(({ data, preview = false }, ref) => {
	const patientInfo = data || {};
	const { hospitalConfigData } = useHospitalConfigData();

	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

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
					<Box px={"xl"}>
						<Table
							style={{
								borderCollapse: "collapse",
								width: "100%",
							}}
							className="customTable"
						>
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
									<Table.Td colSpan={3}>
										<Text ta="center" py="mes" size="md" fw={600}>
											{t("বিছানা ভাড়া বাবদ (অতিরিক্ত) টাকা ফেরত পাওয়ার জন্য আবেদন ফর্ম")}
										</Text>
									</Table.Td>
								</Table.Tr>
								<Table.Tr>
									<Table.Td colSpan={3}>
										<Box px="mes" pt="2xs" pb="sm">
											<Text fz={"xs"}>{t("তারিখঃ  /  /২০   ইং")}</Text>
											<Text fz={"xs"}>{t("বরাবর")}</Text>
											<Text fz={"xs"}>{t("উপ-পরিচালক")}</Text>
											<Text fz={"xs"}>{t("২৫০ শয্যা বিশিষ্ট টিবি হাসপাতাল")}</Text>
											<Text fz={"xs"}>{t("শ্যামলী, ঢাকা - ১২০৭")}</Text>

											<Text my="sm" fz={"xs"}>
												{t(
													"বিষয়ঃ বিছানা ভাড়া বাবদ (অতিরিক্ত) ............ টাকা ফেরত পাওয়ার জন্য আবেদন ফর্ম"
												)}
											</Text>
											<Text fz={"xs"}>{t("জনাব")}</Text>
											<Text fz={"xs"}>
												{t(
													"যথাযথ সম্মান প্রদর্শন পূর্বক বিনীত নিবেদন এই যে, আমি........................, বয়স............বছর, হাসপাতাল আইডি/রেজিস্ট্রেশন নং..................... আমি গত ........................ তারিখ হইতে ..................... তারিখ পর্যন্ত অত্র হাসপাতাল ওয়ার্ড নং............ এর বিছানা নং.............../ কেবিন নং............ এ ভর্তি ছিলাম এবং অদ্য .................. তারিখ আমায় হাসপাতাল থেকে ছুটি প্রদান করা হয়। এমতাবস্থায় আমি বিছানাভাড়া (রিফান্ড বিল মোতাবেক) বাবদ ............... টাকা অতিরিক্ত প্রদান করায় ফেরত পেতে ইচ্ছুক।"
												)}
											</Text>
											<Text fz={"xs"} mt="sm">
												{t(
													"অতএব, মহোদয়ের নিকট বিনীত নিবেদন এই যে, আমার উক্ত টাকা ফেরত পাওয়ের জন্য প্রয়োজনীয় ব্যবস্থা গ্রহণের আপনার সু-মর্জি কামনা করছি।"
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
											<Text size="sm">{getValue(patientInfo?.patient_id || "")}</Text>
										</Group>
									</Table.Td>
									<Table.Td>
										<Group gap="xs">
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
								<Table.Tr>
									<Table.Td colspan={"2"}>
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
												{patientInfo?.year ? `${patientInfo?.year} Years` : ""}{" "}
												{patientInfo?.month ? `${patientInfo?.month} Mon` : ""}{" "}
												{patientInfo?.day ? `${patientInfo?.day} Day` : ""}
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
											<Text size="xs">{capitalizeWords(patientInfo?.gender || "")}</Text>
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
													<> / {getValue(patientInfo?.guardian_mobile, "")}</>
												)}
											</Text>
										</Group>
									</Table.Td>
								</Table.Tr>

								<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Table.Td colSpan={3}>
										<Grid columns={12} gutter="0" mt={"md"}>
											<Grid.Col span={6} align="left">
												<Text fz="sm" pb={"xs"}>
													{t("আবেদনকারী")}
												</Text>
												<Text fz="xs" pb={"xs"}>
													স্বাক্ষর------------------
												</Text>
												<Text fz="xs" pb={"xs"}>
													নাম--------------------------
												</Text>
												<Text fz="xs" pb={"xs"}>
													মোবাইল-----------------------
												</Text>
												<Text fz="xs" pb={"xs"}>
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
										<Box px="mes" pt="sm" pb="sm">
											<Table
												style={{
													borderCollapse: "collapse",
													width: "100%",
												}}
												className="customTable"
											>
												<Table.Tbody>
													<Table.Tr>
														<Table.Td style={{ width: "50%" }}>
															<Text size="xs" fw={600}>
																Admission Date:{" "}
																{getValue(
																	patientInfo?.admission_date_time ||
																		patientInfo?.admission_date,
																	""
																)}
															</Text>
														</Table.Td>
														<Table.Td style={{ width: "50%" }}>
															<Text size="xs" fw={600}>
																Admission Fee:{" "}
																{getValue(patientInfo?.admission_fee, "0")}
															</Text>
														</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>
															<Text size="xs" fw={600}>
																Bed/Cabin Num:{" "}
																{getValue(
																	patientInfo?.room_name ||
																		patientInfo?.bed_name ||
																		patientInfo?.cabin_name,
																	""
																)}
															</Text>
														</Table.Td>
														<Table.Td>
															<Text size="xs" fw={600}>
																Bed/Cabin Fee (Per Day):{" "}
																{getValue(
																	patientInfo?.room_price ||
																		patientInfo?.bed_fee ||
																		patientInfo?.cabin_fee,
																	"0"
																)}
															</Text>
														</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>
															<Text size="xs" fw={600}>
																Paid Day(s):{" "}
																{getValue(
																	patientInfo?.room_consume_day ||
																		patientInfo?.paid_days,
																	"0"
																)}
															</Text>
														</Table.Td>
														<Table.Td>
															<Text size="xs" fw={600}>
																Paid Amount: {getValue(patientInfo?.paid_amount, "0")}
															</Text>
														</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>
															<Text size="xs" fw={600}>
																Hospital Day(s):{" "}
																{getValue(
																	patientInfo?.hospital_days ||
																		patientInfo?.room_admission_day,
																	"0"
																)}
															</Text>
														</Table.Td>
														<Table.Td>
															<Text size="xs" fw={600}>
																Hospital Amount:{" "}
																{getValue(patientInfo?.hospital_amount, "0")}
															</Text>
														</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Td>
															<Text size="xs" fw={600}>
																Refund Day(s):{" "}
																{getValue(
																	patientInfo?.refund_days ||
																		patientInfo?.remaining_day,
																	"0"
																)}
															</Text>
														</Table.Td>
														<Table.Td>
															<Text size="xs" fw={600}>
																Refund Amount:{" "}
																{getValue(patientInfo?.refund_amount, "0")}
															</Text>
														</Table.Td>
													</Table.Tr>
												</Table.Tbody>
											</Table>
										</Box>
									</Table.Td>
								</Table.Tr>
							</Table.Tbody>
						</Table>
					</Box>
				</Box>
			</Stack>
		</Box>
	);
});

FreeServiceForm2BN.displayName = "FreeServiceForm2BN";

export default FreeServiceForm2BN;
