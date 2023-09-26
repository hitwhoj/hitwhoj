/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  devServerPort: 8002,
  serverDependenciesToBundle: [
    /^rehype.*/,
    /^remark.*/,
    /^unified.*/,
    /^react-markdown.*/,
    /^micromark.*/,
    /^gemoji.*/,
    /^mdast.*/,
    /^lowlight.*/,
    /^unist.*/,
    /^hast.*/,
    /^vfile.*/,
    /^property-information.*/,
    /^bail.*/,
    /^trough.*/,
    /^space-separated-tokens.*/,
    /^comma-separated-tokens.*/,
    /^longest-streak.*/,
    /^html-void-elements.*/,
    /^ccount.*/,
    /^web-namespaces.*/,
    /^zwitch.*/,
    /^markdown-table.*/,
    /^decode-named-character-reference.*/,
    /^fault.*/,
    /^character-entities.*/,
  ],
};
