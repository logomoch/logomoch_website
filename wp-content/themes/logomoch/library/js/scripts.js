/*
 * Get Viewport Dimensions
 * returns object with viewport dimensions to match css in width and height properties
 * ( source: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript )
*/
function updateViewportDimensions() {
	var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
	return { width:x,height:y };
}
// setting the viewport width
var viewport = updateViewportDimensions();


/*
 * Throttle Resize-triggered Events
 * Wrap your actions in this function to throttle the frequency of firing them off, for better performance, esp. on mobile.
 * ( source: http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed )
*/
var waitForFinalEvent = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if (!uniqueId) { uniqueId = "Don't call this twice without a uniqueId"; }
		if (timers[uniqueId]) { clearTimeout (timers[uniqueId]); }
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

// how long to wait before deciding the resize has stopped, in ms. Around 50-100 should work ok.
var timeToWaitForLast = 100;


(function( $ ) {
  $.fn.almComplete = function(alm){

    // init slider
    $(".alm-reveal:last").find('.newslide').flickity({
      // options
      cellAlign: 'left',
      wrapAround: true,
      contain: true,
      prevNextButtons: false,
      pageDots: false,
      adaptiveHeight: true,
      percentPosition: true,
      lazyLoad: 1
    });
    // Click instead of swipe:
    $(".alm-reveal:last").find('.newslide').on( 'staticClick.flickity', function() {
      $(this).flickity('next');
    });
  };
})(jQuery);




jQuery(document).ready(function($) {

  viewport = updateViewportDimensions();
  if (viewport.width >= 768) {}

  $(window).resize(function () {
    viewport = updateViewportDimensions();
    if (viewport.width >= 768) {

      $("#newsletterlink").hide();
      $(".mobilelocation").hide();

      $('.workmain, .worksidebar').css({"height": "auto"}); // unset workmain height
      // Reduce then resize workslide area
      $('.workslide .flickity-viewport').height( 0 ); // hack
      $('.workslide .flickity-viewport').height( $(".workmain").height() );
      // $worklistmain.masonry('layout');
    } else {
      $("#newsletterlink").show();
      var mrgn = $('.workmain').outerHeight(true) - $('.workmain').outerHeight();
      // console.log( viewport.height, $("#mobileheader").outerHeight(true), mrgn, viewport.height - $("#mobileheader").outerHeight(true) - mrgn)
      $('.workmain').height( viewport.height - $("#mobileheader").outerHeight(true) - 20 - $(".head").outerHeight(true) );
      $('.worksidebar').height( viewport.height - $("#mobileheader").outerHeight(true) - 20 );
      $('.workslide .flickity-viewport').height( 0 ); // hack
      $('.workslide .flickity-viewport').height( $(".workmain").height() );
    }
    $('.workslide, .newslide').flickity('resize');

    if ( $(".alm-listing").length )
      $(".alm-listing").masonry('layout');

  });

  /**
    MOBILE MENU
  **/
  $("#mobileheader .openmobilemenu").click(function(){
  	$(this).fadeOut(150, function(){
  		$("#mobileheader .closemobilemenu").fadeIn(150);
    });
    $(".mobilelocation").slideUp();
    $("#mobileheader .headernav").slideDown();
  });
  $("#mobileheader .closemobilemenu").click(function(){
    $(this).fadeOut(150, function(){
      $("#mobileheader .openmobilemenu").fadeIn(150)
    });
    $(".mobilelocation").slideDown();
    $("#mobileheader .headernav").slideUp();
  });


/**
 * MASONRY ON MAIN WORK LIST
 **/

/*var $worklistmain = $(".worklistmain").masonry({
  itemSelector: '.work',
  columnWidth: 0,
  // use element for option
  percentPosition: true,
  transitionDuration: 0
});

$(".worklistmain").imagesLoaded().progress( function() {
  $worklistmain.masonry('layout');
});*/



/**
 * IMAGE SLIDER
 **/
// clean wordpress image attributes
$('.workslide, .newslide').find("img")
  .removeAttr("srcset")
  .removeAttr("sizes")
  .removeAttr("width")
  .removeAttr("height")
  .wrap("<div class=\"slide\"></div>");

// Click instead of swipe:
$('.workslide, .newslide').on( 'staticClick.flickity', function() {
  $(this).flickity('next');
});


$('.workslide, .newslide').on( 'ready.flickity', function() {
  $(".slidenb").text("1 / " + $('.workslide, .newslide').find("img").length );
});


// init slider
$('.workslide, .newslide').flickity({
  // options
  cellAlign: 'left',
  wrapAround: true,
  contain: true,
  prevNextButtons: false,
  pageDots: false,
  adaptiveHeight: true,
  percentPosition: true,
  lazyLoad: 1
});

$('.workslide, .newslide').on( 'change.flickity', function( event, index ) {
  $(".slidenb").text((index+1) + " / " + $('.workslide, .newslide').data('flickity').cells.length );
});




$(window).trigger('resize');



if ( $('#home').length )
{
  $('#home').bgSlide({
    onImageTransition: function ( ) {
      var index = $(".slide:visible").index() +1
      $(".homeslideshowpage a").text( index+" / "+ $("#home .slide").length);
    }
  });
  $(".homeslideshowpage a").text( "1 / "+ $("#home .slide").length);
}


/*
  Show title when mouse over thumbnails
*/
$('.work>a').mouseenter( function(){
  $(this).find('div.title').animate({'margin-top': '-0px'}, 250);
}).mouseleave( function(){
  $(this).find('div.title').animate({'margin-top': '-25px'}, 250);
});


var newsletterBtn = $('.menu-item>a[href=#newsletter], #newsletterlink');
var contactBtn = $(".menu-item a[href='http://logomoch.github.io/logomoch_website/contact/'], .menu-item a[href='https://logomoch.github.io/logomoch_website/contact/']");

$("#newsletterlink").appendTo("#header #menu-main-menu");
contactBtn.mouseover(function(){
  newsletterBtn.fadeIn();
})
$("#menu-main-menu").mouseleave(function(){
  newsletterBtn.fadeOut();
});




$("#newsletter").css({"display":"flex"}).hide();

if(window.location.hash) {
  var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
  if (hash == 'newsletter'){
    toggleNewsletter();
  }
}

function toggleNewsletter(){
  if( !$("#newsletter").is(':visible') ){
    console.log("newsletterz");
    $("#newsletter").fadeIn();
  }else{
    $("#newsletter").fadeOut();
    $(this).blur();
  }
}
  newsletterBtn.click( function(){
    toggleNewsletter();
    return false;
  });



  $('#newsletter').click( function(){
    $("#newsletter").fadeOut();
    newsletterBtn.blur();
  });

  $("#mc_embed_signup").click(function( event ) {
    event.stopPropagation();
  });



/*var canScrollPage = true;
$("body.single-work ").bind('mousewheel DOMMouseScroll', function(event){
  if ( canScrollPage ) {
    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
        // scroll up
        $('html,body').animate({scrollTop: 0},'slow');
    }
    else {
        // scroll down
        $('html,body').animate({scrollTop: $(".worksidebar").offset().top - $("#mobileheader").outerHeight(true) },'slow');
    }
    return false;
  }
});*/





}); /* end of as page load scripts */

