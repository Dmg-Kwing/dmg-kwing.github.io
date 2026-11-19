const deflist = require("markdown-it-deflist");

module.exports = function (eleventyConfig) {
  eleventyConfig.amendLibrary("md", (md) => {
    md.use(deflist);
  });

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
