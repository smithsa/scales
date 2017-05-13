//TO DO
//3. Add Webpack.js
//4. Refactor
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
        'getScale': getScale,
        'getMusicalNotes': musical_notes
  };

})();

var ScalePlayer = (function () {
  var synths = {
      'default': new Tone.Synth(),
      'mono': new Tone.MonoSynth(),
      'poly': new Tone.PolySynth(),
      'pluck': new Tone.PluckSynth(),
      'fm': new Tone.FMSynth()
  }
  var octave_setting = 4;
  var current_synth = synths.default.toMaster();

  function setSynth(synth_name){
    current_synth = synths[synth_name];
  }

  function getSynth(){
    return current_synth;
  }
  function addOctave(note, octave){
    octave = octave.toString();
    var return_note = note+octave;
    return return_note;
  }
  function addOctaves(scale_list, octave){
     var return_list = [];
     var len_list = scale_list.length;
     for(var i=0; i < len_list; i++){
        if(i == (len_list - 1)){
          return_list.push(addOctave(scale_list[i], octave + 1));
        }else{
          return_list.push( addOctave(scale_list[i], octave) );
        }
     }
     return return_list;
  }

  function arpeggiateScale(scale_list){
    scale_list = addOctaves(scale_list, octave_setting);
    var pattern = new Tone.Pattern(function(time, note){
      current_synth.triggerAttackRelease(note, 0.25);
    }, scale_list);
    var stop_time = "2m"; 
    pattern.start(0).stop(stop_time);
    Tone.Transport.schedule(function(time){
      Tone.Transport.stop();
    }, stop_time);
    Tone.Transport.start();
  }

  function stopPlayer(){
    Tone.Transport.stop();
  }

  return {
      'currentSynth': current_synth,
      'arpeggiate': arpeggiateScale,
      'setSynth' : setSynth,
      'getSynth' : getSynth,
      'stop' : stopPlayer,
  };
 
})();

var scales = null, key_accidental = null, seconds = null, keys =  ["A", "B", "C", "D", "E", "F", "G"], time_out = null, start_string = null;
var current_key;
var current_scale;
$( document ).ready(function() {
  $("#start").click(function(){      
      seconds = get_time();
      key_accidental = get_key_accidentals();
      scales = get_scales();
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
    ScalePlayer.stop();

  });
});

function get_scales(){
  var scales = [];
  $("input.input-scales").each(function(){
    if($(this).is(':checked')){
      scales.push( $(this).val() );
    }
  });
  return scales;
}
function get_key_accidentals(){
  var keys = [];
  $("input.input-keys").each(function(){
    if($(this).is(':checked')){
      keys.push( $(this).val() );
    }
  });
  return keys;
}
function get_time(){
  return parseInt($("#seconds").val());
}
function update_scale_blitz(){
  scales = get_scales();
  key_accidental = get_key_accidentals();
  seconds = get_time();
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
            // console.log(current_key, current_scale);
            // console.log(scale_list);
            ScalePlayer.arpeggiate(scale_list);
            var scale_duration = 4300;
            setTimeout(function(){
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



