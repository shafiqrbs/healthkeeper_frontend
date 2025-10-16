import { Box, Text, Grid, Group, Image, Divider } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import DashedDivider from "@components/core-component/DashedDivider";
import { getLoggedInUser } from "@/common/utils";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const DischargeA4EN = forwardRef(({ data, preview = false }, ref) => {
	const user = getLoggedInUser();

	const patientInfo = data || {};
	const jsonContent = data?.json_content || {};
	const medicines = jsonContent?.medicines || [];
	const { hospitalConfigData } = useHospitalConfigData();

	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	return (
		<Box display={preview ? "block" : "none"}>
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
						</Grid.Col>
						<Grid.Col span={4}>
							<Group mr="md" justify="flex-end" align="center" h="100%" py="xs">
								<Image src={TBLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
					</Grid>
				</Box>
				<Divider />

				<Box mt="sm" fz="sm">
					<Text fz="sm" fw={700}>
						Date: ____ / ____ / ______
					</Text>
					<Text fz="sm" mt={"sm"}>
						To,
					</Text>
					<Text fz="sm">Director</Text>
					<Text fz="sm">_____________________________ Hospital</Text>
					<Text fz="sm">_____________________________ (Address)</Text>
					<Text fz="sm" mt={"sm"} fw={700}>
						Subject: Application for patient discharge.
					</Text>
					<Text fz="sm" mt={"sm"}>
						Sir/Madam,
					</Text>
					<Text fz="sm" mt={"xs"}>
						I, Dr. ______________________________________, hereby state that the patient Mr./Ms.
						______________________________________, age ______ years, gender __________, address
						________________________________________, was admitted to our hospital on ____ / ____ / ______.
					</Text>
					<Text fz="sm" mt={"xs"}>
						The patient was admitted due to ____________________________ (primary diagnosis/complaint).
						Following admission, the necessary investigations and treatment were provided. The patient has
						shown gradual improvement and is currently stable and in a satisfactory condition.
					</Text>
					<Text fz="sm" mt={"xs"}>
						During the course of treatment, the patient received ____________________________ (summary of
						treatment). The current clinical status is stable, and the patient is deemed fit for discharge
						to home.
					</Text>
					<Text fz="sm" mt={"xs"}>
						Therefore, the patient is being discharged today, on ____ / ____ / ______.
					</Text>
					<Text fz="sm" mt={"sm"} fw={600}>
						Medications advised:
					</Text>
					<Text fz="sm">1. ____________________________________________</Text>
					<Text fz="sm">2. ____________________________________________</Text>
					<Text fz="sm">3. ____________________________________________</Text>
					<Text fz="sm" mt={"sm"} fw={600}>
						Additional advice and instructions:
					</Text>
					<Text fz="sm">• ____________________________________________</Text>
					<Text fz="sm">• ____________________________________________</Text>
					<Text fz="sm">• ____________________________________________</Text>
					<Text fz="sm" mt={"xs"}>
						The patient has been advised to attend follow‑up on ____ / ____ / ______, or earlier if
						necessary.
					</Text>
					<Text fz="sm" mt={"xs"}>
						Kindly arrange to record the above in the hospital records accordingly.
					</Text>
					<Text fz="sm" mt={"sm"}>
						Sincerely,
					</Text>
					<Text fz="sm">Dr. ______________________________________</Text>
					<Text fz="sm">Designation: _______________________________</Text>
					<Text fz="sm">Department: ________________________________</Text>
					<Text fz="sm">Seal & Signature: __________________________</Text>
				</Box>

				<DashedDivider mt="30px" mb={0} />
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

DischargeA4EN.displayName = "DischargeA4EN";

export default DischargeA4EN;
