// Runs as a separate CLI (postbuild), so load .env the same way Next.js does.
require("@next/env").loadEnvConfig(process.cwd());

const config = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
};

module.exports = config;
