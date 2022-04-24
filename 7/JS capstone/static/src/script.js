var kick = new Audio('https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Big-Rack-Tom.mp3');
var crash = new Audio('https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Crash.mp3');
var lowTom = new Audio('https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Floor-Tom.mp3');
var midTom = new Audio('sounds/mid.wav');
var highTom = new Audio('https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Small-Rack-Tom.mp3');
var snare = new Audio('https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Snare.mp3');
var hiHat = new Audio('sounds/hi-hat.mp3');
var C = new Audio("notes/C.mp3");
var Db = new Audio("notes/Db.mp3");
var Dee = new Audio("notes/D.mp3");
var Eb = new Audio("notes/Eb.mp3");
var E = new Audio("notes/E.mp3");
var F = new Audio("notes/F.mp3");
var Gb = new Audio("notes/Gb.mp3");
var G = new Audio("notes/G.mp3");
var Ab = new Audio("notes/Ab.mp3");
var Aa = new Audio("notes/A.mp3");
var Bb = new Audio("notes/Bb.mp3");
var B = new Audio("notes/B.mp3");

const W = 87; //KICK;
const A = 65; //HI TOM;
const D = 68; // MID TOM;
const Shift = 16; //SNARE;
const Sp = 32; //low tom
const left = 97; //hi-hat
const right = 98; //crash
const FF = 70; //c
const T = 84; //Db
const GG = 71; //D
const Y = 89; //Eb
const H = 72; //E
const J = 74; //F
const I = 73; //Gb
const K = 75; //G
const O = 79; //Ab
const L = 76; //A
const P = 80; //Bb
const semi = 186; //B

var socket = io();


function playawit(record)
{
    var i = 0;                  //  set your counter to 1

        function myLoop()
         {                              
            setTimeout(function() 
            { 
               
                switch(record[i])
                {
                    case W: {  kick.play(); }
                    break;
    
                    case A: { highTom.pause(); highTom.currentTime = 0; highTom.play();}
                    break;
    
                    case D:{ midTom.pause(); midTom.currentTime = 0; midTom.play();}
                    break;
    
                    case Shift: { snare.pause(); snare.currentTime = 0; snare.play();}
                    break;
    
                    case Sp: { lowTom.pause(); lowTom.currentTime = 0; lowTom.play();}
                    break;
    
                    case left: { hiHat.pause(); hiHat.currentTime = 0; hiHat.play();}
                    break;
                
                    case right: { crash.pause(); crash.currentTime = 0; crash.play();}
                    break;
            /////////////////////////////////////////////////////////////////////////////////
                    case FF: { C.pause(); C.currentTime = 0; C.play(); $("#C").addClass('active'); setTimeout(function () {$("#C").removeClass('active');}, 500);}
                    break;
    
                    case T: { Db.pause(); Db.currentTime = 0; Db.play();$("#Db").addClass('active'); setTimeout(function () {$("#Db").removeClass('active');}, 500);}
                    break;
                
                    case GG: { Dee.pause(); Dee.currentTime = 0; Dee.play(); $("#D").addClass('active'); setTimeout(function () {$("#D").removeClass('active');}, 500);}
                    break;
                
                    case Y: { Eb.pause(); Eb.currentTime = 0; Eb.play(); $("#Eb").addClass('active'); setTimeout(function () {$("#Eb").removeClass('active');}, 500);}
                    break;
    
                    case H: { E.pause(); E.currentTime = 0; E.play(); $("#E").addClass('active'); setTimeout(function () {$("#E").removeClass('active');}, 500);}
                    break;
    
                    case J: { F.pause(); F.currentTime = 0; F.play(); $("#F").addClass('active'); setTimeout(function () {$("#F").removeClass('active');}, 500);}
                    break;
    
                    case I: { Gb.pause(); Gb.currentTime = 0; Gb.play(); $("#Gb").addClass('active'); setTimeout(function () {$("#Gb").removeClass('active');}, 500);}
                    break;
                
                    case K:  { G.pause(); G.currentTime = 0; G.play(); $("#G").addClass('active'); setTimeout(function () {$("#G").removeClass('active');}, 500);}
                    break;
                
                    case O:  { Ab.pause(); Ab.currentTime = 0; Ab.play(); $("#Ab").addClass('active'); setTimeout(function () {$("#Ab").removeClass('active');}, 500);}
                    break;
    
                    case L: { Aa.pause(); Aa.currentTime = 0; Aa.play(); $("#A").addClass('active'); setTimeout(function () {$("#A").removeClass('active');}, 500);}
                    break;
                
                    case P: { Bb.pause(); Bb.currentTime = 0; Bb.play(); $("#Bb").addClass('active'); setTimeout(function () {$("#Bb").removeClass('active');}, 500);}
                    break;
    
                    case semi: { B.pause(); B.currentTime = 0; B.play(); $("#B").addClass('active'); setTimeout(function () {$("#B").removeClass('active');}, 500);}
                    break;
                    
                }
                i++; 
                if (i < record.length) 
                {myLoop();} 

            }, 500);
        }

    myLoop();  
}



