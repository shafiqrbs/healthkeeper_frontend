import { Box, Text, Stack, Group, Image, Table } from "@mantine/core";
import { forwardRef } from "react";
import TbImage from "@assets/images/tb_logo.png";
import GovtLogo from "@assets/images/government_seal_of_bangladesh.svg";
import { getLoggedInUser } from "@/common/utils";
import { useTranslation } from "react-i18next";
import useDomainHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import {HOSPITAL_DATA_ROUTES} from "@/constants/routes";
import Barcode from "react-barcode";

const DashedLine = () => (
	<Text size="xxs" ta="center" ff="monospace">
		-----------------------------------------------
	</Text>
);

const OPDPos = forwardRef(({ref}) => {
	const user = getLoggedInUser();
	const { t } = useTranslation();
	const { hospitalConfigData } = useDomainHospitalConfigData();
	const { data: prescriptionData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/79`,
	});
	const patientInfo = prescriptionData?. data || {};

	return (
		<Box>
			<Box ref={ref} w="80mm" p={8} bg="white" mx="auto" bd="1px solid black">
				<Stack gap={2}>
					{/* =============== header section with logo and hospital info =============== */}
					<Group justify="space-between" align="center" gap={8}>
						<Image src={GovtLogo} alt="Govt Logo" width={30} height={30} fit="contain" />
						<Stack gap={0} ta="left">
							<Text ta="center" size="xs" fw={700}>
								{hospitalConfigData?.organization_name || "Hospital"}
							</Text>
							<Text ta="center" size="xxs">
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
						{t("টিকিট")} - {patientInfo?.payment_mode_name || "Cash"}
					</Text>
					<Text size="xs" fw={700} ta="center">
						<strong>{t("বহির্বিভাগ কক্ষ")}:</strong> {patientInfo?.room_name || "Room 1"}
					</Text>
					<DashedLine />

					{/* =============== patient information section =============== */}

					<Table fz="10px" verticalSpacing={2} withRowBorders={false}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>তারিখ:</strong> {patientInfo?.created || "2021-01-01"}
								</Table.Td>
								<Table.Td align="right">

								</Table.Td>
							</Table.Tr>
							{patientInfo?.health_id && (
								<Table.Tr>
									<Table.Td colspan={2} align="center">
										<strong>HID:</strong> {patientInfo?.health_id || "HID-987654321"}
									</Table.Td>
								</Table.Tr>
							)}
							<Table.Tr>
								<Table.Td>
									<strong>{patientInfo?.invoice || "INV-987654321"}</strong>
								</Table.Td>
								<Table.Td align="right">{patientInfo?.patient_id || "PT-987654321"}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>মোড:</strong> {patientInfo?.mode_name || "OPD"}
								</Table.Td>
								<Table.Td align="right">
									<strong>কক্ষ:</strong> {patientInfo?.room_name || "Room 1"}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}></Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>{t("নাম")}:</strong> {patientInfo?.name || "John Doe"}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("লিঙ্গ")}:</strong> {patientInfo?.gender && patientInfo.gender[0].toUpperCase() + patientInfo.gender.slice(1)}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("মোবাইল")}:</strong> {patientInfo?.mobile || "01717171717"}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("বয়স")}</strong> {patientInfo?.day || 1} {t("দিন")} {patientInfo?.month || 1}{" "}
									{t("মাস")} {patientInfo?.year} {t("বছর")}
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
								<Table.Td colSpan={2}>
									<strong>{t("ঠিকানা")}</strong> {patientInfo?.address || "Uttara"}
								</Table.Td>
							</Table.Tr>
							{patientInfo?.guardian_name && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>{t("অভিভাবকের নাম")}:</strong> {patientInfo?.guardian_name || "John Doe"}
									</Table.Td>
								</Table.Tr>
							)}
							{patientInfo?.guardian_mobile && patientInfo?.guardian_name && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>{t("অভিভাবকের মোবাইল")}:</strong>{" "}
										{patientInfo?.guardian_mobile || "01717171717"}
									</Table.Td>
								</Table.Tr>
							)}
							<Table.Tr>
								<Table.Td colSpan={2} />
							</Table.Tr>
						</Table.Tbody>
					</Table>

					<DashedLine />
					<Group justify="space-between" px={12}>
						<Text size="xs" fw={600}>
							{t("ফি পরিমাণ")}:
						</Text>
						<Text size="xs" fw={600}>
							৳ {patientInfo?.total || 100}
						</Text>
					</Group>
					<DashedLine />

					{/* =============== footer section =============== */}
					<Table withRowBorders={false} fz={10}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>{t("প্রস্তুতকারী")}:</strong> {patientInfo?.created_by_name || "John Doe"}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("প্রিন্ট")}:</strong> {user?.name || "John Doe"}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2} align="center">
									<Barcode fontSize={'12'} width={'1'} height={'40'} value={patientInfo?.barcode}/>
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2} align="center">
									<strong>{t("প্রিন্টের সময়")}:</strong>{" "}
									{new Date().toLocaleString() || "2021-01-01"}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					<Text size="xxs" ta="center">
						© {new Date().getFullYear()} © {hospitalConfigData?.organization_name}{" "}
						{t("সর্বস্বত্ব সংরক্ষিত")}।
					</Text>
				</Stack>
			</Box>
		</Box>
	);
});

OPDPos.displayName = "OPDPos";

export default OPDPos;
