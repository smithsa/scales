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