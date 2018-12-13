$(document).ready(function() {

  $(".btn-write-note").on("click", function(){
    var thisId = $(this).closest(".card").attr("data-id");
    
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        var notesDivSelector = "#modal-" + data._id + " .article-notes"
        $(notesDivSelector).empty();
        // The title of the article
        // $(".article-notes").append("<h2>" + data.title + "</h2>");
        // // An input to enter a new title
        // $(".article-notes").append("<input id='titleinput' name='title' >");
        // // A textarea to add a new note body
        // $(".article-notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // // A button to submit a new note, with the id of the article saved to it
        // $(".article-notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          var $noteBody = $("<p>").text(data.note.body)
          $(notesDivSelector).append($noteBody)
          // Place the title of the note in the title input
          // $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          // $("#bodyinput").val(data.note.body);
        }
      });
  })

  $(".btn-save").on("click", function(){
    var thisId = $(this).closest(".card").attr("data-id");
    var noteInputSelector = "#modal-" + thisId + " .noteinput"

    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: $(noteInputSelector).val()
      }
    }).then(function(data) {
      console.log(data);
    });

    // Also, remove the values entered in the input and textarea for note entry
    $(noteInputSelector).val("");
  })

  // TODO fix this (button not working)
  $("#btn-scrape").on("click", function(){
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function(data) {
      alert("Scrape complete!");
      location.reload();
    });
  })
})