class runtime {
	constructor(canvas,time,inputs,objects=[],collisionSystem,viewport,uid) {
		this.canvas = canvas
		this.time = time
		this.inputs = inputs
		this.objects = objects
		this.collisionSystem = collisionSystem
		this.viewport = viewport
		this.uid = uid
	}
	Update() {
		//Old Collision Update
		//this.collisionSystem.Update()
		
		this.inputs.Update()
		for (let i=0;i<this.objects.length;i++) {this.objects[i].Update()}
		//this.viewport.Update()
		this.canvas.Update()
		game.canvas.ctx.fillStyle = "#000000"
		game.canvas.ctx.font = "16px Palatino"
		if (game.time.f%6==0) {processTimeToShow = game.time.processTime}
		game.canvas.ctx.fillText("Process Time: " + processTimeToShow, game.viewport.location.x + 10, game.viewport.location.y + 20)
		game.canvas.ctx.fillText("Objects: " + game.objects.length, game.viewport.location.x + 10, game.viewport.location.y + 40)
	}
}

var processTimeToShow = 0