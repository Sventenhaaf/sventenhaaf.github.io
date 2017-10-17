$(".two a").click(function(e) {
  e.preventDefault();
  var id = $(this).attr('href').substring(1);
  console.log("ID:", id)
  console.log($('#'+id).offset())
  $('html,body').animate({scrollTop: $('#'+id).offset().top}, 'fast');
  window.history.pushState("", "", '/' + id);
});
