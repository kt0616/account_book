$(function(){
  $('input[name=user_id]').bind('change', function(){
    var successFunc = function(data){
      if(data == 'conf'){
        $('#check_user_id').removeClass('noDisplay');
      }else{
        $('#check_user_id').addClass('noDisplay');
      }
    }
    var errFunc = function(){

    }
    $.ajax({
      url: '/ajax/ajax_user_id',
      data: 'user_id='+$(this).val(),
      type: 'GET',
      dataType: 'text',
      timeout: 5000,
      success: successFunc,
      err: errFunc
    });
  })
})
