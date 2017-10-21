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
  let imgAjaxPostData
  let sentimentPostData
  let imgLabels = []
  let labelsString
  let sentimentScore
  let sentimentMagnitude
  let mood


  /*           FUNCTIONS             */


  let getImgLabels = (data) => {

    imgData = data.responses[0].labelAnnotations

    imgData.forEach((obj) => imgLabels.push(obj.description))

    labelsString = imgLabels.join()

  }

  let crystalImg = () => {
    $("#crystalImg").attr("src", `data:image/png;base64,${base64Image}`)
  }

  /*    events      */

  function dragEnter(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  function dragLeave(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  function dragOver(e) {
    e.stopPropagation()
    e.preventDefault()
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
    Proceed with caution around <em>${arr[10]}</em>.</p>`

    renderFortune(fortune)
    // console.log("at append mood:", mood)
  }

  let renderFortune = (text) => {

    $('.message-pretext').fadeIn(1000)

    $('#fortuneText').hide().append(text).fadeIn(7000)

  }

  function audioPlayer() {
    audio = new Audio()
    audio.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/161676/music.mp3"
    audio.loop = true
    audio.volume = .8
    audio.paused = true
  }

  let getSentiment = () => {
    mood = ''

    sentimentPostData = {
      "document": {
        "type": "PLAIN_TEXT",
        "content": `${labelsString}`
      },
      "encodingType": "UTF8"
    }
    /*    make the AJAX call for natural language API      */
    $.ajax({
      url: 'https://language.googleapis.com/v1beta1/documents:analyzeSentiment?key=AIzaSyAQPPYpUEbyZdx7UZyUmTZxL8SddruT_Uo',
      method: 'POST',
      dataType: 'JSON',
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(sentimentPostData),
    }).done((sentimentData) => {
      parseSentimentData(sentimentData)
    }).fail((err) => {}) // end of AJAX Request



  } // end of getSentiment()

  let parseSentimentData = (sentimentData) => {

    sentimentScore = sentimentData['documentSentiment']['score']

    determineMood(sentimentScore)
  }

  let determineMood = (sentimentScore) => {
    if (sentimentScore > -1.0 && sentimentScore <= -0.3) {
      mood = `You seem to be upset or concerned.`
    } else if (sentimentScore >= -0.2 && sentimentScore <= 0.2) {
      mood = `I sense you are content, perhaps neutral.`
    } else if (sentimentScore >= 0.3 && sentimentScore <= 1) {
      mood = `It appears that you are satisfied and happy at the moment.`
    } else {
      mood = "I can't determine your mood."
    }

    $('#moodDiv').hide().append(mood).fadeIn(5000)
  }


  /*     ADDING EVENT LISTENERS    */


  $('#dropBox').on("dragenter", dragEnter)
  $('#dropBox').on("dragleave", dragLeave)
  $('#dropBox').on("dragover", dragOver)
  dropBox.addEventListener("drop", drop, false)
  /*   music play-pause   */
  $('#musicBtn').click(function() {
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  })

  /*  ASSIGNING LOADED IMG TO VARIABLES  */

  function drop(event) {
    event.stopPropagation()
    event.preventDefault()
    $('.message-pretext').hide()
    $('#moodDiv').empty()
    $('#fortuneText').empty()
    imgLabels = []
    labelsString = ''
    dataTransfer = event.dataTransfer
    files = dataTransfer.files
    file = files[0]

    /*   CONVERT TO BASE64 STRING   */

    if (files && file) {

      let reader = new FileReader()

      reader.onload = function(readerEvt) {
        let binaryString = readerEvt.target.result
        base64Image = btoa(binaryString)
        crystalImg()
        // console.log("base64Image = ", base64Image);

        imgAjaxPostData = {
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

        /*    MAKE THE AJAX IMG LABEL CALL, ONCE THERE IS A FILE LOADED  */
        $.ajax({
          url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAQPPYpUEbyZdx7UZyUmTZxL8SddruT_Uo',
          method: 'POST',
          dataType: 'JSON',
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(imgAjaxPostData), // end of AJAX Request
        }).done((data) => {

          // Hide loading graphic?
          $('.message-pretext').fadeIn(1000)
          getImgLabels(data)
          // console.log("data from google is...", data)
          getSentiment()

          createFortune(imgLabels)
          // console.log("IMG LABELS: ", imgLabels);

        }).fail((err) => {
          console.log("error happened with getting labels", err)
        })

      }; // reader onload bracket

      reader.readAsBinaryString(file)

    } // if statement

  }; // END OF DROP EVENT









}) // DOM READY FUNCTION
