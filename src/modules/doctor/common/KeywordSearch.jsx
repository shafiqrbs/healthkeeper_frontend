import DatePickerForm from "@components/form-builders/DatePicker";
import InputForm from "@components/form-builders/InputForm";
import { ActionIcon, Flex } from "@mantine/core";
import { IconFilter, IconRestore, IconSearch } from "@tabler/icons-react";
import React from "react";

export default function KeywordSearch({ form }) {
	return (
		<Flex className="keyword-search-box">
			<DatePickerForm
				form={form}
				name="date"
				placeholder="Select Date"
				value={form.values.date}
				onChange={(value) => form.setFieldValue("date", value)}
			/>
			<InputForm
				placeholder="Keyword Search"
				form={form}
				name="keywordSearch"
				rightSection={<IconSearch size={16} stroke={1.5} />}
				styles={{ root: { width: "100%" } }}
			/>
			<Flex gap="xxxs" align="center">
				<ActionIcon c="var(--theme-primary-color-6)" bg="white">
					<IconSearch size={16} stroke={1.5} />
				</ActionIcon>
				<ActionIcon c="var(--theme-success-color)" bg="white">
					<IconFilter size={16} stroke={1.5} />
				</ActionIcon>
				<ActionIcon c="var(--theme-secondary-color-8)" bg="white">
					<IconRestore size={16} stroke={1.5} />
				</ActionIcon>
			</Flex>
		</Flex>
	);
}
