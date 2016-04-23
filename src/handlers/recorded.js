let data = [ ];

const recorded = (curr, prev) => {
	data = JSON.parse(load(paths.recorded));
};

export default recorded;
