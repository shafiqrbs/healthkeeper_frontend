import { Box, Text, Grid, Group, Image, Table } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import { getLoggedInUser } from "@/common/utils";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const AdmissionFormBN = forwardRef(({ data, preview = false }, ref) => {
	const user = getLoggedInUser();

	const admissionData = data || {};

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
								{t("AdmissionForm")}
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
									{t("প্রকার")} {getValue(admissionData?.mode_name, "")}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="md" fw={600}>
									{t("বহির্বিভাগ কক্ষ")}
								</Text>
								<Text size="md">{getValue(admissionData?.room_name, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">{getValue(admissionData?.invoice, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">{getValue(admissionData?.patient_id, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("HID")}
								</Text>
								<Text size="xs">{getValue(admissionData?.health_id, "")}</Text>
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
								<Text size="xs">{getValue(admissionData?.name, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("মোবাইল")}
								</Text>
								<Text size="xs">{getValue(admissionData?.mobile, "")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("লিঙ্গ")}
								</Text>
								<Text size="xs">
									{admissionData?.gender &&
										admissionData.gender[0].toUpperCase() + admissionData.gender.slice(1)}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">
									{t("তারিখ")}: {getValue(admissionData?.created)}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("বয়স")}
								</Text>
								<Text size="xs">
									{getValue(admissionData?.year, 0)} Y, {getValue(admissionData?.month, 0)} M,{" "}
									{getValue(admissionData?.day, 0)} D
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("জন্ম তারিখ")}
								</Text>
								<Text size="xs">{getValue(admissionData?.dob, "")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("ফি পরিমাণ")}
								</Text>
								<Text size="xs">{getValue(admissionData?.total, 0)}</Text>
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== billing details table ================ */}
				<Box pos="relative" my="lg">
					<Table withTableBorder withColumnBorders>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>{t("Particular")}</Table.Th>
								<Table.Th>{t("Quantity")}</Table.Th>
								<Table.Th>{t("Price")}</Table.Th>
								<Table.Th>{t("Total")}</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{admissionData?.entities?.map((item, index) => (
								<Table.Tr key={index}>
									<Table.Td>{item.item_name || t("Fee")}</Table.Td>
									<Table.Td>{item.quantity}</Table.Td>
									<Table.Td>{item.price}</Table.Td>
									<Table.Td>{item.sub_total}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Box>

				{/* =============== payment summary table ================ */}
				<Box pos="relative" my="lg">
					<Table withTableBorder withColumnBorders>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>{t("Description")}</Table.Th>
								<Table.Th>{t("Amount")}</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td fw={600}>{t("Receive")}</Table.Td>
								<Table.Td fw={600}>৳ {getValue(admissionData?.total, "0")}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td fw={600}>{t("Return")}</Table.Td>
								<Table.Td fw={600}>৳ {getValue(admissionData?.return_amount, "0")}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td fw={600}>{t("Balance")}</Table.Td>
								<Table.Td fw={600}>৳ {getValue(admissionData?.balance, "0")}</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>

				<Box bd="1px solid #555" style={{ borderRadius: "4px" }}>
					{/* =============== top section with printed by and signature ================ */}
					<Grid columns={12} gutter="0">
						<Grid.Col span={6} pl="xl">
							<Text fz="xl">{admissionData?.doctor_name || "N/A"}</Text>
							<Text fz="xs">{admissionData?.designation_name || "N/A"}</Text>
							<Text fz="xs">Doctor ID: {getValue(admissionData?.employee_id)}</Text>
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

AdmissionFormBN.displayName = "AdmissionFormBN";

export default AdmissionFormBN;
