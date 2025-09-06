import { Box, Text, Stack, Group, Image, Table } from "@mantine/core";
import { forwardRef } from "react";
import TbImage from "@assets/images/tb_logo.png";
import GovtLogo from "@assets/images/government_seal_of_bangladesh.svg";
import { getLoggedInUser } from "@/common/utils";
import { useTranslation } from "react-i18next";
import useDomainHospitalConfigData from "@hooks/config-data/useDomainHospitalConfigData";

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
		<Box display="none">
			<Box ref={ref} w="80mm" p={8} bg="white" mx="auto">
				<Stack gap={2}>
					{/* =============== header section with logo and hospital info =============== */}
					<Group justify="center" align="center" gap={8}>
						<Image src={GovtLogo} alt="Govt Logo" width={44} height={44} fit="contain" />
						<Stack gap={0} ta="left">
							<Text ta="center" size="xs" fw={700}>
								{hospitalConfigData?.organization_name}
							</Text>
							<Text ta="center" size="xxs">
								{hospitalConfigData?.address}
							</Text>
							<Text ta="center" size="8px">
								{t("হটলাইন")} {hospitalConfigData?.hotline}
							</Text>
						</Stack>
						<Image src={TbImage} alt="TB Hospital" width={44} height={44} fit="contain" />
					</Group>
					<DashedLine />

					{/* =============== prescription title =============== */}
					<Text size="sm" fw={700} ta="center">
						{t("টিকিট")} - {data?.payment_mode_name}
					</Text>
					<Text size="xs" fw={700} ta="center">
						<strong>{t("বহির্বিভাগ কক্ষ")}:</strong> {data?.room_name}
					</Text>
					<DashedLine />

					{/* =============== patient information section =============== */}

					<Table fz="10px" verticalSpacing={2} withRowBorders={false}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>তারিখ:</strong> {data?.created}
								</Table.Td>
								<Table.Td align="right">
									<strong>অ্যাপয়েন্টমেন্ট তারিখ:</strong> {data?.appointment}
								</Table.Td>
							</Table.Tr>
							{data?.health_id && (
								<Table.Tr>
									<Table.Td colspan={2} align="center">
										<strong>HID:</strong> {data?.health_id}
									</Table.Td>
								</Table.Tr>
							)}
							<Table.Tr>
								<Table.Td>
									<strong>{data?.invoice}</strong>
								</Table.Td>
								<Table.Td align="right">{data?.patient_id}</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>মোড:</strong> {data?.mode_name}
								</Table.Td>
								<Table.Td align="right">
									<strong>কক্ষ:</strong> {data?.room_name}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}></Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>{t("নাম")}:</strong> {data?.name}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("লিঙ্গ")}:</strong> {data?.gender}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("মোবাইল")}:</strong> {data?.mobile}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("বয়স")}</strong> {data?.year} Y {data?.month} M {data?.day} D
								</Table.Td>
								<Table.Td miw={100} align="right">
									<strong>{t("জন্ম তারিখ")}</strong> {data?.dob}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>{t("ঠিকানা")}</strong> {data?.address}
								</Table.Td>
							</Table.Tr>
							{data?.guardian_name && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>{t("অভিভাবকের নাম")}:</strong> {data?.guardian_name}
									</Table.Td>
								</Table.Tr>
							)}
							{data?.guardian_mobile && data?.guardian_name && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>{t("অভিভাবকের মোবাইল")}:</strong> {data?.guardian_mobile}
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
							৳ {data?.total || 0}
						</Text>
					</Group>
					<DashedLine />

					{/* =============== footer section =============== */}
					<Table withRowBorders={false} fz={10}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>{t("প্রস্তুতকারী")}:</strong> {data?.created_by_name}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("প্রিন্ট")}:</strong> {user?.name}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2} align="center">
									<strong>{t("প্রিন্টের সময়")}:</strong> {new Date().toLocaleString()}
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
