import { Box, Button, Flex, Tooltip } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import inputCss from "@assets/css/InputField.module.css";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import { getYear, getMonth } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const range = (start, end, step = 1) => {
	const result = [];
	for (let i = start; i <= end; i += step) {
		result.push(i);
	}
	return result;
};

export default function DateSelectorForm({
	label,
	placeholder,
	required,
	nextField,
	name,
	form,
	tooltip,
	mt,
	id,
	size = "sm",
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

	// =============== state for selected date ================
	const [selectedDate, setSelectedDate] = useState(form.values[name] ? new Date(form.values[name]) : null);

	// =============== years and months for custom header ================
	const years = range(1940, getYear(new Date()) + 1, 1);
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

	// =============== update form value when date changes ================
	useEffect(() => {
		if (selectedDate) {
			form.setFieldValue(name, selectedDate);
		}
	}, [selectedDate, form, name]);

	// =============== handle date change ================
	const handleDateChange = (date) => {
		if (onChange) {
			onChange();
		}
		setSelectedDate(date);
	};

	// =============== handle clear date ================
	const handleClearDate = () => {
		setSelectedDate(null);
		form.setFieldValue(name, "");
	};

	// =============== custom header component ================
	const renderCustomHeader = ({
		date,
		changeYear,
		changeMonth,
		decreaseMonth,
		increaseMonth,
		prevMonthButtonDisabled,
		nextMonthButtonDisabled,
	}) => (
		<Flex mt="xxs" justify="center" align="center" gap="xxxs">
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
			<select
				value={getYear(date)}
				onChange={({ target: { value } }) => changeYear(value)}
				radius="xs"
				size="xs"
				color="gray"
			>
				{years.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>

			<select
				value={months[getMonth(date)]}
				onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
				radius="xs"
				size="xs"
				color="gray"
			>
				{months.map((option) => (
					<option key={option} value={option}>
						{option}
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

	return (
		<Tooltip
			label={tooltip}
			opened={name in form.errors && !!form.errors[name]}
			px={16}
			py={2}
			position="top-end"
			bg="var(--theme-validation-error-color)"
			c="white"
			withArrow
			offset={2}
			zIndex={999}
			transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
		>
			<Box mt={mt} miw={miw}>
				{label && (
					<label
						htmlFor={id}
						style={{
							display: "block",
							marginBottom: "8px",
							fontSize: "14px",
							fontWeight: "500",
							color: "var(--mantine-color-text)",
						}}
					>
						{label}
						{required && <span style={{ color: "red" }}> *</span>}
					</label>
				)}
				<Box pos="relative">
					{leftSection && (
						<Box
							style={{
								position: "absolute",
								left: "12px",
								top: "50%",
								transform: "translateY(-50%)",
								zIndex: 1,
								pointerEvents: "none",
							}}
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
						dateFormat="dd/MM/yyyy"
						showYearDropdown
						showMonthDropdown
						dropdownMode="select"
						onKeyDown={getHotkeyHandler([
							[
								"Enter",
								() => {
									nextField === "EntityFormSubmit"
										? document.getElementById(nextField).click()
										: document.getElementById(nextField).focus();
								},
							],
						])}
						style={{
							width: "100%",
							padding: size === "sm" ? "8px 12px" : "12px 16px",
							paddingLeft: leftSection ? "40px" : "12px",
							paddingRight: (form.values[name] && closeIcon) || rightSection ? "40px" : "12px",
							border:
								name in form.errors && form.errors[name]
									? "1px solid var(--theme-validation-error-color)"
									: "1px solid var(--mantine-color-gray-3)",
							borderRadius: "4px",
							fontSize: "14px",
							backgroundColor: disabled ? "var(--mantine-color-gray-1)" : "white",
							color: "var(--mantine-color-text)",
							cursor: disabled ? "not-allowed" : "text",
						}}
						className={inputCss.input}
						autoComplete="off"
					/>
					{rightSection && (
						<div
							style={{
								position: "absolute",
								right: "12px",
								top: "50%",
								transform: "translateY(-50%)",
								zIndex: 1,
								cursor: "pointer",
							}}
						>
							{form.values[name] && closeIcon ? (
								<Tooltip label={t("Close")} withArrow bg="var(--theme-error-color)" c="white">
									<IconX
										color="var(--theme-error-color)"
										size={16}
										opacity={0.5}
										onClick={handleClearDate}
									/>
								</Tooltip>
							) : (
								<Tooltip
									label={tooltip}
									px={16}
									py={2}
									withArrow
									position={"left"}
									c="white"
									bg="var(--theme-info-color)"
									transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
								>
									{rightSection ? rightSection : <IconInfoCircle size={16} opacity={0.5} />}
								</Tooltip>
							)}
						</div>
					)}
				</Box>
			</Box>
		</Tooltip>
	);
}
