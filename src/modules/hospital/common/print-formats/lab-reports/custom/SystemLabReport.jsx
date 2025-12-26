import {Box, Text, Grid, Table} from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
const SystemLabReport = forwardRef(({reportData,report}) => {
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	return (
		<Box>
			<Box mt={"md"} h={'700'}>
				<Table
					withColumnBorders
					verticalSpacing={0}
					horizontalSpacing={0}
					striped={false}
					highlightOnHover={false}
					style={{
						margin: 0,
						padding: 0,
						borderCollapse: "collapse",
						width: "100%",
						border: "1px solid var(--theme-tertiary-color-8)",
					}}
				>
					<Table.Thead>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th w={"35%"} pl={4}>
								{t("Parameter")}
							</Table.Th>
							<Table.Th w={"25%"} pl={4}>
								{t("Result")}
							</Table.Th>
							<Table.Th w={"40%"} pl={4}>
								{t("ReferenceValue")}
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{report?.reports?.map((item, index) => (
							<Table.Tr key={index}>
								<Table.Td>
									<Text fz={"xs"} pl={4}>
										{item.name}
									</Text>
								</Table.Td>
								<Table.Td>
									<Text fz={"xs"} pl={4}>
										{item.result} {item.unit}
									</Text>
								</Table.Td>
								<Table.Td>
									<Text fz={"xs"} pl={4}>
										{item.reference_value}
									</Text>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				{report?.comment && (
					<Box  pt={0}>
						<Text fw="bold" size="xs" mb="xs" mt={'md'}>
							{t("Comment")}
						</Text>
						<Box p="xs" bd="1px solid #ddd">
							<Text size="xs">{report?.comment || ""}</Text>
						</Box>
					</Box>
				)}
			</Box>
			{/* =============== Additional Information Section ================ */}

			<Box p="md" pt={0} pb={0}>
				<Grid columns={12} gutter="xs">
					<Grid.Col span={4}>
						<Box>
							<Text fw="bold" ta="center">
								Medical Technologist(Lab)
							</Text>
						</Box>
					</Grid.Col>
					<Grid.Col span={4}/>
					<Grid.Col span={4}>
						<Box>
							<Text fw="bold" mb="sm" ta="center">
								Clinical Pathologist
							</Text>
						</Box>
					</Grid.Col>
				</Grid>
			</Box>
			{/* =============== Doctor Information and Signature ================ */}
		</Box>
	);
});
SystemLabReport.displayName = "SystemLabReport";
export default SystemLabReport;
