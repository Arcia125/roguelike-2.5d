const randomNumberGenerator = (() => {
	// return a random integer between min and max.
	const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

	const getRandomRange = (min, max) => Math.random() * (max - min) + min;

	const getCoinFlip = () => Math.floor(Math.random() * 2);

	const getChance = (percentage) => {
		const percentageChance = percentage / 100;
		const rand = Math.random();
		return percentageChance > rand;
	}
	
	return {
		getRandomInt,
		getRandomRange,
		getCoinFlip,
		getChance,
	};

})();

export default randomNumberGenerator;
