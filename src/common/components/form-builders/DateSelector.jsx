import { Box, Button, Flex, Tooltip } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import { getYear, getMonth } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const range = (start, end, step = 1) => {
	const result = [];
	for (let i = start; i <= end; i += step) result.push(i);
	return result;
};

export default function DateSelector({
	value,
	label,
	placeholder,
	required,
	nextField,
	tooltip,
	mt,
	id,
	size = "xs",
	closeIcon,
	disable,
	leftSection,
	rightSection,
	disabledFutureDate = false,
	miw,
	disabled = false,
	onChange,
}) {
	const { t } = useTranslation();

	// ================== STATE ==================
	const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);

	// ================== KEEP IN SYNC WITH PARENT ==================
	useEffect(() => {
		if (!value) {
			setSelectedDate(null);
			return;
		}

		const next = new Date(value);
		if (!selectedDate || next.getTime() !== selectedDate.getTime()) {
			setSelectedDate(next);
		}
	}, [value]);

	// ================== HANDLERS ==================
	const handleDateChange = (date) => {
		setSelectedDate(date);
		onChange?.(date ?? "");
	};

	const handleClearDate = () => {
		setSelectedDate(null);
		onChange?.("");
	};

	// ================== HEADER DATA ==================
	const years = range(1940, getYear(new Date()) + 5);
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	// ================== CUSTOM HEADER ==================
	const renderCustomHeader = ({
		date,
		changeYear,
		changeMonth,
		decreaseMonth,
		increaseMonth,
		prevMonthButtonDisabled,
		nextMonthButtonDisabled,
	}) => (
		<Flex mt="2xs" justify="center" align="center" gap="3xs">
			<Button
				onClick={decreaseMonth}
				disabled={prevMonthButtonDisabled}
				variant="subtle"
				size="xs"
				radius="xs"
				color="gray"
			>
				{"<"}
			</Button>

			<select value={getYear(date)} onChange={(e) => changeYear(Number(e.target.value))}>
				{years.map((y) => (
					<option key={y} value={y}>
						{y}
					</option>
				))}
			</select>

			<select value={months[getMonth(date)]} onChange={(e) => changeMonth(months.indexOf(e.target.value))}>
				{months.map((m) => (
					<option key={m} value={m}>
						{m}
					</option>
				))}
			</select>

			<Button
				onClick={increaseMonth}
				disabled={nextMonthButtonDisabled}
				variant="subtle"
				size="xs"
				radius="xs"
				color="gray"
			>
				{">"}
			</Button>
		</Flex>
	);

	// ================== RENDER ==================
	return (
		<Tooltip label={tooltip} opened={false} withArrow position="top-end">
			<Box mt={mt} miw={miw}>
				{label && (
					<label htmlFor={id} style={{ marginBottom: 8, display: "block" }}>
						{label}
						{required && <span style={{ color: "red" }}> *</span>}
					</label>
				)}

				<Box pos="relative">
					{leftSection && (
						<Box
							pos="absolute"
							left={12}
							top="50%"
							style={{ transform: "translateY(-50%)", pointerEvents: "none" }}
						>
							{leftSection}
						</Box>
					)}

					<DatePicker
						id={id}
						selected={selectedDate}
						onChange={handleDateChange}
						placeholderText={placeholder}
						disabled={disabled}
						minDate={disable ? new Date() : undefined}
						maxDate={disabledFutureDate ? new Date() : undefined}
						renderCustomHeader={renderCustomHeader}
						dateFormat="dd-MM-yyyy"
						onKeyDown={getHotkeyHandler([
							[
								"Enter",
								() => {
									if (!nextField) return;
									const el = document.getElementById(nextField);
									el?.focus?.() || el?.click?.();
								},
							],
						])}
						style={{
							width: "100%",
							padding: size === "xs" ? "4px 10px" : size === "sm" ? "8px 12px" : "12px 16px",
							paddingLeft: leftSection ? 40 : 12,
							paddingRight: rightSection || closeIcon ? 40 : 12,
							borderRadius: 4,
							fontSize: 12,
							backgroundColor: disabled ? "#f1f3f5" : "#fff",
						}}
						autoComplete="off"
					/>

					{rightSection && (
						<Box
							pos="absolute"
							right={12}
							top="50%"
							style={{ transform: "translateY(-50%)", cursor: "pointer" }}
						>
							{selectedDate && closeIcon ? (
								<Tooltip label={t("Close")} withArrow>
									<IconX size={16} onClick={handleClearDate} />
								</Tooltip>
							) : (
								rightSection || <IconInfoCircle size={16} />
							)}
						</Box>
					)}
				</Box>
			</Box>
		</Tooltip>
	);
}
