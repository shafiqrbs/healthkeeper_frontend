import { Box, Text, Stack, Group, Image, Table } from "@mantine/core";
import { forwardRef } from "react";
import TbImage from "@assets/images/tb_logo.png";
import GovtLogo from "@assets/images/government_seal_of_bangladesh.svg";
import { getLoggedInUser } from "@/common/utils";
import { useTranslation } from "react-i18next";
import useDomainHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import Barcode from "react-barcode";

const DashedLine = () => (
	<Text size="2xs" ta="center" ff="monospace">
		-----------------------------------------------
	</Text>
);

const DetailsInvoicePosEN = forwardRef(({ data, preview = false }, ref) => {
	const user = getLoggedInUser();
	const { t } = useTranslation();
	const { hospitalConfigData } = useDomainHospitalConfigData();

	const patientInfo = data || {};

	return (
		<Box display={preview ? "block" : "none"}>
			<Box ref={ref} w="80mm" p={8} bg="var(--mantine-color-white)" mx="auto">
				<Stack gap={2}>
					{/* =============== header section with logo and hospital info =============== */}
					<Group justify="space-between" align="center" gap={8}>
						<Image src={GovtLogo} alt="Govt Logo" width={30} height={30} fit="contain" />
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
						<Image src={TbImage} alt="TB Hospital" width={30} height={30} fit="contain" />
					</Group>
					<DashedLine />

					{/* =============== prescription title =============== */}
					<Text size="sm" fw={700} ta="center">
						{t("Ticket")} - {patientInfo?.payment_mode_name || "Cash"}
					</Text>
					<Text size="xs" fw={700} ta="center">
						<strong>{t("Bill Details")}:</strong> {patientInfo?.room_name || ""}
					</Text>
					<DashedLine />

					{/* =============== essential patient info =============== */}
					<Table fz="10px" verticalSpacing={1} withRowBorders={false}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>{t("Date")}:</strong> {patientInfo?.created || ""}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("ID")}:</strong> {patientInfo?.patient_id || ""}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>{t("Name")}:</strong> {patientInfo?.name || ""}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("Mobile")}:</strong> {patientInfo?.mobile || ""}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("Gender")}:</strong> {patientInfo?.gender || ""}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>

					<DashedLine />

					{/* =============== financial summary =============== */}
					<Table fz="10px" verticalSpacing={1} withRowBorders={false}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>{t("Admission Fee")}:</strong>
								</Table.Td>
								<Table.Td align="right">৳ {patientInfo?.admission_fee || 0}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("Cabin Rent")}:</strong>
								</Table.Td>
								<Table.Td align="right">৳ {patientInfo?.cabin_rent || 0}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("Total Deposit")}:</strong>
								</Table.Td>
								<Table.Td align="right">৳ {patientInfo?.total_deposit || 0}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("Discount")}:</strong>
								</Table.Td>
								<Table.Td align="right">৳ {patientInfo?.discount_amount || 0}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("Refund")}:</strong>
								</Table.Td>
								<Table.Td align="right">৳ {patientInfo?.refund_amount || 0}</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>

					<DashedLine />
					<Group justify="space-between" px={4}>
						<Text size="sm" fw={700}>
							{t("Total Payable")}:
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
									<Barcode fontSize={"12"} width={"1"} height={"40"} value={patientInfo?.invoice} />
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("CreatedBy")}:</strong> {patientInfo?.created_by_name || ""}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("PrintedBy")}:</strong> {user?.name}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2} align="center">
									<strong>{t("প্রিন্টের সময়")}:</strong> {new Date().toLocaleString()}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					<Text size="2xs" ta="center" pb={"xl"}>
						© {new Date().getFullYear()} {hospitalConfigData?.organization_name} {t("All Rights Reserved")}।
					</Text>
				</Stack>
			</Box>
		</Box>
	);
});

DetailsInvoicePosEN.displayName = "DetailsInvoicePosEN";

export default DetailsInvoicePosEN;
