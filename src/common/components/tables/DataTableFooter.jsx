import React from "react";
import { useTranslation } from "react-i18next";
import { Group, Paper, Text } from "@mantine/core";

export default function DataTableFooter({ indexData, module }) {
	const { t } = useTranslation();
	return (
		<Paper className="infinite-pagination-footer" p="md" withBorder>
			<Group justify="space-between">
				<Text size="sm">
					{t("Showing")} {indexData?.data?.data?.length || indexData?.data?.length || 0}{" "}
					{t("of")} {indexData?.data?.total || indexData?.total || 0} {module}
					{indexData?.data?.data?.length < indexData?.data?.total &&
						`, ${t("scroll to bottom to load more")}`}
				</Text>
			</Group>
		</Paper>
	);
}
