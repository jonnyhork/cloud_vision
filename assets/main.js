$(document).ready(function() {
  console.log('doc ready!');

  $('.message-pretext').hide()
  window.addEventListener("load", () => audioPlayer())
  /*
  Prevent window from displaying image when dropped
  */
  window.addEventListener("dragover", function(e) {
    e.preventDefault();
  }, false);
  window.addEventListener("drop", function(e) {
    e.preventDefault();
  }, false);



  /*          VARIABLES             */

  let dropBox = document.getElementById('dropBox')
  let imgData
  let dataTransfer
  let files
  let file
  let base64Image
  let ajaxPostData
  let imgLabels = []

  /*           FUNCTIONS             */
  let getImgLabels = (data) => {

    imgData = data.responses[0].labelAnnotations

    imgData.forEach((obj) => imgLabels.push(obj.description))
    console.log('IMG DATA= ', imgData);
    console.log('IMG LABELS= ', imgLabels);
  }

  let crystalImg = () => {
    $("#crystalImg").attr("src", `data:image/png;base64,${base64Image}`)
  }

  /*    events      */
  // $("#musicBtn").click(togglePlay())

  function dragEnter(e) {
    e.stopPropagation()
    e.preventDefault()
    // $("#dropBox").addClass('drag-on')
  }

  function dragLeave(e) {
    e.stopPropagation()
    e.preventDefault()
    // $("#dropBox").removeClass('drag-on')
  }

  function dragOver(e) {
    e.stopPropagation()
    e.preventDefault()
    // $("#dropBox").removeClass('drag-on')
  }

  let createFortune = (arr) => {
    let fortune = `<p>I can see....a, wait, it's definately something like <em>${arr[0]}</em>.</p>
    <p>I sense that <em>${arr[1]}</em> is in your near future, or past...
    <br>
    <br>
    Your thoughts have been occupied recently, by things like <em>${arr[2]}</em> and <em>${arr[3]}</em>.
    <br>
    <br>
    There is interest in <em>${arr[4]}</em>, <em>${arr[5]}</em> and <em>${arr[6]}</em> but you're not quite certain.
    <br>
    <br>
    You prefer a certain amount of change and variety and become dissatisfied when faced with restrictions and limitations.</p>

    <h3 class="message-title">Ah, yes, I sense there is more..</h3>

    <p> At times you are extroverted, affable, sociable, while at other times you are introverted, wary, reserved. You shoud explore <em>${arr[7]}</em> or <em>${arr[8]}</em> and <em>${arr[9]}</em>.
    <br>
    <br>
    Proceed with caution around <em>${arr[10]}</em>.</p>
`
    renderFortune(fortune)
  }

  let renderFortune = (text) => {
    $('.message-pretext').fadeIn(1000)
    $('#fortuneText').empty()
    $('#fortuneText').hide().append(text).fadeIn(3000)

  }

  function audioPlayer() {
    console.log('audio')
    audio = new Audio()
    audio.src = "assets/audio/Darkness.mp3"
    audio.loop = true
    audio.volume = .2
    audio.paused = true
  }

  /*     ADDING EVENT LISTENERS    */

  $('#dropBox').on("dragenter", dragEnter)
  $('#dropBox').on("dragleave", dragLeave)
  $('#dropBox').on("dragover", dragOver)
  dropBox.addEventListener("drop", drop, false)
  $('#musicBtn').click(function() {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  /*  ASSIGNING LOADED IMG TO VARIABLES  */

  function drop(event) {
    event.stopPropagation()
    event.preventDefault()
    imgLabels = []
    dataTransfer = event.dataTransfer
    files = dataTransfer.files
    file = files[0]
    // display loading grapghic
    // console.log("DROPBOX filelist is: ", files)
    // console.log('DROPBOX imageFile: ', file)

    /*   CONVERT TO BASE64 STRING   */

    if (files && file) {

      let reader = new FileReader();

      reader.onload = function(readerEvt) {
        let binaryString = readerEvt.target.result;
        base64Image = btoa(binaryString);
        crystalImg()
        // console.log("base64Image = ", base64Image);

        ajaxPostData = {
          "requests": [{
            "image": {
              "content": `${base64Image}`
            },
            "features": [{
              "type": "LABEL_DETECTION",
              "maxResults": 11
            }]
          }]
        }
        // console.log("POST_JSON IS:", ajaxPostData)

        /*    MAKE THE AJAX CALL, ONCE THERE IS A FILE LOADED  */
        $.ajax({
          url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAQPPYpUEbyZdx7UZyUmTZxL8SddruT_Uo',
          method: 'POST',
          dataType: 'JSON',
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(ajaxPostData), // end of AJAX Request
        }).done((data) => {
          // console.log("data from google is...", data)
          // Hide loading graphic
          $('.message-pretext').fadeIn(1000)
          getImgLabels(data)
          createFortune(imgLabels)
          // console.log("IMG LABELS: ", imgLabels);

        }).fail((err) => {
          console.log("error happened with getting labels", err)
        })

      }; // reader onload bracket

      reader.readAsBinaryString(file);

    } // if statement

  }; // END OF DROP EVENT









}) // DOM READY FUNCTION
