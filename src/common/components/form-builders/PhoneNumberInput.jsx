import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import React, { forwardRef } from "react";
import { Box, Tooltip, Text } from "@mantine/core";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import inputCss from "@assets/css/InputField.module.css";

const TooltipContent = forwardRef(({ onClick, onMouseEnter, onMouseLeave, form, name }, ref) => {
	const value = form.values[name];
	return (
		<div
			ref={ref}
			style={{
				cursor: "pointer",
				display: "flex",
				alignItems: "center",
				height: "100%",
				position: "absolute",
				right: "2px",
			}}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{value ? (
				<IconX
					size={16}
					color="var(--theme-error-color)"
					opacity={0.7}
					onClick={() => form.setFieldValue(name, "")}
				/>
			) : (
				<IconInfoCircle size={16} color="#ADB5BD" opacity={0.7} />
			)}
		</div>
	);
});

export default function PhoneNumber(props) {
	const { name, form, tooltip, mt, id, disabled, label, placeholder, required, nextField } =
		props;
	const { t } = useTranslation();
	const error = form.errors[name];

	const handleChange = (value) => {
		form.setFieldValue(name, value);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault(); // Prevent form submission
			const nextElement = document.getElementById(nextField);
			if (nextElement) {
				nextElement.focus();
			}
		}
	};

	return (
		<Box mt={mt}>
			<Text size="sm" fw={500} mb={3}>
				{label}
				{label && required && <span style={{ color: "red" }}>*</span>}
			</Text>
			<Tooltip
				label={tooltip}
				opened={name in form.errors && !!form.errors[name]}
				px={20}
				py={3}
				position="top-end"
				bg="var(--theme-error-color)"
				c="white"
				withArrow
				offset={2}
				transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
			>
				<div style={{ position: "relative" }}>
					<PhoneInput
						country={"bd"}
						classNames={inputCss}
						value={form.values[name] || `+880`}
						onChange={handleChange}
						inputProps={{
							required: required,
							disabled: disabled,
							id: id,
							onKeyDown: handleKeyDown,
						}}
						inputStyle={{
							width: "100%",
							height: "36px",
							fontSize: "14px",
							borderRadius: "4px",
							borderColor: error ? "var(--theme-error-color)" : undefined,
							paddingRight: "2.5rem",
						}}
						containerStyle={{ marginBottom: 0 }}
						placeholder={placeholder}
						// countryCodeEditable={false}
					/>

					<div
						style={{
							position: "absolute",
							right: "0.5rem",
							top: "50%",
							transform: "translateY(-50%)",
						}}
					>
						<Tooltip
							label={tooltip}
							px={16}
							py={2}
							withArrow
							position="left"
							c="white"
							bg="var(--theme-info-color)"
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<TooltipContent form={form} name={name} />
						</Tooltip>
					</div>
				</div>
			</Tooltip>
		</Box>
	);
}
