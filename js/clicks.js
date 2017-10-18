$(".two a").click(function(e) {
  e.preventDefault();
  var id = $(this).attr('href').substring(1);
  console.log("ID:", id)
  console.log()
  console.log($('#'+id).offset())
  $('html,body').animate({scrollTop: $('#'+id).offset().top}, 'fast');
  window.history.pushState("", "", '/' + id);
});


[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29].forEach(n => {
    var el = document.getElementById("delay" + n);
    el.style.display = "none";
    window.setTimeout(() => {
      if (n < 4 || n > 6) {
        el.style.display = "block";
      } else {
        el.style.display = "inline";
      }
    }, 1400 + 300*Math.pow(n, 0.25))
})
