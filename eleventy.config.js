const deflist = require("markdown-it-deflist");

// GitHub project pages are served under /<repo>/ (this repo: /Jiong.github.io/).
// Local development keeps "/" so the preview remains at http://localhost:8080/.
const rawPrefix = process.env.PATH_PREFIX || "/";
const pathPrefix = rawPrefix.endsWith("/") ? rawPrefix : `${rawPrefix}/`;
const prefixNoSlash = pathPrefix === "/" ? "" : pathPrefix.replace(/\/$/, "");

module.exports = function (eleventyConfig) {
  eleventyConfig.amendLibrary("md", (md) => {
    md.use(deflist);
  });

  if (prefixNoSlash) {
    eleventyConfig.addTransform("prefix-root-urls", function (content, outputPath) {
      if (!outputPath || !outputPath.endsWith(".html")) return content;
      return content.replace(
        /\b(href|src)="(\/(?!\/)[^"]*)"/g,
        function (match, attribute, url) {
          if (url === pathPrefix || url.startsWith(pathPrefix)) return match;
          return `${attribute}="${prefixNoSlash}${url}"`;
        }
      );
    });
  }

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "public/imgs": "imgs" });
  eleventyConfig.addPassthroughCopy({ "public/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "public/favicon.svg": "favicon.svg" });

  eleventyConfig.addCollection("projects", (collectionApi) =>
    collectionApi
      .getFilteredByTag("projects")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  eleventyConfig.addCollection("articles", (collectionApi) =>
    collectionApi
      .getFilteredByTag("articles")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
