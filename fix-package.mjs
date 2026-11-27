import fs from 'node:fs';

fs.copyFileSync('package.json', 'package.json.bak');

let t = fs.readFileSync('package.json', 'utf8').replace(/\r\n/g, '\n');

const marker =
  '"./layers/wildlife-sightings/source": "./src/layers/wildlifeSightings/source.js"';
const i = t.indexOf(marker);
if (i < 0) throw new Error('Marker line not found');

const tail = `
  },
  "main": "electron/main.js",
  "directories": {
    "doc": "docs"
  },
  "build": {
    "appId": "ai.godseyeview.app",
    "productName": "Gods Eye View",
    "asar": false,
    "directories": {
      "output": "release",
      "buildResources": "electron-assets"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "electron-assets/**/*",
      "build/**/*",
      "server/**/*",
      "src/**/*",
      "vite.config.js",
      ".env",
      "package.json"
    ],
    "win": { "target": "nsis", "icon": "electron-assets/icon.ico" },
    "nsis": { "oneClick": false, "allowToChangeInstallationDirectory": true }
  }
}
`;

t = t.slice(0, i + marker.length) + tail;

const pair =
  '    "qa:data-library": "node scripts/qa-data-library.mjs",\n' +
  '    "mcp": "node server/mcp/stdio.js",\n';
t = t.replace(pair + pair, pair);

JSON.parse(t); // throws if still invalid, nothing is saved
fs.writeFileSync('package.json', t);
console.log('package.json fixed and valid');