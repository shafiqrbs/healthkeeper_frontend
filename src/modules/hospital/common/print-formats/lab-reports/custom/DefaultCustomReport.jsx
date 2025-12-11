import {Box, Text, Grid} from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
import {useOutletContext} from "react-router-dom";
const DefaultCustomReport = forwardRef(({reportData,report}) => {
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	const { mainAreaHeight } = useOutletContext();
	console.log(mainAreaHeight)
	return (
		<Box>
			<Box mb="md" p={'xl'} pt={'md'} fz={'md'}>
				<div dangerouslySetInnerHTML={{__html:getValue(reportData?.findings)}}/>
				{report?.comment && (
					<Box p="md" pt={0}>
						<Text fw="bold" size="xs" mb="xs">
							{t("Comment")}
						</Text>
						<Box p="xs" bd="1px solid #ddd">
							<Text size="xs">{report?.comment || ""}</Text>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
});
DefaultCustomReport.displayName = "DefaultCustomReport";
export default DefaultCustomReport;
