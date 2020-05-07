const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models')

]).then(startVideo)
function startVideo(){
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        error => console.error(error)
    )
}

video.addEventListener('play', () =>{
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {  width: video.width, height: video.height }
    faceapi.matchDimensions(canvas,displaySize)
   setInterval(async () =>{
       const detections = await  faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withAgeAndGender().withFaceExpressions().withFaceExpressions()
       const resizedDetections = faceapi.resizeResults(detections,displaySize)
       //makes sure the box gets deleted every time a new one spawns
       canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
       faceapi.draw.drawFaceExpressions(canvas,resizedDetections)

       //draws the age and gender of the user
       resizedDetections.forEach( detection => {
           const box = detection.detection.box
           const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
           drawBox.draw(canvas)
       })
   },100)
})