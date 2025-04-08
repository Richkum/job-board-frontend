import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable the rule for using 'any' type
      "react-hooks/exhaustive-deps": "off", // Disable the rule for missing dependencies in useEffect
      "react/no-unescaped-entities": "off", // Disable the rule for unescaped entities in JSX
      "@typescript-eslint/no-unused-vars": "off", // Disable the rule for unused variables
      "@typescript-eslint/no-unused-expressions": "off", // Disable the rule for unused expressions
      "prefer-const": "off", // Disable the rule for preferring const over let
    },
  },
];

export default eslintConfig;
