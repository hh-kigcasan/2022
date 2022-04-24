class Commands{

    static anaylyze(transcript){

        let words = transcript.split(" ");
        let search = "";

        switch(words[0]){

            case "change":
                console.log("you are changing the background")
            break;
            case "login":
                $("form").submit();
            break;

            case "background":
           
            for(let i = 1; i< words.length; i++){
                search += words[i] + " ";
            }

            $.get("https://www.googleapis.com/customsearch/v1/siterestrict?key=AIzaSyABkMZYygVSCUcxo5nnvu0Mkd1O-iuqArU&cx=bd88b222668a53ae7&q="+search+"&searchType=image",function(result){

                if(result.items[0].link.length > 0){
                    $("body").css("background-image", "url(\""+result.items[0].link+"\")");
                }
                $.post("/users/system",{ background: result.items[0].link});
                return false;

            });

            break;

            case "color":

                for(let i = 1; i< words.length; i++){
                    search += words[i] + " ";
                }
                $("body").css("color", search);

                $.post("/users/system",{color:search},function(result){
                    return false;
                });
              
            break;

            case "rollback":
                $.post("/users/system",{background:undefined,color:undefined});
                $("body").css("background-image", "url(\"assets/images/bg3.jpg\")");
                $("body").css("color", "black");
            break;

            default:
                console.log("try saying action words like change,search")
        }
    }
}