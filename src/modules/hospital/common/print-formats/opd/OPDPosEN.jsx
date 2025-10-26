import { Box, Text, Stack, Group, Image, Table } from "@mantine/core";
import { forwardRef } from "react";
import TbImage from "@assets/images/tb_logo.png";
import GovtLogo from "@assets/images/government_seal_of_bangladesh.svg";
import { getLoggedInUser } from "@/common/utils";
import { useTranslation } from "react-i18next";

const DashedLine = () => (
	<Text size="xxs" ta="center" ff="monospace">
		-----------------------------------------------
	</Text>
);

const OPDPosBN = forwardRef(({ data, preview = false }, ref) => {
	const user = getLoggedInUser();
	const { t } = useTranslation();
	return (
		<Box display={preview ? "block" : "none"}>
			<Box ref={ref} w="80mm" p={8} bg="white" mx="auto">
				<Stack gap={2}>
					{/* =============== header section with logo and hospital info =============== */}
					<Group justify="center" align="center" gap={8}>
						<Image src={GovtLogo} alt="Govt Logo" width={44} height={44} fit="contain" />
						<Stack gap={0} ta="left">
							<Text ta="center" size="xs" fw={700}>
								{t("250BeddedTBHospital")}
							</Text>
							<Text ta="center" size="xxs">
								{t("Shyamoli, Dhaka-1207")}
							</Text>
							<Text ta="center" size="8px">
								{t("Hotline: 01969910200")}
							</Text>
						</Stack>
						<Image src={TbImage} alt="TB Hospital" width={44} height={44} fit="contain" />
					</Group>
					<DashedLine />

					{/* =============== prescription title =============== */}
					<Text size="sm" fw={700} ta="center">
						{t("TICKET")} - {data?.payment_mode_name}
					</Text>
					<Text size="xs" fw={700} ta="center">
						<strong>{t("OPDROOM")}:</strong> {data?.room_name}
					</Text>
					<DashedLine />

					{/* =============== patient information section =============== */}

					<Table fz="10px" verticalSpacing={2} withRowBorders={false}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>{t("Created")}:</strong> {data?.created}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("ApptDate")}:</strong> {data?.appointment}
								</Table.Td>
							</Table.Tr>
							{data?.health_id && (
								<Table.Tr>
									<Table.Td colspan={2} align="center">
										<strong>{t("HID")}:</strong> {data?.health_id}
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
									<strong>{t("Mode")}:</strong> {data?.mode_name}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("Room")}:</strong> {data?.room_name}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2} />
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>{t("Name")}:</strong> {data?.name}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("Gender")}:</strong> {data?.gender}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("Mobile")}:</strong> {data?.mobile}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<strong>{t("Age")}</strong> {data?.year}Y {data?.month}M {data?.day}D
								</Table.Td>
								<Table.Td miw={100} align="right">
									<strong>{t("DOB")}</strong> {data?.dob}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2}>
									<strong>{t("Address")}</strong> {data?.address}
								</Table.Td>
							</Table.Tr>
							{data?.guardian_name && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>{t("GuardianName")}:</strong> {data?.guardian_name}
									</Table.Td>
								</Table.Tr>
							)}
							{data?.guardian_mobile && data?.guardian_name && (
								<Table.Tr>
									<Table.Td colSpan={2}>
										<strong>{t("GuardianMobile")}:</strong> {data?.guardian_mobile}
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
							{t("FeeAmount")}:
						</Text>
						<Text size="xs" fw={600}>
							৳ {data?.amount || 0}
						</Text>
					</Group>
					<DashedLine />

					{/* =============== footer section =============== */}
					<Table withRowBorders={false} fz={10}>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>
									<strong>{t("CreatedBy")}:</strong> {data?.created_by_name}
								</Table.Td>
								<Table.Td align="right">
									<strong>{t("PrintedBy")}:</strong> {user?.name}
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={2} align="center">
									<strong>{t("Printed")}:</strong> {new Date().toLocaleString()}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					<Text size="xxs" ta="center">
						© {new Date().getFullYear()} {t("PrintedBy")}. {t("250BeddedTBHospital")}{" "}
						{t("AllRightsReserved")} .
					</Text>
				</Stack>
			</Box>
		</Box>
	);
});

OPDPosBN.displayName = "OPDPosBN";

export default OPDPosBN;
