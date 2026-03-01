"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "npx tsx prisma/seed.ts",
    },
    datasource: {
        url: "postgresql://admin:password@localhost:5433/meey_shop?schema=public",
    },
};
//# sourceMappingURL=prisma.config.js.map