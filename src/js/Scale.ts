export default class Scale {
  musical_notes: Array<string>;
  scale_formula:  { [key: string]: Array<number> }
  constructor() {
    this.musical_notes = [ 'A', 'Bb', 'B', 'C', 'C#','D','Eb','E','F','F#','G','G#'];
    this.scale_formula = {
      'major': [1, 1, .5, 1, 1, 1, .5],
      'minor': [1, .5, 1, 1, .5, 1, 1],
      'dorian': [1, .5, 1, 1, 1, .5, 1],
      'mixolydian': [1, 1, .5, 1, 1, .5, 1],
      'major pentatonic': [1, 1, 1.5, 1, 1.5],
      'minor pentatonic': [1.5, 1, 1, 1.5, 1],
      'blues': [1.5, 1, .5, .5, 1.5, 1]
    }
  }

  returnScaleFormula(scale_name : string) : Array<number>{
    return this.scale_formula[scale_name];
  }

  returnRelativeNote(note: string, step : number){
    let steps_index = this.musical_notes.indexOf(note);
    let musical_notes_index = steps_index + step;
    let musical_notes_size = this.musical_notes.length - 1;

    if(musical_notes_index > musical_notes_size){
      musical_notes_index = ((musical_notes_index - musical_notes_size) - 1);
    }

    return this.musical_notes[musical_notes_index];
  }

  generateScale(key: string, scale_forumla: Array<number>, index: number, scale_list: Array<string>){
    let scale_forumla_length = scale_forumla.length;
    if(scale_list.length === scale_forumla_length){
      return scale_list;
    }
    let cur_step = (scale_forumla[index] / .5);
    let note = this.returnRelativeNote(key, cur_step);
    scale_list.push(note);
    key = note;
    this.generateScale(key, scale_forumla, index + 1, scale_list);
  }

  returnScale(key: string, scale_forumla: Array<number>){
    let scale_list : Array<string> = [];
    this.generateScale(key, scale_forumla, 0, scale_list);
    scale_list.unshift(key);
    return scale_list;
  }

  getScale(key: string, scale_name: string){
    var formula = this.returnScaleFormula(scale_name);
    var scale_notes = this.returnScale(key, formula);
    return scale_notes;
  }
};
