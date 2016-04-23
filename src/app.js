import fs from 'fs';
import handlers from './handlers';

global.load = (path) => fs.readFileSync(path).toString();

global.config = JSON.parse(load(__dirname + '/../data/config.json'));
global.config = JSON.parse(load(`${__dirname}/../data/config.json`));

global.paths = {
	recorded: `${config.chinachu}/recorded.json`,
	recording: `${config.chinachu}/recording.json`
};

fs.watchFile(paths.recorded, handlers.recorded);
fs.watchFile(paths.recording, handlers.recording);