$( document ).ready(function() {
$(document).keydown(function (event)
{
    socket.emit("press", event.which);

    socket.on("update", (key) =>
    {
            console.log(key);
            switch(key)
            {
                case W: { kick.pause(); kick.currentTime = 0; kick.play(); $("#foot").css({"left":"48%", "top":"83%", "display" : "block"}); $("#foot").addClass("hand"); console.log("W");}
                break;

                case A: { highTom.pause(); highTom.currentTime = 0; highTom.play(); $("#hand").css({"left":"45%", "top":"74%", "display" : "block"}); $("#hand").addClass("hand");}
                break;

                case D:{ midTom.pause(); midTom.currentTime = 0; midTom.play(); $("#hand").css({"left":"52%", "top":"73%", "display" : "block"}); $("#hand").addClass("hand");}
                break;

                case Shift: { snare.pause(); snare.currentTime = 0; snare.play(); $("#hand").css({"left":"40%", "top":"86%", "display" : "block"}); $("#hand").addClass("hand");}
                break;

                case Sp: { lowTom.pause(); lowTom.currentTime = 0; lowTom.play(); $("#hand").css({"left":"57%", "top":"83%", "display" : "block"}); $("#hand").addClass("hand");}
                break;

                case left: { hiHat.pause(); hiHat.currentTime = 0; hiHat.play(); $("#right").css({"left":"31%", "top":"90%", "display" : "block"}); $("#hand").addClass("hand");}
                break;
            
                case right: { crash.pause(); crash.currentTime = 0; crash.play(); $("#right").css({"left":"65%", "top":"78%", "display" : "block"}); $("#hand").addClass("hand");}
                break;
        /////////////////////////////////////////////////////////////////////////////////w
                case FF: { C.pause(); C.currentTime = 0; C.play(); $("#C").addClass('active'); setTimeout(function () {$("#C").removeClass('active');}, 500);}
                break;

                case T: { Db.pause(); Db.currentTime = 0; Db.play();$("#Db").addClass('active'); setTimeout(function () {$("#Db").removeClass('active');}, 500);}
                break;
            
                case GG: { Dee.pause(); Dee.currentTime = 0; Dee.play(); $("#D").addClass('active'); setTimeout(function () {$("#D").removeClass('active');}, 500);}
                break;
            
                case Y: { Eb.pause(); Eb.currentTime = 0; Eb.play(); $("#Eb").addClass('active'); setTimeout(function () {$("#Eb").removeClass('active');}, 500);}
                break;

                case H: { E.pause(); E.currentTime = 0; E.play(); $("#E").addClass('active'); setTimeout(function () {$("#E").removeClass('active');}, 500);}
                break;

                case J: { F.pause(); F.currentTime = 0; F.play(); $("#F").addClass('active'); setTimeout(function () {$("#F").removeClass('active');}, 500);}
                break;

                case I: { Gb.pause(); Gb.currentTime = 0; Gb.play(); $("#Gb").addClass('active'); setTimeout(function () {$("#Gb").removeClass('active');}, 500);}
                break;
            
                case K:  { G.pause(); G.currentTime = 0; G.play(); $("#G").addClass('active'); setTimeout(function () {$("#G").removeClass('active');}, 500);}
                break;
            
                case O:  { Ab.pause(); Ab.currentTime = 0; Ab.play(); $("#Ab").addClass('active'); setTimeout(function () {$("#Ab").removeClass('active');}, 500);}
                break;

                case L: { Aa.pause(); Aa.currentTime = 0; Aa.play(); $("#A").addClass('active'); setTimeout(function () {$("#A").removeClass('active');}, 500);}
                break;
            
                case P: { Bb.pause(); Bb.currentTime = 0; Bb.play(); $("#Bb").addClass('active'); setTimeout(function () {$("#Bb").removeClass('active');}, 500);}
                break;

                case semi: { B.pause(); B.currentTime = 0; B.play(); $("#B").addClass('active'); setTimeout(function () {$("#B").removeClass('active');}, 500);}
                break;
                
            }
    });
});

$(document).bind("keyup", function(event)
 {
    
    setTimeout(function(){$('#hand').css("display", "none")}, 500);
    setTimeout(function(){$('#right').css("display", "none")}, 500);
    setTimeout(function(){$('#foot').css("display", "none")}, 500);
    $('#hand').removeClass('hand');
    $('#right').removeClass('hand');
    $('#foot').removeClass('hand');
 });

$("#record").click(function()
{
    socket.emit("record"); 
    console.log('recording');
});

$("#play").click(function()
{
    socket.emit("play"); 
    console.log('play!');
    socket.on("proceed", (record) =>
    {
        console.log(record);
        playawit(record);
    });

});
$("#refresh").click(function()
{
    socket.emit("refresh"); 
    console.log('refresh!');
  

});


}); //document.ready



