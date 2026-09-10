const level = [
	//Level 0
	[
		
		function p1() {return new _player(
			"p1",
			new _location(320,380), 
			new _movements([
				new _inputTranslation(4,"p1left","p1right","p1up","p1down")
			]),
			new _triggers([
				new _whileCollidingTrigger(new _actions([new _destroyObject("p1")]), 0, 0, "enemy", "p1hu"),
				new _onInputTrigger(
					new _actions([
						new _clearObjectMoveset("p1"),
						new _addObjectMovement("p1", new _inputTranslation(2,"p1left","p1right","p1up","p1down"))
					]),
					0,
					0,
					"p1focus",
					true
				),
				new _onInputTrigger(
					new _actions([
						new _clearObjectMoveset("p1"),
						new _addObjectMovement("p1", new _inputTranslation(4,"p1left","p1right","p1up","p1down"))
					]),
					0,
					0,
					"p1focus",
					false
				),
				new _whileInputTrigger(
					new _actions([
						new _spawnObject(
							new _object(
								game.uid.NewUID(1),
								new _location(400,400),
								new _movements([new _linearTranslation(0,-10)]),
								new _triggers([
									new _variableEqualsVariable(
										new _actions([
											new _warpObjectToObject(game.uid.Memory(1), "p1")
										]),
										0,
										0,
										new _objectF(game.uid.Memory(1)),
										new _variable(1)
									)
								]),
								new _actions(),
								new _colliders([
									new _hitbox(
										game.uid.NewUID(),
										game.uid.Memory(1),
										new _location(0,0),
										new _location(),
										10,
										10,
										"enemy",
										false,
										1
									)
								]),
								false,
								0,
								false
							),
							new _conditions()
						)
					]),
					2,
					0,
					"p1a",
					true
				)
			]),
			new _actions(),
			new _colliders([new _hurtbox("p1hu", "p1", new _location(0,0), new _location(320,380), 20, 20, "enemy", false, 1)]),
			false,
			1,
			0,
			false
		)},
		function p2() {return new _player(
			"p2",
			new _location(320,380), 
			new _movements([new _inputTranslation(5,"p2left","p2right","p2up","p2down")]),
			new _triggers([new _whileCollidingTrigger(new _actions([new _destroyObject("p2")]), 0, 0, "enemy", "p2hu")]),		
			new _actions(), 
			new _colliders([new _hurtbox("p2hu", "p2", new _location(0,0), new _location(320,380), 20, 20, "enemy", false, 1)]), 
			false, 
			2,
			0,
			false
		)},
		function() {return new _object(
			game.uid.NewUID(0),
			new _location(160,300), 
			new _movements([new _radialTranslation(0.1,10,0)]),
			new _triggers(),
			new _actions(), 
			new _colliders([new _hitbox(game.uid.NewUID(), game.uid.Memory(0), new _location(0,0), new _location(160,300), 100, 100, "enemy", false, 1)]),
			false,
			0,
			false
		)},
		function() {return new _object(
			game.uid.NewUID(0),
			new _location(480,300), 
			new _movements([new _radialTranslation(0.1,10,Math.PI*0.5)]),
			new _triggers(),
			new _actions(), 
			new _colliders([new _hurtbox(game.uid.NewUID(), game.uid.Memory(0), new _location(0,0), new _location(480,300), 100, 100, "enemy", false, 1)]),
			false,
			0,
			false
		)},
		function() {return new _object(
			game.uid.NewUID(0),
			new _location(240,270),
			new _movements([new _linearTranslation(-0.2,0.1)]),
			new _triggers(),
			new _actions(),
			new _colliders([new _hitbox(game.uid.NewUID(), game.uid.Memory(0), new _location(0,0), new _location(240,270), 20, 20, "enemy", false, 1)]),
			false,
			0,
			false
		)},
		function() {return new _object(
			game.uid.NewUID(0),
			new _location(240,300),
			new _movements([new _linearTranslationPolar(0.2,5)]),
			new _triggers(),
			new _actions(),
			new _colliders([new _hitbox(game.uid.NewUID(), game.uid.Memory(0), new _location(0,0), new _location(240,300), 20, 20, "enemy", false, 1)]),
			false,
			0,
			false
		)},
		function() {return new _object(
			game.uid.NewUID(0),
			new _location(320,200), 
			new _movements([new _radialTranslation(0.1,100,0), new _radialTranslation(-0.1,100,Math.PI)]),
			new _triggers(),
			new _actions(), 
			new _colliders([new _hitbox(game.uid.NewUID(), game.uid.Memory(0), new _location(0,0), new _location(320,200), 100, 10, "enemy", false, 1)]),
			false,
			0,
			false
		)},
		function() {return new _object(
			game.uid.NewUID(0),
			new _location(320,150), 
			new _movements([new _radialTranslation(0.1,100,0), new _radialTranslation(-0.1,100,Math.PI)]),
			new _triggers(),
			new _actions(), 
			new _colliders([new _hitbox(game.uid.NewUID(), game.uid.Memory(0), new _location(0,0), new _location(320,150), 140, 10, "enemy", false, 1)]),
			false,
			0,
			false
		)},
		function() {return new _object(
			game.uid.NewUID(0),
			new _location(320,105), 
			new _movements([new _radialTranslation(0.1,100,0), new _radialTranslation(-0.1,100,Math.PI)]),
			new _triggers(),
			new _actions(), 
			new _colliders([new _hitbox(game.uid.NewUID(), game.uid.Memory(0), new _location(0,0), new _location(320,110), 180, 10, "enemy", false, 1)]),
			false,
			0,
			false
		)},
		function() {return new _object(
			game.uid.NewUID(0),
			new _location(320,75), 
			new _movements([new _radialTranslation(0.1,100,0), new _radialTranslation(-0.1,100,Math.PI)]),
			new _triggers(),
			new _actions(), 
			new _colliders([new _hitbox(game.uid.NewUID(), game.uid.Memory(0), new _location(0,0), new _location(320,75), 220, 10, "enemy", false, 1)]),
			false,
			0,
			false
		)}
		/*,
		function amogus() {return new _object(
			"amogus",
			new _location(100,300),
			new _movement([new _inputTranslation(5,"p2left","p2right","p2up","p2down")]),
			new _triggers(),
			new _actions(),
			new _colliders([
				new _hitbox(new _location(100,300), 30, 40, "enemy", 1),
				new _hitbox(new _location(90,330), 10, 20, "enemy", 1),
				new _hitbox(new _location(110,330), 10, 20, "enemy", 1),
				new _hurtbox(new _location(100,295), 20, 15, "enemy", 1)
			]),
			false
		)}*/
	]
]