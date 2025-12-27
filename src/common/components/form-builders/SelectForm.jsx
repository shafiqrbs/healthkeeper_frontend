import { forwardRef, useEffect } from "react";
import { Tooltip, Select } from "@mantine/core";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent.jsx";
import { useDispatch } from "react-redux";
import { storeEntityData } from "@/app/store/core/crudThunk.js";
import inputCss from "@assets/css/InputField.module.css";

const SelectForm = forwardRef(
	(
		{
			comboboxProps,
			position,
			color,
			label,
			placeholder,
			required = false,
			nextField,
			name,
			form,
			tooltip,
			mt,
			id,
			dropdownValue,
			searchable,
			value,
			changeValue,
			clearable = true,
			allowDeselect = true,
			inlineUpdate = false,
			updateDetails = null,
			size,
			pt,
			rightSection = undefined,
			disabled = false,
			withCheckIcon = true,
			onBlur,
			onSearchChange = () => {},
			nothingFoundMessage = "",
		},
		ref
	) => {
		const dispatch = useDispatch();

		// Sync form value with local state when form value changes
		useEffect(() => {
			if (form && form.values[name] && changeValue) {
				changeValue(form.values[name]);
			}
		}, [form?.values[name]]);

		const handleChange = async (e) => {
			// Update local state first
			if (changeValue) {
				changeValue(e);
			}

			// Then update form state
			if (form) {
				form.setFieldValue(name, e);
			}

			// Handle next field focus
			if (nextField) {
				setTimeout(() => {
					const nextElement = document.getElementById(nextField);
					if (nextElement) {
						nextElement.focus();
					}
				}, 0);
			}

			// Handle inline update if needed
			if (inlineUpdate) {
				updateDetails.data.value = e;
				try {
					const resultAction = await dispatch(storeEntityData(updateDetails));

					if (resultAction.payload?.status !== 200) {
						showNotificationComponent(
							resultAction.payload?.message || "Error updating invoice",
							"red",
							"",
							"",
							true
						);
					}
				} catch (error) {
					showNotificationComponent("Request failed. Please try again.", "red", "", "", true);
					console.error("Error updating invoice:", error);
				}
			}
		};

		return (
			<>
				{form && (
					<Tooltip
						label={tooltip}
						opened={name in form.errors && !!form.errors[name]}
						px={16}
						py={2}
						position={position && position ? position : "top-end"}
						bg={color && color ? color : "var(--theme-error-color)"}
						c="white"
						withArrow
						offset={2}
						zIndex={999}
						transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
					>
						<Select
							onSearchChange={onSearchChange}
							onBlur={onBlur}
							pt={pt}
							classNames={inputCss}
							ref={ref}
							id={id}
							label={label}
							placeholder={placeholder}
							mt={mt}
							size={size ? size : "sm"}
							data={dropdownValue}
							autoComplete="off"
							clearable={clearable}
							searchable={searchable}
							error={!!form.errors[name]}
							value={
								value !== undefined
									? String(value)
									: form?.values[name] !== undefined &&
									  form?.values[name] !== null &&
									  form?.values[name] !== ""
									? String(form.values[name])
									: null
							}
							onChange={handleChange}
							withAsterisk={required}
							comboboxProps={comboboxProps}
							allowDeselect={allowDeselect}
							rightSection={rightSection}
							disabled={disabled}
							withCheckIcon={withCheckIcon}
							nothingFoundMessage={nothingFoundMessage}
						/>
					</Tooltip>
				)}
			</>
		);
	}
);

SelectForm.displayName = "SelectForm";

export default SelectForm;
