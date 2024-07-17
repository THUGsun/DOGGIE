// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    const recordButton = document.getElementById('recordButton');
    const actionButtons = document.getElementById('actionButtons');
    const resultButtons = document.getElementById('resultButtons');
    const title = document.getElementById('title');

    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;
    let audioUrl;
    let audio;
    let isRecording = false;
    let hasPermission = false;

    recordButton.addEventListener('mousedown', handleRecording);
    recordButton.addEventListener('mouseup', stopRecording);
    document.getElementById('reRecordButton').addEventListener('click', reRecord);
    document.getElementById('playButton').addEventListener('click', playRecording);
    document.getElementById('submitButton').addEventListener('click', submitRecording);
    document.getElementById('resultPlayButton').addEventListener('click', playResult);
    document.getElementById('downloadButton').addEventListener('click', downloadResult);

    async function handleRecording() {
        if (!hasPermission) {
            await requestPermission();
            hasPermission = true;
        } else {
            startRecording();
        }
    }

    async function requestPermission() {
        if (!navigator.mediaDevices) {
            alert('浏览器不支持录音功能');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
        } catch (err) {
            console.error('获取录音权限失败: ', err);
        }
    }

    function startRecording() {
        title.classList.add('recording');
        title.innerText = '正在录制...';
        audioChunks = [];

        if (mediaRecorder) {
            mediaRecorder.start();
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            isRecording = true;
        }
    }

    function stopRecording() {
        if (isRecording) {
            title.classList.remove('recording');
            title.innerText = '录音转换为狗语';

            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    audioUrl = URL.createObjectURL(audioBlob);
                    audio = new Audio(audioUrl);
                };
            }

            recordButton.classList.add('hidden');
            actionButtons.classList.remove('hidden');
            isRecording = false;
        }
    }

    function reRecord() {
        actionButtons.classList.add('hidden');
        recordButton.classList.remove('hidden');
    }

    function playRecording() {
        if (audio) {
            audio.play();
        }
    }

    function submitRecording() {
        actionButtons.classList.add('hidden');
        resultButtons.classList.remove('hidden');

        // 在此处添加提交录音的逻辑（并调用算法）
    }

    function playResult() {
        // 在此处添加播放转换结果的逻辑
    }

    function downloadResult() {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = audioUrl;
        a.download = 'recording.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
