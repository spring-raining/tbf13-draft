module.exports = {
  title: 'tbf13-draft', // populated into `publication.json`, default to `title` of the first entry or `name` in `package.json`.
  author: '小形克宏 <ogwata@vivliostyle.org>', // default to `author` in `package.json` or undefined.
  language: 'ja', // default to undefined.
  //size: '', // paper size.
  theme: 'themes/theme_print.css', // .css or local dir or npm package. default to undefined.
  entry: ['content/ogwata/draft-ogwata.md'],
  // entryContext: './manuscripts', // default to '.' (relative to `vivliostyle.config.js`).
  output: [
    './draft-ogwata.md.pdf', // the output format will be inferred from the name.
  ],
  // workspaceDir: '.vivliostyle', // directory which is saved intermediate files.
  // toc: true, // whether generate and include ToC HTML or not, default to 'false'.
  // cover: './cover.png', // cover image. default to undefined.
  // vfm: { // options of VFM processor
  //   hardLineBreaks: true, // converts line breaks of VFM to <br> tags. default to 'false'.
  //   disableFormatHtml: true, // disables HTML formatting. default to 'false'.
  // },
};
