const createWrapper = require('./createWrapper')
const cliCursor = require('cli-cursor')

let wrapper

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

function fixedLog () {
	const args = Array.from(arguments)

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

// This should probably be refactored

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
			const dispose = value(update.bind(null, i))
			if (dispose) {
				if (!disposers) {
					disposers = []
				}
				// Add to disposers
				disposers.push(dispose)
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

const characters = ['/', '—', '\\', '|']

module.exports.flip = (characters, options) => {
	options = Object.assign({
		interval: 33
	}, options)
	return update => {
		let i = 0
		function render () {
			let str = characters[i]
			if (options.map) {
				str = options.map(str)
			}
			update(str)
		}

		setInterval(() => {
			++i
			if (i >= characters.length) {
				i = i % characters.length
			}
			render()
		}, options.interval)

		render()
	}
}

/*

Interesting characters

'▒'
'░'
' '
*/

module.exports.spinner = (options) => {
	// return module.exports.flip(['[     ]', '[▒    ]', '[▒▒   ]', '[▒▒▒  ]', '[▒▒▒▒ ]', '[▒▒▒▒▒]', '[ ▒▒▒▒]', '[  ▒▒▒]', '[   ▒▒]', '[    ▒]'], { interval: 100 })

	// https://gist.github.com/ellemenno/9489706
	const arr = ['⸨░░░░░░░░░⸩', '⸨ ░░░░░░░░⸩', '⸨  ░░░░░░░⸩']
	// const arr = ['▁','▃','▄','▅','▆','▇','█','▇','▆','▅','▄','▃']
	// const arr = ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷'].reverse()
	// const arr = ['←','↖','↑','↗','→','↘','↓','↙']
	// const arr = ['.','o','O','@','*',' ']
	// const arr = ['▉','▊','▋','▌','▍','▎','▏','▎','▍','▌','▋','▊','▉']
	// const arr = ['◡◡', '⊙⊙', '◠◠']
    // const arr = ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈']
    // const arr = characters

	// return module.exports.flip(arr, { interval: 100 })

	options = Object.assign({
		interval: 100
	}, options)
	return module.exports.flip(characters, options)
}