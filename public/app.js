$(document).ready(function() {

  $(".btn-write-note").on("click", function(){
    var thisId = $(this).closest(".card").attr("data-id");
    
    // Get the article data
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
        // Add the note information to the page
        console.log(data);
        var notesDivSelector = "#modal-" + data._id + " .article-notes"
        $(notesDivSelector).empty();
  
        // If there's a note associated with the article
        if (data.note) {
          // TODO Add delete button and hook up to a delete route
          var $noteBody = $('<p class="note">' + data.note.body + "</p>")
          $(notesDivSelector).append($noteBody)
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