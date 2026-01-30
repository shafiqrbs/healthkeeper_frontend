import { BarChart } from "@mantine/charts";
import { Box, Card, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { useOutletContext } from "react-router-dom";

// =============== transforms a single section's list of { date, total } into BarChart format ===============
function transformSectionDataToChartData(records) {
    if (!Array.isArray(records) || records.length === 0) return [];

    const sorted = [ ...records ]
        .filter((entry) => entry?.date != null)
        .sort((first, second) => new Date(first.date) - new Date(second.date));

    return sorted.map((entry) => ({
        date: entry.date,
        dateLabel: format(parseISO(entry.date), "MMM d"),
        total: entry.total ?? 0,
    }));
}

/**
 * Single-section bar chart. Pass the section's data (array of { date, total }),
 * sectionLabel for the title, and color for the bars.
 */
export default function DashboardOverviewChart({ data, sectionLabel, color = "blue.6" }) {
    const { mainAreaHeight } = useOutletContext();
    const seriesName = sectionLabel ?? "Total";
    const seriesConfig = [ { name: seriesName, color } ];

    const chartRows = useMemo(
        () =>
            transformSectionDataToChartData(data).map((row) => ({
                dateLabel: row.dateLabel,
                [ seriesName ]: row.total,
            })),
        [ data, seriesName ]
    );

    if (!data?.length) {
        return (
            <Box h={320} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text size="sm" c="dimmed">No data</Text>
            </Box>
        );
    }

    return (
        <Card>
            <Stack gap="xs">
                <Box
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        justifyContent: "center",
                    }}
                >
                    <Box
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 2,
                            backgroundColor: `var(--mantine-color-${color.replace(".", "-")})`,
                        }}
                    />
                    <Text size="sm" fw={500}>{sectionLabel}</Text>
                </Box>
                <BarChart
                    h={180}
                    data={chartRows}
                    dataKey="dateLabel"
                    withLegend={false}
                    tickLine="y"
                    series={seriesConfig}
                    valueFormatter={(value) => new Intl.NumberFormat("en-US").format(value)}
                />
            </Stack>
        </Card>
    );
}
