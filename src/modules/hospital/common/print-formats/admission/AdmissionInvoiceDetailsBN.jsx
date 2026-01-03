import { Box, Text, Group, Image, Table, Flex, Stack } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import { formatDateTimeAmPm } from "@/common/utils";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import Barcode from "react-barcode";
import { capitalizeWords } from "@utils/index";

const AdmissionInvoiceDetailsBN = forwardRef(({ data, preview = false }, ref) => {
	const admissionData = data || {};
	const patientInfo = data || {};
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
				{`@media  {
					table { border-collapse: collapse !important;border: 1px solid #807e7e !important; }
					table, table th, table td {  padding-top:0!important; padding-bottom:0!important; margin-top:0!important; margin-bottom:0!important; }
				}`}
			</style>
			<Stack
				ref={ref}
				p="48px"
				w="210mm"
				mih="1122px"
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
				align="stretch"
				justify="space-between"
				style={{
					border: "1px solid var(--theme-tertiary-color-8)",
				}}
			>
				<Box>
					<Table
						style={{
							borderCollapse: "collapse",
							width: "100%",
							border: "1px solid var(--theme-tertiary-color-8)",
						}}
						className="customTable"
					>
						<Table.Tbody>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={"3"}>
									<Box mb="sm">
										<Flex gap="md" justify="center">
											<Box>
												<Group ml="md" align="center" h="100%">
													<Image src={GLogo} alt="logo" width={60} height={60} />
												</Group>
											</Box>
											<Box>
												<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
													{hospitalConfigData?.organization_name || ""}
												</Text>
												<Text ta="center" size="sm" c="gray" mt="2">
													{hospitalConfigData?.address || ""}
												</Text>
												<Text ta="center" size="sm" c="gray" mb="2">
													{t("হটলাইন")} {hospitalConfigData?.hotline || ""}
												</Text>
											</Box>
											<Box>
												<Group mr="md" justify="flex-end" align="center" h="100%">
													<Image src={TBLogo} alt="logo" width={60} height={60} />
												</Group>
											</Box>
										</Flex>
									</Box>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={3} style={{ textAlign: "center", padding: 0 }}>
									<Text size="md" fw={600}>
										{t("Admission Bill Details")}
									</Text>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("PatientID")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.patient_id || "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Add.ID")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.invoice || "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Type")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.payment_mode_name, "")}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={2}>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Name")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.name, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Gender")}:
										</Text>
										<Text size="xs">{capitalizeWords(patientInfo?.gender || "")}</Text>
										<Group gap="xs">
											<Text size="xs" fw={600}>
												{t("Age")}:
											</Text>
											<Text size="xs">{patientInfo?.year || 0} Years</Text>
										</Group>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("DOB")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.dob, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Religion")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.religion_name, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Weight")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.weight, "")}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={"2"}>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("NID/Birth")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.nid, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Add.Date")}:
										</Text>
										<Text size="xs">
											{getValue(formatDateTimeAmPm(patientInfo?.admission_date), "")}
										</Text>
									</Group>
								</Table.Td>
							</Table.Tr>

							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("F/M/H")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.guardian_name, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Relation")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.patient_relation, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td colSpan={2}>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Mobile")}:
										</Text>
										<Text size="xs">
											{getValue(patientInfo?.mobile, "")}
											{patientInfo?.guardian_mobile && (
												<> / {getValue(patientInfo?.guardian_mobile, "")}</>
											)}
										</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={3}>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Address")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.address, "")}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					<Box pos="relative" mt="lg">
						<Table withTableBorder withColumnBorders borderColor="var(--theme-tertiary-color-8)">
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={3}>
									<Group gap="xs">
										<Text size="md" fw={600}>
											{t("AdmissionInformation")}:
										</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Bed/Cabin")}:
										</Text>
										<Text size="sm">{getValue(patientInfo?.room_name, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Unit")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.admit_unit_name, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Department")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.admit_department_name, "")}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Consultant")}:
										</Text>
										<Text size="sm">
											{getValue(patientInfo?.admit_consultant_name, "")} - (Deputy Director)
										</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("Card No")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.card_no, "")}</Text>
									</Group>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Text size="xs" fw={600}>
											{t("UnitDoctor")}:
										</Text>
										<Text size="xs">{getValue(patientInfo?.admit_doctor_name, "")}</Text>
									</Group>
								</Table.Td>
							</Table.Tr>
						</Table>
					</Box>
					<Box pos="relative" mt="lg">
						<Flex gap="md" align="flex-start">
							{/* Left Table - Invoice Particular */}
							<Box w="60%">
								<Table withTableBorder withColumnBorders borderColor="var(--theme-tertiary-color-8)">
									<Table.Thead>
										<Table.Tr>
											<Table.Th>{t("Particular")}</Table.Th>
											<Table.Th ta="center" width={50}>{t("Unit")}</Table.Th>
											<Table.Th ta="right">{t("Price")}</Table.Th>
											<Table.Th ta="right">{t("Refund")}</Table.Th>
											<Table.Th ta="right">{t("Total")}</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{admissionData?.invoice_particular?.map((item, index) => (
											<Table.Tr key={index}>
												<Table.Td>{item.name || item.item_name || t("Fee")}</Table.Td>
												<Table.Td width={50} align="center">
													{item.quantity}
												</Table.Td>
												<Table.Td width={60} align="right">
													{item.price}
												</Table.Td>
												<Table.Td align="right">{item.refund_amount}</Table.Td>
												<Table.Td fw={600} width={60} align="right">
													{item.sub_total-item.refund_amount}
												</Table.Td>
											</Table.Tr>
										))}
										<Table.Tr>
											<Table.Td fw={600} colSpan={4} ta="right">
												{t("Total Amount")}
											</Table.Td>
											<Table.Td fw={600} ta="right">{getValue(admissionData?.total, "0")}</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</Box>

							{/* Right Table - Invoice Transaction */}
							<Box w="40%">
								<Table withTableBorder withColumnBorders borderColor="var(--theme-tertiary-color-8)">
									<Table.Thead>
										<Table.Tr>
											<Table.Th>{t("Date")}</Table.Th>
											<Table.Th>{t("Mode")}</Table.Th>
											<Table.Th ta="center">{t("Amount")}</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{admissionData?.invoice_transaction?.map((item, index) => (
											<Table.Tr key={index}>
												<Table.Td fw={600} width={110}>
													{item.created}
												</Table.Td>
												<Table.Td>{item.mode || ""}</Table.Td>
												<Table.Td width={80} align="center">
													{item.amount}
												</Table.Td>
											</Table.Tr>
										))}
										<Table.Tr>
											<Table.Td fw={600} colSpan={2} ta="right">
												{t("Total")}
											</Table.Td>
											<Table.Td ta="center" fw={600}>
												{admissionData?.invoice_transaction?.reduce(
													(sum, item) => sum + parseFloat(item.amount || 0),
													0
												)}
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</Box>
						</Flex>
						{/* Signature Section */}
					</Box>
				</Box>
				{/* =============== payment summary table ================ */}
				<Box ta="center">
					<Text size="xs" c="gray" mt="xs">
						{patientInfo?.patient_id && (
							<Barcode fontSize={"12"} width={"1"} height={"24"} value={patientInfo?.patient_id} />
						)}
					</Text>
					<Text fz={8}>
						{t("প্রিন্টের সময়")}: {new Date().toLocaleString()}
					</Text>
				</Box>
			</Stack>
		</Box>
	);
});

AdmissionInvoiceDetailsBN.displayName = "AdmissionInvoiceDetailsBN";

export default AdmissionInvoiceDetailsBN;
