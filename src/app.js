// setup global variables

import fs from 'fs';
import { EventEmitter } from 'events';

global.load = (path) => fs.readFileSync(path).toString();

global.dispatcher = new EventEmitter();
global.config = JSON.parse(load(`${__dirname}/../data/config.json`));

global.paths = {
	recorded: `${config.chinachu}/recorded.json`,
	recording: `${config.chinachu}/recording.json`
};

// register handlers

// browserify が import を先頭に持ってくるので、global にエクスポートしたものがモジュールで読めずエラーになる
// ちょっと嫌だけどこの書き方なら大丈夫なので。。。
const handlers = require('./handlers')['default'];

fs.watchFile(paths.recorded, handlers.recorded);
fs.watchFile(paths.recording, handlers.recording);
