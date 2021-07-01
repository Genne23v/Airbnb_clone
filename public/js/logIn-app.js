const displayLogInError = (message) => {
  const type = message.type;
  const messages = message.message;
  const errors = formResponse(type, messages);

  $(".svr-logIn-res").prepend(errors);
};
$(".log-in").on("click", (e) => {
  e.preventDefault();
  $(".svr-logIn-res").empty();

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
    console.log("done");
    displayLogInError(data);
  });
});

$(document).ready(function () {
  $("#login-modal").on("hidden.bs.modal", function () {
    console.log("modal close triggered");
    $(".svr-logIn-res").empty();
  });
});
