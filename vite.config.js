import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": "/src",
			"@components": "/src/common/components",
			"@utils": "/src/common/utils",
			"@assets": "/src/assets",
			"@hooks": "/src/common/hooks",
			"@modules": "/src/modules",

			"@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
		},
	},
});
