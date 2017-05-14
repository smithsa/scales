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

module.exports = ScalePlayer;