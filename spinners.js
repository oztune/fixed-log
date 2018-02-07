// This should probably be refactored

const renderProgressBar = require('./renderProgressBar')

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
module.exports.bars = (renderOprions) => {
	const numBars = renderOprions.length
	const numFrames = (numBars * 2 + 1)
	let chars = []
	for (let i = 0; i < numFrames; ++i) {
		const range = i <= numBars ?
			[0, i] :
			[i - numBars, numBars]
		
		chars.push(renderProgressBar(range, renderOprions))
	}

	return createSpinner(chars, renderOprions)
}

/*

Interesting characters

░ ▒ ▓ █

■

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