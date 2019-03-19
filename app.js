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
      console.log(blobData)

      const url = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true"

      $.ajax({
        url: url,
        contentType: "application/octet-stream",
        headers: {
        'Ocp-Apim-Subscription-Key': ""
        },
        type: "POST",
        processData: false,
        data: blobData
      })
      .done(function(data) {
          console.log(data)
      })
      .fail(function(err) {
          console.error(err);
      })
  });
}