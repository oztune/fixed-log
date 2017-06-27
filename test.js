const colors = require('colors')
const fixedLog = require('./fixedLog')

let time = 0

const arr = ['/', '—', '\\', '|']

setInterval(() => {
	fixedLog(colors.green(arr[time % arr.length] + ' hello ' + time))
	time += 1
	// console.log(13123)
}, 100)

let i = 0, j = 0

setInterval(() => {
	console.error('error ' + i)
	i++
}, 500)

setInterval(() => {
	console.log('reg ' + j)
	j++
}, 600)