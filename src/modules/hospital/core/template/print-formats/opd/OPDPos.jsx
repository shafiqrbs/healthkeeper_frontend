import { Box, Text, Stack, Group, Image, Table } from "@mantine/core";
import { forwardRef } from "react";
import TbImage from "@assets/images/tb_logo.png";
import GovtLogo from "@assets/images/government_seal_of_bangladesh.svg";
import { getLoggedInUser } from "@/common/utils";
import { useTranslation } from "react-i18next";
import useDomainHospitalConfigData from "@hooks/config-data/useHospitalConfigData";

const DashedLine = () => (
	<Text size="xxs" ta="center" ff="monospace">
		-----------------------------------------------
	</Text>
);

const OPDPos = forwardRef(({ data }, ref) => {
	const user = getLoggedInUser();
	const { t } = useTranslation();
	const { hospitalConfigData } = useDomainHospitalConfigData();

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
						{t("টিকিট")} - {data?.payment_mode_name || "Cash"}
					</Text>
					<Text size="xs" fw={700} ta="center">
						<strong>{t("বহির্বিভাগ কক্ষ")}:</strong> {data?.room_name || "Room 1"}
					</Text>
					<DashedLine />

					{/* =============== patient information section =============== */}

					<Table fz="10px" verticalSpacing={2} withRowBorders={false}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>তারিখ:</strong> {data?.created || "2021-01-01"}
								</Table.Td>
								<Table.Td align="right">
									<strong>অ্যাপয়েন্টমেন্ট তারিখ:</strong> {data?.appointment || "2021-01-01"}
								</Table.Td>
							</Table.Tr>
							{data?.health_id && (
								<Table.Tr>
									<Table.Td colspan={2} align="center">
										<strong>HID:</strong> {data?.health_id || "HID-987654321"}
									</Table.Td>
								</Table.Tr>
							)}
							<Table.Tr>
								<Table.Td>
									<strong>{data?.invoice || "INV-987654321"}</strong>
								</Table.Td>
								<Table.Td align="right">{data?.patient_id || "PT-987654321"}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>মোড:</strong> {data?.mode_name || "OPD"}
								</Table.Td>
								<Table.Td align="right">
									<strong>কক্ষ:</strong> {data?.room_name || "Room 1"}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}></Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>{t("নাম")}:</strong> {data?.name || "John Doe"}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("লিঙ্গ")}:</strong> {data?.gender || "Male"}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("মোবাইল")}:</strong> {data?.mobile || "01717171717"}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("বয়স")}</strong> {data?.day || 1} {t("দিন")} {data?.month || 1}{" "}
									{t("মাস")} {data?.year} {t("বছর")}
								</Table.Td>
								<Table.Td miw={100} align="right">
									<strong>{t("জন্ম তারিখ")}</strong> {data?.dob || "2000-01-01"}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>{t("ঠিকানা")}</strong> {data?.address || "Uttara"}
								</Table.Td>
							</Table.Tr>
							{data?.guardian_name && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>{t("অভিভাবকের নাম")}:</strong> {data?.guardian_name || "John Doe"}
									</Table.Td>
								</Table.Tr>
							)}
							{data?.guardian_mobile && data?.guardian_name && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>{t("অভিভাবকের মোবাইল")}:</strong>{" "}
										{data?.guardian_mobile || "01717171717"}
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
							৳ {data?.total || 100}
						</Text>
					</Group>
					<DashedLine />

					{/* =============== footer section =============== */}
					<Table withRowBorders={false} fz={10}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>{t("প্রস্তুতকারী")}:</strong> {data?.created_by_name || "John Doe"}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("প্রিন্ট")}:</strong> {user?.name || "John Doe"}
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
