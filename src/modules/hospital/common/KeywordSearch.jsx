import DatePickerForm from "@components/form-builders/DatePicker";
import InputForm from "@components/form-builders/InputForm";
import { ActionIcon, Flex, Popover } from "@mantine/core";
import { IconFilter, IconRestore, IconSearch } from "@tabler/icons-react";
import React from "react";
import AdvancedFilter from "../../../common/components/advance-search/AdvancedFilter";

export default function KeywordSearch({ form }) {
	return (
		<Flex className="keyword-search-box">
			<DatePickerForm
				form={form}
				name="date"
				placeholder="Select Date"
				value={form.values.date}
				onChange={(value) => form.setFieldValue("date", value)}
				miw={200}
			/>
			<InputForm
				placeholder="Keyword Search"
				form={form}
				tooltip="Search by patient name, mobile, email, etc."
				name="keywordSearch"
				rightSection={<IconSearch size={16} stroke={1.5} />}
				styles={{ root: { width: "100%" } }}
			/>
			<Flex gap="xxxs" align="center">
				<ActionIcon c="var(--theme-primary-color-6)" bg="white">
					<IconSearch size={16} stroke={1.5} />
				</ActionIcon>
				<AdvancedFilter />

				<ActionIcon c="var(--theme-tertiary-color-8)" bg="white">
					<IconRestore size={16} stroke={1.5} />
				</ActionIcon>
			</Flex>
		</Flex>
	);
}
