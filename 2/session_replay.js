// This function will create a socket connection to the host to and emit the events
function sessionReplay(host = 'http://localhost:7999')
{
    // get the url 
    let url = window.location.href;
    if (url[url.length - 1] != '/') 
    {
        url = url + '/';
    }
    
    // create the socket connection
    const socketReplay = io(host, {query: {"url": url}});

    let events = [];
    let cssRules = document.styleSheets[0].cssRules;
    let css = [];

    // get all css styling
    for (let i = 0; i < cssRules.length; i++) {
        css.push(cssRules[i].cssText);
    }
    
    // set all the client data to be emit
    let html = document.documentElement.innerHTML;
    let initial_data = {
        url: url,
        html: html,
        css: css,
        // screen_width: screen.availWidth,
        // screen_height: screen.availHeight,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        zoom_client: window.devicePixelRatio,
        date: new Date().toISOString()
    };

    // future features, image & scroll
    // let blob = await fetch(url).then(r => r.blob());
    // if(container.scrollTop + container.clientHeight >= container.scrollHeight && totalPage > currentPageNum)

    // emit the initial content of the client's browser html content
    socketReplay.emit('data_to_replay', initial_data);

    // emit all input/keyboard stroke events
    document.addEventListener('input', function(e) {

        let nodeList = document.querySelectorAll(e.target.tagName.toLowerCase());
        let index = 0;
        for (; nodeList[index] != e.target; index++) {}

        let event = {
            type: e.type,
            tagName: e.target.tagName.toLowerCase(),
            nodeListIndex: index,
            value: e.target.value,
            time: Math.floor(e.timeStamp)
        }

        events.push(event);
        socketReplay.emit('events_data', {event: event});
    });

    // emit mousemove events
    document.addEventListener('mousemove', function(e) {
        
        // only store the event if the difference between previous event is greater than or equal to 50 milliseconds
        if (events.length > 0 && (e.timeStamp - events[events.length - 1].time) < 50)
        {
            return;
        }
        
        let event = {
            type: e.type,
            x: e.clientX,
            y: e.clientY,
            time: Math.floor(e.timeStamp)
        }

        events.push(event);
        socketReplay.emit('events_data', {event: event});
    });

    // emit all click events
    document.addEventListener('click', function(e) {
        
        let nodeList = document.querySelectorAll(e.target.tagName.toLowerCase());
        let index = 0;
        for (; nodeList[index] != e.target; index++) {}

        let event = {
            type: e.type,
            tagName: e.target.tagName.toLowerCase(),
            nodeListIndex: index,
            x: e.clientX,
            y: e.clientY,
            time: Math.floor(e.timeStamp)
        }

        events.push(event);
        socketReplay.emit('events_data', {event: event});
    });
}