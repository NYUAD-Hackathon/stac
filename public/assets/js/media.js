
// This adjusts audio links depending on category and language.
function adjust_audio(category) {
	var active_text = $(".active").text().trim().toLowerCase();
	console.log(active_text);
 
	var audio_elem = document.getElementById("myAudio");
	if(category=="b1"){
      audio_elem.src=active_text+"/Visa.mp3";
	} else if(category=="b2"){
      audio_elem.src=active_text+"/Salary.mp3";
	} else if(category=="b3"){
		audio_elem.src=active_text+"/WorkingConditions.mp3";
	} else if(category=="b4"){
		audio_elem.src=active_text+"/LosingYourJob.mp3";
	} else if(category=="b5"){
		audio_elem.src=active_text+"/GoingHome.mp3";
	} else if(category=="b6"){
		audio_elem.src=active_text+ "/RightsUnderLaw.mp3";
	} else if(category=="b7"){
		audio_elem.src=active_text+"/Domestic.mp3";
	} else if(category=="b8"){
		audio_elem.src=active_text+"/Contact.mp3";
	}
}


function aud_play_pause(category) {
  adjust_audio(category);

  var myAudio = $("#myAudio");
  console.log(myAudio);
  console.log(myAudio.attr("_paused"));
  var audio_elem = document.getElementById("myAudio");
  if (typeof myAudio.attr("_paused") == "undefined" || myAudio.attr("_paused") == "true" ) {
	console.log("yo");
    audio_elem.play();	
	myAudio.attr("_paused","false");
	console.log("changed it to " + myAudio.attr("_paused"));
  } else {
	console.log("hi there");
    audio_elem.pause();
	myAudio.attr("_paused","true");
    console.log("changed it to " + myAudio.attr("_paused"));

  }  
}

// It adds a click event to all li elements.
function dowhatever() {
  var active_text = $(".active").text().trim();
  console.log(active_text);

}
function BindClickEvent() {
	var selector = '.nav li';
    console.log("adding onclick to this");
    console.log($(selector));
    $(selector).on('click', function(){
	    console.log("adding onclick to this");
        $(selector).removeClass('active');
        $(this).addClass('active');
});};

// This runs when the document starts
 $( document ).ready(function() {
    BindClickEvent();
	console.log("document function ran");
 });
 
