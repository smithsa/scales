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