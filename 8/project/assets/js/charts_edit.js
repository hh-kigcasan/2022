$(document).ready(function(){

    if(charts.length == 0){
        let obj1 = new Charts("container").create_input();
    }else{
        charts = Organization.decodeHTML(charts);

        for(let index in charts.name){
            let data = {name:charts.name[index],
                        position:charts.position[index],
                        path:charts.path[index]
                        }

            let obj1 = new Charts("container",charts.level[index],charts.parentName,data);
            obj1.display_input(charts.top[index],charts.left[index],charts.path[index]);
        }
    }

    $(document).on("change","#myfile", function(){
            $("#container").submit();
    });

    $("#container").submit(function(){
        Organization.update_position();

        let form_data = new FormData($(this)[0]);

        $.ajax({
            url: $(this).attr("action"),
            type: 'POST',
            data: form_data,
            async: false,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
        });
        return false;
    });

    $("#save").click(function(){
        $("#container").submit();
    });
});