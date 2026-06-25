const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const config = getDefaultConfig(__dirname);

// Exclude recipecost-pro(1) from bundling
config.resolver.blacklistRE = /recipecost-pro\(1\)\/.*/;
config.resolver.blockList = [
    /recipecost-pro\(1\)\/.*/,
];

config.resolver.sourceExts.push('sql');

module.exports = withNativeWind(config, { input: "./global.css" });