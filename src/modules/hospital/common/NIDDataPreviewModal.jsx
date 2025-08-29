import { Box, Grid, Modal, Stack, Text, Badge } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function NIDDataPreviewModal({ opened, close, userNidData }) {
	const { t } = useTranslation();

	// =============== helper function to format gender ================
	const formatGender = (gender) => {
		return gender === 1 ? t("Male") : gender === 2 ? t("Female") : t("Other");
	};

	// =============== helper function to format date ================
	const formatDate = (dateString) => {
		if (!dateString) return t("NotAvailable");
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString();
		} catch {
			return dateString;
		}
	};

	return (
		<Modal opened={opened} onClose={close} title={t("NIDDataPreview")} size="xl" fz="sm" fw={600}>
			<Stack gap="md">
				{/* =============== verification token section =============== */}
				<Box
					p="md"
					bg="var(--theme-tertiary-color-1)"
					style={{ borderRadius: "8px", border: "1px solid var(--theme-secondary-color-3)" }}
				>
					<Text fw={600} fz="sm" mb="sm" c="var(--theme-primary-color-6)">
						{t("VerificationToken")}
					</Text>
					<Badge variant="light" color="blue" size="lg">
						{userNidData?.verifyToken || t("NotAvailable")}
					</Badge>
				</Box>

				{/* =============== basic citizen information section =============== */}
				<Box
					p="md"
					bg="var(--theme-tertiary-color-1)"
					style={{ borderRadius: "8px", border: "1px solid var(--theme-secondary-color-3)" }}
				>
					<Text fw={600} fz="sm" mb="md" c="var(--theme-primary-color-6)">
						{t("BasicInformation")}
					</Text>

					<Grid columns={24} gutter="md">
						{/* english information */}
						<Grid.Col span={12}>
							<Stack gap="sm">
								<Text fw={500} fz="xs" c="dimmed" tt="uppercase">
									{t("EnglishInformation")}
								</Text>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("FullName")}
									</Text>
									<Text fz="sm" fw={500}>
										{userNidData?.citizenData.fullName_English || t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("FatherName")}
									</Text>
									<Text fz="sm">
										{userNidData?.citizenData.fatherName_English || t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("MotherName")}
									</Text>
									<Text fz="sm">
										{userNidData?.citizenData.motherName_English || t("NotAvailable")}
									</Text>
								</Box>
							</Stack>
						</Grid.Col>

						{/* bangla information */}
						<Grid.Col span={12}>
							<Stack gap="sm">
								<Text fw={500} fz="xs" c="dimmed" tt="uppercase">
									{t("BanglaInformation")}
								</Text>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("FullName")}
									</Text>
									<Text fz="sm" fw={500} style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.fullName_Bangla || t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("FatherName")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.fatherName_Bangla || t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("MotherName")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.motherName_Bangla || t("NotAvailable")}
									</Text>
								</Box>
							</Stack>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== personal details section =============== */}
				<Box
					p="md"
					bg="var(--theme-tertiary-color-1)"
					style={{ borderRadius: "8px", border: "1px solid var(--theme-secondary-color-3)" }}
				>
					<Text fw={600} fz="sm" mb="md" c="var(--theme-primary-color-6)">
						{t("PersonalDetails")}
					</Text>

					<Grid columns={24} gutter="md">
						<Grid.Col span={8}>
							<Box>
								<Text fz="xs" c="dimmed" fw={500}>
									{t("DateOfBirth")}
								</Text>
								<Text fz="sm" fw={500}>
									{formatDate(userNidData?.citizenData.dob)}
								</Text>
							</Box>
						</Grid.Col>

						<Grid.Col span={8}>
							<Box>
								<Text fz="xs" c="dimmed" fw={500}>
									{t("Gender")}
								</Text>
								<Badge
									variant="light"
									color={userNidData?.citizenData.gender === 1 ? "blue" : "pink"}
									size="md"
								>
									{formatGender(userNidData?.citizenData.gender)}
								</Badge>
							</Box>
						</Grid.Col>

						<Grid.Col span={8}>
							<Box>
								<Text fz="xs" c="dimmed" fw={500}>
									{t("NIDNumber")}
								</Text>
								<Text fz="sm" fw={500} style={{ fontFamily: "monospace" }}>
									{userNidData?.citizenData.citizen_nid || t("NotAvailable")}
								</Text>
							</Box>
						</Grid.Col>
					</Grid>

					<Grid columns={24} gutter="md" mt="md">
						<Grid.Col span={12}>
							<Box>
								<Text fz="xs" c="dimmed" fw={500}>
									{t("MobileNumber")}
								</Text>
								<Text fz="sm">{userNidData?.citizenData.mobile || t("NotAvailable")}</Text>
							</Box>
						</Grid.Col>

						<Grid.Col span={12}>
							<Box>
								<Text fz="xs" c="dimmed" fw={500}>
									{t("BINBRN")}
								</Text>
								<Text fz="sm">{userNidData?.citizenData.bin_BRN || t("NotAvailable")}</Text>
							</Box>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== permanent address section =============== */}
				<Box
					p="md"
					bg="var(--theme-tertiary-color-1)"
					style={{ borderRadius: "8px", border: "1px solid var(--theme-secondary-color-3)" }}
				>
					<Text fw={600} fz="sm" mb="md" c="var(--theme-primary-color-6)">
						{t("PermanentAddress")}
					</Text>

					<Grid columns={24} gutter="md">
						<Grid.Col span={12}>
							<Stack gap="xs">
								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("Division")}
									</Text>
									<Text fz="sm" fw={500} style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.permanentHouseholdNo?.division || t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("District")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.permanentHouseholdNo?.district || t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("Upazilla")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.permanentHouseholdNo?.upazilla || t("NotAvailable")}
									</Text>
								</Box>
							</Stack>
						</Grid.Col>

						<Grid.Col span={12}>
							<Stack gap="xs">
								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("UnionOrWard")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.permanentHouseholdNo?.unionOrWard ||
											t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("MouzaOrMoholla")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.permanentHouseholdNo?.mouzaOrMoholla ||
											t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("VillageOrRoad")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.permanentHouseholdNo?.villageOrRoad ||
											t("NotAvailable")}
									</Text>
								</Box>
							</Stack>
						</Grid.Col>
					</Grid>

					<Grid columns={24} gutter="md" mt="md">
						<Grid.Col span={12}>
							<Box>
								<Text fz="xs" c="dimmed" fw={500}>
									{t("HouseOrHoldingNo")}
								</Text>
								<Text fz="sm">
									{userNidData?.citizenData.permanentHouseholdNo?.houseOrHoldingNo ||
										t("NotAvailable")}
								</Text>
							</Box>
						</Grid.Col>

						<Grid.Col span={12}>
							<Box>
								<Text fz="xs" c="dimmed" fw={500}>
									{t("AddressLine")}
								</Text>
								<Text fz="sm">
									{userNidData?.citizenData.permanentHouseholdNo?.address_line || t("NotAvailable")}
								</Text>
							</Box>
						</Grid.Col>
					</Grid>

					{userNidData?.citizenData.permanentHouseholdNoText && (
						<Box mt="md">
							<Text fz="xs" c="dimmed" fw={500}>
								{t("FullAddressText")}
							</Text>
							<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
								{userNidData.citizenData.permanentHouseholdNoText}
							</Text>
						</Box>
					)}
				</Box>

				{/* =============== present address section =============== */}
				<Box
					p="md"
					bg="var(--theme-tertiary-color-1)"
					style={{ borderRadius: "8px", border: "1px solid var(--theme-secondary-color-3)" }}
				>
					<Text fw={600} fz="sm" mb="md" c="var(--theme-primary-color-6)">
						{t("PresentAddress")}
					</Text>

					<Grid columns={24} gutter="md">
						<Grid.Col span={12}>
							<Stack gap="xs">
								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("Division")}
									</Text>
									<Text fz="sm" fw={500} style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.presentHouseholdNo?.division || t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("District")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.presentHouseholdNo?.district || t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("Upazilla")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.presentHouseholdNo?.upazilla || t("NotAvailable")}
									</Text>
								</Box>
							</Stack>
						</Grid.Col>

						<Grid.Col span={12}>
							<Stack gap="xs">
								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("UnionOrWard")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.presentHouseholdNo?.unionOrWard || t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("MouzaOrMoholla")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.presentHouseholdNo?.mouzaOrMoholla ||
											t("NotAvailable")}
									</Text>
								</Box>

								<Box>
									<Text fz="xs" c="dimmed" fw={500}>
										{t("VillageOrRoad")}
									</Text>
									<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
										{userNidData?.citizenData.presentHouseholdNo?.villageOrRoad ||
											t("NotAvailable")}
									</Text>
								</Box>
							</Stack>
						</Grid.Col>
					</Grid>

					<Grid columns={24} gutter="md" mt="md">
						<Grid.Col span={12}>
							<Box>
								<Text fz="xs" c="dimmed" fw={500}>
									{t("HouseOrHoldingNo")}
								</Text>
								<Text fz="sm">
									{userNidData?.citizenData.presentHouseholdNo?.houseOrHoldingNo || t("NotAvailable")}
								</Text>
							</Box>
						</Grid.Col>

						<Grid.Col span={12}>
							<Box>
								<Text fz="xs" c="dimmed" fw={500}>
									{t("AddressLine")}
								</Text>
								<Text fz="sm">
									{userNidData?.citizenData.presentHouseholdNo?.address_line || t("NotAvailable")}
								</Text>
							</Box>
						</Grid.Col>
					</Grid>

					{userNidData?.citizenData.presentHouseholdNoText && (
						<Box mt="md">
							<Text fz="xs" c="dimmed" fw={500}>
								{t("FullAddressText")}
							</Text>
							<Text fz="sm" style={{ fontFamily: "Noto Sans Bengali, Arial" }}>
								{userNidData.citizenData.presentHouseholdNoText}
							</Text>
						</Box>
					)}
				</Box>
			</Stack>
		</Modal>
	);
}
