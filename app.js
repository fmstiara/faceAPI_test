const HOST = 'https://japaneast.api.cognitive.microsoft.com/face/v1.0/'
const PERSON_GROUP_ID = 'test-members'
const API_KEY = ''

window.onload = ()=>{
  const video = document.getElementById('video');
  const constraints = {
      audio: false,
      video: {
          // スマホのバックカメラを使用
          facingMode: 'environment'
      }
  };
  //  カメラの映像を取得
  navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
          video.srcObject = stream;
          const button = document.getElementById('take-button')
          button.onclick = function(){
            getImageFromVideo(video)
            .then(res => detect(res))
          }
      })
      .catch((err) => {
          window.alert(err.name + ': ' + err.message);
      });


}

function getImageFromVideo(video){
  return new Promise((resolve => {
    let canvas = document.getElementById('video-mask')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    let ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    resolve(canvas.toDataURL('image/png'))
  }))
}

function detect(image_url){
  fetch(image_url).then(res => res.blob())
  .then(blobData => {
      const url = HOST + "detect?returnFaceId=true"

      $.ajax({
        url: url,
        contentType: "application/octet-stream",
        headers: {
        'Ocp-Apim-Subscription-Key': API_KEY
        },
        type: "POST",
        processData: false,
        data: blobData
      })
      .done(function(data) {
          console.log(data)
          let faceIds = []
          data.forEach(v => {
            faceIds.push(v["faceId"])
          })
          console.log(faceIds)
          identify(faceIds)
      })
      .fail(function(err) {
          console.error(err);
      })
  });
}

function identify(faceIds = []){
  const url = HOST + "identify"

  $.ajax({
    url: url,
    contentType: "application/json",
    headers: {
    'Ocp-Apim-Subscription-Key': API_KEY
    },
    type: "POST",
    processData: false,
    data: JSON.stringify({
      personGroupId: PERSON_GROUP_ID,
      faceIds: faceIds,
      maxNumOfCandidatesReturned: 100,
      confidenceThreshold: 0.5
    })
  })
  .done(function(data) {
      console.log(data)
  })
  .fail(function(err) {
      console.error(err);
  })
}