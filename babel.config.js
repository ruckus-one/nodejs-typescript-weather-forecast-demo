module.exports = {
    "plugins": [
        "babel-plugin-transform-typescript-metadata",
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
    ],
    "presets": [
        "@babel/preset-typescript" ,
        ["@babel/preset-env", {targets: {node: "current"} }],
    ]
}
