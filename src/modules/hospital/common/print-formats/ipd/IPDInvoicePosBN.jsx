import { Box, Text, Stack, Group, Image, Table, Grid, NumberInput, Flex } from "@mantine/core";
import { forwardRef } from "react";
import TbImage from "@assets/images/tb_logo.png";
import GovtLogo from "@assets/images/government_seal_of_bangladesh.svg";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { useTranslation } from "react-i18next";
import useDomainHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import Barcode from "react-barcode";
import {capitalizeWords} from "@utils/index";

const DashedLine = () => (
	<Text size="2xs" ta="center" ff="monospace">
		-----------------------------------------------------------------------------------
	</Text>
);

const IPDInvoicePosBn = forwardRef(({ data, preview = false }, ref) => {
	const { user } = useAppLocalStore();
	const { t } = useTranslation();
	const { hospitalConfigData } = useDomainHospitalConfigData();

	const patientInfo = data || {};
	const entities = patientInfo?.invoice_particular;
	console.log(patientInfo);
	return (
		<Box display={preview ? "block" : "none"}>
			<Box ref={ref} w="140mm" p={8} mt={'50'} bg="var(--mantine-color-white)" mx="auto" style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
				<Stack gap={2}>
					{/* =============== header section with logo and hospital info =============== */}
					<Group justify="center" align="center" gap={8}>
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
						{t("Admission")} - {patientInfo?.parent_patient_mode_name}
					</Text>
					<Text size="xs" fw={700} ta="center">
						<strong>{t("বেড /কেবিন নং")}:</strong> {patientInfo?.room_name || ""}
					</Text>
					<DashedLine />
					<Table verticalSpacing={1} withRowBorders={false}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>{t("ইউনিট নং")}:</strong>{" "}
									{patientInfo?.admit_unit_name || ""}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("বিভাগ")}:</strong>{" "}
									{patientInfo?.admit_department_name || ""}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					<DashedLine />
					{/* =============== essential patient info =============== */}
					<Table verticalSpacing={1} withRowBorders={false}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>{t("তারিখ")}:</strong> {patientInfo?.created || ""}
								</Table.Td>
								<Table.Td align="right">
									{patientInfo?.patient_id || ""}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>{t("নাম")}:</strong> {patientInfo?.name || ""}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("মোবাইল")}:</strong> {patientInfo?.mobile || ""}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("লিঙ্গ")}:</strong> {capitalizeWords(patientInfo?.gender) || ""}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					<Table verticalSpacing={1} withRowBorders={false} mt={'xl'}>
						<Table.Tbody>
							<Table.Tr style={{ borderTop: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Th>{t("Particular")}</Table.Th>
								<Table.Th style={{ textAlign: "center", width: "80px" }}>{t("Days")}</Table.Th>
								<Table.Th style={{ textAlign: "right", width: "70px" }}>{t("Amount")}</Table.Th>
							</Table.Tr>
							{patientInfo?.items?.map((item, index) => (
								<Table.Tr key={index} style={{ borderTop: "1px solid var(--theme-tertiary-color-8)" }}>
									<Table.Td>
										{index + 1}. {item?.item_name}
									</Table.Td>
									<Table.Td style={{ textAlign: "center", width: "60px" }}>
										{item?.quantity}
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
						<Text  fw={700}>
							{t("মোট পরিশোধ")}:
						</Text>
						<Text size="sm" fw={700}>
							৳ {patientInfo?.total_payable || patientInfo?.total || 0}
						</Text>
					</Group>
					<DashedLine />
					{/* =============== footer section =============== */}
					<Table withRowBorders={false} >
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

IPDInvoicePosBn.displayName = "IPDInvoicePosBn";

export default IPDInvoicePosBn;
