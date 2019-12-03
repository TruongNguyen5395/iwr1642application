/**
 * jQuery plugin "Lightspeed box".
 * Lightbox plugin with transitions and wait cursor.
 *
 * https://github.com/AlexEmashev/lsb-lightbox
 * Author: Alexander Emashev
 * License: The MIT public license.
 */
(function ($) {
  'use strict';
  $.fn.lightspeedBox = function (options) {
    var defaultSettings = {
      showImageTitle: true,
      showImageCount: true,
      showDownloadButton: true,
      showPlayButton: true,
      slideshow: false,
      playbackTiming: 3500,
      zIndex: 30,
      locale: {
        nextButton: 'Next image',
        prevButton: 'Previous image',
        closeButton: 'Close',
        downloadButton: 'Download image',
        noImageFound: 'Sorry, no image found.',
        playButton: 'Play slideshow',
        pauseButton: 'Stop slideshow'
      }
    };
    
    /**
     * Settings of the plugin.
     */
    var settings = $.extend(defaultSettings, options);

    /**
     * Lightbox element.
     */
    var $lsb;
    
    /**
     * Wait cursor.
     */
    var $spinner;
    
    /**
     * Image reference in lightbox.
     */
    var $lsbImage;
    
    /**
     * Image title from alt tag.
     */
    var $lsbTitle;
    
    /**
     * Image count
     */
    var $lsbCount;
    
    /**
     * No image found message.
     */
    var $noImageFound;
    
    /**
     * Next image button.
     */
    var $next;
    
    /**
     * Previous image button.
     */
    var $prev;
    
    /**
     * Close button.
     */
    var $close;
    
    /**
     * Image download button.
     */
    var $download;
    
    /**
    * Play slideshow button.
    */
    var $play;
    
    /**
    * Pause button
    */
    var $pause;
    
    /**
     * Used for transition effect between slides.
     */
    var transitionTimeout = 400;
    
    /**
    * Flag that lsb is closed
    */
    var lsbClosed = true;

    /**
     * Collection of images to show in lightbox.
     */
    var imageCollection = {
      /** 
       * Current selected image.
       */
      current: null,
      /**
       * Image addresses collection.
       * {href: 'www.example.com/img.jpg', alt: 'Sample image &quot;1&quot;'}
       */
      images: [],
      /**
       * Fills image collection with appropriate images
       * @param $selectedImg - current image element.
       */
      getImagesInSet: function ($selectedImg) {
        var previews;
        // Reset previous images.
        var collectedImages = [];
        var curImgIndex = 0;

        // Get selected image props
        var selectedImgHref = $selectedImg.attr('href');
        var selectedImgAlt = $selectedImg.find('img').attr('alt');
        // Check if element is in group.
        var group = $selectedImg.attr('data-lsb-group');

        // Get all images in group
        if (group) {
          previews = $('.lsb-preview[data-lsb-group="' + group + '"]');
          // Fill collection with found elements.
          previews.each(function (i, element) {
            var elementHref = element.getAttribute('href');
            var alt = $(element).find('img').attr('alt');

            collectedImages.push({
              href: elementHref,
              alt: alt
            });
            // Calculate image of the collection that should be displayed (the one user clicked).
            if (elementHref === selectedImgHref) {
              curImgIndex = i;
            }
          });
        } else { // If it is a single image
          collectedImages.push({
            href: selectedImgHref,
            alt: selectedImgAlt
          });
        }

        this.images = collectedImages;
        this.current = curImgIndex;
        // Hide next and previous buttons if there is only one image.
        if (this.images.length === 1) {
          $prev.css('visibility', 'hidden');
          $next.css('visibility', 'hidden');
          $play.hide();
        } else {
          $prev.css('visibility', 'visible');
          $next.css('visibility', 'visible');
          if(settings.showPlayButton)
            $play.show();
        }
      },
      /**
       * Returns next image reference.
       */
      nextImage: function () {
        if (this.images.length === 0) {
          return '';
        }

        this.current += 1;
        if (this.current > this.images.length - 1) {
          this.current = 0;
        }

        return this.images[this.current];
      },
      /**
       * Returns previous image reference.
       */
      previousImage: function () {
        if (this.images.length === 0) {
          return '';
        }

        this.current -= 1;
        if (this.current < 0) {
          this.current = this.images.length - 1;
        }

        return this.images[this.current];
      },
      /**
       * Returns true if images holds more than just one image.
       */
      canSwitch: function () {
        return this.images.length > 1;
      }
    };

    ////////////// Functions /////////////

    /**
     * Initializes the lightbox.
     */
    (function init() {
      var waitingIconCircle = '';

      for (var i = 0; i < 12; i++) {
        waitingIconCircle += '<div class="waitingicon-circle"></div>';
      }

      $('body').append(
        '<div class="lightspeed-box">' +
        '<div class="lsb-content">' +
        '<header class="lsb-header"><div class="lsb-image-count"></div><div class="lsb-image-title"></div></header>' +
        '<div class="lsb-control-panel">' +
        '<a class="lsb-control lsb-panel-button lsb-play" title="Slideshow">' + 
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1408 1792">' + 
        '<path fill="#000" d="M1384 927l-1328 738q-23 13-39.5 3t-16.5-36v-1472q0-26 16.5-36t39.5 3l1328 738q23 13 23 31t-23 31z" />' + 
        '</svg>' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1408 1792">' + 
        '<path fill="#fff" d="M1384 927l-1328 738q-23 13-39.5 3t-16.5-36v-1472q0-26 16.5-36t39.5 3l1328 738q23 13 23 31t-23 31z" />' + 
        '</svg>' +
        '</a>' +
        '<a class="lsb-control lsb-panel-button lsb-pause" title="Stop Slideshow">' + 
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1536 1792">' + 
        '<path fill="#000" d="M1536 192v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45zM640 192v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45z" />' + 
        '</svg>' + 
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1536 1792">' + 
        '<path fill="#fff" d="M1536 192v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45zM640 192v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45z" />' + 
        '</svg>' +
        '</a>' +
        '<a class="lsb-control lsb-panel-button lsb-download" download title="Download Image">' + 
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1664 1792">' + 
        '<path fill="#000" d="M1280 1344q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zM1536 1344q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zM1664 1120v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h465l135 136q58 56 136 56t136-56l136-136h464q40 0 68 28t28 68zM1339 551q17 41-14 70l-448 448q-18 19-45 19t-45-19l-448-448q-31-29-14-70 17-39 59-39h256v-448q0-26 19-45t45-19h256q26 0 45 19t19 45v448h256q42 0 59 39z" />' + 
        '</svg>' + 
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1664 1792">' + 
        '<path fill="#fff" d="M1280 1344q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zM1536 1344q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zM1664 1120v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h465l135 136q58 56 136 56t136-56l136-136h464q40 0 68 28t28 68zM1339 551q17 41-14 70l-448 448q-18 19-45 19t-45-19l-448-448q-31-29-14-70 17-39 59-39h256v-448q0-26 19-45t45-19h256q26 0 45 19t19 45v448h256q42 0 59 39z" />' + 
        '</svg>' +
        '</a>' +
        '</div>' +
        '<div class="lsb-image-container">' +
        '<div class="lsb-no-image-found"><div class="no-found-msg">Sorry, no image found.</div></div>' +
        '<img class="lsb-image lsb-noimage">' +
        '</div>' +
        '<div class="waitingicon">' +
        waitingIconCircle +
        '</div>' +
        '<div class="lsb-control lsb-close">' + 
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1408 1792">' + 
        '<path fill="#000" d="M1298 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z" />' + 
        '</svg>' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1408 1792">' + 
        '<path fill="#fff" d="M1298 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z" />' + 
        '</svg>' +
        '</div>' +
        '<div class="lsb-control lsb-prev" title="Previous Image">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 640 1792">' +
        '<path fill="#000" d="M627 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z" />' +
        '</svg>'+
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 640 1792">' +
        '<path fill="#fff" d="M627 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z" />' +
        '</svg>'+
        '</div>' +
        '<div class="lsb-control lsb-next" title="Next Image">' + 
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 640 1792">' + 
        '<path fill="#000" d="M595 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z" />' + 
        '</svg>' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 640 1792">' + 
        '<path fill="#fff" d="M595 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z" />' + 
        '</svg>' +
        '</div>' +
        '</div>' +
        '</div>'
      );

      // Lightbox element.
      $lsb = $('.lightspeed-box');
      $lsb.css('z-index', settings.zIndex);
      $spinner = $('.waitingicon');
      $lsbImage = $lsb.find('.lsb-image');
      $lsbTitle = $lsb.find('.lsb-image-title');
      $lsbCount = $lsb.find('.lsb-image-count');
      $noImageFound = $lsb.find('.lsb-no-image-found'); // No image found message.
      // Next image button.
      $next = $lsb.find('.lsb-next');
      // Previous image button.
      $prev = $lsb.find('.lsb-prev');
      $close = $lsb.find('.lsb-close');
      $download = $lsb.find('.lsb-download');
      $play = $lsb.find('.lsb-play');
      $pause = $lsb.find('.lsb-pause');

      if (!settings.showDownloadButton) {
        $download.hide();
      }
      
      if (settings.showPlayButton) {
        $play.hide();
      }
      
      $pause.hide();

      // Set l10n.
      $next.attr('title', settings.locale.nextButton);
      $prev.attr('title', settings.locale.prevButton);
      $close.attr('title', settings.locale.closeButton);
      $download.attr('title', settings.locale.downloadButton);
      $play.attr('title', settings.locale.playButton);
      $pause.attr('title', settings.locale.pauseButton);
      $noImageFound.find('.no-found-msg').text(settings.locale.noImageFound);



      ///// Add event handlers for elements. //////

      var mouseOffset = {x: 0, y: 0}; // Structure to support preview click.
      var clickThreshold = 20; // Max amount in pixels to detect click.
      /**
      * Instead of click on image, detect mousedown and mouseup events. They work with touch either.
      * This allows to use this lightbox in different sliders.
      */
      $('.lsb-preview').mousedown(function (event) {
        mouseOffset.x = event.clientX;
        mouseOffset.y = event.clientY;
      });
      
      $('.lsb-preview').mouseup(function (event) {
        if (Math.abs(mouseOffset.x - event.clientX) < clickThreshold &&
           Math.abs(mouseOffset.y - event.clientY) < clickThreshold) {
          // Get all images in set
          imageCollection.getImagesInSet($(this));
          
          showLightbox();
          switchImage(imageCollection.images[imageCollection.current]);
          
          if (settings.slideshow) {
            window.setTimeout(playbackGo, settings.playbackTiming);
          }
        }
      });
      
      $('.lsb-preview').click(function (event) {
        event.preventDefault();
      });
      
      
      // Add swipe detection plugin.
      $lsb.swipeDetector().on('swipeLeft.lsb swipeRight.lsb', function (event) {
        if (imageCollection.images.length > 1) {
          if (event.type === 'swipeLeft') {
            switchImage(imageCollection.nextImage());
          } else if (event.type === 'swipeRight') {
            switchImage(imageCollection.previousImage());
          }
        }
      });

      /**
       * Keyboard support.
       */
      $(document).on('keyup.lightspeed-box', function (event) {
        if ($lsb.hasClass('lsb-active')) {
          // Right button press. Image switching make sence only if there are more than one image in collection.
          if (event.which === 39 && imageCollection.images.length > 1) {
            event.stopPropagation();
            switchImage(imageCollection.nextImage());
          } else if (event.which === 37 && imageCollection.images.length > 1) { // Left button press
            event.stopPropagation();
            switchImage(imageCollection.previousImage());
          } else if (event.which === 27) { // Esc button press
            closeLightbox();
          }
        }
      });

      /**
       * Next image button click.
       */
      $next.click(function (event) {
        event.stopPropagation();
        settings.slideshow = false;
        switchImage(imageCollection.nextImage());
      });

      /**
       * Previous image button click.
       */
      $prev.click(function (event) {
        event.stopPropagation();
        settings.slideshow = false;
        switchImage(imageCollection.previousImage());
      });
      
      /**
      * Play click.
      */
      $play.click(function (event) {
        event.stopPropagation();
        switchPlayback(true);
      });
      
      /**
      * Pause click.
      */
      $pause.click(function (event) {
        event.stopPropagation();
        switchPlayback(false);
      });
      
      /**
      * Download button click.
      */
      $download.click(function (event) {
        event.stopPropagation();
      });

      /**
       * Click on element, that is displayed when no image found.
       */
      $noImageFound.click(switchOrCloseImage);

      /**
       * Click on image.
       */
      $lsbImage.click(switchOrCloseImage);

      /**
       * Click on empty space of lightbox.
       */
      $lsb.click(function (event) {
        switchPlayback(false);
        closeLightbox();
      });

      /**
       * Allow user to click or select image title.
       */
      $lsbTitle.click(function (event) {
        event.stopPropagation();
      });

    })();

    function switchOrCloseImage(event) {
      if (typeof event !== 'undefined') {
        event.stopPropagation();
        // This means user used any of controls, so play button should be disabled.
        switchPlayback(false);
      }

      if (imageCollection.images.length > 1) {
        switchImage(imageCollection.nextImage());
      } else {
        closeLightbox();
      }
    }
    
    /**
    * Switch interface between play and pause.
    * @param play {Boolean} true to turn on slideshow.
    */
    function switchPlayback(play) {
      if (play) {
        settings.slideshow = true;
        $play.hide();
        $pause.show();
        window.setTimeout(playbackGo, settings.playbackTiming);
      } else {
        settings.slideshow = false;
        $play.show();
        $pause.hide();
      }
    }

    /**
     * Shows lightbox.
     */
    function showLightbox() {
      lsbClosed = false;
      $lsbCount.text('');
      $lsb.addClass('lsb-active');
    }
    /**
     * Hides lightbox.
     */
    function closeLightbox() {
      $lsb.removeClass('lsb-active');
      $lsbImage.removeClass('lsb-image-loaded');
      $lsbImage.addClass('lsb-noimage');
      lsbClosed = true;
    }

    function playbackGo() {
      if (settings.slideshow)
        switchOrCloseImage();

      // If lightbox is not closed and playback enabled, set timeout for new slide.
      if (settings.slideshow && !lsbClosed) {
        window.setTimeout(playbackGo, settings.playbackTiming);
      }
    }

    /**
     * Switches image to specific.
     * @param imageObj image to which to switch to reference.
     */
    function switchImage(imageObj) {
      $lsbImage.addClass('lsb-noimage');
      $lsbImage.removeClass('lsb-image-loaded');
      $lsbTitle.addClass('lsb-image-notitle');
      $noImageFound.hide();

      // Use timeout to let the image transition effect play.
      window.setTimeout(function () {
        loadImage(imageObj);
      }, transitionTimeout);
    }


    /**
     * Loads full size image.
     */
    function loadImage(imageObj) {
      $spinner.show();
      // Show current image number.
      if (settings.showImageCount && imageCollection.images.length > 1) {
        $lsbCount.text((imageCollection.current + 1) + '/' + imageCollection.images.length);
      } else {
        $lsbCount.text('');
      }

      //Load image.
      var $img = $('<img />').attr('src', imageObj.href).on('load', function () {
        // Set image.
        $lsbImage.attr('src', $img.attr('src'));
        if (settings.showImageTitle) {
          // Set image title.
          $lsbTitle.text(imageObj.alt);
        }
        // Set download button reference
        $download.attr('href', imageObj.href);
        displayImage();
      }).on('error', function (error) {
        $spinner.hide();
        // Show at least a title, so user can refer it to define a problem.
        $lsbTitle.text(imageObj.alt);
        $noImageFound.show();
        console.log('[LSB Error]:', error);
      });
    }

    /**
     * Shows image when animation has finished.
     */
    function displayImage() {
      $spinner.hide();
      $lsbImage.removeClass('lsb-noimage');
      $lsbImage.addClass('lsb-image-loaded');
      $lsbTitle.removeClass('lsb-image-notitle');
    }
  };

  /** 
   * Plugin to detect swipes
   */
  $.fn.swipeDetector = function (options) {
    // States: 0 - no swipe, 1 - swipe started, 2 - swipe released
    var swipeState = 0;
    // Coordinates when swipe started
    var startX = 0;
    var startY = 0;
    // Distance of swipe
    var pixelOffsetX = 0;
    var pixelOffsetY = 0;
    // Target element which should detect swipes.
    var swipeTarget = this;
    var defaultSettings = {
      // Amount of pixels, when swipe don't count.
      swipeThreshold: 70,
      // Flag that indicates that plugin should react only on touch events.
      // Not on mouse events too.
      useOnlyTouch: true
    };

    // Initializer
    (function init() {
      options = $.extend(defaultSettings, options);
      // Support touch and mouse as well.
      swipeTarget.on('mousedown touchstart', swipeStart);
      $('html').on('mouseup touchend', swipeEnd);
      $('html').on('mousemove touchmove', swiping);
    })();

    function swipeStart(event) {
      if (options.useOnlyTouch && !event.originalEvent.touches)
        return;

      if (event.originalEvent.touches)
        event = event.originalEvent.touches[0];

      if (swipeState === 0) {
        swipeState = 1;
        startX = event.clientX;
        startY = event.clientY;
      }
    }

    function swipeEnd(event) {
      if (swipeState === 2) {
        swipeState = 0;

        if (Math.abs(pixelOffsetX) > Math.abs(pixelOffsetY) &&
          Math.abs(pixelOffsetX) > options.swipeThreshold) { // Horizontal Swipe
          if (pixelOffsetX < 0) {
            swipeTarget.trigger($.Event('swipeLeft.lsb'));
          } else {
            swipeTarget.trigger($.Event('swipeRight.lsb'));
          }
        } else if (Math.abs(pixelOffsetY) > options.swipeThreshold) { // Vertical swipe
          if (pixelOffsetY < 0) {
            swipeTarget.trigger($.Event('swipeUp.lsb'));
          } else {
            swipeTarget.trigger($.Event('swipeDown.lsb'));
          }
        }
      }
    }

    function swiping(event) {
      // If swipe don't occuring, do nothing.
      if (swipeState !== 1)
        return;


      if (event.originalEvent.touches) {
        event = event.originalEvent.touches[0];
      }

      var swipeOffsetX = event.clientX - startX;
      var swipeOffsetY = event.clientY - startY;

      if ((Math.abs(swipeOffsetX) > options.swipeThreshold) ||
        (Math.abs(swipeOffsetY) > options.swipeThreshold)) {
        swipeState = 2;
        pixelOffsetX = swipeOffsetX;
        pixelOffsetY = swipeOffsetY;
      }
    }

    return swipeTarget; // Return element available for chaining.
  }
}(jQuery));
