class _UID {
	constructor(n=8, charset='ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
		this.n = n
		this.charset = charset
		this.current = this.NewUID()
		this.memory = new Array()
	}
	NewUID(memoryIndex = -1) {
		//mostly https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
		let result = '';
		let counter = 0;
		while (counter < this.n) {
			result += this.charset.charAt(Math.floor(Math.random() * this.charset.length))
			counter += 1
		}
		this.current = result
		if (memoryIndex != -1) {this.memory[memoryIndex] = this.current}
		return this.current
	}
	Memory(memoryIndex) {
		let uid = this.memory[memoryIndex]
		if (uid == undefined) {uid = this.NewUID()}
		this.current = uid
		return this.current
	}
}