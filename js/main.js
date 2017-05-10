/*     
      *******                    **             
    *       ***                   **            
   *         **                   **            
   **        *                    **            
    ***                           **            
   ** ***           ****      *** **      ***   
    *** ***        * ***  *  *********   * ***  
      *** ***     *   ****  **   ****   *   *** 
        *** ***  **    **   **    **   **    ***
          ** *** **    **   **    **   ******** 
           ** ** **    **   **    **   *******  
            * *  **    **   **    **   **       
  ***        *   **    **   **    **   ****    *
 *  *********     ***** **   *****      ******* 
*     *****        ***   **   ***        *****  
*                                               
 ***/                   
var scales = null, key_type = null, seconds = null, keys =  ["A", "B", "C", "D", "E", "F", "G"], time_out = null, start_string = null;

$( document ).ready(function() {
  $("#start").click(function(){      
      seconds = get_time();
      key_type = get_keys();
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
function get_keys(){
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
  key_type = get_keys();
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
            changeScale();
            setTimeout(countdown( elementName, minutes, seconds ), 2000);
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
function changeScale(){
    var random_key_type = key_type[randomIntFromInterval(0, key_type.length-1)];
    var random_key = keys[randomIntFromInterval(0, keys.length-1)];
    var random_scale = scales[randomIntFromInterval(0, scales.length-1)];
    var start_string = randomIntFromInterval(1,6);

    if(random_key_type === "flats"){
      random_key = random_key + " Flat"
    }
    else if(random_key_type === "naturals"){
      random_key = random_key;
    }
    else if(random_key_type === "sharps"){
      random_key = random_key + "#"
    }
    $("#key").text(random_key);
    $("#scale").text(random_scale);
}



