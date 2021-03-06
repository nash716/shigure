import _ from 'lodash';
import cp from 'child_process';
import path from 'path';
import psTree from 'ps-tree';

const data = { };
let stopFlag = false;

data.encoded = JSON.parse(load(paths.encoded));
data.encoding = JSON.parse(load(paths.encoding));

dispatcher.on('recording-start', () => {
	_.forEach(data.encoding, (encoding, index) => {
		if (encoding.pid === -1) {
			return;
		}

		psTree(encoding.pid, (err, children) => {
			if (err) {
				log(`An error occurred while searching children of pid ${encoding.pid}`);

				return;
			}

			cp.spawn('renice', [ 19, '-p', encoding.pid ]);

			for (const child of children) {
				cp.spawn('renice', [ 19, '-p', child.PID ]);
			}

			log(`renice: pid = ${encoding.pid}, ${children.map(c => c.PID).join(', ')}`);
		});
	});
});

dispatcher.on('stop-next', () => {
	log('shigure will exit after this task has been completed.');

	stopFlag = true;
});

const format = (f, p) => {
	p = path.resolve(config.chinachu, '../', p);
	const basename = path.basename(p, '.m2ts');
	const basedir = path.dirname(p);

	return f.replace('{basename}', basename).replace('{basedir}', basedir);
};

const encode = () => {
	_.forEach(data.encoding, (encoding, index) => {
		if (encoding.pid !== -1) {
			return;
		}

		const input = path.resolve(config.chinachu, '../', encoding.chinachu.recorded);

		const proc = cp.spawn(config.script, [ input, encoding.encoded ], { cwd: path.resolve(__dirname, '../../lib'), detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] });
		proc.unref();

		log(`encoding start: pid = ${proc.pid}, input = ${input}, output = ${encoding.encoded}`);

		proc.on('close', (code) => {
			log(`encoding end: pid = ${proc.pid}, exit code = ${code}`);

			data.encoding = _.without(data.encoding, encoding);
			save(paths.encoding, JSON.stringify(data.encoding));

			data.encoded.push({
				chinachu: encoding.chinachu,
				encoded: encoding.encoded,
				exitCode: code
			});
			save(paths.encoded, JSON.stringify(data.encoded));

			dispatcher.emit('encode-end');
		});

		data.encoding[index].pid = proc.pid;
		save(paths.encoding, JSON.stringify(data.encoding));

		return false;
	});
};

const recorded = (curr, prev) => {
	data.recorded = JSON.parse(load(paths.recorded));

	if (stopFlag) {
		log('shigure has stopped.')

		process.exit(0);
	}

	if (!_.isEmpty(data.encoding)) {
		return;
	}

	_.forEach(data.recorded, (recorded) => {
		let flag = false;

		if (_.find(data.encoded, { chinachu: recorded })) {
			//log('already encoded, skip');

			return;
		}

		_.forEach(config.target, (target) => {
			const pattern = new RegExp(target, 'i');

			if (recorded.title.match(pattern)) {
				data.encoding.push({
					chinachu: recorded,
					encoded: format(config.output, recorded.recorded),
					pid: -1
				});

				save(paths.encoding, JSON.stringify(data.encoding));

				flag = true;

				return false;
			}
		});

		if (flag) {
			return false;
		}
	});

	encode();
};

export default recorded;
