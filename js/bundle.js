/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var ScalePlayer = __webpack_require__(2);
var Scale = __webpack_require__(1);

var ScaleBlitz = (function () {
    var scales = null, 
        key_accidental = null, 
        seconds = null, 
        time_out = null, 
        player_timeout = null,
        start_string = null, 
        current_key = null, 
        current_scale = null,
        is_two_octave = 0,
        keys =  ["A", "B", "C", "D", "E", "F", "G"];
    function init(){
          $("#bpm").select2();
          $("#start").click(function(){   
              seconds = getTime();
              key_accidental = getKeyAccidentals();
              scales = getScales();
              start_string = randomIntFromInterval(1,6);
              changeScale();
              $("#start").hide();
              $("#stop").show();
              $("#count").show();
              $(".controls h3").show();
              countdown("count", 0, seconds);
          });
          $("#stop, #c-button--slide-right").click(function(){
              clearTimeout(time_out);
              $("#key").text("Key");
              $("#scale").text("Scale");
              $("#count").hide();
              $("#stop").hide();
              $("#start").show();
              clearTimeout(player_timeout);
              ScalePlayer.stop();
          });
          $(".input-number-decrement").click(function(){
              var cur_val = parseInt($(".input-number").val());
              if(cur_val > 0){
                $(".input-number").val( cur_val - 1 );
              }
          });
          $(".input-number-increment").click(function(){
              var cur_val = parseInt($(".input-number").val());
              if(cur_val < 120){
                $(".input-number").val( cur_val + 1 );
              }
          });
          $("input[name='octave_num']").click(function(){
              is_two_octave = parseInt($("input[name='octave_num']:checked").val());
          });

          $("#bpm").change(function(){
              ScalePlayer.changeTempo($(this).val());
          });

          // Chrome prevents audio context from starting without user insteraction, resume the context after first mousedown event
          document.addEventListener("mousedown", function(){
            if (Tone.context.state !== 'running') Tone.context.resume();
          },  { once: true });
    }
    
    function getScales(){
        var scales = [];
        $("input.input-scales").each(function(){
          if($(this).is(':checked')){
            scales.push( $(this).val() );
          }
        });
        return scales;
    }

    function getKeyAccidentals(){
      var keys = [];
      $("input.input-keys").each(function(){
        if($(this).is(':checked')){
          keys.push( $(this).val() );
        }
      });
      return keys;
    }

    function getTime(){
      return parseInt($("#seconds").val());
    }

    function updateScaleBlitz(){
      scales = getScales();
      key_accidental = getKeyAccidentals();
      seconds = getTime();
    }

    function countdown( elementName, minutes, seconds ){
        var element, endTime, hours, mins, msLeft, time;
        function twoDigits( n )
        {
            return (n <= 9 ? "0" + n : n);
        }

        function updateTimer()
        {
            msLeft = endTime - (+new Date);
            if ( msLeft < 1000 ) {
                element.innerHTML = "Time Up!";
                var scale_list = Scale.getScale(current_key, current_scale);
                if(is_two_octave == 1){
                    ScalePlayer.arpeggiate(scale_list, true);
                }else{
                    ScalePlayer.arpeggiate(scale_list);
                }
                var scale_duration = (ScalePlayer.getScaleDuration()) * 1000;
                console.log(ScalePlayer.getScaleDuration());
                player_timeout = setTimeout(function(){
                  changeScale();
                  setTimeout(countdown( elementName, minutes, seconds ), 2000);

                }, scale_duration);
            } else {
                time = new Date( msLeft );
                hours = time.getUTCHours();
                mins = time.getUTCMinutes();
                element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
                time_out = setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
            }
        }

        element = document.getElementById( elementName );
        endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
        updateTimer();
    }

    function randomIntFromInterval(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function isNumber(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    function filterKeyType(key_accidental, key){
        var return_key_accidentals = key_accidental;
        var remove_val = '';
        if(key === 'B' || key === 'E'){ //no sharps
            remove_val = 'sharps';
        }else if(key === 'C' || key === 'F'){ //no flats
            remove_val = 'flats';
        }

        var index = return_key_accidentals.indexOf(remove_val);
        if (index >= 0) {
          return_key_accidentals.splice( index, 1 );
        }
        return return_key_accidentals;
    }

    function sanitizeKey(key){
      key = key.replace(' Flat', 'b');
      var enharmonic_notes = { 'A#': 'Bb', 'Db': 'C#','D#':'Eb', 'Gb':'F#', 'Ab':'G#'};
      if(enharmonic_notes.hasOwnProperty(key)){
        key = enharmonic_notes[key];
      }
      return key;
    }

    function changeScale(){
        var random_key = keys[randomIntFromInterval(0, keys.length-1)];
        var random_scale = scales[randomIntFromInterval(0, scales.length-1)];
        var start_string = randomIntFromInterval(1,6);
        var filtered_key_accidentals = filterKeyType(key_accidental, random_key);
        var random_key_accidental = filtered_key_accidentals[randomIntFromInterval(0, key_accidental.length-1)];

        if(random_key_accidental === "flats"){
          random_key = random_key + " Flat"
        }
        else if(random_key_accidental === "naturals"){
          random_key = random_key;
        }
        else if(random_key_accidental === "sharps"){
          random_key = random_key + "#"
        }

        $("#key").text(random_key);
        $("#scale").text(random_scale);
        current_key = sanitizeKey(random_key);
        current_scale = random_scale;
    }

    return {
      'init': init
    };
    
})();


module.exports = ScaleBlitz;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var Scale = (function () {
  var musical_notes = [ 'A', 'Bb', 'B', 'C', 'C#','D','Eb','E','F','F#','G','G#'];
  var scale_formula = {
    'major': [1, 1, .5, 1, 1, 1, .5],
    'minor': [1, .5, 1, 1, .5, 1, 1],
    'dorian': [1, .5, 1, 1, 1, .5, 1],
    'mixolydian': [1, 1, .5, 1, 1, .5, 1],
    'major pentatonic': [1, 1, 1.5, 1, 1.5],
    'minor pentatonic': [1.5, 1, 1, 1.5, 1],
    'blues': [1.5, 1, .5, .5, 1.5, 1]
  };
  
  function returnScaleFormula(scale_name){
    return scale_formula[scale_name];
  }

  function returnRelativeNote(note, steps){
    var steps_index = musical_notes.indexOf(note);
    var musical_notes_index = steps_index + steps;
    var musical_notes_size = musical_notes.length - 1;
    var relative_note = '';
    if(musical_notes_index > musical_notes_size){
        musical_notes_index = ((musical_notes_index - musical_notes_size) - 1);
    }
    relative_note = musical_notes[musical_notes_index];
    return relative_note;
  }

  function generateScale(key, scale_forumla, index, scale_list){
      var scale_forumla_length = scale_forumla.length;
      if(scale_list.length === scale_forumla_length){
        return scale_list;
      }
      var cur_step = (scale_forumla[index] / .5);
      var note = returnRelativeNote(key, cur_step);
      scale_list.push(note);
      key = note;
      generateScale(key, scale_forumla, index + 1, scale_list);
  }
  
  function returnScale(key, scale_forumla){
     var scale_list = [];
     generateScale(key, scale_forumla, 0, scale_list);
     scale_list.unshift(key);
     return scale_list;
  }

  function getScale(key, scale_name){
      var formula = returnScaleFormula(scale_name);
      var scale_notes = returnScale(key, formula);
      return scale_notes;
  }

  return {
        'getScale': getScale
  };

})();

module.exports = Scale;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var ScalePlayer = (function () {
  var synths = {
      'default': new Tone.Synth(),
      'mono': new Tone.MonoSynth(),
      'pluck': new Tone.PluckSynth(),
      'fm': new Tone.FMSynth()
  };
  var octave_setting = 2;
  var current_synth = synths.fm.toMaster();
  var octave_note_order = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  var scale_duration = 0;
  var cur_temp = 120;
  function setSynth(synth_name){
    current_synth = synths[synth_name].toMaster();
  }

  function getSynth(){
    return current_synth;
  }
  function getScaleDuration(){
    return scale_duration;
  }
  function addOctave(note, octave){
    octave = octave.toString();
    var return_note = note+octave;
    return return_note;
  }

  function addOctaves(scale_list, octave){
     var return_list = [];
     var len_list = scale_list.length;
     var index_root_note = octave_note_order.indexOf(scale_list[0][0]);
     for(var i=0; i < len_list; i++){
        var index_cur_note = octave_note_order.indexOf(scale_list[i][0]);
        if(scale_list[0] === scale_list[i]  && i != 0){
          return_list.push(addOctave(scale_list[i], octave + 1));
          octave += 1;
        }else if(index_cur_note < index_root_note){
          return_list.push(addOctave(scale_list[i], octave + 1));
        }else{
          return_list.push(addOctave(scale_list[i], octave));
        }
     }

     return return_list;
  }

  function arpeggiateScale(scale_list, is_two_octave = false){
    is_two_octave = (typeof is_two_octave !== 'undefined') ?  is_two_octave : false;
    if(is_two_octave){
        octave_one = scale_list;
        octave_two = scale_list.slice();
        octave_two.shift();
        scale_list = octave_one.concat(octave_two);
      }

      scale_list = addOctaves(scale_list, octave_setting);
      console.log(scale_list);
  
    var release_trigger = 60/cur_temp;
    var scale_length = scale_list.length;
    var pattern = new Tone.Pattern(function(time, note){
      current_synth.triggerAttackRelease(note, release_trigger);
    }, scale_list);

    scale_duration = release_trigger * (scale_length);
    var stop_time = scale_duration;

    pattern.iterations = scale_length;
    pattern.start(.5);
    Tone.Transport.start();
    Tone.Transport.scheduleOnce(function(time){
      Tone.Transport.stop();
    }, stop_time);
  }

  function stopPlayer(){
    Tone.Transport.stop();
  }

  function changeTempo(tempo){
    cur_temp = parseInt(tempo);
    Tone.Transport.bpm.rampTo(parseInt(tempo));
  }

  return {
      'currentSynth': current_synth,
      'arpeggiate': arpeggiateScale,
      'getScaleDuration': getScaleDuration,
      'changeTempo' : changeTempo,
      'setSynth' : setSynth,
      'getSynth' : getSynth,
      'stop' : stopPlayer
  };
 
})();

module.exports = ScalePlayer;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var ScaleBlitz = __webpack_require__(0);

$( document ).ready(function() {
    ScaleBlitz.init();
	var slideRight = new Menu({
		wrapper: '#o-wrapper',
		type: 'slide-right',
		menuOpenerClass: '.c-button',
		maskId: '#c-mask'
	});
	var slideRightBtn = document.querySelector('#c-button--slide-right');
	slideRightBtn.addEventListener('click', function(e) {
		e.preventDefault;
		slideRight.open();
	});
});









/***/ })
/******/ ]);