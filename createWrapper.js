module.exports = function createWrapper () {
	const stream = process.stdout
	const originalWrite = stream.write

	let str = null

	function bloop (cb) {
		stream.write = originalWrite
		{
			stream.clearLine(0)
			stream.cursorTo(0)
			if (cb) cb(stream)
			if (str) {
				stream.cursorTo(0)
				stream.write(str)
			}
		}
		stream.write = newWrite
	}

	function newWrite (string, encoding, fd) {
		const args = arguments
		bloop(stream => stream.write.apply(stream, args))
	}

	stream.write = newWrite

	const orig2 = process.stderr.write
	process.stderr.write = function () {
		const args = arguments
		bloop(() => {
			orig2.apply(process.stderr, args)
		})
	}

	return {
		setString (s) {
			str = s
			bloop()
		},
		unwrap () {
			process.stdout.write = originalWrite
			process.stderr.write = orig2
		}
	}
}