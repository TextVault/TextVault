import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

export const systemConfig = defineConfig({});
export const systemTheme = createSystem(defaultConfig, systemConfig);
