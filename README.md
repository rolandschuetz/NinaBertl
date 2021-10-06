# NinaBertl

###### INSTALL dependencies, start changes WATCH and SERVE locally.
`npm start`

###### SERVE locally and WATCH files changes
`npm run dev`

###### Create PRODUCTION BUILD
`npm run prod`

------------

### Color Pallet
![Color Pallete](color-pallet.png "Color Pallet")

------------

### File structure
┌ **src** (sources directory)\
├── **assets** (assets directory)\
├──── **images**\
├────── **icons**\
├────── **favicon**\
├──── **fonts**\
├──── **audio**\
├──── **video**\
├──── **data** (for json|txt|md data)\
├ **components** (main structural components)\
├ **global** (simple elements like button|input|textarea, global elements like icons and other main styles and js)\
├ **pages** (pages layouts and additional scripts and styling)\
├ **views** (complex repeatable elements based on multiple components)\
├ **live** (current development build)\
├ **public** (production build)\
├ package.json (main project config)\
├ gulpfile.babel.js (main building tool config)\
└ webpack.config.js (es6)

------------

### Environment
[Livereload](https://chrome.google.com/webstore/search/livereload?hl=ru) extension for development mode\
`node 10.16.0`\
`npm 6.13.0`
