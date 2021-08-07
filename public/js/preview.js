// window.onload = () => {
//   let roomPreview = localStorage.getItem("room-preview");
//   console.log(`roomPreview: ${roomPreview}`);
//   if (roomPreview != null) {
//     $(".photo-preview").empty();
//     $($.parseHTML("<img>"))
//       .attr("src", roomPreview)
//       .appendTo(".photo-preview")
//       .css("object-fit", "cover");
//   }
// };
$(function () {
  let imagePreview = function (input) {
    console.log(`imagePreview running ${input.files[0]}`);

    if (input.files[0]) {
      console.log("file exists");
      //let filesAmount = input.files.length;
      // for (i = 0; i < filesAmount; i++) {
      //   let reader = new FileReader();
      //   reader.onload = function (event) {
      //     $($.parseHTML("<img>"))
      //       .attr("src", event.target.result)
      //       .appendTo(placeToInsertImagePreview);
      //   };
      //   reader.readAsDataURL(input.files[i]);
      // }
      let reader = new FileReader();
      reader.onload = function (event) {
        console.log(event.target.result);
        $(".photo-preview").empty();
        $($.parseHTML("<img>"))
          .attr("src", event.target.result)
          .appendTo(".photo-preview")
          .css("object-fit", "cover");
      };
      reader.readAsDataURL(input.files[0]);
      // reader.onload = function () {
      //   console.log(reader.result);
      //   localStorage.setItem("room-preview", reader.result);
      // };
    }
  };
  $("#photos").on("change", function () {
    console.log(`image uploaded ${this}`);
    imagePreview(this);
  });
});
