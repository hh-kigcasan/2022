document.addEventListener("DOMContentLoaded", function() {
    let mediaRecorder;
    let recordedBlobs;

    const errorMsgElement = document.querySelector("span#errorMsg");
    const recordedVideo = document.querySelector("video#recorded");
    const recordButton = document.querySelector("button#record");
    const playButton = document.querySelector("button#play");
    const downloadButton =document.querySelector("button#download");

    document.querySelector("button#start").addEventListener("click", async function() {
        const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
        const constraints = {
            audio: {
                echoCancellation: {exact: hasEchoCancellation}
            },
            video: {
                width: 1280,
                height: 720
            }
        }

        await init(constraints);
    });

    async function init(constraints) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        }
        catch(errors) {
            console.log(errors);
        }
    }
    function handleSuccess(stream) {
        recordButton.disabled = false;
        window.stream = stream;

        const gumVideo = document.querySelector('video#gum');
        gumVideo.srcObject = stream;
    }

    recordButton.addEventListener('click', () => {
        if (recordButton.value === 'Record') {
            startRecording();
        } 
        else {
            stopRecording();
            recordButton.textContent = "";
            recordButton.value = 'Record';
            let img_element = document.createElement("img");
            img_element.src = "img/record.png";
            recordButton.appendChild(img_element);
            playButton.disabled = false;
            downloadButton.disabled = false;
        }
    });

    function startRecording() {
        recordedBlobs = [];
        let options = {mimeType: 'video/webm;codecs=vp9,opus'};
        try {
            mediaRecorder = new MediaRecorder(window.stream, options);
        } 
        catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }
        
        recordButton.textContent = 'Stop Recording';
        recordButton.value = "Stop Recording";
        playButton.disabled = true;
        downloadButton.disabled = true;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
    }

    
    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
        const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
    
    function stopRecording() {
        mediaRecorder.stop();
    }
});