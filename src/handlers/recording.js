import _ from 'lodash';

const recording = (curr, prev) => {
	const data = JSON.parse(load(paths.recording));

	if (_.isEmpty(data)) {
		return;
	}

	dispatcher.emit('recording');
};

export default recording;
