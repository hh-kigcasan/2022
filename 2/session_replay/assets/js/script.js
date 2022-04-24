// this function will show the data of the specific url/webpage
function showWebpageData()
{
    let webpageID = '#webpage_' + $(".webpage_select").val();
    let heatmapClass = 'heatmap_' + $(".webpage_select").val();

    $(".webpage_data").css("visibility", "visible");
    $(".webpage_data > h4").text("Webpage: " + $(webpageID).text());
    $(".webpage_data > h4+p").text("Total recordings: " + $(webpageID + '+td').text());
    $(".webpage_data > h4+p+p+p").text("Users average visiting time: " + $(webpageID + '+td+td').text());
    $(".webpage_data > .heatmap_btn").attr("heatmap_id", '').attr("heatmap_id", $(".webpage_select").val());
}

// invoke the client socket
const socket = io();

$(document).ready(function() {

    let iframe = document.querySelector('.display > iframe');
    let iframeDoc;

    // event listener when new live user session is available
    socket.on("update_replays_list", function(data) {

        let currentWebpageID = document.querySelector('.webpage_select').value;

        // append to the selected webpage the new user
        if (currentWebpageID && data.currentUsers && data.currentUsers[currentWebpageID] && !data.disconnect)
        {
            const elem = document.createElement("button");
            elem.id = 'new' + data.socketID;
            elem.className = "user_records";
            elem.style.backgroundColor = 'rgb(113, 196, 113)';
            elem.innerHTML = `New User ${data.socketID} <span></span><span>Live</span>`;

            // check if to append or prepend the data via order_by
            if (document.querySelector('.order_by').value == 1) 
            {
                document.querySelector('.video_list').appendChild(elem);
            }
            else
            {
                document.querySelector('.video_list').prepend(elem);
            }

            // update current users
            document.querySelector('.current_users').innerHTML = 'Current users: ' + data.currentUsers[currentWebpageID];
        }
        else if (currentWebpageID && data.disconnect && document.querySelector('#' + 'new' + data.socketID)) // if the admin has this id on page, remove that element
        {
            // remove the element
            document.querySelector('#' + 'new' + data.socketID).remove();

            // update current users
            document.querySelector('.current_users').innerHTML = 'Current users: ' + data.currentUsers[currentWebpageID];
        }
        else if (data.newUserID && document.querySelector('.webpage_select').value == data.webpageID)
        {
            // create the element
            const elem = document.createElement("button");
            elem.id = "user_" + data.newUserID;
            elem.className = "user_records";
            elem.innerHTML = `User ID#${data.newUserID} <span>${data.time}</span><span>${data.created_at}</span>`;

            // check if to append or prepend the data via order_by
            if (document.querySelector('.order_by').value == 1) 
            {
                document.querySelector('.video_list .existing_records').appendChild(elem);
            }
            else
            {
                document.querySelector('.video_list .existing_records').prepend(elem);
            }
        }
    });

    // event listener for new recording
    socket.on("initial_display", function(data) {

        // arrange/construct the html content of iframe
        let htmlBody = data.html.split('</head>')[1];
        let cursor = `<div id="cursor" style="position:absolute; visibility:hidden; z-index:999;">
                        <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  height="22px" width="12px" viewBox="8 3 13 23">  
                            <path d="M 9 3 A 1 1 0 0 0 8 4 L 8 21 A 1 1 0 0 0 9 22 A 1 1 0 0 0 9.796875 21.601562 L 12.919922 18.119141 L 16.382812 26.117188 C 16.701812 26.855187 17.566828 27.188469 18.298828 26.855469 C 19.020828 26.527469 19.340672 25.678078 19.013672 24.955078 L 15.439453 17.039062 L 21 17 A 1 1 0 0 0 22 16 A 1 1 0 0 0 	21.628906 15.222656 L 9.7832031 3.3789062 A 1 1 0 0 0 9 3 z"/>
                        </svg>
                    </div>`;
        let clickMarker = `<div id="clickMarker" 
                                style=" position:absolute; 
                                        visibility:hidden; 
                                        border:1px solid rgba(0, 0, 0, 0.3); 
                                        border-radius:50%; 
                                        background-color:rgba(0, 0, 255, 0.4);
                                        width:30px;
                                        height:30px;
                                        z-index:998;
                                        "></div>`;          

        htmlBody = htmlBody.split("</body>")[0] + cursor + "\n" + clickMarker + "\n</body>";
        let html = `<head>\n<style>\n${data.css}\n</style>\n</head>\n${htmlBody}`;
        
        // reset the width and height for every event.
        iframe.style.width = '100%'; // 100% is the width, the same as in the css
        iframe.style.height = "500px"; // 500px is the height, the same as in the css

        // set the width, height and zoom of the iframe based on the width and height of the source client
        iframe.style.transform = `scale(${data.zoom_iframe * data.zoom_client})`;
        iframe.style.width = iframe.offsetWidth / (data.zoom_iframe * data.zoom_client) + "px";
        iframe.style.height = iframe.offsetHeight / (data.zoom_iframe * data.zoom_client) + "px";

        // set the html content of the iframe
        iframe.srcdoc = html;
        // iframe.contentWindow.document.querySelector('head').innerHTML = `\n<style>\n${data.css}\n</style>`
    });

    // this is for live view
    socket.on("update_dom", function(data) {

        // set the document content to shorten codes
        iframeDoc = iframe.contentDocument.documentElement;

        // let lastEvent = data.events[data.events.length - 1];
        // iframeDoc.querySelectorAll(lastEvent.tagName)[lastEvent.nodeListIndex].value = lastEvent.value;
        if (data.event.type == 'mousemove') 
        {
            iframeDoc.querySelector('#cursor').style.visibility = 'visible';
        }
        else if (data.event.type = 'input')
        {
            iframeDoc.querySelectorAll(data.event.tagName)[data.event.nodeListIndex].value = data.event.value;
        }
        else if (data.event.type = 'click')
        {
            iframeDoc.querySelectorAll(data.event.tagName)[data.event.nodeListIndex].value = data.event.value;
        }
    });

    // add event listener to play/pause button
    let isPause = true;
    let playPauseElem = document.querySelectorAll(".play_pause");
    for (let i = 0; i < playPauseElem.length; i++)
    {
        // if the play/pause button is click, display the proper character
        playPauseElem[i].addEventListener("click", function() {
            playPauseElem[0].style.display = "block"
            playPauseElem[1].style.display = "block"
            this.style.display = "none";

            isPause = !isPause;
        });
    }

    // emit the request to display the content of the session recording
    document.addEventListener("click", function(e) {

        if (e.target.className == "user_records")
        {
            let id = e.target.id

            // add the socketID to the video player controllers.
            document.querySelector(".controls").setAttribute("player_id", id);

            if (id.split('new')[1])
            {
                id = id.split('new')[1];
            }

            // remove the intro from the video player
            document.querySelector(".intro").style.display = "none";

            // emit the click event to display the html content of the session recording
            socket.emit("user_records_clicked", {id: id});
        }
    });

    // This will emit a request to show the heatmap of the specific webpage when the heatmap_btn is clicked
    $(document).on("click", ".heatmap_btn", function() {

        socket.emit("show_heatmap", {heatmapID: $(this).attr("heatmap_id")});
    });

    // This socket listener will display the heatmap
    socket.on("display_heatmap", function(data) {

        // display the heatmap
        document.querySelector('.chart_section').style.display = "block";
        document.querySelector('.chart_section > h3').innerHTML = `Heatmap of users click events (${data.html.url})`;

        // create the heatmap of the webpage
        const opacity = 0.3;
        const svg = d3.select("#heatmap_svg_container")
            .append("svg")
            .attr("width", data.html.screen_width)
            .attr("height", data.html.screen_height)
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0)
            .append("g")
        
        // set the y-axis scale
        const y = d3.scaleLinear()
            .domain([0, data.html.screen_height])
            .range([ 0, data.html.screen_height]);
  
        // set the x-axis scale
        const x = d3.scaleLinear()
            .domain([0, data.html.screen_width])
            .range([ 0, data.html.screen_width]);

        // set the contour
        const densityData = d3.contourDensity()
            .y(function(d) { return y(d.y); })
            .x(function(d) { return x(d.x); })(data.clickEventsLocation)

        // set the range of colors
        let range = [];
        let dataLastIndex = densityData.length - 1;

        for (let i = 0; i < densityData.length; i++)
        {
            range.push(`hsl(${(1 - (i / dataLastIndex)) * 240}, 100%, 50%)`);
        }

        // set the scale of colors
        const colors = d3.scaleLinear()
            .domain(d3.ticks(0, dataLastIndex, dataLastIndex))
            .range(range);

        // display the graph
        svg.selectAll("path")
            .data(densityData)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("fill", function(d, i) { return colors(i); })
            .style('opacity', opacity);

        // arrange/construct the html content of iframe
        let htmlBody;
        let html;
        let iframeHeatmap = document.querySelector('.heatmap > iframe');
        let heatmapSVG = document.querySelector('#heatmap_svg_container').innerHTML;

        htmlBody = data.html.html.split('</head>')[1];
        htmlBody = htmlBody.split("</body>")[0] + '<div class="iframe_heatmap">\n' + heatmapSVG + '\n</div>' + "\n</body>";
        html = `<head>\n<style>\n${data.html.css}\n</style>\n</head>\n${htmlBody}`;
        
        // reset the width and height for every event.
        iframeHeatmap.style.width = '100%'; // 100% is the width, the same as in the css
        iframeHeatmap.style.height = "500px"; // 600px is the height, the same as in the css

        // set the width, height and zoom of the iframe based on the width and height of the source client
        iframeHeatmap.style.transform = `scale(${data.html.zoom_iframe * data.html.zoom_client})`;
        iframeHeatmap.style.width = iframeHeatmap.offsetWidth / (data.html.zoom_iframe * data.html.zoom_client) + "px";
        iframeHeatmap.style.height = iframeHeatmap.offsetHeight / (data.html.zoom_iframe * data.html.zoom_client) + "px";

        // set the html content of the iframe
        iframeHeatmap.srcdoc = html;

        // remove the html content of heatmap_svg_container
        document.querySelector('#heatmap_svg_container').innerHTML = '';
        document.querySelector('.heatmap_legend').innerHTML = "";

        // create scale of colors or legend of colors for the heatmap
        const svgColorScale = d3.select(".heatmap_legend")
            .append("svg")
            .attr("width", 650)
            .attr("height", 80)
            .style('margin', '20px')
            .append("g")
            .attr("transform", "translate(" + 20 + ", " + 0 + ")");

        // set the scale
        const colorScale = d3.scaleLinear()
            .domain(d3.ticks(0, 200, 5))
            .range(["blue", "cyan", "green", "yellow", "red"]);
  
        // set the scale legend
        const xColor = d3.scaleLinear()
            .domain([0, 1])
            .range([ 0, 200 * 3]);

        // set the x-axis
        const axis = d3.axisBottom(xColor);
        axis.ticks(1).tickFormat(function(d, i) {

            if(i) 
            {
                return "Most Clicks";
            }
            return "No Click"
        });

        svgColorScale.append("g")
            .attr("transform", "translate(" + 0 + ", " + 40 + ")")
            .call(axis);

        // set the graph
        svgColorScale.selectAll("rects")
            .data(d3.range(200))
            .enter()
            .append("rect")
            .attr("y", 0)
            .attr("x", function(d,i) { return i * 3; })
            .attr("width", 3)
            .attr("height", 30)
            .attr("fill", function(d) { return colorScale(d); })
            .style("opacity", opacity + 0.3);
    });

    // This will emit to play the video/DOM events when the play button is clicked
    document.querySelector('.play_btn').addEventListener("click", function(e) {

        // let startTime = Date.now();

        // setInterval(function() {
            // socket.emit("play", {time: Date.now() - startTime});
        // }, 20);

        let id = e.target.parentNode.getAttribute("player_id");
        if (!id)
        {
            document.querySelector(".pause_btn").style.display = "none";
            document.querySelector(".play_btn").style.display = "block";
            return;
        }

        if (id.split('new')[1])
        {
            id = id.split('new')[1];
        }

        socket.emit("play", {id: id});
    });

    // This will change the DOM based on the stored events
    socket.on("playing", function(data) {
        
        iframeDoc = iframe.contentDocument.documentElement;

        if (data.type == 'mousemove') 
        {
            iframeDoc.querySelector('#cursor').style.visibility = 'visible';
            iframeDoc.querySelector('#cursor').style.top = data.y + "px";
            iframeDoc.querySelector('#cursor').style.left = data.x + "px";
        }
        else if (data.type == 'click') 
        {   
            console.log(data);
            iframeDoc.querySelector('#clickMarker').style.visibility = 'visible';
            iframeDoc.querySelector('#clickMarker').style.top = data.y - 15 + "px"; // 15px is to center the circle
            iframeDoc.querySelector('#clickMarker').style.left = data.x - 15 + "px";  // 15px is to center the circle
            setTimeout(function() {
                iframeDoc.querySelector('#clickMarker').style.visibility = 'hidden';
            }, 150);
        }
        else if (data.type = 'input')
        {
            console.log(data);
            iframeDoc.querySelectorAll(data.tagName)[data.nodeListIndex].value = data.value;
        }
    });

    // This will change the control button to play icon again when the video is done playing
    socket.on('play_done', function() {

        document.querySelector('.pause_btn').style.display = 'none'
        document.querySelector('.play_btn').style.display = 'block'
    });
    
    // This will get the video list for the specific webpage through AJAX
    $(document).on("change", "select", function() {

        document.querySelector(".start_intro").style.display = "none";
        $.post($(this).parent().attr('action'), $(this).parent().serialize(), function(resData) {

            $('.video_list').html(resData);
            showWebpageData();
        });
    });
});

