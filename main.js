// toggle
$(".navbar").click(function () {
  if ($(this).hasClass("open-menu")) {
    $(this).removeClass("open-menu");
    $(".menu").removeClass("open-menu");
    $("body").removeClass("stop-scroll");
  } else {
    $(this).addClass("open-menu");
    $(".menu").addClass("open-menu");
    $("body").addClass("stop-scroll");
  }
});
