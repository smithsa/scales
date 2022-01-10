import * as Tone from 'tone';

// TODO remove the get methods and use class getters
export default class ScalePlayer {
  synths : { [key: string]: any };
  octave_setting: number;
  current_synth: any; // TODO get type from the Tone.Synth
  octave_note_order: Array<string>;
  scale_duration: number;
  cur_temp: number;
  constructor() {
    this.synths = {
      'default': new Tone.Synth(),
      'mono': new Tone.MonoSynth(),
      'pluck': new Tone.PluckSynth(),
      'fm': new Tone.FMSynth()
    };
    this.octave_setting = 2;
    this.current_synth = this.synths.fm.toMaster();
    this.octave_note_order = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    this.scale_duration = 0;
    this.cur_temp = 120;
  }

  setSynth(synth_name: string){
    this.current_synth = this.synths[synth_name].toMaster();
  }

  getSynth(){
    return this.current_synth;
  }

  getScaleDuration(){
    return this.scale_duration;
  }

  addOctave(note: string, octave: number){
    let octaveAsString = octave.toString();
    return note+octaveAsString;
  }

  addOctaves(scale_list: Array<string>, octave: number){
    let return_list = [];
    let len_list = scale_list.length;
    let index_root_note = this.octave_note_order.indexOf(scale_list[0][0]);
    for(let i=0; i < len_list; i++){
      let index_cur_note = this.octave_note_order.indexOf(scale_list[i][0]);
      if(scale_list[0] === scale_list[i]  && i !== 0){
        return_list.push(this.addOctave(scale_list[i], octave + 1));
        octave += 1;
      }else if(index_cur_note < index_root_note){
        return_list.push(this.addOctave(scale_list[i], octave + 1));
      }else{
        return_list.push(this.addOctave(scale_list[i], octave));
      }
    }

    return return_list;
  }

  arpeggiateScale(scale_list: Array<string>, is_two_octave = false) {
    is_two_octave = is_two_octave || false;
    if(is_two_octave === true){
      let octave_one = scale_list;
      let octave_two = scale_list.slice();
      octave_two.shift();
      scale_list = octave_one.concat(octave_two);
    }

    scale_list = this.addOctaves(scale_list, this.octave_setting);


    let release_trigger = 60/this.cur_temp;
    let scale_length = scale_list.length;
    let pattern = new Tone.Pattern(function(time, note){
      this.current_synth.triggerAttackRelease(note, release_trigger);
    }, scale_list);

    this.scale_duration = release_trigger * (scale_length);
    let stop_time = this.scale_duration;

    pattern.iterations = scale_length;
    pattern.start(.5);
    Tone.Transport.start();
    Tone.Transport.scheduleOnce(function(time){
      Tone.Transport.stop();
    }, stop_time);
  }

  stopPlayer() {
    Tone.Transport.stop();
  }

  changeTempo(tempo: string){
    this.cur_temp = parseInt(tempo);
    Tone.Transport.bpm.rampTo(parseInt(tempo));
  }
}
