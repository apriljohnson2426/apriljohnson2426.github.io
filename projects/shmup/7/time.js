class time {
	constructor(fps=60, updateFunction, updateContext) {
		this.fps = fps
		this.fpsInterval = 1000 / this.fps
		this.f = 0
		this.cancel = false
		this.now = 0
		this.then = 0
		this.elapsed = 0
		this.Update = updateFunction
		this.updateContext = updateContext
		this.processStartTime = 0
		this.processEndTime = 0
		this.processTime = 0
		this.Start()
	}
	Start() {
		this.cancel = false
		requestAnimationFrame(this.Loop.bind(this))
	}
	Stop() {
		this.cancel = true
	}
	Loop() {
		if (this.cancel) {return}
		requestAnimationFrame(this.Loop.bind(this))
		this.now = performance.now()
		this.elapsed = this.now - this.then
		if (this.elapsed > this.fpsInterval) {
			this.then = this.now
			this.f++
			//this.Update()
			this.processStartTime = performance.now()
			game.Update()
			this.processEndTime = performance.now()
			this.processTime = this.processEndTime - this.processStartTime
		}
	}
	Update() {
		
	}
}