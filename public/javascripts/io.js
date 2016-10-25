var socket = io();
var galeria = [];
var folderIndex;
var photoIndex;

$(document).ready( function() {
  setTimeout( function() {
    $('#duzeZdjecieDiv').show();
    $('#photosDiv').show();
  }, 500);
  $(window).bind('resize', function() { set_photo_width(); });
  $('#photographs').on('click', 'a.fullsize', pokazFullSize);
  $('#galleries').on('click', 'a.photolink', pokazZdjecia);
  $('#next').on('click', { value: 1}, pokazFullSizeNext);
  $('#prev').on('click', { value: -1}, pokazFullSizePrev);
});

socket.on('connect', function() {
  socket.emit('hello');
});

socket.on('test', function(data) {
  console.log(data);
});

socket.on('galeria', function(gallery) {
  galeria = gallery;
  console.log(galeria);
  wyswietlGalerie(galeria);
});

function wyswietlGalerie(galeria) {
  $('#listaGalerii').html('');
  for (var i=0; i<galeria.length; i++) {
  	$('#listaGalerii').append( '<div class="galeriaMenu">' + 
    	                  '<a class="photolink" rel="' + i + '" href="#photographs">' +
    	                  '<img alt="thumbnail" width="300" height="200" class="fit center" src="' + 
                        '/' + galeria[i].folder + '/' + galeria[i].zdjecia[0] +
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
                   '<a href="#bigSize" class="fullsize" id="/' + 
                    galeria[index].folder + '/' + galeria[index].zdjecia[i] + 
                   '" indeks="' + i + '"s folder="' + index + '">' + 
                   '<img alt="thumbnail" width="300" height="200" class="fit center" src="' +
                   '/' + galeria[index].folder + '/' + galeria[index].zdjecia[i] +
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
  var indeks = $(this).attr('indeks');
  folderIndex = $(this).attr('folder');
  photoIndex = indeks;
  //console.log('funkcja pokazFullSize(), zmienna "zdjecie": ' + zdjecie);
  $('#powrot2').css('display','none');
  $('#guziki').css('display','inline-block');
  $('#duzeZdjecieDiv').html('');
  $('#bigPic').html('<img alt="zdjęcie" class="photo fit center" src="' + 
                    zdjecie + '">' 
  );
  set_photo_width();
};

function pokazFullSizeNext(){
  photoIndex++;
  if (photoIndex >= (galeria[folderIndex].zdjecia).length ) {
    photoIndex = 0;
  }
  var zdjecie = '/' + galeria[folderIndex].folder + '/' + 
                galeria[folderIndex].zdjecia[photoIndex];
  $('#powrot2').css('display','none');
  $('#guziki').css('display','inline-block');
  $('#duzeZdjecieDiv').html('');
  $('#bigPic').html('<img alt="zdjęcie" class="photo fit center" src="' + 
                    zdjecie + '">' 
  );
  set_photo_width();
};

function pokazFullSizePrev(){
  photoIndex--;
  if (photoIndex < 0) {
    photoIndex = (galeria[folderIndex].zdjecia).length - 1;
  }
  var zdjecie = '/' + galeria[folderIndex].folder + '/' + 
                galeria[folderIndex].zdjecia[photoIndex];
  $('#powrot2').css('display','none');
  $('#guziki').css('display','inline-block');
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

