
const rand = (high, low) => Math.random() * (high - low) + low;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// This team function determines which team a point is within
const team = point => {
	// Not working: a smaller square within the bigger square
	if ((point.x > 100 && point.x < 300) && ( point.y > 100 && point.y < 300 )) {
		return -1;
	} else {
		return 1;
	}

	// Working
	// return point.x > point.y ? 1 : -1;;
};

function createTemplate({X_MAX, Y_MAX, randomPoints, guess, trainedWeights}) {
	return `
	  <svg width="${X_MAX}" height="${Y_MAX}">
	    ${randomPoints.map(point => {
	    	const {sum, team: guessedTeam} = guess(trainedWeights, point);
	    	const actualTeam = team(point);
			return `<circle 
				onclick="console.log({x: ${point.x}, y: ${point.y}, guessedSum: ${sum}, guessedTeam: ${guessedTeam}, actualTeam: ${actualTeam}})"
				cx="${point.x}"
				cy="${point.y}"
				r="4"
				fill="${guessedTeam === -1 ? 'blue' : 'red' }"/>`
			}
	    )}
	    <line x1="0" x2="${X_MAX}" y1="0" y2="${Y_MAX}" stroke="purple" />
	  </svg>
	`;
}

const X_MAX = 400;
const Y_MAX = 400;

function guess(weights, point) {
	const sum = point.x * weights.x + point.y * weights.y;
	const team = sum >= 0 ? 1 : -1;
	return {sum, team};
}

function train(weights, point, actualTeam) {
	const {team} = guess(weights, point); // 1
	const error = actualTeam - team;
	const learningRate = 0.1;

	return {
		x: weights.x + point.x * error * learningRate,
		y: weights.y + point.y * error * learningRate
	}
}

function generatePoints(num) {
	let points = [];

	for (let i = 0; i < num; i++) {
		const point = {
			x: rand(0, X_MAX),
			y: rand(0, Y_MAX)
		}
		points.push(point);
	}

	return points;
}

function start() {
	const randomWeights = ({
		x: rand(-1, 1),
		y: rand(-1, 1)
	});

	const randomPoints = generatePoints(900);

	const examples = generatePoints(1000000).map(point => ({
		point,
		team: team(point)
	}));

	let currentWeights = randomWeights;

	for (const example of examples) {
		currentWeights = train(currentWeights, example.point, example.team)
	}

	console.info('Final weights', currentWeights);

	const html = createTemplate({
		X_MAX,
		Y_MAX,
		randomPoints,
		guess,
		trainedWeights: currentWeights
	});

	document.body.innerHTML = html;
}

start();