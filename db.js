const fs = require('fs');
const path = require('path');

let PATH = path.join(
    __dirname,
    'users.json'
);

if (!fs.existsSync(PATH)) {
    fs.writeFileSync(PATH, '{}');
}

let DATA = JSON.parse( fs.readFileSync(PATH).toString() );

if (!DATA['byID']) DATA['byID'] = {};
if (!DATA['byName']) DATA['byName'] = {};
fs.writeFileSync(PATH, JSON.stringify(DATA));
