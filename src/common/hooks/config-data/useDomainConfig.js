import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShowConfigEntityData } from "../../../store/inventory/crudSlice.js";

const useDomainConfig = (autoFetch = true) => {
	const dispatch = useDispatch();
	const domainConfig = useSelector((state) => state.crud.showConfigData);

	const [path, setPath] = useState("domain/config");

	const fetchDomainConfig = useCallback(
		(customPath) => {
			const effectivePath = customPath || path;
			if (effectivePath) {
				dispatch(getShowConfigEntityData(effectivePath));
			}
		},
		[dispatch, path]
	);

	useEffect(() => {
		if (autoFetch && path) {
			fetchDomainConfig();
		}
	}, [autoFetch, fetchDomainConfig, path]);

	// Save domainConfig to localStorage whenever it changes
	useEffect(() => {
		if (domainConfig) {
			localStorage.setItem("domain-config-data", JSON.stringify(domainConfig));
		}
	}, [domainConfig]);

	return { domainConfig, fetchDomainConfig, setPath };
};

export default useDomainConfig;
