const displayLogInError = (message) => {
  const type = message.type;
  const messages = message.message;
  const errors = formResponse(type, messages);

  if (type === "success") {
    $(".login-form")
      .find("*")
      .css("position", "absolute")
      .css("top", "10000px");
    $(".log-in-success").prepend(errors).css("margin-top", "60px");
  } else {
    $(".svr-logIn-res").prepend(errors);
  }
};

$(".log-in").on("click", (e) => {
  e.preventDefault();
  $(".svr-logIn-res").empty();
  $(".log-in-success").empty();

  const email = $("#logIn-email").val();
  const password = $("#logIn-password").val();

  $.ajax({
    url: "/logIn",
    method: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      email: email,
      password: password,
    }),
  }).done(function (data) {
    //console.log(`Response: ${data.loggedIn}`);
    displayLogInError(data);
  });
});

$(document).ready(function () {
  $("#login-modal").on("hidden.bs.modal", function () {
    $(".svr-logIn-res").empty();
    $(".log-in-success").empty().css("margin-top", "0");
    $(".login-form").find("*").css("position", "static");
    location.reload();
  });
});
