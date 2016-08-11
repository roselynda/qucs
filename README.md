# zaquantum

Front-end for Zaquantum / Qucs circuit simulation app

Built on Express.js

To run:

npm install

npm start

###File structure:

####Jade / Views:
- main views jade files
- /editor (editor components)
- /landing (landing components)
- /modals (all modal views)
- /objects (UI objects: Navbar, pricing, etc)

####SCCS / Stylesheets:
- style.scss (all scss files are imported here)
- /base (base styling: colors, typography, mixins)
- /layouts (styling for specific layouts)
- /objects (UI objects/components)
  - /editor (UI objects/components for editor view)

####Javascript:
- init.js (all functions are initialized here)
- /experiment (editor functions)
- /interactions (UI interactions + loading of data)
- /libs (library files)
- /result (result display / graph)

####Libraries used:
- Fabric.js (for canvas)
- Bulma.io (css framework)
- Plotly.js (results graph)
