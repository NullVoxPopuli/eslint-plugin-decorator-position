declare namespace _exports {
    export { EslintPackageUniversal, DecoratorConfigRaw, RuleOptionsRaw, RuleOptionsNormalized, DecoratorConfigIntent, DecoratorConfigOptionsNormalized, DecoratorConfigNormalized, OptionsPlaceDecoratorsBesideProperty, OptionsPlaceDecoratorsAboveProperty, DecoratorInfo, MessageId, RuleModule, RuleModuleOmited, RuleModuleCreateContext, DefinitionNode, DecoratorKey };
}
declare const _exports: RuleModuleOmited;
export = _exports;
type EslintPackageUniversal = {
    ESLint: typeof import("eslint").ESLint;
    CLIEngine?: typeof import("eslint").ESLint;
};
type DecoratorConfigRaw = string | [string, {
    withArgs: boolean;
}];
type RuleOptionsRaw = {
    printWidth?: number;
    properties?: "prefer-inline" | "above";
    methods?: "prefer-inline" | "above";
    overrides?: {
        above?: Array<DecoratorConfigRaw>;
        "prefer-inline"?: Array<DecoratorConfigRaw>;
    };
};
type RuleOptionsNormalized = {
    printWidth: number;
    properties: "prefer-inline" | "above";
    methods: "prefer-inline" | "above";
    overrides: {
        above: Array<DecoratorConfigRaw>;
        "prefer-inline": Array<DecoratorConfigRaw>;
    };
};
type DecoratorConfigIntent = "same-line" | "different-line";
type DecoratorConfigOptionsNormalized = {
    withArgs?: boolean;
    intent?: DecoratorConfigIntent | undefined;
};
type DecoratorConfigNormalized = [string, DecoratorConfigOptionsNormalized];
type OptionsPlaceDecoratorsBesideProperty = Pick<RuleOptionsNormalized, "printWidth"> & {
    overrides: Pick<RuleOptionsNormalized["overrides"], "prefer-inline">;
};
type OptionsPlaceDecoratorsAboveProperty = Pick<RuleOptionsNormalized, "printWidth"> & {
    overrides: Pick<RuleOptionsNormalized["overrides"], "above">;
};
type DecoratorInfo = {
    needsTransform?: boolean;
    name?: string;
    decorator?: any;
    arity?: any;
    arityMatches?: any;
    currentPositionMatchesIntent?: any;
    inlineLength?: any;
    ifInlineWouldViolatePrettier?: any;
};
type MessageId = "expectedInline" | "expectedAbove";
type RuleModule = TSESLint.RuleModule<MessageId, [RuleOptionsRaw]>;
type RuleModuleOmited = Omit<RuleModule, "defaultOptions" | "meta"> & {
    meta: Omit<RuleModule["meta"], "schema">;
};
type RuleModuleCreateContext = Parameters<RuleModule["create"]>[0];
type DefinitionNode = TSESTree.PropertyDefinition | TSESTree.MethodDefinition;
type DecoratorKey = TSESTree.PropertyNameComputed | TSESTree.ClassPropertyNameNonComputed;
import type { TSESLint } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
