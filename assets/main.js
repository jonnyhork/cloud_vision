$(document).ready(function() {
  console.log('doc ready!');
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
  /*    events      */
  function dragEnter(e) {
    e.stopPropagation()
    e.preventDefault()
    $("#dropBox").addClass('drag-on')
    // console.log('dragEnter')
  }

  function dragLeave(e) {
    e.stopPropagation()
    e.preventDefault()
    $("#dropBox").removeClass('drag-on')

    // console.log('dragLeave')
  }

  function dragOver(e) {
    e.stopPropagation()
    e.preventDefault()
    // console.log('dragOver')
  }




  /*     ADDING EVENT LISTENERS TO DROPBOX   */


  $('#dropBox').on("dragenter", dragEnter)
  $('#dropBox').on("dragleave", dragLeave)
  $('#dropBox').on("dragover", dragOver)
  dropBox.addEventListener("drop", drop, false)




  /*  ASSIGNING LOADED IMG TO VARIABLES  */

  function drop(event) {
    event.stopPropagation()
    event.preventDefault()
    imgLabels = []
    dataTransfer = event.dataTransfer
    files = dataTransfer.files
    file = files[0]
    // console.log("DROPBOX filelist is: ", files)
    // console.log('DROPBOX imageFile: ', file)

    /*   CONVERT TO BASE64 STRING   */

    if (files && file) {
      let reader = new FileReader();

      reader.onload = function(readerEvt) {
        let binaryString = readerEvt.target.result;
        base64Image = btoa(binaryString);

        // console.log("base64Image = ", base64Image);

        ajaxPostData = {
          "requests": [{
            "image": {
              "content": `${base64Image}`
            },
            "features": [{
              "type": "LABEL_DETECTION",
              "maxResults": 10
            }]
          }]
        }
        // console.log("POST_JSON IS:", ajaxPostData)

        /*    MAKE THE AJAX CALL, ONCE THERE IS A FILE LOADED  */
        let $xhr = $.ajax({
          url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAQPPYpUEbyZdx7UZyUmTZxL8SddruT_Uo',
          method: 'POST',
          dataType: 'JSON',
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(ajaxPostData),
        }) // end of AJAX Request

        $xhr.done((data) => {
          // console.log("data from google is...", data)

          getImgLabels(data)

        })
        $xhr.fail((err) => {
          console.log("error happened with getting labels", err)
        })

      }; // reader onload bracket

      reader.readAsBinaryString(file);

    } // if statement

  }; // END OF DROP EVENT









}) // DOM READY FUNCTION
