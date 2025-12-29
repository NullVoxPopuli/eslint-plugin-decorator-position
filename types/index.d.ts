export let rules: {
    'decorator-position': import("./rules/decorator-position").RuleModuleOmited;
};
export namespace configs {
    let base: {
        ignorePatterns?: string | string[];
        root?: boolean;
        $schema?: string;
        env?: import("@typescript-eslint/utils/dist/ts-eslint").ClassicConfig.EnvironmentConfig;
        extends?: string | string[];
        globals?: import("@typescript-eslint/utils/dist/ts-eslint").ClassicConfig.GlobalsConfig;
        noInlineConfig?: boolean;
        overrides?: import("@typescript-eslint/utils/dist/ts-eslint").ClassicConfig.ConfigOverride[];
        parser?: string | null;
        parserOptions?: import("@typescript-eslint/utils/dist/ts-eslint").ClassicConfig.ParserOptions;
        plugins?: string[];
        processor?: string;
        reportUnusedDisableDirectives?: boolean;
        rules?: import("@typescript-eslint/utils/dist/ts-eslint").ClassicConfig.RulesRecord;
        settings?: import("@typescript-eslint/utils/dist/ts-eslint").SharedConfigurationSettings;
    };
    let ember: {
        ignorePatterns?: string | string[];
        root?: boolean;
        $schema?: string;
        env?: import("@typescript-eslint/utils/dist/ts-eslint").ClassicConfig.EnvironmentConfig;
        extends?: string | string[];
        globals?: import("@typescript-eslint/utils/dist/ts-eslint").ClassicConfig.GlobalsConfig;
        noInlineConfig?: boolean;
        overrides?: import("@typescript-eslint/utils/dist/ts-eslint").ClassicConfig.ConfigOverride[];
        parser?: string | null;
        parserOptions?: import("@typescript-eslint/utils/dist/ts-eslint").ClassicConfig.ParserOptions;
        plugins?: string[];
        processor?: string;
        reportUnusedDisableDirectives?: boolean;
        rules?: import("@typescript-eslint/utils/dist/ts-eslint").ClassicConfig.RulesRecord;
        settings?: import("@typescript-eslint/utils/dist/ts-eslint").SharedConfigurationSettings;
    };
}
