var socket = io();
var galeria = [];

$(document).ready( function() {
  $(window).bind('resize', function() { set_photo_width(); });
  $('#photographs').on('click', 'a.fullsize', pokazFullSize);
  $('#galleries').on('click', 'a.photolink', pokazZdjecia);
});

socket.on('connect', function() {
  socket.emit('hello');
});

socket.on('galeria', function(gallery) {
  galeria = gallery;
  console.log('Obiekt galeria{}:');
  console.log(galeria);
  wyswietlGalerie(galeria);
});

function wyswietlGalerie(galeria) {
  $('#listaGalerii').html('');
  for (var i=0; i<galeria.length; i++) {
  	$('#listaGalerii').append( '<div class="galeriaMenu">' + 
    	                  '<a class="photolink" rel="' + i + '" href="#photographs">' +
    	                  '<img alt="thumbnail" width="300" height="200" class="fit center" src="photo/' + 
    	                  galeria[i].folder + '/' + galeria[i].zdjecia[0] +
                          '"></a>' + 
                          '<div class="desc">' + galeria[i].folder + '</div></div>');
  	};
};

function pokazZdjecia() {
  var index = $(this).attr('rel') || 0;
  var zdjeciaHtml = '';
  //console.log('funkcja pokazZdjecia(), zmienna "index": ' + index);
  $('#zdjecia').html('');
  $('#photosDiv').html('');
  $('#photographsHeader').html('');
  $('#photographsHeader').html(galeria[index].folder);
  for (var i=0; i < (galeria[index].zdjecia).length; i++) {
    zdjeciaHtml += '<div class="zdjecie">' + 
                   '<a href="#bigSize" class="fullsize" id="photo/' + 
                    galeria[index].folder + '/' + galeria[index].zdjecia[i] + 
                   '">' + 
                   '<img alt="thumbnail" width="300" height="200" class="fit center" src="photo/' + 
                   galeria[index].folder + '/' + galeria[index].zdjecia[i] +
                   '"></a></div>';

    /*$('#zdjecia').append( '<div class="zdjecie">' + 
                          '<a href="#duzeZdjecie" class="fullsize" id="photo/' + 
                          galeria[index].folder + '/' + galeria[index].zdjecia[i] + 
                          '">' + 
    	                    '<img alt="thumbnail" width="300" height="200" class="fit center" src="photo/' + 
    	                    galeria[index].folder + '/' + galeria[index].zdjecia[i] +
                          '"></a></div>'); */
  };
  $('#zdjecia').html(zdjeciaHtml);
};

function pokazFullSize(){
  var zdjecie = $(this).attr('id') || 'photo not found!';
  //console.log('funkcja pokazFullSize(), zmienna "zdjecie": ' + zdjecie);
  $('#duzeZdjecieDiv').html('');
  $('#bigPic').html('<img alt="zdjęcie" class="photo fit center" src="' + 
                    zdjecie + '">' 
  );
  set_photo_width();
};

function set_photo_width() {
  var maxWidth = $( window ).width() - 60 + "px";
  $('.photo').css( "max-width", maxWidth );
};

function redirect (){
  window.location.replace('#galleries');
  return null;
}; 

