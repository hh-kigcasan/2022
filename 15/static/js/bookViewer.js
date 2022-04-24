$(document).ready((event) => {
  var socket = io();

  // Flip animations for the book viewer
  $("#storybook").turn({
    gradients: true,
    acceleration: true,
    autoCenter: true,
    display: "double",
    when: {
      turned: (event, page, pageObj) => {
        // console.log("the current page is " + page, event);
        // console.log(pageObj);
      },
    },
    width: 960,
    height: 582,
  });

  // Open Book Functions
  let bookViewer = $("#book");
  let closeBtn = $("#closebook");

  closeBtn.click(() => {
    socket.emit("disconnect book", { bookID: "sample-book", id: socket.id });
    bookViewer.fadeOut("slow").css("display", "none");
  });

  let book = $("#sample-book");

  book.click(() => {
    let name = prompt("Enter Your Name: ");

    if (name) {
      bookViewer.css("display", "block");
      socket.emit("join book", {
        username: name,
        id: socket.id,
        bookID: "sample-book",
      });
    } else {
      alert("Please enter a name before entering a book.");
    }
  });

  // Connect Users using sockets
  socket.on("online users", (data) => {
    $("#onlineUsers").empty();
    for (let user of data) {
      $("#onlineUsers").append(`<span class="user">${user.username}</span>`);
    }
  });

  // Realtime event editor using keyup
  $("textarea").keyup(function (e) {
    let text = this.value;
    socket.emit("message", {
      message: text,
      bookID: "sample-book",
      element: this.id,
    });
  });

  socket.on("display message", (data) => {
    $("#" + data.element).val(data.message);
    $("#mv1").val(data.message);

  });
  // End of RealTime event

  // detect if page is reloaded

  /*========================================================= */

  // Collect all the p elements
  let p = $("p");
  console.log(p);
  // Make the p elements editable
  p.click(() => {
    console.log(this);
    $(this).attr("contenteditable", "true");
  });

  let lines = 0;
  //Can Use TAB in Textboxes
  $("textarea").keydown(function (e) {
    if (e.keyCode === 9) {
      let start = this.selectionStart;
      let end = this.selectionEnd;
      let value = $(this).val();

      $(this).val(value.substring(0, start) + "\t" + value.substring(end));

      this.selectionStart = this.selectionEnd = start + 1;
      console.log($(this).val().length);
      e.preventDefault();
    }

    // CHeck number of lines in textarea
    let totalChar = $(this).val().length;
    console.log(totalChar);
    while (totalChar > 9) {
      totalChar = totalChar / 60;
      console.log(lines++);
    }
  });

  //  Add Page Button Listener
  let addPage = $("#add-page-btn");
  let currentPages = $("#storybook").turn("pages");
  let idNum = currentPages;
  addPage.click(() => {
    // Create Div for new page
    let textarea = $("<textarea/>", {
      id: "t" + idNum++,
      class: "storycontent",
      placeholder: "Page Content",
      maxlength: "920",
    });
    let element = $("<div/>");
    element.addClass("page").append(textarea);

    // Back to Back Page
    $("#storybook").turn("addPage", element, currentPages++);
  });
  // end of Add Page Button Listener


  // save book listener
  let saveButton = $("#save-book-btn");
  saveButton.click(function () {
    let bookName = prompt("Enter Book Name: ");
    if (bookName) {
      socket.emit("save book", {
        bookID: bookName,
        id: socket.id,
      });
    } else {
      alert("Please enter a name before saving a book.");
    }
  });
});
