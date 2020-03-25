let recorder, _blob;

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
            const stream = await getMedia(constraints);
            const sourceNode = new MediaStreamAudioSourceNode(audioCtx, {
                mediaStream: stream
            });
            recorder = new WebAudioRecorder(sourceNode, {
                workerDir: "/js/lib/"
            });
            recorder.setEncoding('mp3');
            registerEvent(recorder);
            console.log('Audio recorder object', recorder);
            console.log('Successfully initialized Audio recorder!');
            alert('Successfully initialized Audio recorder!');
        } catch (err) {
            console.log(err);
            alert(`Error: ${err.message}. Please check console for detailed logs!`);
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
        _blob = blob;
        //cross browser
        window.URL = window.URL || window.webkitURL;
        const blobURL = window.URL.createObjectURL(blob);
        createAudioElement(blobURL);
    }
};

const createAudioElement = (blobUrl) => {
    const sourceTest = '/temp-20200323144727306.mp3'
    const downloadEl = document.createElement('a');
    downloadEl.style = 'display: block';
    downloadEl.innerHTML = 'Download';
    downloadEl.download = `recording-${new Date().toISOString().replace(/[-T:\.Z]/g, "")}.mp3`;
    downloadEl.href = blobUrl;
    const audioEl = document.createElement('audio');
    audioEl.className = 'recording';
    audioEl.controls = true;
    const sourceEl = document.createElement('source');
    sourceEl.src = blobUrl;
    sourceEl.type = 'audio/mpeg';
    audioEl.appendChild(sourceEl);
    document.body.appendChild(audioEl);
    document.body.appendChild(downloadEl);
};

const uploadFile = async () => {
    if (!recorder.isRecording()) {
        console.log('Blob', _blob);
        const fileName = `recording-${new Date().toISOString().replace(/[-T:\.Z]/g, "")}.mp3`;
        const file = new File([_blob], fileName, {
            lastModified: Date.now(),
            type: 'audio/mpeg'
        });
        console.log(file);
        const formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('fileData', file);
        formData.append('quoteID', '5e78e47fafff581d80d23e87');
        try {
            const res = await fetch('http://localhost:8080/recorder', {
                method: 'POST',
                body: formData
            });
            const resData = await res.json();
            if (res.status === 201) {
                alert('Uploaded succeed!');
            }
            console.log(resData);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

const checkInit = recorder => {
    if (recorder === undefined) {
        return false;
    }
    return true;
}

const record = () => {
    if (!checkInit(recorder)) {
        return alert('Audio recorder is uninitialized!');
    }
    if (!recorder.isRecording()) {
        alert('Recording...');
        recorder.startRecording();
        console.log('Recording');
    }
};

const stopRecord = () => {
    if (!checkInit(recorder)) {
        return alert('Audio recorder is uninitialized!');
    }
    if (recorder.isRecording()) {
        recorder.finishRecording();
        alert('Recording exported!');
    }
};

const cancelRecord = () => {
    if (!checkInit(recorder)) {
        return alert('Audio recorder is uninitialized!');
    }
    if (recorder.isRecording()) {
        recorder.cancelRecording();
        alert('Recording cancelled!');
    }
}

const getMedia = async (constraints) => {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        return stream;
    } catch (err) {
        console.log(err);
    }
};