$(function(){
  $(".toggle").bind('click', function() {
      $(this).toggleClass("active").next().slideToggle(300);
  });

  $(window).on('load', function () {
      $('.selectpicker').selectpicker({
          'selectedText': 'cat'
      });
  });

  var temp = $('input[name=payment_display]');
  if(temp){
    money = Math.floor(temp.val() / 100);
  }
})


var money = 0;
function myValue(key){
  switch (key) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      money = money * 10 + key;
      break;
    case '00':
      money *= 100;
      break;
    case 'ca':
      money = 0;
      break;
    case 'bs':
      money = Math.floor(money / 10);
      break;
    default:

  }
  refreshView();
}

function refreshView(){
  $('input[name=payment_display]').val(getNumeric(money * 100));
}

function getNumeric(num){
  return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function setValueInPayment(){
  if(!money > 0) return false;
  $('input[name=payment_setting]').val($('#item_type').val());
  $('input[name=bank_id]').val($('#bank .active input').val());
  if($('#item_type option:selected').attr('in_out_type') == 0) money *= -1;
  $('input[name=money]').val(money * 100);
  $('input[name=monthly]').val($('#monthly_day').val());
}

function setValueInPaymentTransfer(){
  if(!money > 0) return false;
  $('input[name=from_bank_id]').val($('#bank_from .active input').val());
  $('input[name=to_bank_id]').val($('#bank_to .active input').val());
  $('input[name=money]').val(money * 100);
}
