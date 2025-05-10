import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerDropdown } from "@/app/store/core/utilityThunk";

const useCustomerDropdownData = () => {
	const dispatch = useDispatch();
	const [customerDropdown, setCustomerDropdown] = useState([]);

	useEffect(() => {
		dispatch(getCustomerDropdown("core/select/customer"));
	}, [dispatch]);

	const customerDropdownData = useSelector((state) => state.utility.customerDropdownData);

	useEffect(() => {
		if (customerDropdownData && customerDropdownData?.data?.length > 0) {
			const transformedData = customerDropdownData?.data?.map((type) => {
				return { label: type.name, value: String(type.id) };
			});
			setCustomerDropdown(transformedData);
		}
	}, [customerDropdownData]);

	return customerDropdown;
};

export default useCustomerDropdownData;
