import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  /**
   * The public site's security boundary, enforced at build rather than at
   * review.
   *
   * `src/lib/services/web/*` serves anonymous visitors. It may read the
   * publication projections and nothing else. The internal services carry
   * landlord contacts, mandate fee rates, internal valuations and entity
   * scoping, and none of that has any business being one import away from a
   * page a stranger loads.
   *
   * A lint rule is the right shape for this because the failure mode is a
   * quiet one: nobody sets out to leak a fee rate, they import a helper that
   * happens to return the whole row. This fails the build instead.
   */
  {
    files: ["src/lib/services/web/**/*.ts", "src/lib/services/web/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/services/*", "@/lib/services/!(web)/**", "../*", "../../*"],
              message:
                "Public web services may not import internal services. Read the publication tables directly with an explicit select list.",
            },
          ],
        },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
