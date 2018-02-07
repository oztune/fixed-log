module.exports = function (percentOrRange, options) {
	options = Object.assign({
		length: 10,
		empty: '░',
		full: '█',
		prefix: '|',
		suffix: '|'
	}, options)

	const numBars = options.length

	const range = typeof percentOrRange === 'number' ?
		// We floor because we don't want numbers over 95% to
		// look like 100%
		[0, Math.floor(numBars * percentOrRange)] :
		percentOrRange

	let str = ''
	for (let i = 0; i < numBars; ++i) {
		const full = (i >= range[0]) && (i < range[1])
		str += full ? options.full : options.empty
	}
	return options.prefix + str + options.suffix
}