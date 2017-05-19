var ScalePlayer = require('./ScalePlayer');
var Scale = require('./Scale');

var ScaleBlitz = (function () {
    var scales = null, 
        key_accidental = null, 
        seconds = null, 
        time_out = null, 
        player_timeout = null,
        start_string = null, 
        current_key = null, 
        current_scale = null,
        keys =  ["A", "B", "C", "D", "E", "F", "G"];
    function init(){
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
                ScalePlayer.arpeggiate(scale_list);
                var scale_duration = 4500;
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