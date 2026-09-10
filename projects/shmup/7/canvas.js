class _canvas {
	constructor(width=640,height=480,hitboxesVisible=false) {
		this.div = document.createElement("div")
		document.body.appendChild(this.div)
		this.c = document.createElement("canvas")
		this.div.appendChild(this.c)
		this.ctx = this.c.getContext("2d")
		this.width = width
		this.c.width = this.width
		this.height = height
		this.c.height = this.height
		this.hitboxesVisible = hitboxesVisible
		this.Resize()
	}
	Update() {
		this.ctx.setTransform(1,0,0,1,-game.viewport.location.x,-game.viewport.location.y)
		this.ctx.clearRect(game.viewport.location.x,game.viewport.location.y,this.c.width,this.c.height)
		this.ctx.fillStyle = "#CFCFCFFF"
		this.ctx.fillRect(game.viewport.location.x,game.viewport.location.y,this.c.width,this.c.height)
		if (this.hitboxesVisible) {
			this.DrawHurtboxes()
			this.DrawHitboxes()
		}
	}
	Resize() {
		if (window.innerWidth/window.innerHeight<this.c.width/this.c.height) {
			this.div.setAttribute("style", "width: "+window.innerWidth+"px")
			this.c.setAttribute("style", "width: 100%")
		}
		else {
			this.div.setAttribute("style", "height: "+window.innerHeight+"px")
			this.c.setAttribute("style", "height: 100%")
			this.c.style.position = "absolute"
			this.c.style.left = (window.innerWidth - window.innerHeight * this.width / this.height) * 0.5 + "px"
		}
	}
	DrawObjects() {
		
	}
	DrawHitboxes() {
		game.canvas.ctx.beginPath()
		game.canvas.ctx.fillStyle = "#FF000044"
		for (let i=0;i<game.objects.length;i++) {
			for (let j=0;j<game.objects[i].colliders.colliderset.length;j++) {
				if (game.objects[i].colliders.colliderset[j].constructor.name == "_hitbox") {
					let object = game.objects[i]
					let collider = game.objects[i].colliders.colliderset[j]
					this.ctx.fillRect(collider.location.x-collider.width/2,collider.location.y-collider.height/2,collider.width,collider.height)
				}
			}
		}
	}
	DrawHurtboxes() {
		game.canvas.ctx.beginPath()
		game.canvas.ctx.fillStyle = "#00FF0044"
		for (let i=0;i<game.objects.length;i++) {
			for (let j=0;j<game.objects[i].colliders.colliderset.length;j++) {
				if (game.objects[i].colliders.colliderset[j].constructor.name == "_hurtbox") {
					let object = game.objects[i]
					let collider = game.objects[i].colliders.colliderset[j]
					this.ctx.fillRect(collider.location.x-collider.width/2,collider.location.y-collider.height/2,collider.width,collider.height)
				}
			}
		}
	}
}

window.onresize = function() {
	if (game.canvas!=undefined) {game.canvas.Resize()}
}