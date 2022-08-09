module.exports = {
  title: 'tbf13-draft', // populated into `publication.json`, default to `title` of the first entry or `name` in `package.json`.
  author: 'spring-raining <harusamex.com@gmail.com>', // default to `author` in `package.json` or undefined.
  language: 'ja', // default to undefined.
  // size: 'A4', // paper size.
  theme: 'theme', // .css or local dir or npm package. default to undefined.
  entry: ['content/index.md'],
  // entryContext: './manuscripts', // default to '.' (relative to `vivliostyle.config.js`).
  output: [
    './tbf13-draft.pdf', // the output format will be inferred from the name.
  ],
  // workspaceDir: '.vivliostyle', // directory which is saved intermediate files.
  // toc: true, // whether generate and include ToC HTML or not, default to 'false'.
  // cover: './cover.png', // cover image. default to undefined.
  // vfm: { // options of VFM processor
  //   hardLineBreaks: true, // converts line breaks of VFM to <br> tags. default to 'false'.
  //   disableFormatHtml: true, // disables HTML formatting. default to 'false'.
  // },
};
