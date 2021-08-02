const formResponse = (type, messages) => {
  const responseContainer = $("<div>").attr({
    class: "alert alert-" + type,
    style: "padding: .4rem 1rem;",
  });

  console.log(`Each error ${messages.constructor}`);
  if (messages.constructor === Array) {
    messages.forEach((each) => {
      let text = $("<p>");
      each = "&#10004 " + each;
      text.html(each);
      //console.log(`Each msg: ${text}`);
      responseContainer.append(text);
    });
  } else {
    const text = $("<p>");
    messages = "&#10004 " + messages;
    text.html(messages);
    responseContainer.append(text);
  }

  return responseContainer;
};
const displayFlash = (message) => {
  const type = message.type;
  const messages = message.message;
  //console.log(messages);
  const response = formResponse(type, messages);

  if (type === "success") {
    $(".registration-form")
      .find("*")
      .css("position", "absolute")
      .css("top", "10000px");
    $(".sign-up-success").prepend(response).css("margin-top", "60px");
  } else {
    $(".svr-res").prepend(response);
  }
};

$(".sign-up").on("click", (e) => {
  e.preventDefault();
  $(".sign-up-success").empty();
  $(".svr-res").empty();

  const email = $('input[name="email"]').val();
  const fname = $('input[name="fname"]').val();
  const lname = $('input[name="lname"]').val();
  const password = $('input[name="password"]').val();

  $.ajax({
    url: "/register",
    method: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      email: email,
      fname: fname,
      lname: lname,
      password: password,
    }),
  })
    .done(function (data) {
      console.log(`Response: ${data}`);
      displayFlash(data);
    })
    .fail(function (data, textStatus, errorThrown) {
      console.log(`Failed: ${data}, ${textStatus}, ${errorThrown}`);
    });
});

$(document).ready(function () {
  $("#registration-modal").on("hidden.bs.modal", function () {
    $(".svr-res").empty();
    $(".sign-up-success").empty().css("margin-top", "0");
    $(".registration-form").find("*").css("position", "static");
    // location.reload();
  });
});
