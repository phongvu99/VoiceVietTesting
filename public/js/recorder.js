let recorder;

const init = async () => {
    // const AudioContext = window.AudioContext || window.webkitAudioContext;
    // const audioCtx = new AudioContext();
    const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    const constraints = {
        audio: true,
        video: false
    };
    if (navigator.mediaDevices.getUserMedia) {
        try {
            console.log('testing');
            const stream = await getMedia(constraints);
            const sourceNode = new MediaStreamAudioSourceNode(audioCtx, {
                mediaStream: stream
            });
            recorder = new WebAudioRecorder(sourceNode, {
                workerDir: "js/lib/"
            });
            registerEvent(recorder);
            console.log('Audio recorder object', recorder);
            console.log('Successfully initialized Audio recorder!');
        } catch (err) {
            console.log(err);
        }
    }
};

const registerEvent = (recorder) => {
    recorder.onEncoderLoaded = (recorder, enconding) => {
        console.log('Encoding option', enconding);
    }
    recorder.onError = (recorder, msg) => {
        console.log(msg);
    }
    recorder.onComplete = (recorder, blob) => {
        console.log(blob);
        //cross browser
        window.URL = window.URL || window.webkitURL;
        const blobURL = window.URL.createObjectURL(blob);
        createAudioElement(blobURL);
    }
};

const createAudioElement = (blobUrl) => {
    const downloadEl = document.createElement('a');
    downloadEl.style = 'display: block';
    downloadEl.innerHTML = 'download';
    downloadEl.download = 'audio.webm';
    downloadEl.href = blobUrl;
    const audioEl = document.createElement('audio');
    audioEl.controls = true;
    const sourceEl = document.createElement('source');
    sourceEl.src = blobUrl;
    sourceEl.type = 'audio/webm';
    audioEl.appendChild(sourceEl);
    document.body.appendChild(audioEl);
    document.body.appendChild(downloadEl);
};

const record = () => {
    if (!recorder.isRecording()) {
        recorder.startRecording();
    }
    console.log('Recording');
};

const stopRecord = async () => {
    if (recorder.isRecording()) {
        recorder.finishRecording()
    }
};

const getMedia = async (constraints) => {
    let stream = null;

    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        return stream;
    } catch (err) {
        console.log(err);
    }
};