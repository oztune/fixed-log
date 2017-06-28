const createWrapper = require('./createWrapper')
const cliCursor = require('cli-cursor')

let wrapper

const isTTY = process.stdout.isTTY && process.stderr.isTTY

function globalSetup () {
	wrapper = createWrapper()
	cliCursor.hide()

	// When the process exists, clear the string
	process.once('exit', function () {
		wrapper.setString()
	})
}

function globalDispose () {
	wrapper.unwrap()
	wrapper = null
	cliCursor.show()
}

module.exports = function fixedLog () {
	const args = Array.from(arguments)
	if (!isTTY) {
		console.log.apply(console, args)
		return
	}

	if (args.length <= 1 && args[0] == null) {
		if (wrapper) {
			globalDispose()
		}
	} else {
		if (!wrapper) {
			globalSetup()
		}
		wrapper.setString(args.join(''))
	}
}

module.exports.isTTY = isTTY