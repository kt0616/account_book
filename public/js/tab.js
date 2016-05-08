$(function(){
  $("#tab-head li").addClass("tab1");
  $("#tab-head li a").eq(0).addClass("tab2");
  $("#tab-head li a").click(function() {
    $("#tab-body div").css('display','none');
    $($(this).attr("href")).css('display','');
    $($(this).attr("href")).fadeIn();/*アニメーションで制御*/
    $("#tab-head li a").removeClass("tab2");
    $(this).addClass("tab2");

    return false;
  });
});
}
