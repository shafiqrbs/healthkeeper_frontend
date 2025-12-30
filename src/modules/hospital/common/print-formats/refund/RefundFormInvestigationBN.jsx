import { Box, Text, Grid, Group, Image, Table, Stack, Flex } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import { capitalizeWords, formatDateTimeAmPm } from "@/common/utils";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { formatDate } from "@utils/index";

const RefundFormInvestigationBN = forwardRef(({ data, preview = false }, ref) => {
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
											{t("প্যাথলজি / রেডিওলজি বিল বাবদ জমাকৃত টাকা ফেরত পাওয়ার জন্য আবেদন ফর্ম")}
										</Text>
									</Table.Td>
								</Table.Tr>
								<Table.Tr>
									<Table.Td colSpan={3}>
										<Box px="mes" pt="2xs" pb="sm">
											<Text fz={"xs"}>
												{t("তারিখঃ")}
												{formatDate(patientInfo?.created_at)}
											</Text>
											<Text fz={"xs"}>{t("বরাবর")}</Text>
											<Text fz={"xs"}>{t("উপ-পরিচালক")}</Text>
											<Text fz={"xs"}>{t("২৫০ শয্যা বিশিষ্ট টিবি হাসপাতাল")}</Text>
											<Text fz={"xs"}>{t("শ্যামলী, ঢাকা - ১২০৭")}</Text>

											<Text my="sm" fz={"xs"}>
												{t(
													"বিষয়ঃ প্যাথলজি / রেডিওলজি বিল বাবদ জমাকৃত (অনিবার্য কারণে না হওয়ায়) টাকা ফেরত পাওয়ার জন্য আবেদন ফর্ম"
												)}
											</Text>
											<Text fz={"xs"}>{t("জনাব")}</Text>
											<Text fz={"xs"}>
												{t(
													`যথাযথ সম্মান প্রদর্শন পূর্বক বিনীত নিবেদন এই যে, আমি ${
														patientInfo?.name || ""
													}, বয়স ${patientInfo?.year ? `${patientInfo?.year} বছর` : ""} ${
														patientInfo?.month ? `${patientInfo?.month} মাস` : ""
													}, হাসপাতাল আইডি/রেজিস্ট্রেশন নং ${getValue(
														patientInfo?.patient_id || ""
													)} আমি অদ্য ${formatDateTimeAmPm(
														patientInfo?.created_at
													)} তারিখে হাসপাতালের বহিবি ভাগের রোগী হিসাবে পরীক্ষা-নিরীক্ষা বাবদ বিল কাউন্টারে ${getValue(
														patientInfo?.total,
														"0"
													)} টাকা জমা দেওয়া হয় এবং এর মধ্যে ${getValue(
														patientInfo?.amount,
														"0"
													)} টাকা (অনিবার্য কারণে পরীক্ষা-নিরীক্ষা না হওয়ায়) উক্ত টাকা অতিরিক্ত হওয়ায় তা ফেরত পেতে ইচ্ছুক।`
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
												withTableBorder
												withColumnBorders
												borderColor="var(--theme-tertiary-color-8)"
											>
												<Table.Thead>
													<Table.Tr
														style={{ border: "1px solid var(--theme-tertiary-color-8)" }}
													>
														<Table.Td colSpan={3}>
															<Group gap="xs">
																<Text size="md" fw={600}>
																	{t("PaymentDetails")}:
																</Text>
															</Group>
														</Table.Td>
													</Table.Tr>
													<Table.Tr>
														<Table.Th>{t("Particular")}</Table.Th>
														<Table.Th ta="center">{t("Quantity")}</Table.Th>
														<Table.Th ta="center">{t("Price")}</Table.Th>
														<Table.Th ta={"right"}>{t("Total")}</Table.Th>
													</Table.Tr>
												</Table.Thead>
												<Table.Tbody>
													{patientInfo?.items?.map((item, index) => (
														<Table.Tr key={index}>
															<Table.Td>{item.item_name}</Table.Td>
															<Table.Td width={80} align="center">
																{item.quantity}
															</Table.Td>
															<Table.Td width={80} align="center">
																{item.price}
															</Table.Td>
															<Table.Td fw={600} width={110} ta={"right"}>
																{item.sub_total}
															</Table.Td>
														</Table.Tr>
													))}
													<Table.Tr>
														<Table.Td colSpan={3} fw={600} ta={"right"}>
															{t("Amount")}
														</Table.Td>
														<Table.Td width={110} fw={600} ta={"right"}>
															{getValue(patientInfo?.total, "0")}
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

RefundFormInvestigationBN.displayName = "RefundFormInvestigationBN";

export default RefundFormInvestigationBN;
