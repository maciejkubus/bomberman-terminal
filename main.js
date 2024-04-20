const readline = require('readline')

const map = []
const mapSize = {
	width: 24,
	height: 12,
}

const playerA = {
	x: 1,
	y: 1,
	keys: ['w', 'a', 's', 'd'],
	bombKey: 'e',
	bombPlaced: false,
	move: function(key) {
		let newPosition = { x: 0, y: 0 }
		if(key == 'w') {
			newPosition = { x: this.x, y: this.y -1 }
		}
		if(key == 's') {
			newPosition = { x: this.x, y: this.y +1 }
		}
		if(key == 'a') {
			newPosition = { x: this.x -1, y: this.y }
		}
		if(key == 'd') {
			newPosition = { x: this.x +1, y: this.y }
		}

		const tile = map.find(tile => tile.x == newPosition.x && tile.y == newPosition.y)

		if(tile.tile == '⬛' || tile.tile == '🔥') {
			this.x = newPosition.x
			this.y = newPosition.y
		}
	},
	bomb: function() {
		if(this.bombPlaced) return;

		const tile = map.find(tile => tile.x == this.x && tile.y == this.y)
		tile.tile = '💣';
		this.bombPlaced = true;
		setTimeout(() => {
			this.bombPlaced = false;
			explode(tile.x, tile.y)
		}, 2500)
	}
}
const playerB = {
	x: 23,
	y: 11,
	keys: ['up', 'down', 'left', 'right'],
	bombKey: 'space',
	bombPlaced: false,
	move: function(key) {
		let newPosition = { x: 0, y: 0 }
		if(key == 'up') {
			newPosition = { x: this.x, y: this.y -1 }
		}
		if(key == 'down') {
			newPosition = { x: this.x, y: this.y +1 }
		}
		if(key == 'left') {
			newPosition = { x: this.x -1, y: this.y }
		}
		if(key == 'right') {
			newPosition = { x: this.x +1, y: this.y }
		}

		const tile = map.find(tile => tile.x == newPosition.x && tile.y == newPosition.y)

		if(tile.tile == '⬛' || tile.tile == '🔥') {
			this.x = newPosition.x
			this.y = newPosition.y
		}
	},
	bomb: function() {
		if(this.bombPlaced) return;

		const tile = map.find(tile => tile.x == this.x && tile.y == this.y)
		tile.tile = '💣';
		this.bombPlaced = true;
		setTimeout(() => {
			this.bombPlaced = false;
			explode(tile.x, tile.y)
		}, 2500)
	}
}

const explode = (startX, startY) => {
	for(let y = startY - 2; y <= startY + 2; y++) {
		const tile = map.find(tile => tile.x == startX && tile.y == y)
		if(tile && tile.tile != '🧱') {
			tile.tile = '🔥'
			setTimeout(() => {
				tile.tile = '⬛'
			}, 400)
		}
	}
	for(let x = startX - 2; x <= startX + 2; x++) {
		const tile = map.find(tile => tile.x == x && tile.y == startY)
		if(tile && tile.tile != '🧱') {
			tile.tile = '🔥'
			setTimeout(() => {
				tile.tile = '⬛'
			}, 400)
		}
	}
}

const generateMap = () => {
	for(let y = 0; y <= mapSize.height; y++) {
		for(let x = 0; x <= mapSize.width; x++) {
			if(x % 2 == 1 && y % 2 == 1) {
				map.push({ x: x, y: y, tile: '⬛' })
			}
			else if((x == 1 && y == 2) || (x == 2 && y == 1) || (x == mapSize.width - 1 && y == mapSize.height - 2) || (x == mapSize.width - 2 && y == mapSize.height - 1)) {
				map.push({ x: x, y: y, tile: '⬛' })
			}
			else if(x % 2 == 1 && y != 0 && y != mapSize.height) {
				map.push({ x: x, y: y, tile: '🛢️ ' })
			}
			else if(y % 2 == 1 && x != 0 && x != mapSize.width) {
				map.push({ x: x, y: y, tile: '🛢️ ' })
			}
			else {
				map.push({ x: x, y: y, tile: '🧱' })
			}
		}
	}
}

const draw = () => {
	for(let y = 0; y <= mapSize.height; y++) {
		let line = "";
		for(let x = 0; x <= mapSize.width; x++) {
			if(playerA.x == x && playerA.y == y) {
				line += '🟥'
			}
			else if(playerB.x == x && playerB.y == y) {
				line += '🟩'
			}
			else {
				const tile = map.find(tile => tile.x == x && tile.y == y);
				line += tile.tile
			}
		}
		console.log(line)
	}
}

const die = (winner) => {
	console.log('WINNER: ' + winner)
	process.exit()
}

const update = () => {
	console.clear()
	draw()

	const tileA = map.find(tile => tile.x == playerA.x && tile.y == playerA.y)
	if(tileA.tile == '🔥') {
		die('Zielony')
	}

	const tileB = map.find(tile => tile.x == playerB.x && tile.y == playerB.y)
	if(tileB.tile == '🔥') {
		die('Czerwony')
	}
}

const main = () => {
	readline.emitKeypressEvents(process.stdin);

	if (process.stdin.isTTY)
			process.stdin.setRawMode(true);

	process.stdin.on('keypress', (chunk, key) => {
		if(key.name == 'q') {
			process.exit()
		}
		if(playerA.keys.includes(key.name)) {
			playerA.move(key.name)
		}
		if(key.name == playerA.bombKey) {
			playerA.bomb()
		}
		if(playerB.keys.includes(key.name)) {
			playerB.move(key.name)
		}
		if(key.name == playerB.bombKey) {
			playerB.bomb()
		}
	});

	setInterval(update, 100)
	generateMap()
}

main();