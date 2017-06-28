// This should probably be refactored

function createSpinner (characters, options) {
	options = Object.assign({
		interval: 100
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

function createSpinnerFactory (characters, defaultInterval) {
	return options => {
		if (defaultInterval) {
			options = Object.assign({
				interval: defaultInterval
			}, options)
		}
		return createSpinner(characters, options)
	}
}

// FYI: We can probably use this: https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json

module.exports.line = createSpinnerFactory(['/', '—', '\\', '|'])
// module.exports.dots = createSpinnerFactory(['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷'].reverse())
module.exports.dots = createSpinnerFactory(["⠋",	"⠙", "⠹", "⠸",
			"⠼",
			"⠴",
			"⠦",
			"⠧",
			"⠇",
			"⠏"])

module.exports.dot = createSpinnerFactory(['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'])
module.exports.arc = createSpinnerFactory(['◜ ', ' ◝', ' ◞', '◟ '])
module.exports.o = createSpinnerFactory(['.','o','O','@','*',' '])
module.exports.bars = options => {
	options = Object.assign({
		length: 6,
		empty: '░',
		full: '▒',
		prefix: '|',
		suffix: '|'
	}, options)

	const numBars = options.length
	const numFrames = (numBars * 2)
	let chars = []
	for (let i = 0; i < numFrames; ++i) {
		let str = ''
		for (let j = 0; j < numBars; ++j) {
			const full = i <= numBars ? j < i : j >= (i - numBars)
			str += full ? options.full : options.empty
		}
		chars.push(options.prefix + str + options.suffix)
	}

	return createSpinner(chars, options)
}

/*

Interesting characters

'▒'
'░'
' '

Interesting squences

https://gist.github.com/ellemenno/9489706

// 	const arr = ['⸨░░░░░░░░░⸩', '⸨ ░░░░░░░░⸩', '⸨  ░░░░░░░⸩']
// 	// const characters = ['/', '—', '\\', '|']
// 	// const arr = ['▁','▃','▄','▅','▆','▇','█','▇','▆','▅','▄','▃']
// 	// const arr = ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷'].reverse()
// 	// const arr = ['←','↖','↑','↗','→','↘','↓','↙']
// 	// const arr = ['.','o','O','@','*',' ']
// 	// const arr = ['▉','▊','▋','▌','▍','▎','▏','▎','▍','▌','▋','▊','▉']
// 	// const arr = ['◡◡', '⊙⊙', '◠◠']
//     // const arr = ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈']
*/