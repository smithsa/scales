# Scale Blitz

ScaleBlitz is a web application created to help musicians practice playing scales. The application focuses on improving speed and accuracy. The key and scale name randomly selected flashes on the screen, the musician must then quickly play the scale within the set amount of time. A MIDI library will then provides an audio playback of the selected scale. Users can change a variety of settings such as pitch, playback speed, and the scales they would like to focus on.

The application was built using HTML, CSS, JavaScript, JQuery, and Webpack. The midi audio playblack of the scales are generated programmatically with an algorithm that spell out notes in a selected scale.

<img width="70%" alt="scale-blitz-screenshot" src="https://user-images.githubusercontent.com/1827606/46259090-0a342f80-c49a-11e8-8f8d-46d97ac88051.png">

## Prerequisites
*	[NPM](https://www.npmjs.com/)
*	[Webpack](https://webpack.js.org/)

## Installation
1. Clone the repository
	```
	git clone git@github.com:smithsa/scales.git
	```

2. Navigate into the *scales* directory
	```
	cd scales
	```	

3. Install the dependencies via NPM
	```
	npm install
	``` 	
4. Build bundle js file
	```
	webpack
	``` 

## Usage

![2018-09-30 10 16 26](https://user-images.githubusercontent.com/1827606/46259089-086a6c00-c49a-11e8-908b-ae146f840cea.gif)

## Built With
*	[NPM](https://www.npmjs.com/)
*	[JQuery](https://jquery.com/)
*	[Webpack](https://webpack.js.org/)
*	[Tone.js](https://tonejs.github.io/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT © [Sade Smith](https://sadesmith.com)
