var ScalePlayer = (function () {
  var synths = {
      'default': new Tone.Synth(),
      'mono': new Tone.MonoSynth(),
      'pluck': new Tone.PluckSynth(),
      'fm': new Tone.FMSynth()
  };
  var octave_setting = 3;
  var release_trigger = "4n";
  var current_synth = synths.fm.toMaster();
  var octave_note_order = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  function setSynth(synth_name){
    current_synth = synths[synth_name].toMaster();
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
     var index_root_note = octave_note_order.indexOf(scale_list[0][0]);
     for(var i=0; i < len_list; i++){
        var index_cur_note = octave_note_order.indexOf(scale_list[i][0]);
        if(scale_list[0] === scale_list[i]  && i != 0){
          return_list.push(addOctave(scale_list[i], octave + 1));
        }else if(index_cur_note < index_root_note){
          return_list.push(addOctave(scale_list[i], octave + 1));
        }else{
          return_list.push(addOctave(scale_list[i], octave));
        }
     }
     return return_list;
  }

  function arpeggiateScale(scale_list){
    scale_list = addOctaves(scale_list, octave_setting);
    var scale_length = scale_list.length;
    var pattern = new Tone.Pattern(function(time, note){
      current_synth.triggerAttackRelease(note, release_trigger);
    }, scale_list);

    // var scale_duration = release_trigger * (scale_length + 1);
    var scale_duration = "2m";
    var stop_time = scale_duration.toString();

    pattern.start(0).stop(stop_time);
    Tone.Transport.scheduleOnce(function(time){
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
      'stop' : stopPlayer
  };
 
})();

module.exports = ScalePlayer;