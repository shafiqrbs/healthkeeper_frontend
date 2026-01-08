import { DateTimePicker } from "@mantine/dates";
import { Tooltip } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import inputCss from "@assets/css/InputField.module.css";

function DateTimePickerForm({
	defaultValue = new Date(),
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
	onBlur,
	readOnly = false,
}) {
	const { t } = useTranslation();

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
			<DateTimePicker
				id={id}
				clearable
				defaultValue={defaultValue}
				size={size}
				classNames={inputCss}
				disabled={disabled}
				minDate={disable && new Date()}
				maxDate={disabledFutureDate ? new Date() : undefined}
				label={label}
				placeholder={placeholder}
				mt={mt}
				readOnly={readOnly}
				miw={miw}
				autoComplete="off"
				valueFormat="DD MMM YYYY hh:mm A"
				timePickerProps={{
					withDropdown: true,
					popoverProps: { withinPortal: false },
					format: "12h",
				}}
				{...form.getInputProps(name)}
				onBlur={onBlur || form.getInputProps(name).onBlur}
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
				leftSection={leftSection}
				rightSection={
					form.values[name] && closeIcon ? (
						<Tooltip label={t("Close")} withArrow bg="var(--theme-error-color)" c="white">
							<IconX
								color="var(--theme-error-color)"
								size={16}
								opacity={0.5}
								onClick={() => {
									form.setFieldValue(name, "");
								}}
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
					)
				}
				withAsterisk={required}
			/>
		</Tooltip>
	);
}

export default DateTimePickerForm;
