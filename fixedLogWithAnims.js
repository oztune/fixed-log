const fixedLog = require('./fixedLog')

let dispose

module.exports = function () {
	const args = Array.from(arguments)
	const values = []
	let disposed = false, started = false
	let disposers

	// Dispose the previous ones
	if (dispose) {
		dispose()
	}

	function update (index, value) {
		if (disposed) {
			return
		}
		values[index] = value
		if (started) {
			fixedLog.apply(null, values)
		}
	}

	args.forEach((value, i) => {
		if (typeof value === 'function') {
			if (fixedLog.isTTY) {
				const dispose = value(update.bind(null, i))
				if (dispose) {
					if (!disposers) {
						disposers = []
					}
					// Add to disposers
					disposers.push(dispose)
				}
			} else {
				values[i] = ''
			}
		} else {
			values[i] = value
		}
	})

	dispose = () => {
		disposed = true
		if (disposers) {
			disposers.forEach(fn => fn())
		}
	}

	started = true
	fixedLog.apply(null, values)
}