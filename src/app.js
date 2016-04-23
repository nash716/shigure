// setup global variables

import fs from 'fs';
import { EventEmitter } from 'events';

global.load = (path) => fs.readFileSync(path).toString();
global.save = (path, content) => fs.writeFileSync(path, content);

global.dispatcher = new EventEmitter();

const configPath = `${__dirname}/../data/config.json`;

global.config = JSON.parse(load(configPath));

global.paths = {
	recorded: `${config.chinachu}/recorded.json`,
	recording: `${config.chinachu}/recording.json`,
	encoded: `${__dirname}/../data/encoded.json`,
	encoding: `${__dirname}/../data/encoding.json`,
	log: `${__dirname}/../shigure.log`
};

global.log = (str) => fs.appendFileSync(paths.log, `[${new Date()}] ${str}\n`);

fs.watchFile(configPath, (curr, prev) => {
	global.config = JSON.parse(load(configPath));
});

log('shigure has started.');

// register handlers

// browserify が import を先頭に持ってくるので、global にエクスポートしたものがモジュールで読めずエラーになる
// ちょっと嫌だけどこの書き方なら大丈夫なので。。。
const handlers = require('./handlers')['default'];

fs.watchFile(paths.recorded, handlers.recorded);
fs.watchFile(paths.recording, handlers.recording);
