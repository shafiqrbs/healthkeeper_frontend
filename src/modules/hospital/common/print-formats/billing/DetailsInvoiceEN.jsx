import { Box, Text, Grid, Group, Image, Table } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const DetailsInvoiceEN = forwardRef(({ data, preview = false }, ref) => {
	const { user } = useAppLocalStore();

	const patientInfo = data || {};
	const { hospitalConfigData } = useHospitalConfigData();

	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	return (
		<Box display={preview ? "block" : "none"}>
			<style>
				{`@media print {
					table { border-collapse: collapse !important; }
					table, table th, table td { border: 1px solid #807e7e !important; }
				}`}
			</style>
			<Box
				ref={ref}
				p="md"
				w={PAPER_WIDTH}
				h={PAPER_HEIGHT}
				style={{ overflow: "hidden" }}
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
				bd="1px solid black"
			>
				{/* =============== header section with doctor information in bengali and english ================ */}
				<Box mb="xs">
					<Grid gutter="md">
						<Grid.Col span={4}>
							<Group ml="md" align="center" h="100%" py="xs">
								<Image src={GLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
						<Grid.Col span={4}>
							<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
								{getValue(hospitalConfigData?.organization_name, "")}
							</Text>
							<Text ta="center" size="xs" c="gray" mt="2">
								{getValue(hospitalConfigData?.address, "")}
							</Text>
							<Text ta="center" size="xs" c="gray" mb="2">
								{t("হটলাইন")} {getValue(hospitalConfigData?.hotline, "")}
							</Text>
							<Text fw={600} ta="center" size="md" mb="2">
								{t("BillDetails")}
							</Text>
						</Grid.Col>
						<Grid.Col span={4}>
							<Group mr="md" justify="flex-end" align="center" h="100%" py="xs">
								<Image src={TBLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== patient information section ================ */}
				<Box mb="xs">
					<Grid columns={12} gutter="xs" px={4}>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="md" fw={600}>
									{t("প্রকার")} {getValue(patientInfo?.mode_name, "")}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="md" fw={600}>
									{t("বহির্বিভাগ কক্ষ")}
								</Text>
								<Text size="md">{getValue(patientInfo?.room_name, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">{getValue(patientInfo?.invoice, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">{getValue(patientInfo?.patient_id, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("HID")}
								</Text>
								<Text size="xs">{getValue(patientInfo?.health_id, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs" />
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("নাম")}
								</Text>
								<Text size="xs">{getValue(patientInfo?.name, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("মোবাইল")}
								</Text>
								<Text size="xs">{getValue(patientInfo?.mobile, "")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("লিঙ্গ")}
								</Text>
								<Text size="xs">
									{patientInfo?.gender &&
										patientInfo.gender[0].toUpperCase() +
											patientInfo.gender.slice(1)}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">
									{t("তারিখ")}: {getValue(patientInfo?.created)}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("বয়স")}
								</Text>
								<Text size="xs">
									{getValue(patientInfo?.year, 0)} Y,{" "}
									{getValue(patientInfo?.month, 0)} M,{" "}
									{getValue(patientInfo?.day, 0)} D
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("জন্ম তারিখ")}
								</Text>
								<Text size="xs">{getValue(patientInfo?.dob, "")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("ফি পরিমাণ")}
								</Text>
								<Text size="xs">{getValue(patientInfo?.total, 0)}</Text>
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== medical notes and prescription area with rx symbol ================ */}
				<Box pos="relative" my="lg">
					<Table withTableBorder withColumnBorders>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>{t("বিবরণ")}</Table.Th>
								<Table.Th>{t("মূল্য")}</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td fw={600}>{t("ভর্তি ফি")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.admission_fee, "0")}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td fw={600}>{t("ভর্তির তারিখ ও সময়")}</Table.Td>
								<Table.Td>
									{getValue(patientInfo?.admission_date_time, "")}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td fw={600}>{t("ছাড়ের তারিখ")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.discharge_date, "")}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td fw={600}>{t("মোট পরিশোধযোগ্য")}</Table.Td>
								<Table.Td fw={600}>
									{getValue(patientInfo?.total_payable, "0")}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>

				<Box pos="relative" mb="lg">
					<Table withTableBorder withColumnBorders>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>{t("সেবার নাম")}</Table.Th>
								<Table.Th>{t("মূল্য")}</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td fw={600}>{t("চিনির মাত্রা")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.sugar_level, "")}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td fw={600}>{t("সিটি স্ক্যান")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.ct_scan, "")}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td fw={600}>{t("ডিসচার্জ")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.somon_discharge, "")}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td fw={600}>{t("এমটি টেস্ট")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.mt_test, "")}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td fw={600}>{t("মোট")}</Table.Td>
								<Table.Td fw={600}>{getValue(patientInfo?.total, "0")}</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>

				<Box pos="relative" mb="lg">
					<Table withTableBorder withColumnBorders>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>{t("জমার তারিখ")}</Table.Th>
								<Table.Th>{t("সর্বমোট জমা")}</Table.Th>
								<Table.Th>{t("কেবিন ভাড়া")}</Table.Th>
								<Table.Th>{t("সর্বমোট")}</Table.Th>
								<Table.Th>{t("ফেরত পাবে")}</Table.Th>
								<Table.Th>{t("ফেরত পরিমাণ")}</Table.Th>
								<Table.Th>{t("ডিস্কাউন্ট পাবে")}</Table.Th>
								<Table.Th>{t("ডিস্কাউন্ট পরিমাণ")}</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									{getValue(patientInfo?.deposit_date, "১২-১২-২০২০")}
								</Table.Td>
								<Table.Td>{getValue(patientInfo?.total_deposit, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.cabin_rent, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.grand_total, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.refund_amount, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.refund_premium, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.discount_amount, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.discount_premium, "0")}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td fw={600} ta="center">
									{t("চূড়ান্ত ব্যালেন্স")}
								</Table.Td>
								<Table.Td>{getValue(patientInfo?.total_deposit, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.cabin_rent, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.grand_total, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.refund_amount, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.refund_premium, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.discount_amount, "0")}</Table.Td>
								<Table.Td>{getValue(patientInfo?.discount_premium, "0")}</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>

				<Box bd="1px solid #555" style={{ borderRadius: "4px" }}>
					{/* =============== top section with printed by and signature ================ */}
					<Grid columns={12} gutter="0">
						<Grid.Col span={6} pl="xl">
							<Text fz="xl">{patientInfo?.doctor_name || "N/A"}</Text>
							<Text fz="xs">{patientInfo?.designation_name || "N/A"}</Text>
							<Text fz="xs">Doctor ID: {getValue(patientInfo?.employee_id)}</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text size="sm" fw={600} mb="xs">
								<Text>{t("Signature")}</Text>
								{/* {renderImagePreview([], patientInfo?.signature_path)} */}
							</Text>
						</Grid.Col>
					</Grid>
				</Box>

				<Box ta="center">
					<Text size="xs" c="gray" mt="xs">
						<strong>{t("প্রিন্ট")}: </strong>
						{user?.name}
					</Text>
					<Text fz={8}>
						{t("প্রিন্টের সময়")}: {new Date().toLocaleString()}
					</Text>
				</Box>
			</Box>
		</Box>
	);
});

DetailsInvoiceEN.displayName = "DetailsInvoiceEN";

export default DetailsInvoiceEN;
