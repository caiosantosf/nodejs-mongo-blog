$(window).scroll(function() {
  if ($(document).scrollTop() > 10) {
    $('#logo').addClass('logo-small');
  } else {
    $('#logo').removeClass('logo-small');
  }
});

$('.pgwSlider').pgwSlider({
  autoSlide: true,
  verticalCentering: true,
  displayList: false,
  transitionEffect: 'sliding',
  displayControls: 'true',
  touchControls: 'true',
  transitionDuration: 300,
  intervalDuration: 6000,
  maxHeight: 420
});

$(".carousel").on("touchstart", function(event){
  var xClick = event.originalEvent.touches[0].pageX;
  $(this).one("touchmove", function(event){
      var xMove = event.originalEvent.touches[0].pageX;
      if( Math.floor(xClick - xMove) > 5 ){
          $(this).carousel('next');
      }
      else if( Math.floor(xClick - xMove) < -5 ){
          $(this).carousel('prev');
      }
  });
  $(".carousel").on("touchend", function(){
          $(this).off("touchmove");
  });
});

var data = new Date(document.getElementById("hiddendate").innerHTML);
data = new Date(data);

var day = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
var date = data.getDate();
var month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][data.getMonth()];
var year = data.getFullYear();

document.querySelector(".dayofmonth").innerHTML = date;
document.querySelector(".dayofweek").innerHTML = day;
document.querySelector(".shortdate").innerHTML = month + ' de ' + year;
document.querySelector(".agenda-time").innerHTML = 'Horário: ' + ('0' + data.getHours()).slice(-2) + ':' + ('0' + data.getMinutes()).slice(-2);