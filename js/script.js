var voka = {};
// voka.avatar = "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";

var you = {};
// you.avatar = "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTivoka = hours + ':' + minutes + ' ' + ampm;
    return strTivoka;
}            


try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    console.log("recognition exists");
}
catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}

var deviceResponse = "";

recognition.onresult = function(event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if(!mobileRepeatBug) {
        deviceResponse += transcript;
    }
    
};

recognition.onstart = function() { 
    console.log('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
    if (deviceResponse != "") {
        insertChat("voka", deviceResponse); 
    } else {
        insertChat("voka", "I can't hear anything! Try moving closer and repeating the command."); 
    }
    
    deviceResponse = "";
    console.log("inserted chat");
    console.log('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
    if(event.error == 'no-speech') {
        console.log('No speech was detected. Try again.');  
    };
}


//-- No use time. It is a javaScript effect.
function insertChat(who, text, time = 0){
    console.log("Inserting chat");

    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == "voka"){
        
        control = '<li style="width:100%">' +
                        '<div class="msj macro">' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';                    
    } else{

        control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                  '</li>';
    }
    setTimeout(
        function(){
            if (who == "you") {
                utterance = new SpeechSynthesisUtterance(text)
                speechSynthesis.speak(utterance);
            }                        
            $("ul").append(control);
            $("ul").scrollTop($("ul")[0].scrollHeight);

            utterance.onend = function() {
                recognition.start();
            }

            console.log(deviceResponse);
            
        }, time);
    
}

function resetChat(){
    $("ul").empty();
}


$(".mytext").keydown(function(e){
    if (e.keyCode == 13){
        console.log("hi");
        var text = $(this).val();
        if (text !== ""){
            insertChat("you", text);              
            $(this).val('');
        }
        
    }
});

//-- Clear Chat
resetChat();

//-- Print Messages
// insertChat("voka", "Hello Tom...", 0);  
// insertChat("you", "Hi, Pablo", 1500);
// insertChat("voka", "What would you like to talk about today?", 3500);
// insertChat("you", "Tell voka a joke",7000);
// insertChat("voka", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
// insertChat("you", "LOL", 12000);


//-- NOTE: No use time on insertChat.