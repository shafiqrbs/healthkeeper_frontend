import { Box, Text, Stack, Group, Image, Table } from "@mantine/core";
import { forwardRef } from "react";
import TbImage from "@assets/images/tb_logo.png";
import GovtLogo from "@assets/images/government_seal_of_bangladesh.svg";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { useTranslation } from "react-i18next";
import useDomainHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import Barcode from "react-barcode";
import { t } from "i18next";

const DashedLine = () => (
	<Text size="2xs" ta="center" ff="monospace">
		-----------------------------------------------
	</Text>
);

const InvoicePosBN = forwardRef(({ data, preview = false }, ref) => {
	const { user } = useAppLocalStore();
	const { t } = useTranslation();
	const { hospitalConfigData } = useDomainHospitalConfigData();

	const patientInfo = data || {};

	return (
		<Box display={preview ? "block" : "none"}>
			<Box ref={ref} w="80mm" p={8} bg="var(--mantine-color-white)" mx="auto">
				<Stack gap={2}>
					{/* =============== header section with logo and hospital info =============== */}
					<Group justify="space-between" align="center" gap={8}>
						<Image
							src={GovtLogo}
							alt="Govt Logo"
							width={30}
							height={30}
							fit="contain"
						/>
						<Stack gap={0} ta="left">
							<Text ta="center" size="xs" fw={700}>
								{hospitalConfigData?.organization_name || "Hospital"}
							</Text>
							<Text ta="center" size="2xs">
								{hospitalConfigData?.address || "Uttara"}
							</Text>
							<Text ta="center" size="8px">
								{t("হটলাইন")} {hospitalConfigData?.hotline || "0987634523"}
							</Text>
						</Stack>
						<Image
							src={TbImage}
							alt="TB Hospital"
							width={30}
							height={30}
							fit="contain"
						/>
					</Group>
					<DashedLine />

					{/* =============== prescription title =============== */}
					<Text size="sm" fw={700} ta="center">
						{t("ইনভয়েস")} - {patientInfo?.payment_mode_name || "Cash"}
					</Text>
					<Text size="xs" fw={700} ta="center">
						<strong>{t("বিলের বিবরণ")}:</strong>
					</Text>
					<DashedLine />

					{/* =============== essential patient info =============== */}
					<Table fz="10px" verticalSpacing={2} withRowBorders={false}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td colspan={2}>
									<strong>তারিখ:</strong> {patientInfo?.created || ""}
								</Table.Td>
							</Table.Tr>
							{patientInfo?.health_id && (
								<Table.Tr>
									<Table.Td colspan={2} align="center">
										<strong>HID:</strong> {patientInfo?.health_id || ""}
									</Table.Td>
								</Table.Tr>
							)}
							<Table.Tr>
								<Table.Td>
									<strong>{patientInfo?.invoice || ""}</strong>
								</Table.Td>
								<Table.Td align="right">{patientInfo?.patient_id || ""}</Table.Td>
							</Table.Tr>

							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>{t("নাম")}:</strong> {patientInfo?.name || ""}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("বয়স")}: </strong>
									{patientInfo?.year ? `${patientInfo.year} ${t("বছর")} ` : ""}
									{patientInfo?.month ? `${patientInfo.month} ${t("মাস")} ` : ""}
									{patientInfo?.day ? `${patientInfo.day} ${t("দিন")}` : ""}
								</Table.Td>
								<Table.Td miw={100} align="right">
									{patientInfo?.dob && (
										<>
											<strong>{t("জন্ম")}</strong> {patientInfo?.dob}
										</>
									)}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("লিঙ্গ")}:</strong>{" "}
									{patientInfo?.gender &&
										patientInfo.gender[0].toUpperCase() +
											patientInfo.gender.slice(1)}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("মোবাইল")}:</strong> {patientInfo?.mobile || ""}
								</Table.Td>
							</Table.Tr>

							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>{t("ঠিকানা")}</strong>{" "}
									{[patientInfo?.upazila, patientInfo?.district]
										.filter(Boolean)
										.join(", ")}
								</Table.Td>
							</Table.Tr>
							{patientInfo?.guardian_name && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>{t("অভিভাবকের নাম")}:</strong>{" "}
										{patientInfo?.guardian_name || ""}
									</Table.Td>
								</Table.Tr>
							)}
							{patientInfo?.guardian_mobile && patientInfo?.guardian_name && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>{t("অভিভাবকের মোবাইল")}:</strong>{" "}
										{patientInfo?.guardian_mobile || ""}
									</Table.Td>
								</Table.Tr>
							)}
							<Table.Tr>
								<Table.Td colSpan={2} />
							</Table.Tr>
						</Table.Tbody>
					</Table>

					{/* =============== financial summary =============== */}
					<Table fz="10px" verticalSpacing={1} withRowBorders={false}>
						<Table.Tbody>
							<Table.Tr
								style={{ borderTop: "1px solid var(--theme-tertiary-color-8)" }}
							>
								<Table.Th>{t("Particular")}</Table.Th>
								<Table.Th style={{ textAlign: "right", width: "60px" }}>
									{t("Room")}
								</Table.Th>
								<Table.Th style={{ textAlign: "right", width: "70px" }}>
									{t("Amount")}
								</Table.Th>
							</Table.Tr>
							{patientInfo?.items?.map((item, index) => (
								<Table.Tr
									key={index}
									style={{ borderTop: "1px solid var(--theme-tertiary-color-8)" }}
								>
									<Table.Td>
										{index + 1}. {item?.item_name}
									</Table.Td>
									<Table.Td style={{ textAlign: "right", width: "60px" }}>
										{item?.diagnostic_room_name}
									</Table.Td>
									<Table.Td style={{ textAlign: "right", width: "70px" }}>
										৳ {item?.sub_total}
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
					<DashedLine />
					<Group justify="space-between" px={4}>
						<Text size="sm" fw={700}>
							{t("মোট পরিশোধ")}:
						</Text>
						<Text size="sm" fw={700}>
							৳ {patientInfo?.total_payable || patientInfo?.total || 0}
						</Text>
					</Group>
					<DashedLine />

					{/* =============== footer section =============== */}
					<Table withRowBorders={false} fz={10}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td colSpan={2} align="center">
									<Barcode
										fontSize={"12"}
										width={"1"}
										height={"40"}
										value={patientInfo?.invoice}
									/>
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("CreatedBy")}:</strong>{" "}
									{patientInfo?.created_by_name || ""}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("PrintedBy")}:</strong> {user?.name}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2} align="center">
									<strong>{t("প্রিন্টের সময়")}:</strong>{" "}
									{new Date().toLocaleString()}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					<Text size="2xs" ta="center" pb="xl">
						© {new Date().getFullYear()} {hospitalConfigData?.organization_name}{" "}
						{t("সর্বস্বত্ব সংরক্ষিত")}।
					</Text>
				</Stack>
			</Box>
		</Box>
	);
});

InvoicePosBN.displayName = "InvoicePosBN";

export default InvoicePosBN;
