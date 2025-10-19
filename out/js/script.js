/**
 * Global variables
 */
"use strict";
(function () {
	let
			userAgent = navigator.userAgent.toLowerCase(),
			isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false;

	// Unsupported browsers
	if (isIE !== false && isIE < 12) {
		console.warn("[Core] detected IE" + isIE + ", load alert");
		var script = document.createElement("script");
		script.src = "./js/support.js";
		document.querySelector("head").appendChild(script);
	}

	let
			initialDate = new Date(),

			$document = $(document),
			$window = $(window),
			$html = $("html"),
			$body = $("body"),

			isDesktop = $html.hasClass("desktop"),
			isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
			isRtl = $html.attr("dir") === "rtl",
			windowReady = false,
			isNoviBuilder = false,

			plugins = {
				pointerEvents:           isIE < 11 ? "js/pointer-events.min.js" : false,
				bootstrapTooltip:        $("[data-toggle='tooltip']"),
				bootstrapModalDialog:    $('.modal'),
				bootstrapTabs:           $(".tabs-custom"),
				copyrightYear:           $(".copyright-year"),
				rdNavbar:                $(".rd-navbar"),
				rdMailForm:              $(".rd-mailform"),
				rdInputLabel:            $(".form-label"),
				regula:                  $("[data-constraints]"),
				owl:                     $(".owl-carousel"),
				search:                  $(".rd-search"),
				searchResults:           $('.rd-search-results'),
				statefulButton:          $('.btn-stateful'),
				isotope:                 $('.isotope-wrap'),
				popover:                 $('[data-toggle="popover"]'),
				viewAnimate:             $('.view-animate'),
				lightGallery:            $("[data-lightgallery='group']"),
				lightGalleryItem:        $("[data-lightgallery='item']"),
				lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
				radio:                   $("input[type='radio']"),
				checkbox:                $("input[type='checkbox']"),
				customToggle:            $("[data-custom-toggle]"),
				selectFilter:            $("select"),
				rdAudioPlayer:           $(".rd-audio"),
				vide:                    $(".vide_bg"),
				jPlayerInit:             $(".jp-player-init"),
				customParallax:          $(".custom-parallax"),
				slick:                   $('.slick-slider'),
				countDown:               $(".countdown"),
				calendar:                $(".rd-calendar"),
				bookingCalendar:         $(".booking-calendar"),
				bootstrapDateTimePicker: $("[data-time-picker]"),
				facebookWidget:          $('#fb-root'),
				twitterfeed:             $(".twitter-timeline"),
				rdRange:                 $('.rd-range'),
				stepper:                 $("input[type='number']"),
				customWaypoints:         $('[data-custom-scroll-to]'),
				scroller:                $(".scroll-wrap"),
				captcha:                 $('.recaptcha'),
				materialParallax:        $(".parallax-container"),
				wow:                     $(".wow"),
				textRotator:             $(".text-rotator"),
				particles:               $('#particles-js'),
				maps:                    $(".google-map-container"),
				preloader:               $('.preloader'),
				swiper:                  document.querySelectorAll('.swiper-container'),
				customCarousel:          document.querySelectorAll('.circle-carousel'),
				counter:                 document.querySelectorAll('.counter'),
				progressLinear:          document.querySelectorAll('.progress-linear'),
				progressCircle:          document.querySelectorAll('.progress-circle'),
				countdown:               document.querySelectorAll('.countdown'),
			};

	/**
	 * @desc Check the element was been scrolled into the view
	 * @param {object} elem - jQuery object
	 * @return {boolean}
	 */
	function isScrolledIntoView(elem) {
		if (isNoviBuilder) return true;
		return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
	}

	/**
	 * @desc Calls a function when element has been scrolled into the view
	 * @param {object} element - jQuery object
	 * @param {function} func - init function
	 */
	function lazyInit(element, func) {
		var scrollHandler = function () {
			if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
				func.call();
				element.addClass('lazy-loaded');
			}
		};

		scrollHandler();
		$window.on('scroll', scrollHandler);
	}

	// Initialize scripts that require a loaded window
	$window.on('load', function () {
		// Page loader & Page transition
		if (plugins.preloader.length && !isNoviBuilder) {
			pageTransition({
				target:            document.querySelector('.page'),
				delay:             0,
				duration:          500,
				classIn:           'fadeIn',
				classOut:          'fadeOut',
				classActive:       'animated',
				conditions:        function (event, link) {
					return link && !/(\#|javascript:void\(0\)|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
				},
				onTransitionStart: function (options) {
					setTimeout(function () {
						plugins.preloader.removeClass('loaded');
					}, options.duration * .75);
				},
				onReady:           function () {
					plugins.preloader.addClass('loaded');
					windowReady = true;
				}
			});
		}

		// Counter
		if (plugins.counter) {
			for (let i = 0; i < plugins.counter.length; i++) {
				let
						node = plugins.counter[i],
						counter = aCounter({
							node:     node,
							duration: node.getAttribute('data-duration') || 1000
						}),
						scrollHandler = (function () {
							if (Util.inViewport(this) && !this.classList.contains('animated-first')) {
								this.counter.run();
								this.classList.add('animated-first');
							}
						}).bind(node),
						blurHandler = (function () {
							this.counter.params.to = parseInt(this.textContent, 10);
							this.counter.run();
						}).bind(node);

				if (isNoviBuilder) {
					node.counter.run();
					node.addEventListener('blur', blurHandler);
				} else {
					scrollHandler();
					window.addEventListener('scroll', scrollHandler);
				}
			}
		}

		// Progress Bar
		if (plugins.progressLinear) {
			for (let i = 0; i < plugins.progressLinear.length; i++) {
				let
						container = plugins.progressLinear[i],
						counter = aCounter({
							node:     container.querySelector('.progress-linear-counter'),
							duration: container.getAttribute('data-duration') || 1000,
							onStart:  function () {
								this.custom.bar.style.width = this.params.to + '%';
							}
						});

				counter.custom = {
					container: container,
					bar:       container.querySelector('.progress-linear-bar'),
					onScroll:  (function () {
						if ((Util.inViewport(this.custom.container) && !this.custom.container.classList.contains('animated')) || isNoviBuilder) {
							this.run();
							this.custom.container.classList.add('animated');
						}
					}).bind(counter),
					onBlur:    (function () {
						this.params.to = parseInt(this.params.node.textContent, 10);
						this.run();
					}).bind(counter)
				};

				if (isNoviBuilder) {
					counter.run();
					counter.params.node.addEventListener('blur', counter.custom.onBlur);
				} else {
					counter.custom.onScroll();
					document.addEventListener('scroll', counter.custom.onScroll);
				}
			}
		}

		// Progress Circle
		if (plugins.progressCircle) {
			for (let i = 0; i < plugins.progressCircle.length; i++) {
				let
						container = plugins.progressCircle[i],
						counter = aCounter({
							node:     container.querySelector('.progress-circle-counter'),
							duration: 500,
							onUpdate: function (value) {
								this.custom.bar.render(value * 3.6);
							}
						});

				counter.params.onComplete = counter.params.onUpdate;

				counter.custom = {
					container: container,
					bar:       aProgressCircle({node: container.querySelector('.progress-circle-bar')}),
					onScroll:  (function () {
						if (Util.inViewport(this.custom.container) && !this.custom.container.classList.contains('animated')) {
							this.run();
							this.custom.container.classList.add('animated');
						}
					}).bind(counter),
					onBlur:    (function () {
						this.params.to = parseInt(this.params.node.textContent, 10);
						this.run();
					}).bind(counter)
				};

				if (isNoviBuilder) {
					counter.run();
					counter.params.node.addEventListener('blur', counter.custom.onBlur);
				} else {
					counter.custom.onScroll();
					window.addEventListener('scroll', counter.custom.onScroll);
				}
			}
		}

		// Isotope
		if (plugins.isotope.length) {
			for (let i = 0; i < plugins.isotope.length; i++) {
				let
						wrap = plugins.isotope[i],
						filterHandler = function (event) {
							event.preventDefault();
							for (let n = 0; n < this.isoGroup.filters.length; n++) this.isoGroup.filters[n].classList.remove('active');
							this.classList.add('active');
							this.isoGroup.isotope.arrange({filter: this.getAttribute("data-isotope-filter") !== '*' ? '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]' : '*'});
						},
						resizeHandler = function () {
							this.isoGroup.isotope.layout();
						};

				wrap.isoGroup = {};
				wrap.isoGroup.filters = wrap.querySelectorAll('[data-isotope-filter]');
				wrap.isoGroup.node = wrap.querySelector('.isotope');
				wrap.isoGroup.layout = wrap.isoGroup.node.getAttribute('data-isotope-layout') ? wrap.isoGroup.node.getAttribute('data-isotope-layout') : 'masonry';
				wrap.isoGroup.isotope = new Isotope(wrap.isoGroup.node, {
					itemSelector: '.isotope-item',
					layoutMode:   wrap.isoGroup.layout,
					filter:       '*',
					columnWidth:  (function () {
						if (wrap.isoGroup.node.hasAttribute('data-column-class')) return wrap.isoGroup.node.getAttribute('data-column-class');
						if (wrap.isoGroup.node.hasAttribute('data-column-width')) return parseFloat(wrap.isoGroup.node.getAttribute('data-column-width'));
					}())
				});

				for (let n = 0; n < wrap.isoGroup.filters.length; n++) {
					let filter = wrap.isoGroup.filters[n];
					filter.isoGroup = wrap.isoGroup;
					filter.addEventListener('click', filterHandler);
				}

				window.addEventListener('resize', resizeHandler.bind(wrap));

				if(!isIE) {
					let imgs = document.querySelectorAll('img[loading="lazy"]')
					for(let i = 0; i < imgs.length; i++) {
						let img = imgs[i]
						img.addEventListener('load', function (e) {
							window.dispatchEvent(new Event('resize'));
						})
					}
				}
			}
		}

		// Material Parallax
		if (plugins.materialParallax.length) {
			if (!isNoviBuilder && !isIE && !isMobile) {
				plugins.materialParallax.parallax();
			} else {
				for (let i = 0; i < plugins.materialParallax.length; i++) {
					let $parallax = $(plugins.materialParallax[i]);

					$parallax.addClass('parallax-disabled');
					$parallax.css({"background-image": 'url(' + $parallax.data("parallax-img") + ')'});
				}
			}
		}
	});

	// Initialize scripts that require a finished document
	$(function () {
		isNoviBuilder = window.xMode;

		/**
		 * @desc Insert element after reference element
		 * @param {Node} elem - inserted element
		 * @param {object} refElem - reference element
		 */
		function insertAfter(elem, refElem) {
			return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
		}

		/**
		 * @desc Init custom background circle effect
		 * @param {object} swiper - swiper instance
		 */
		function initCircleBg(swiper) {
			/**
			 * @desc Recalculate svg circle parameters
			 * @param {object} swiper - swiper instance
			 * @return {object} - circle parameters
			 */
			function calcCircle(swiper) {
				var activeSlide = swiper.$wrapperEl[0].children[swiper.activeIndex];
				return {
					centerX: activeSlide.getAttribute('data-circle-cx') ? swiper.width * activeSlide.getAttribute('data-circle-cx') : swiper.width / 2,
					centerY: activeSlide.getAttribute('data-circle-cy') ? swiper.height * activeSlide.getAttribute('data-circle-cy') : swiper.height / 2,
					radius:  activeSlide.getAttribute('data-circle-r') ? swiper.width * activeSlide.getAttribute('data-circle-r') : swiper.height * .4
				};
			}

			// Svg parameters
			swiper.params.svg = {
				fill:      swiper.$el[0].getAttribute('data-circle-fill') || '#f1f1f1',
				easingIn:  'easeOutQuad',
				easingOut: 'easeOutQuad'
			};

			swiper.svg = {};
			swiper.svg.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			swiper.svg.el.setAttribute('class', 'swiper-svg');
			swiper.svg.el.setAttribute('width', '100%');
			swiper.svg.el.setAttribute('height', '100%');
			swiper.svg.el.setAttribute('viewbox', '0 0 ' + swiper.width + ' ' + swiper.height);
			swiper.svg.circle = calcCircle(swiper);
			swiper.svg.el.innerHTML = '<circle fill="' + swiper.params.svg.fill + '"  cx="' + swiper.svg.circle.centerX + '" cy="' + swiper.svg.circle.centerY + '" r="' + swiper.svg.circle.radius + '"/>';
			swiper.$el[0].insertBefore(swiper.svg.el, swiper.$wrapperEl[0]);
			// insertAfter( swiper.svg.el, swiper.$wrapperEl[0] );
			swiper.svg.circleEl = swiper.svg.el.querySelector('circle');

			swiper.on('resize', function () {
				swiper.svg.circle = calcCircle(swiper);
				swiper.svg.circleEl.setAttribute('cx', swiper.svg.circle.centerX);
				swiper.svg.circleEl.setAttribute('cy', swiper.svg.circle.centerY);
				swiper.svg.circleEl.setAttribute('r', swiper.svg.circle.radius);
			});

			swiper.on('slideChangeTransitionStart', function () {
				var swiper = this;
				swiper.svg.circle = calcCircle(swiper);

				var shapeIn = function () {
					return new Promise(function (resolve, reject) {
						anime({
							targets:  swiper.svg.circleEl,
							duration: swiper.params.speed / 4,
							easing:   swiper.params.svg.easingIn,
							cx:       swiper.width / 2,
							cy:       swiper.height / 2,
							r:        swiper.width,
							complete: resolve
						})
					});
				};

				var shapeOut = function () {
					return new Promise(function (resolve, reject) {
						anime({
							targets:  swiper.svg.circleEl,
							duration: swiper.params.speed / 4,
							delay:    swiper.params.speed / 2,
							easing:   swiper.params.svg.easingOut,
							cx:       swiper.svg.circle.centerX,
							cy:       swiper.svg.circle.centerY,
							r:        swiper.svg.circle.radius,
							complete: resolve
						});
					});
				};

				shapeIn().then(shapeOut);
			});
		}

		/**
		 * @desc Init custom serial rectangle frame effect
		 * @param {object} swiper - swiper instance
		 */
		function initFrameRectSerial(swiper) {
			/**
			 * @desc Path recalculation depending on the state
			 * @param {object} swiper - swiper instance
			 * @param {string} [state] - path state
			 * @return {string} - path description for <path> element
			 */
			var calculatePath = function (swiper, state) {
				switch (state) {
					case 'step1':
						return 'M 0,0 0,' + swiper.height + ' ' + swiper.width + ',' + swiper.height + ' ' + swiper.width + ',0 0,0 Z M ' + swiper.frame.size + ',' + swiper.frame.size + ' ' + swiper.width + ',0 ' + swiper.width + ',' + swiper.height + ' 0,' + swiper.height + ' Z';
						break;
					case 'step2':
						return 'M 0,0 0,' + swiper.height + ' ' + swiper.width + ',' + swiper.height + ' ' + swiper.width + ',0 0,0 Z M ' + swiper.frame.size + ',' + swiper.frame.size + ' ' + (swiper.width - swiper.frame.size) + ',' + swiper.frame.size + ' ' + swiper.width + ',' + swiper.height + ' 0,' + swiper.height + ' Z';
						break;
					case 'step3':
						return 'M 0,0 0,' + swiper.height + ' ' + swiper.width + ',' + swiper.height + ' ' + swiper.width + ',0 0,0 Z M ' + swiper.frame.size + ',' + swiper.frame.size + ' ' + (swiper.width - swiper.frame.size) + ',' + swiper.frame.size + ' ' + (swiper.width - swiper.frame.size) + ',' + (swiper.height - swiper.frame.size) + ' 0,' + swiper.height + ' Z';
						break;
					case 'step4':
						return 'M 0,0 0,' + swiper.height + ' ' + swiper.width + ',' + swiper.height + ' ' + swiper.width + ',0 0,0 Z M ' + swiper.frame.size + ',' + swiper.frame.size + ' ' + (swiper.width - swiper.frame.size) + ',' + swiper.frame.size + ' ' + (swiper.width - swiper.frame.size) + ',' + (swiper.height - swiper.frame.size) + ' ' + swiper.frame.size + ',' + (swiper.height - swiper.frame.size) + ' Z';
						break;
					default:
						return 'M 0,0 0,' + swiper.height + ' ' + swiper.width + ',' + swiper.height + ' ' + swiper.width + ',0 0,0 Z M 0,0 ' + swiper.width + ',0 ' + swiper.width + ',' + swiper.height + ' 0,' + swiper.height + ' Z';
						break;
				}
			};

			// Frame parameters
			swiper.params.frame = {
				fill:      swiper.$el[0].getAttribute('data-frame-fill') || '#f1f1f1',
				easingIn:  'easeOutQuad',
				easingOut: 'easeOutQuad'
			};

			swiper.frame = {};
			swiper.frame.size = swiper.width / 12;
			swiper.frame.paths = {
				initial: calculatePath(swiper),
				step1:   calculatePath(swiper, 'step1'),
				step2:   calculatePath(swiper, 'step2'),
				step3:   calculatePath(swiper, 'step3'),
				step4:   calculatePath(swiper, 'step4')
			};
			swiper.frame.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			swiper.frame.el.setAttribute('class', 'swiper-frame');
			swiper.frame.el.setAttribute('width', '100%');
			swiper.frame.el.setAttribute('height', '100%');
			swiper.frame.el.setAttribute('fill-rule', 'evenodd');
			swiper.frame.el.setAttribute('viewbox', '0 0 ' + swiper.width + ' ' + swiper.height);
			swiper.frame.el.innerHTML = '<path fill="' + swiper.params.frame.fill + '" d="' + swiper.frame.paths.initial + '"/>';
			swiper.$el[0].insertBefore(swiper.frame.el, swiper.$wrapperEl[0]);
			swiper.frame.shape = swiper.frame.el.querySelector('path');

			swiper.on('resize', function () {
				this.frame.size = this.width / 12;
				this.frame.paths.initial = calculatePath(this);
				this.frame.paths.step1 = calculatePath(this, 'step1');
				this.frame.paths.step2 = calculatePath(this, 'step2');
				this.frame.paths.step3 = calculatePath(this, 'step3');
				this.frame.paths.step4 = calculatePath(this, 'step4');
				this.frame.el.setAttribute('viewbox', '0 0 ' + this.width + ' ' + this.height);
				this.frame.shape.setAttribute('d', this.animating ? this.frame.paths.final : this.frame.paths.initial);
			});

			swiper.on('slideChangeTransitionStart', function () {
				var swiper = this;

				var shapeIn = function () {
					return new Promise(function (resolve, reject) {
						var duration = swiper.params.speed * .14;

						var shapeTimeline = anime.timeline({
							duration: duration,
							easing:   swiper.params.frame.easingIn
						});

						shapeTimeline
						.add({
							targets: swiper.frame.shape,
							d:       swiper.frame.paths.step1
						})
						.add({
							targets: swiper.frame.shape,
							d:       swiper.frame.paths.step2,
							offset:  '-=' + (duration * .5)
						})
						.add({
							targets: swiper.frame.shape,
							d:       swiper.frame.paths.step3,
							offset:  '-=' + (duration * .5)
						})
						.add({
							targets:  swiper.frame.shape,
							d:        swiper.frame.paths.step4,
							offset:   '-=' + (duration * .5),
							complete: resolve
						});
					});
				};

				var shapeOut = function () {
					return new Promise(function (resolve, reject) {
						var duration = swiper.params.speed * .14;

						var shapeTimeline = anime.timeline({
							duration: duration,
							easing:   swiper.params.frame.easingIn
						});

						shapeTimeline
						.add({
							targets: swiper.frame.shape,
							delay:   swiper.params.speed * .25,
							d:       swiper.frame.paths.step3
						})
						.add({
							targets: swiper.frame.shape,
							d:       swiper.frame.paths.step2,
							offset:  '-=' + (duration * .5)
						})
						.add({
							targets: swiper.frame.shape,
							d:       swiper.frame.paths.step1,
							offset:  '-=' + (duration * .5)
						})
						.add({
							targets:  swiper.frame.shape,
							d:        swiper.frame.paths.initial,
							offset:   '-=' + (duration * .5),
							complete: resolve
						});
					});
				};

				shapeIn().then(shapeOut);
			});
		}

		/**
		 * @desc Init custom trapeze frame effect
		 * @param {object} swiper - swiper instance
		 */
		function initFrameTrapeze(swiper) {
			/**
			 * @desc Path recalculation depending on the state
			 * @param {object} swiper - swiper instance
			 * @param {string} [state] - path state
			 * @return {string} - path description for <path> element
			 */
			var calculatePath = function (swiper, state) {
				switch (state) {
					case 'next':
						return 'M 0,0 0,' + swiper.height + ' ' + swiper.width + ',' + swiper.height + ' ' + swiper.width + ',0 0,0 Z M ' + swiper.frame.size + ',' + swiper.frame.size + ' ' + (swiper.width - swiper.frame.size) + ',' + (swiper.frame.size / 2) + ' ' + (swiper.width - swiper.frame.size) + ',' + (swiper.height - swiper.frame.size / 2) + ' ' + swiper.frame.size + ',' + (swiper.height - swiper.frame.size) + ' Z';
						break;
					case 'prev':
						return 'M 0,0 0,' + swiper.height + ' ' + swiper.width + ',' + swiper.height + ' ' + swiper.width + ',0 0,0 Z M ' + swiper.frame.size + ',' + (swiper.frame.size / 2) + ' ' + (swiper.width - swiper.frame.size) + ',' + swiper.frame.size + ' ' + (swiper.width - swiper.frame.size) + ',' + (swiper.height - swiper.frame.size) + ' ' + swiper.frame.size + ',' + (swiper.height - swiper.frame.size / 2) + ' Z';
						break;
					default:
						return 'M 0,0 0,' + swiper.height + ' ' + swiper.width + ',' + swiper.height + ' ' + swiper.width + ',0 0,0 Z M 0,0 ' + swiper.width + ',0 ' + swiper.width + ',' + swiper.height + ' 0,' + swiper.height + ' Z';
						break;
				}
			};

			var shapeNext = function (swiper) {
				return new Promise(function (resolve, reject) {
					anime({
						targets:  swiper.frame.shape,
						duration: swiper.params.speed / 4,
						easing:   swiper.params.frame.easingIn,
						d:        swiper.frame.paths.next,
						complete: resolve
					})
				});
			};

			var shapePrev = function (swiper) {
				return new Promise(function (resolve, reject) {
					anime({
						targets:  swiper.frame.shape,
						duration: swiper.params.speed / 4,
						easing:   swiper.params.frame.easingIn,
						d:        swiper.frame.paths.prev,
						complete: resolve
					})
				});
			};

			var shapeOut = function (swiper) {
				return function () {
					return new Promise(function (resolve, reject) {
						anime({
							targets:  swiper.frame.shape,
							duration: swiper.params.speed / 4,
							delay:    swiper.params.speed / 2,
							easing:   swiper.params.frame.easingOut,
							d:        swiper.frame.paths.initial,
							complete: resolve
						});
					});
				}
			};

			// Frame parameters
			swiper.params.frame = {
				fill:      swiper.$el[0].getAttribute('data-frame-fill') || '#f1f1f1',
				easingIn:  'easeOutQuint',
				easingOut: 'easeOutQuad'
			};

			swiper.frame = {};
			swiper.frame.size = swiper.width / 12;
			swiper.frame.paths = {
				initial: calculatePath(swiper),
				next:    calculatePath(swiper, 'next'),
				prev:    calculatePath(swiper, 'prev')
			};
			swiper.frame.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			swiper.frame.el.setAttribute('class', 'swiper-frame');
			swiper.frame.el.setAttribute('width', '100%');
			swiper.frame.el.setAttribute('height', '100%');
			swiper.frame.el.setAttribute('fill-rule', 'evenodd');
			swiper.frame.el.setAttribute('viewbox', '0 0 ' + swiper.width + ' ' + swiper.height);
			swiper.frame.el.innerHTML = '<path fill="' + swiper.params.frame.fill + '" d="' + swiper.frame.paths.initial + '"/>';
			swiper.$el[0].insertBefore(swiper.frame.el, swiper.$wrapperEl[0]);
			swiper.frame.shape = swiper.frame.el.querySelector('path');

			swiper.on('resize', function () {
				this.frame.size = this.width / 12;
				this.frame.paths.initial = calculatePath(this);
				this.frame.paths.next = calculatePath(this, 'next');
				this.frame.paths.prev = calculatePath(this, 'prev');
				this.frame.el.setAttribute('viewbox', '0 0 ' + this.width + ' ' + this.height);
				this.frame.shape.setAttribute('d', this.animating ? this.frame.paths.final : this.frame.paths.initial);
			});

			swiper.on('slideNextTransitionStart', function () {
				var swiper = this;
				shapeNext(swiper).then(shapeOut(swiper));
			});

			swiper.on('slidePrevTransitionStart', function () {
				var swiper = this;
				shapePrev(swiper).then(shapeOut(swiper));
			});
		}

		/**
		 * @desc Init custom slash frame effect
		 * @param {object} swiper - swiper instance
		 */
		function initFrameSlash(swiper) {
			/**
			 * @desc Path recalculation depending on the state
			 * @param {object} swiper - swiper instance
			 * @param {string} [state] - path state
			 * @return {string} - path description for <path> element
			 */
			var calculatePath = function (swiper, state) {
				var w = swiper.width, h = swiper.height;
				switch (state) {
					case 'slash':
						var p1 = {
									x: w / 4 - 50,
									y: h / 4 + 50
								},
								p2 = {
									x: w / 4 + 50,
									y: h / 4 - 50
								},
								p3 = {
									x: w - p2.x,
									y: h - p2.y
								},
								p4 = {
									x: w - p1.x,
									y: h - p1.y
								};
						return [
							'M 0,0',
							'0,' + h,
							w + ',' + h,
							w + ',0',
							'0,0 Z',
							'M ' + p1.x + ',' + p1.y,
							p2.x + ',' + p2.y,
							p4.x + ',' + p4.y,
							p3.x + ',' + p3.y + ' Z'
						].join(' ');
						break;
					default:
						return [
							'M 0,0',
							'0,' + h,
							w + ',' + h,
							w + ',0',
							'0,0 Z',
							'M 0,0',
							w + ',0',
							w + ',' + h,
							'0,' + h,
							'0,0 Z'
						].join(' ');
						break;
				}
			};

			// Frame parameters
			swiper.params.frame = {
				fill:      swiper.$el[0].getAttribute('data-frame-fill') || '#f1f1f1',
				easingIn:  'easeOutQuint',
				easingOut: 'easeOutQuad'
			};

			separateCaptions(swiper);
			swiper.frame = {};
			swiper.frame.paths = {
				initial: calculatePath(swiper),
				final:   calculatePath(swiper, 'slash')
			};
			swiper.frame.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			swiper.frame.el.setAttribute('class', 'swiper-frame');
			swiper.frame.el.setAttribute('width', '100%');
			swiper.frame.el.setAttribute('height', '100%');
			swiper.frame.el.setAttribute('fill-rule', 'evenodd');
			swiper.frame.el.setAttribute('viewbox', '0 0 ' + swiper.width + ' ' + swiper.height);
			swiper.frame.el.innerHTML = '<path fill="' + swiper.params.frame.fill + '" d="' + swiper.frame.paths.initial + '"/>';
			swiper.$el[0].insertBefore(swiper.frame.el, swiper.$wrapperEl[0]);
			swiper.frame.shape = swiper.frame.el.querySelector('path');

			swiper.on('resize', function () {
				this.frame.paths.initial = calculatePath(this);
				this.frame.paths.final = calculatePath(this, 'slash');
				this.frame.el.setAttribute('viewbox', '0 0 ' + this.width + ' ' + this.height);
				this.frame.shape.setAttribute('d', this.animating ? this.frame.paths.final : this.frame.paths.initial);
			});

			swiper.on('slideChangeTransitionStart', function () {
				var swiper = this;

				var shapeIn = function () {
					return new Promise(function (resolve, reject) {
						anime({
							targets:  swiper.frame.shape,
							duration: swiper.params.speed / 4,
							easing:   swiper.params.frame.easingIn,
							d:        swiper.frame.paths.final,
							complete: resolve
						})
					});
				};

				var shapeOut = function () {
					return new Promise(function (resolve, reject) {
						anime({
							targets:  swiper.frame.shape,
							duration: swiper.params.speed / 4,
							delay:    swiper.params.speed / 2,
							easing:   swiper.params.frame.easingOut,
							d:        swiper.frame.paths.initial,
							complete: resolve
						});
					});
				};

				shapeIn().then(shapeOut);
			});
		}

		/**
		 * @desc Init custom random frame effect
		 * @param {object} swiper - swiper instance
		 */
		function initFrameRandom(swiper) {
			/**
			 * @desc Returns random frame size considering the size of the slider
			 * @param {object} swiper - swiper instance
			 * @return {number} - frame size
			 */
			var randomSize = function (swiper) {
				return swiper.frame.minSize + swiper.frame.maxSize * Math.random();
			};

			/**
			 * @desc Path recalculation depending on the state
			 * @param {object} swiper - swiper instance
			 * @param {string} [state] - path state
			 * @return {string} - path description for <path> element
			 */
			var calcPath = function (swiper, state) {
				switch (state) {
					case 'random':
						return 'M 0,0 ' + swiper.width + ',0 ' + swiper.width + ',' + swiper.height + ' 0,' + swiper.height + ' Z M ' + randomSize(swiper) + ',' + randomSize(swiper) + ' ' + (swiper.width - randomSize(swiper)) + ',' + randomSize(swiper) + ' ' + (swiper.width - randomSize(swiper)) + ',' + (swiper.height - randomSize(swiper)) + ' ' + randomSize(swiper) + ',' + (swiper.height - randomSize(swiper)) + ' Z';
						break;
					default:
						return 'M 0,0 ' + swiper.width + ',0 ' + swiper.width + ',' + swiper.height + ' 0,' + swiper.height + ' Z M 0,0 ' + swiper.width + ',0 ' + swiper.width + ',' + swiper.height + ' 0,' + swiper.height + ' Z';
						break;
				}
			};

			// Frame parameters
			swiper.params.frame = {
				fill:      swiper.$el[0].getAttribute('data-frame-fill') || '#f1f1f1',
				easingIn:  'easeOutQuint',
				easingOut: 'easeOutQuad'
			};

			swiper.frame = {};
			swiper.frame.maxSize = swiper.width / 15;
			swiper.frame.minSize = swiper.width / 30;
			swiper.frame.paths = {
				initial: calcPath(swiper),
				final:   calcPath(swiper, 'random')
			};
			swiper.frame.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			swiper.frame.el.setAttribute('class', 'swiper-frame');
			swiper.frame.el.setAttribute('width', '100%');
			swiper.frame.el.setAttribute('height', '100%');
			swiper.frame.el.setAttribute('fill-rule', 'evenodd');
			swiper.frame.el.setAttribute('viewbox', '0 0 ' + swiper.width + ' ' + swiper.height);
			swiper.frame.el.innerHTML = '<path fill="' + swiper.params.frame.fill + '" d="' + swiper.frame.paths.initial + '"/>';
			swiper.$el[0].insertBefore(swiper.frame.el, swiper.$wrapperEl[0]);
			swiper.frame.shape = swiper.frame.el.querySelector('path');

			swiper.on('resize', function () {
				this.frame.maxSize = swiper.width / 10;
				this.frame.minSize = swiper.width / 30;
				this.frame.paths.initial = calcPath(this);
				this.frame.paths.final = calcPath(this, 'random');
				this.frame.el.setAttribute('viewbox', '0 0 ' + this.width + ' ' + this.height);
				this.frame.shape.setAttribute('d', this.animating ? this.frame.paths.final : this.frame.paths.initial);
			});

			swiper.on('slideChangeTransitionStart', function () {
				var swiper = this;

				var shapeIn = function () {
					return new Promise(function (resolve, reject) {
						anime({
							targets:  swiper.frame.shape,
							duration: swiper.params.speed / 4,
							easing:   swiper.params.frame.easingIn,
							d:        calcPath(swiper, 'random'),
							complete: resolve
						})
					});
				};

				var shapeOut = function () {
					return new Promise(function (resolve, reject) {
						anime({
							targets:  swiper.frame.shape,
							duration: swiper.params.speed / 4,
							delay:    swiper.params.speed / 2,
							easing:   swiper.params.frame.easingOut,
							d:        swiper.frame.paths.initial,
							complete: resolve
						});
					});
				};

				shapeIn().then(shapeOut);
			});
		}

		/**
		 * @desc Init custom cropping circle effect
		 * @param {object} swiper - swiper instance
		 */
		function initCroppingCircle(swiper) {
			/**
			 * @desc Generates random center coordinates considering the size of the slider and the circle.
			 * @param {object} swiper - swiper instance
			 * @returns {{x: number, y: *}} - random center coordinates
			 */
			var randomCenter = function (swiper) {
				return {
					x: (swiper.width - swiper.frame.radiusReduced * 2) * Math.random(),
					y: (swiper.height - swiper.frame.radiusReduced * 2) * Math.random() + swiper.frame.radiusReduced
				};
			};

			/**
			 * @desc Path recalculation depending on the state.
			 * @param {object} swiper - swiper instance
			 * @param {string} [state] - path state
			 * @return {string} - path description for <path> element
			 */
			var calculatePath = function (swiper, state) {
				var w = swiper.width, h = swiper.height, r, c = randomCenter(swiper);
				switch (state) {
					case 'reduced':
						r = swiper.frame.radiusReduced;
						return [
							'M 0, 0',
							'H ' + w,
							'V ' + h,
							'H 0 Z',

							'M ' + c.x + ', ' + c.y,
							'a ' + r + ',' + r + ' 0 0,0 ' + (r * 2) + ',0',
							'a ' + r + ',' + r + ' 0 0,0 ' + (-r * 2) + ',0 Z'
						].join(' ');
						break;
					default:
						r = swiper.frame.radiusFull;
						return [
							'M 0, 0',
							'H ' + w,
							'V ' + h,
							'H 0 Z',

							'M ' + (w / 2 - r) + ', ' + (h / 2),
							'a ' + r + ',' + r + ' 0 0,0 ' + (r * 2) + ',0',
							'a ' + r + ',' + r + ' 0 0,0 ' + (-r * 2) + ',0 Z'
						].join(' ');
						break;
				}
			};

			/**
			 * @desc Generate dimensions for <image> element to fill slide.
			 * @param {object} swiper - swiper instance
			 * @return {{ width: number, height: number }}
			 */
			var genImgFillSize = function (swiper) {
				var ratio = Math.max(swiper.width / swiper.frame.image.initialBox.width, swiper.height / swiper.frame.image.initialBox.height);
				return {
					width:  swiper.frame.image.initialBox.width * ratio,
					height: swiper.frame.image.initialBox.height * ratio
				};
			};

			/**
			 * @desc Returns initial dimensions of <image> element. It is recommended to specify dimensions in the file name.
			 * @param {object} swiper - swiper instance
			 * @return {object} - initial dimensions
			 */
			var getInitialBox = function (swiper) {
				var initialBox = swiper.params.frame.frameBg.match(/\d+x\d+/g);
				if (initialBox[0]) {
					initialBox = initialBox[0].split('x');
					return {
						width:  initialBox[0],
						height: initialBox[1]
					};
				} else {
					return swiper.frame.image.el.getBBox();
				}
			};

			// Frame parameters
			swiper.params.frame = {
				frameBg:   swiper.$el[0].getAttribute('data-frame-bg'),
				easingIn:  'easeOutQuint',
				easingOut: 'easeInQuad'
			};

			separateCaptions(swiper);
			swiper.frame = {};
			swiper.frame.radiusReduced = swiper.width * .15;
			swiper.frame.radiusFull = Math.sqrt(Math.pow(swiper.width, 2) + Math.pow(swiper.height, 2));
			swiper.frame.paths = {
				initial: calculatePath(swiper),
				final:   calculatePath(swiper, 'reduced')
			};
			swiper.frame.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			swiper.frame.el.setAttribute('class', 'swiper-frame');
			swiper.frame.el.setAttribute('width', '100%');
			swiper.frame.el.setAttribute('height', '100%');
			swiper.frame.el.setAttribute('fill-rule', 'evenodd');
			swiper.frame.el.setAttribute('viewbox', '0 0 ' + swiper.width + ' ' + swiper.height);
			swiper.frame.el.innerHTML = '<defs><clipPath id="shape__clip"><path d="' + swiper.frame.paths.initial + '"/></clipPath></defs><image xlink:href="' + swiper.params.frame.frameBg + '" clip-path="url(#shape__clip)" x="0" y="0"/>';
			swiper.$el[0].insertBefore(swiper.frame.el, swiper.$wrapperEl[0]);
			swiper.frame.shape = swiper.frame.el.querySelector('path');

			swiper.frame.image = {};
			swiper.frame.image.el = swiper.frame.el.querySelector('image');
			swiper.frame.image.initialBox = getInitialBox(swiper);
			swiper.frame.image.box = genImgFillSize(swiper);
			swiper.frame.image.el.setAttribute('width', swiper.frame.image.box.width);
			swiper.frame.image.el.setAttribute('height', swiper.frame.image.box.height);

			swiper.on('resize', function () {
				this.frame.radiusReduced = swiper.width / 8;
				this.frame.radiusFull = Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));

				this.frame.image.box = genImgFillSize(this);
				this.frame.image.el.setAttribute('width', this.frame.image.box.width);
				this.frame.image.el.setAttribute('height', this.frame.image.box.height);

				this.frame.paths.initial = calculatePath(this);
				this.frame.paths.final = calculatePath(this, 'reduced');
				this.frame.el.setAttribute('viewbox', '0 0 ' + this.width + ' ' + this.height);
				this.frame.shape.setAttribute('d', this.animating ? this.frame.paths.final : this.frame.paths.initial);
			});

			swiper.on('slideChangeTransitionStart', function () {
				var swiper = this;

				var shapeIn = function () {
					return new Promise(function (resolve, reject) {
						anime({
							targets:  swiper.frame.shape,
							duration: swiper.params.speed / 3,
							easing:   swiper.params.frame.easingIn,
							d:        calculatePath(swiper, 'reduced'),
							complete: resolve
						})
					});
				};

				var shapeOut = function () {
					return new Promise(function (resolve, reject) {
						anime({
							targets:  swiper.frame.shape,
							duration: swiper.params.speed / 3,
							delay:    swiper.params.speed / 3,
							easing:   swiper.params.frame.easingOut,
							d:        swiper.frame.paths.initial,
							complete: resolve
						});
					});
				};

				shapeIn().then(shapeOut);
			});
		}

		/**
		 * @desc Separate caption elements (.swiper-slide-caption) into other wrapper (.swiper-wrapper). Should only be used with a slide effect.
		 * @param {object} swiper - swiper instance
		 */
		function separateCaptions(swiper) {
			// Add captions contatiner after .swiper-wrapper
			swiper.captWrapperEl = document.createElement('div');
			swiper.captWrapperEl.className = 'swiper-wrapper separated';
			insertAfter(swiper.captWrapperEl, swiper.$wrapperEl[0]);

			// Move all caption to new container
			var captions = swiper.$wrapperEl[0].querySelectorAll('.swiper-slide-caption');
			for (var i = 0; i < captions.length; i++) {
				var caption = captions[i].cloneNode(true),
						captionSlide = document.createElement('div');

				captionSlide.className = 'swiper-slide';
				swiper.captWrapperEl.appendChild(captionSlide);
				captionSlide.appendChild(caption);
				captions[i].remove();
			}

			// Switch slides
			swiper.captWrapperEl.children[swiper.activeIndex].classList.add('active');

			swiper.on('slideChangeTransitionStart', function () {
				swiper.captWrapperEl.children[swiper.activeIndex].classList.add('active');
			});

			swiper.on('slideChangeTransitionEnd', function () {
				swiper.captWrapperEl.children[swiper.realPrevious].classList.remove('active');
			});
		}

		/**
		 * toggleSwiperInnerVideos
		 * @description  toggle swiper videos on active slides
		 */
		function toggleSwiperInnerVideos(swiper) {
			var prevSlide = $(swiper.slides[swiper.previousIndex]),
					nextSlide = $(swiper.slides[swiper.activeIndex]),
					videos,
					videoItems = prevSlide.find("video");

			for (var i = 0; i < videoItems.length; i++) {
				videoItems[i].pause();
			}

			videos = nextSlide.find("video");
			if (!isNoviBuilder && videos.length) {
				videos.get(0).play();
				videos.css({
					'visibility': 'visible',
					'opacity':    '1'
				});
			}
		}

		/**
		 * @desc Sets the actual previous index based on the position of the slide in the markup. Should be the most recent action.
		 * @param {object} swiper - swiper instance
		 */
		function setRealPrevious(swiper) {
			var element = swiper.$wrapperEl[0].children[swiper.activeIndex];
			swiper.realPrevious = Array.prototype.indexOf.call(element.parentNode.children, element);
		}

		/**
		 * @desc Plays required animation preset
		 * @param {object} el - animating DOM node
		 * @param {object} params - extra options
		 * @param {string} params.animation - anime preset name
		 * @param {string} [params.direction] - animation direction
		 * @param {string|array} [params.easing] - animation easing
		 * @param {number} [params.duration] - animation duration
		 * @param {number} [params.delay] - animation delay
		 */
		function bindAnimePreset(el, params) {
			params = params || {};

			var preset = {
				'swiperContentRide':     function () {
					el.animeReset = function () {
						this.style.transform = 'none';
						this.style.opacity = 0;
					};
					el.animeStart = function (direction) {
						anime({
							targets:    el,
							duration:   params.duration || 600,
							delay:      params.delay,
							easing:     params.easing || 'easeOutQuint',
							direction:  params.direction,
							translateY: direction ? 0 : [100, 0],
							translateX: direction
									            ? direction === 'next'
											? [300, 0]
											: [-300, 0]
									            : 0,
							opacity:    [0, 1]
						});
					};
					el.animeOut = function (direction) {
						anime({
							targets:    el,
							duration:   params.duration || 600,
							delay:      params.delay * .3,
							easing:     params.easing || 'easeOutQuint',
							direction:  params.direction,
							translateX: direction
									            ? direction === 'next'
											? [0, -300]
											: [0, 300]
									            : 0,
							opacity:    [1, 0]
						});
					};
				},
				'swiperContentStack':    function () {
					el.animeReset = function () {
						this.style.transform = 'none';
						this.style.opacity = 0;
					};
					el.animeStart = function (direction) {
						anime({
							targets:    el,
							duration:   params.duration || 600,
							delay:      params.delay || 0,
							easing:     params.easing || 'easeOutQuint',
							direction:  params.direction,
							translateY: [300, 0],
							rotate:     [direction === 'prev' ? 25 : -25, 0],
							opacity:    [0, 1]
						});
					};
					el.animeOut = function (direction) {
						anime({
							targets:    el,
							duration:   params.duration || 600,
							delay:      params.delay * .6 || 0,
							easing:     params.easing || 'easeOutQuint',
							direction:  params.direction,
							translateY: [0, -300],
							rotate:     [0, direction === 'prev' ? -15 : 15],
							opacity:    [1, 0]
						});
					};
				},
				'swiperContentDiagonal': function () {
					el.animeReset = function () {
						this.style.transform = 'none';
						this.style.opacity = 0;
					};
					el.animeStart = function (direction) {
						anime({
							targets:    el,
							duration:   params.duration || 600,
							delay:      params.delay || 0,
							easing:     params.easing || 'easeOutQuint',
							direction:  params.direction,
							translateY: [300, 0],
							translateX: [direction === 'next' ? 300 : -300, 0],
							opacity:    [0, 1]
						});
					};
					el.animeOut = function (direction) {
						anime({
							targets:   el,
							duration:  params.duration || 600,
							delay:     params.delay * .6 || 0,
							easing:    params.easing || 'easeOutQuint',
							direction: params.direction,
							opacity:   [1, 0]
						});
					};
				},
				'swiperContentFade':     function () {
					params.easing = params.easing || 'easeOutQuint';
					el.animeReset = function () {
						this.style.transform = 'none';
						this.style.opacity = 0;
					};
					el.animeStart = function (direction) {
						anime({
							targets:    el,
							duration:   params.duration || 600,
							delay:      params.delay,
							easing:     params.easing || 'easeOutQuint',
							direction:  params.direction,
							translateY: direction === 'next'
									            ? [100, 0]
									            : [-100, 0],
							opacity:    [0, 1]
						});
					};
					el.animeOut = function (direction) {
						anime({
							targets:    el,
							duration:   params.duration || 600,
							delay:      params.delay * .6 || 0,
							easing:     params.easing || 'easeOutQuint',
							direction:  params.direction,
							translateY: direction === 'next'
									            ? [0, -100]
									            : [0, 100],
							opacity:    [1, 0]
						});
					};
				},
				'swiperSlideRide':       function () {
					el.animeReset = function () {
						this.style.transform = 'translateX(0) scale(1.2)';
					};
					el.animeStart = function (direction) {
						anime({
							targets:    el,
							duration:   params.duration || 600,
							delay:      params.delay || 0,
							easing:     params.easing || 'easeInOutQuad',
							direction:  params.direction,
							translateX: direction
									            ? direction === 'next'
											? [200, 0]
											: [-200, 0]
									            : 0,
							scale:      {
								value:    1.2,
								duration: 0,
								delay:    0
							}
						});
					};
				},
				'swiperSlideRotate':     function () {
					el.animeReset = function () {
						this.style.transform = 'rotate(0) scale(1.2)';
					};
					el.animeStart = function (direction) {
						el.style.transformOrigin = direction === 'next' ? '0% 50%' : '100% 50%';
						anime({
							targets:    el,
							duration:   params.duration || 600,
							delay:      params.delay || 0,
							easing:     params.easing || 'easeOutElastic',
							direction:  params.direction,
							elasticity: 350,
							rotate:     direction
									            ? direction === 'next'
											? [5, 0]
											: [-5, 0]
									            : 0,
							scale:      direction ? [1.3, 1.1] : 1
						});
					};
				},
				'swiperSlideZoomOut':    function () {
					el.animeReset = function () {
						this.style.transform = 'none';
					};
					el.animeStart = function (direction) {
						anime({
							targets:    el,
							duration:   params.duration || 600,
							delay:      params.delay || 0,
							easing:     params.easing || 'easeInOutQuad',
							direction:  params.direction,
							translateY: direction ? [300, 0] : 0,
							translateX: direction
									            ? direction === 'next'
											? [300, 0]
											: [-300, 0]
									            : 0,
							scale:      direction ? [1.7, 1] : 1,
						});
					};
				},
				'swiperSlideZoomIn':     function () {
					el.animeReset = function () {
						this.style.transform = 'none';
					};
					el.animeStart = function (direction) {
						anime({
							targets:   el,
							duration:  params.duration || 600,
							delay:     params.delay || 0,
							easing:    params.easing || 'easeInQuad',
							direction: params.direction,
							scale:     direction ? [.7, 1.7] : {
								value:    1.7,
								duration: 0
							},
						});
					};
				}
			};

			if (!preset[params.animation]) console.warn('Unknown anime on:', el, 'This will cause further errors.');
			else preset[params.animation]();
		}

		/**
		 * @desc Anime.js animations for swiper events
		 * @param {object} swiper - swiper instance
		 */
		function initSwiperAnime(swiper) {
			// Anime parameters
			swiper.params.anime = {
				animationEvent: 'TransitionStart' // TransitionStart|TransitionEnd
			};

			// Variable "wrappers" required for separated captions
			var wrappers = swiper.$el[0].querySelectorAll('.swiper-wrapper');

			for (var w = 0; w < wrappers.length; w++) {
				var wrapper = wrappers[w];

				// Initialize Anime
				var nodeList = wrapper.querySelectorAll('[data-swiper-anime]');
				for (var i = 0; i < nodeList.length; i++) {
					var el = nodeList[i];
					bindAnimePreset(el, JSON.parse(el.getAttribute('data-swiper-anime')));
				}

				// First play active slide
				nodeList = wrapper.children[swiper.activeIndex].querySelectorAll('[data-swiper-anime]');
				for (var i = 0; i < nodeList.length; i++) if (nodeList[i].animeStart) nodeList[i].animeStart();

				swiper.on('slideNext' + swiper.params.anime.animationEvent, function (wrapper) {
					return function () {
						var nodeList = wrapper.children[swiper.activeIndex].querySelectorAll('[data-swiper-anime]');
						for (var i = 0; i < nodeList.length; i++) if (nodeList[i].animeStart) nodeList[i].animeStart('next');
					};
				}(wrapper));

				swiper.on('slidePrev' + swiper.params.anime.animationEvent, function (wrapper) {
					return function () {
						var nodeList = wrapper.children[swiper.activeIndex].querySelectorAll('[data-swiper-anime]');
						for (var i = 0; i < nodeList.length; i++) if (nodeList[i].animeStart) nodeList[i].animeStart('prev');
					};
				}(wrapper));

				swiper.on('slideNextTransitionStart', function (wrapper) {
					return function () {
						var nodeList;
						if (typeof (swiper.realPrevious) === 'number' && swiper.previousIndex !== swiper.realPrevious) {
							nodeList = wrapper.children[swiper.realPrevious].querySelectorAll('[data-swiper-anime]');
							for (var i = 0; i < nodeList.length; i++) if (nodeList[i].animeOut) nodeList[i].animeOut('next');
						}
						nodeList = wrapper.children[swiper.previousIndex].querySelectorAll('[data-swiper-anime]');
						for (var i = 0; i < nodeList.length; i++) if (nodeList[i].animeOut) nodeList[i].animeOut('next');
					};
				}(wrapper));

				swiper.on('slidePrevTransitionStart', function (wrapper) {
					return function () {
						var nodeList;
						if (typeof (swiper.realPrevious) === 'number' && swiper.previousIndex !== swiper.realPrevious) {
							nodeList = wrapper.children[swiper.realPrevious].querySelectorAll('[data-swiper-anime]');
							for (var i = 0; i < nodeList.length; i++) if (nodeList[i].animeOut) nodeList[i].animeOut('prev');
						}
						nodeList = wrapper.children[swiper.previousIndex].querySelectorAll('[data-swiper-anime]');
						for (var i = 0; i < nodeList.length; i++) if (nodeList[i].animeOut) nodeList[i].animeOut('prev');
					};
				}(wrapper));

				if (swiper.params.anime.animationEvent === 'TransitionEnd') {
					swiper.on('slideChangeTransitionStart', function (wrapper) {
						return function () {
							var nodeList = wrapper.children[swiper.activeIndex].querySelectorAll('[data-swiper-anime]');
							for (var i = 0; i < nodeList.length; i++) if (nodeList[i].animeReset) nodeList[i].animeReset();
						};
					}(wrapper));
				}
			}
		}

		/**
		 * @desc Animate captions on active slides
		 * @param {object} swiper - swiper instance
		 */
		function initCaptionAnimate(swiper) {
			var
					animate = function (caption) {
						return function () {
							var duration;
							if (duration = caption.getAttribute('data-caption-duration')) caption.style.animationDuration = duration + 'ms';
							caption.classList.remove('not-animated');
							caption.classList.add(caption.getAttribute('data-caption-animate'));
							caption.classList.add('animated');
						};
					},
					initializeAnimation = function (captions) {
						for (var i = 0; i < captions.length; i++) {
							var caption = captions[i];
							caption.classList.remove('animated');
							caption.classList.remove(caption.getAttribute('data-caption-animate'));
							caption.classList.add('not-animated');
						}
					},
					finalizeAnimation = function (captions) {
						for (var i = 0; i < captions.length; i++) {
							var caption = captions[i];
							if (caption.getAttribute('data-caption-delay')) {
								setTimeout(animate(caption), Number(caption.getAttribute('data-caption-delay')));
							} else {
								animate(caption)();
							}
						}
					};

			// Caption parameters
			swiper.params.caption = {
				animationEvent: 'slideChangeTransitionEnd'
			};

			initializeAnimation(swiper.$wrapperEl[0].querySelectorAll('[data-caption-animate]'));
			finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));

			if (swiper.params.caption.animationEvent === 'slideChangeTransitionEnd') {
				swiper.on(swiper.params.caption.animationEvent, function () {
					initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
					finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
				});
			} else {
				swiper.on('slideChangeTransitionEnd', function () {
					initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
				});

				swiper.on(swiper.params.caption.animationEvent, function () {
					finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
				});
			}
		}

		/**
		 * makeWaypointScroll
		 * @description  init smooth anchor animations
		 */
		function makeWaypointScroll(obj) {
			var $this = $(obj);
			if (!isNoviBuilder) {
				$this.on('click', function (e) {
					e.preventDefault();
					$("body, html").stop().animate({
						scrollTop: $("#" + $(this).attr('data-custom-scroll-to')).offset().top
					}, 1000, function () {
						$window.trigger("resize");
					});
				});
			}
		}

		/**
		 * initOwlCarousel
		 * @description  Init owl carousel plugin
		 */
		function initOwlCarousel(c) {
			var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
					values = [0, 576, 768, 992, 1200, 1600],
					responsive = {};

			for (var j = 0; j < values.length; j++) {
				responsive[values[j]] = {};
				for (var k = j; k >= -1; k--) {
					if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
						responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
					}
					if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
						responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
					}
					if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
						responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
					}
				}
			}

			// Enable custom pagination
			if (c.attr('data-dots-custom')) {
				c.on("initialized.owl.carousel", function (event) {
					var carousel = $(event.currentTarget),
							customPag = $(carousel.attr("data-dots-custom")),
							active = 0;

					if (carousel.attr('data-active')) {
						active = parseInt(carousel.attr('data-active'), 10);
					}

					carousel.trigger('to.owl.carousel', [active, 300, true]);
					customPag.find("[data-owl-item='" + active + "']").addClass("active");

					customPag.find("[data-owl-item]").on('click', function (e) {
						e.preventDefault();
						carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
					});

					carousel.on("translate.owl.carousel", function (event) {
						customPag.find(".active").removeClass("active");
						customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
					});
				});
			}

			c.on("initialized.owl.carousel", function () {
				initLightGallery($('[data-lightgallery="group-owl"]'), 'lightGallery-in-carousel');
				initLightGalleryItem($('[data-lightgallery="item-owl"]'), 'lightGallery-in-carousel');
			});

			c.owlCarousel({
				autoplay:      isNoviBuilder ? false : c.attr("data-autoplay") === "true",
				loop:          isNoviBuilder ? false : c.attr("data-loop") !== "false",
				items:         1,
				rtl:           isRtl,
				center:        c.attr("data-center") === "true",
				dotsContainer: c.attr("data-pagination-class") || false,
				navContainer:  c.attr("data-navigation-class") || false,
				mouseDrag:     isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
				nav:           c.attr("data-nav") === "true",
				dots:          c.attr("data-dots") === "true",
				dotsEach:      c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
				animateIn:     c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
				animateOut:    c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
				responsive:    responsive,
				navText:       function () {
					try {
						return JSON.parse(c.attr("data-nav-text"));
					} catch (e) {
						return [];
					}
				}(),
				navClass:      function () {
					try {
						return JSON.parse(c.attr("data-nav-class"));
					} catch (e) {
						return ['owl-prev', 'owl-next'];
					}
				}()
			});
		}

		/**
		 * jpFormatePlaylistObj
		 * @description  create playlist object for jPlayer script
		 */
		function jpFormatePlaylistObj(playlistHtml) {
			var playlistObj = [];

			// Format object with audio
			for (var i = 0; i < playlistHtml.length; i++) {
				var playlistItem = playlistHtml[i],
						itemData = $(playlistItem).data();
				playlistObj[i] = {};

				for (var key in itemData) {
					playlistObj[i][key.replace('jp', '').toLowerCase()] = itemData[key];
				}
			}

			return playlistObj;
		}

		/**
		 * initJplayerBase
		 * @description  base Jplayer init obj
		 */
		function initJplayerBase(index, item, mediaObj) {
			return new jPlayerPlaylist({
				jPlayer:             item.getElementsByClassName("jp-jplayer")[0],
				cssSelectorAncestor: ".jp-audio-" + index // Need too bee a selector not HTMLElement or Jq object, so we make it unique
			}, mediaObj, {
				playlistOptions:   {
					enableRemoveControls: false
				},
				supplied:          "ogv, m4v, oga, mp3",
				useStateClassSkin: true,
				volume:            0.4
			});
		}

		/**
		 * Jp Audio player
		 * @description  Custom jPlayer script
		 */
		if (plugins.jPlayerInit.length) {
			$html.addClass('ontouchstart' in window || 'onmsgesturechange' in window ? 'touch' : 'no-touch');

			$.each(plugins.jPlayerInit, function (index, item) {
				var mediaObj = jpFormatePlaylistObj($(item).find('.jp-player-list .jp-player-list-item')),
						playerInstance = initJplayerBase(index, item, mediaObj);


				// Custom playlist for fixed player
				if ($(item).data('jp-player-name')) {
					var customJpPlaylists = $('[data-jp-playlist-relative-to="' + $(item).data('jp-player-name') + '"]'),
							playlistItems = customJpPlaylists.find("[data-jp-playlist-item]");

					// Toggle audio play on custom playlist play button click
					playlistItems.on('click', customJpPlaylists.data('jp-playlist-play-on'), function (e) {
						var mediaObj = jpFormatePlaylistObj(playlistItems),
								$clickedItem = $(e.delegateTarget);

						if (!JSON.stringify(playerInstance.playlist) === JSON.stringify(mediaObj) || !playerInstance.playlist.length) {
							playerInstance.setPlaylist(mediaObj);
						}

						if (!$clickedItem.hasClass('playing')) {
							playerInstance.pause();

							if ($clickedItem.hasClass('last-played')) {
								playerInstance.play();
							} else {
								playerInstance.play(playlistItems.index($clickedItem));
							}

							playlistItems.removeClass('playing last-played');
							$clickedItem.addClass('playing');
						} else {
							playlistItems.removeClass('playing last-played');
							$clickedItem.addClass('last-played');
							playerInstance.pause();
						}

					});


					// Callback for custom playlist
					$(playerInstance.cssSelector.jPlayer).bind($.jPlayer.event.play, function (e) {

						var toggleState = function (elemClass, index) {
							var activeIndex = playlistItems.index(playlistItems.filter(elemClass));

							if (activeIndex !== -1) {
								if (playlistItems.eq(activeIndex + index).length !== 0) {
									playlistItems.eq(activeIndex)
									.removeClass('play-next play-prev playing last-played')
									.end()
									.eq(activeIndex + index)
									.addClass('playing');
								}
							}
						};

						// Check if user select next or prev traack
						toggleState('.play-next', +1);
						toggleState('.play-prev', -1);

						var lastPlayed = playlistItems.filter('.last-played');

						// If user just press pause and than play on same track
						if (lastPlayed.length) {
							lastPlayed.addClass('playing').removeClass('last-played play-next');
						}
					});


					// Add temp marker of last played audio
					$(playerInstance.cssSelector.jPlayer).bind($.jPlayer.event.pause, function (e) {
						playlistItems.filter('.playing').addClass('last-played').removeClass('playing');

						$(playerInstance.cssSelector.cssSelectorAncestor).addClass('jp-state-visible');
					});

					// Add temp marker that user want to play next audio
					$(item).find('.jp-next')
					.on('click', function (e) {
						playlistItems.filter('.playing, .last-played').addClass('play-next');
					});

					// Add temp marker that user want to play prev audio
					$(item).find('.jp-previous')
					.on('click', function (e) {
						playlistItems.filter('.playing, .last-played').addClass('play-prev');
					});
				}
			});
		}

		/**
		 * Owl carousel
		 * @description Enables Owl carousel plugin
		 */
		if (plugins.owl.length) {
			for (var i = 0; i < plugins.owl.length; i++) {
				var c = $(plugins.owl[i]);
				plugins.owl[i].owl = c;

				initOwlCarousel(c);
			}
		}

		/**
		 * Live Search
		 * @description  create live search results
		 */
		function liveSearch(options) {
			$('#' + options.live).removeClass('cleared').html();
			options.current++;
			options.spin.addClass('loading');
			$.get(handler, {
				s:          decodeURI(options.term),
				liveSearch: options.live,
				dataType:   "html",
				liveCount:  options.liveCount,
				filter:     options.filter,
				template:   options.template
			}, function (data) {
				options.processed++;
				var live = $('#' + options.live);
				if ((options.processed === options.current) && !live.hasClass('cleared')) {
					live.find('> #search-results').removeClass('active');
					live.html(data);
					setTimeout(function () {
						live.find('> #search-results').addClass('active');
					}, 50);
				}
				options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
			})
		}

		/**
		 * @desc Attach form validation to elements
		 * @param {object} elements - jQuery object
		 */
		function attachFormValidator(elements) {
			// Custom validator - phone number
			regula.custom({
				name:           'PhoneNumber',
				defaultMessage: 'Invalid phone number format',
				validator:      function () {
					if (this.value === '') return true;
					else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value);
				}
			});

			for (var i = 0; i < elements.length; i++) {
				var o = $(elements[i]), v;
				o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
				v = o.parent().find(".form-validation");
				if (v.is(":last-child")) o.addClass("form-control-last-child");
			}

			elements.on('input change propertychange blur', function (e) {
				var $this = $(this), results;

				if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
				if ($this.parents('.rd-mailform').hasClass('success')) return;

				if ((results = $this.regula('validate')).length) {
					for (i = 0; i < results.length; i++) {
						$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
					}
				} else {
					$this.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}).regula('bind');

			var regularConstraintsMessages = [
				{
					type:       regula.Constraint.Required,
					newMessage: "The text field is required."
				},
				{
					type:       regula.Constraint.Email,
					newMessage: "The email is not a valid email."
				},
				{
					type:       regula.Constraint.Numeric,
					newMessage: "Only numbers are required"
				},
				{
					type:       regula.Constraint.Selected,
					newMessage: "Please choose an option."
				}
			];


			for (var i = 0; i < regularConstraintsMessages.length; i++) {
				var regularConstraint = regularConstraintsMessages[i];

				regula.override({
					constraintType: regularConstraint.type,
					defaultMessage: regularConstraint.newMessage
				});
			}
		}

		/**
		 * @desc Check if all elements pass validation
		 * @param {object} elements - object of items for validation
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function isValidated(elements, captcha) {
			var results, errors = 0;

			if (elements.length) {
				for (var j = 0; j < elements.length; j++) {

					var $input = $(elements[j]);
					if ((results = $input.regula('validate')).length) {
						for (k = 0; k < results.length; k++) {
							errors++;
							$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
						}
					} else {
						$input.siblings(".form-validation").text("").parent().removeClass("has-error")
					}
				}

				if (captcha) {
					if (captcha.length) {
						return validateReCaptcha(captcha) && errors === 0
					}
				}

				return errors === 0;
			}
			return true;
		}

		/**
		 * @desc Validate google reCaptcha
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function validateReCaptcha(captcha) {
			var captchaToken = captcha.find('.g-recaptcha-response').val();

			if (captchaToken.length === 0) {
				captcha
				.siblings('.form-validation')
				.html('Please, prove that you are not robot.')
				.addClass('active');
				captcha
				.closest('.form-wrap')
				.addClass('has-error');

				captcha.on('propertychange', function () {
					var $this = $(this),
							captchaToken = $this.find('.g-recaptcha-response').val();

					if (captchaToken.length > 0) {
						$this
						.closest('.form-wrap')
						.removeClass('has-error');
						$this
						.siblings('.form-validation')
						.removeClass('active')
						.html('');
						$this.off('propertychange');
					}
				});

				return false;
			}

			return true;
		}

		/**
		 * @desc Initialize Google reCaptcha
		 */
		window.onloadCaptchaCallback = function () {
			for (var i = 0; i < plugins.captcha.length; i++) {
				var
						$captcha = $(plugins.captcha[i]),
						resizeHandler = (function () {
							var
									frame = this.querySelector('iframe'),
									inner = this.firstElementChild,
									inner2 = inner.firstElementChild,
									containerRect = null,
									frameRect = null,
									scale = null;

							inner2.style.transform = '';
							inner.style.height = 'auto';
							inner.style.width = 'auto';

							containerRect = this.getBoundingClientRect();
							frameRect = frame.getBoundingClientRect();
							scale = containerRect.width / frameRect.width;

							if (scale < 1) {
								inner2.style.transform = 'scale(' + scale + ')';
								inner.style.height = (frameRect.height * scale) + 'px';
								inner.style.width = (frameRect.width * scale) + 'px';
							}
						}).bind(plugins.captcha[i]);

				grecaptcha.render(
						$captcha.attr('id'),
						{
							sitekey:  $captcha.attr('data-sitekey'),
							size:     $captcha.attr('data-size') ? $captcha.attr('data-size') : 'normal',
							theme:    $captcha.attr('data-theme') ? $captcha.attr('data-theme') : 'light',
							callback: function () {
								$('.recaptcha').trigger('propertychange');
							}
						}
				);

				$captcha.after("<span class='form-validation'></span>");

				if (plugins.captcha[i].hasAttribute('data-auto-size')) {
					resizeHandler();
					window.addEventListener('resize', resizeHandler);
				}
			}
		};

		/**
		 * Init Bootstrap tooltip
		 * @description  calls a function when need to init bootstrap tooltips
		 */
		function initBootstrapTooltip(tooltipPlacement) {
			if (window.innerWidth < 576) {
				plugins.bootstrapTooltip.tooltip('dispose');
				plugins.bootstrapTooltip.tooltip({
					placement: 'bottom'
				});
			} else {
				plugins.bootstrapTooltip.tooltip('dispose');
				plugins.bootstrapTooltip.tooltip({
					placement: tooltipPlacement
				});
			}
		}

		/**
		 * Copyright Year
		 * @description  Evaluates correct copyright year
		 */
		if (plugins.copyrightYear.length) {
			plugins.copyrightYear.text(initialDate.getFullYear());
		}

		// Google maps
		if (plugins.maps.length) {
			lazyInit(plugins.maps, initMaps);
		}

		/**
		 * Is Mac os
		 * @description  add additional class on html if mac os.
		 */
		if (navigator.platform.match(/(Mac)/i)) $html.addClass("mac-os");

		/**
		 * Is Firefox
		 * @description  add additional class on html if mac os.
		 */
		if (isFirefox) $html.addClass("firefox");

		/**
		 * IE Polyfills
		 * @description  Adds some loosing functionality to IE browsers
		 */
		if (isIE) {
			if (isIE < 10) {
				$html.addClass("lt-ie-10");
			}

			if (isIE < 11) {
				if (plugins.pointerEvents) {
					$.getScript(plugins.pointerEvents)
					.done(function () {
						$html.addClass("ie-10");
						PointerEventsPolyfill.initialize({});
					});
				}
			}

			if (isIE === 11) {
				$("html").addClass("ie-11");
			}

			if (isIE === 12) {
				$("html").addClass("ie-edge");
			}
		}

		/**
		 * Bootstrap Tooltips
		 * @description Activate Bootstrap Tooltips
		 */
		if (plugins.bootstrapTooltip.length) {
			var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
			initBootstrapTooltip(tooltipPlacement);
			$(window).on('resize orientationchange', function () {
				initBootstrapTooltip(tooltipPlacement);
			})
		}

		/**
		 * bootstrapModalDialog
		 * @description Stap vioeo in bootstrapModalDialog
		 */
		if (plugins.bootstrapModalDialog.length > 0) {
			var i = 0;

			for (i = 0; i < plugins.bootstrapModalDialog.length; i++) {
				var modalItem = $(plugins.bootstrapModalDialog[i]);

				modalItem.on('hidden.bs.modal', $.proxy(function () {
					var activeModal = $(this),
							rdVideoInside = activeModal.find('video'),
							youTubeVideoInside = activeModal.find('iframe');

					if (rdVideoInside.length) {
						rdVideoInside[0].pause();
					}

					if (youTubeVideoInside.length) {
						var videoUrl = youTubeVideoInside.attr('src');

						youTubeVideoInside
						.attr('src', '')
						.attr('src', videoUrl);
					}
				}, modalItem))
			}
		}

		/**
		 * Radio
		 * @description Add custom styling options for input[type="radio"]
		 */
		if (plugins.radio.length) {
			var i;
			for (i = 0; i < plugins.radio.length; i++) {
				var $this = $(plugins.radio[i]);
				$this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
			}
		}

		/**
		 * Checkbox
		 * @description Add custom styling options for input[type="checkbox"]
		 */
		if (plugins.checkbox.length) {
			var i;
			for (i = 0; i < plugins.checkbox.length; i++) {
				var $this = $(plugins.checkbox[i]);
				$this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
			}
		}

		/**
		 * Popovers
		 * @description Enables Popovers plugin
		 */
		if (plugins.popover.length) {
			if (window.innerWidth < 767) {
				plugins.popover.attr('data-placement', 'bottom');
				plugins.popover.popover();
			} else {
				plugins.popover.popover();
			}
		}

		/**
		 * Bootstrap Buttons
		 * @description  Enable Bootstrap Buttons plugin
		 */
		if (plugins.statefulButton.length) {
			$(plugins.statefulButton).on('click', function () {
				var statefulButtonLoading = $(this).button('loading');

				setTimeout(function () {
					statefulButtonLoading.button('reset')
				}, 2000);
			})
		}

		/**
		 * UI To Top
		 * @description Enables ToTop Button
		 */
		if (isDesktop && !isNoviBuilder) {
			$().UItoTop({
				easingType:     'easeOutQuart',
				containerClass: 'ui-to-top'
			});
		}

		// RD Navbar
		if (plugins.rdNavbar.length) {
			let
					navbar = plugins.rdNavbar,
					aliases = {
						'-':     0,
						'-sm-':  576,
						'-md-':  768,
						'-lg-':  992,
						'-xl-':  1200,
						'-xxl-': 1600
					},
					responsive = {},
					navItems = $('.rd-nav-item');

			for (let i = 0; i < navItems.length; i++) {
				let node = navItems[i];

				if (node.classList.contains('opened')) {
					node.classList.remove('opened')
				}
			}

			for (let alias in aliases) {
				let link = responsive[aliases[alias]] = {};
				if (navbar.attr('data' + alias + 'layout')) link.layout = navbar.attr('data' + alias + 'layout');
				if (navbar.attr('data' + alias + 'device-layout')) link.deviceLayout = navbar.attr('data' + alias + 'device-layout');
				if (navbar.attr('data' + alias + 'hover-on')) link.focusOnHover = navbar.attr('data' + alias + 'hover-on') === 'true';
				if (navbar.attr('data' + alias + 'auto-height')) link.autoHeight = navbar.attr('data' + alias + 'auto-height') === 'true';
				if (navbar.attr('data' + alias + 'stick-up-offset')) link.stickUpOffset = navbar.attr('data' + alias + 'stick-up-offset');
				if (navbar.attr('data' + alias + 'stick-up')) link.stickUp = navbar.attr('data' + alias + 'stick-up') === 'true';
				if (isNoviBuilder) link.stickUp = false;
				else if (navbar.attr('data' + alias + 'stick-up')) link.stickUp = navbar.attr('data' + alias + 'stick-up') === 'true';
			}

			plugins.rdNavbar.RDNavbar({
				anchorNav:    !isNoviBuilder,
				stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
				responsive:   responsive,
				callbacks:    {
					onStuck:        function () {
						let navbarSearch = this.$element.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
						}
					},
					onDropdownOver: function () {
						return !isNoviBuilder;
					},
					onUnstuck:      function () {
						if (this.$clone === null)
							return;

						let navbarSearch = this.$clone.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
							navbarSearch.trigger('blur');
						}

					}
				}
			});

			if (plugins.rdNavbar.attr("data-body-class")) {
				document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
			}
		}

		/**
		 * ViewPort Universal
		 * @description Add class in viewport
		 */
		if (plugins.viewAnimate.length) {
			var i;
			for (i = 0; i < plugins.viewAnimate.length; i++) {
				var $view = $(plugins.viewAnimate[i]).not('.active');
				$document.on("scroll", $.proxy(function () {
					if (isScrolledIntoView(this)) {
						this.addClass("active");
					}
				}, $view))
				.trigger("scroll");
			}
		}

		/**
		 * Swiper
		 * @description  Enable Swiper Slider
		 */
		if (plugins.swiper) {
			for (var i = 0; i < plugins.swiper.length; i++) {
				var
						sliderMarkup = plugins.swiper[i],
						swiper,
						swiperSlide = $(sliderMarkup).find(".swiper-slide"),
						options = {
							loop:                           sliderMarkup.getAttribute('data-loop') === 'true' || false,
							effect:                         isIE ? 'slide' : sliderMarkup.getAttribute('data-effect') || 'fade',
							direction:                      sliderMarkup.getAttribute('data-direction') || 'horizontal',
							speed:                          sliderMarkup.getAttribute('data-speed') ? Number(sliderMarkup.getAttribute('data-speed')) : 1200,
							allowTouchMove:                 false,
							preventIntercationOnTransition: true,
							runCallbacksOnInit:             false,
							separateCaptions:               sliderMarkup.getAttribute('data-separate-captions') === 'true' || false
						};

				for (j = 0; j < swiperSlide.length; j++) {
					var $this = $(swiperSlide[j]),
							url;

					if (url = $this.attr("data-slide-bg")) {
						$this.css({
							"background-image": "url(" + url + ")",
							"background-size":  "cover"
						})
					}
				}

				if (sliderMarkup.getAttribute('data-autoplay')) {
					options.autoplay = {
						delay:                Number(sliderMarkup.getAttribute('data-autoplay')) || 6000,
						stopOnLastSlide:      false,
						disableOnInteraction: true,
						reverseDirection:     false,
					};
				}

				if (sliderMarkup.getAttribute('data-keyboard') === 'true') {
					options.keyboard = {
						enabled:        sliderMarkup.getAttribute('data-keyboard') === 'true',
						onlyInViewport: true
					};
				}

				if (sliderMarkup.getAttribute('data-mousewheel') === 'true') {
					options.mousewheel = {
						releaseOnEdges: true,
						sensitivity:    .1
					};
				}

				if (sliderMarkup.querySelector('.swiper-button-next, .swiper-button-prev')) {
					options.navigation = {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					};
				}

				if (sliderMarkup.querySelector('.swiper-pagination')) {
					options.pagination = {
						el:        '.swiper-pagination',
						type:      'bullets',
						clickable: true
					};
				}

				if (sliderMarkup.querySelector('.swiper-scrollbar')) {
					options.scrollbar = {
						el:        '.swiper-scrollbar',
						hide:      true,
						draggable: true
					};
				}

				options.on = {
					init:            function () {
						setRealPrevious(this);
						switch (options.effect) {
							case 'circle-bg':
								initCircleBg(this);
								break;
							case 'frame-rect-serial':
								initFrameRectSerial(this);
								break;
							case 'frame-trapeze':
								initFrameTrapeze(this);
								break;
							case 'frame-slash':
								initFrameSlash(this);
								break;
							case 'frame-random':
								initFrameRandom(this);
								break;
							case 'cropping-circle':
								initCroppingCircle(this);
								break;
						}
						initSwiperAnime(this);
						initCaptionAnimate(this);
						toggleSwiperInnerVideos(this);

						// Real Previous Index must be set recent
						this.on('slideChangeTransitionEnd', function () {
							setRealPrevious(this);
						});
					},
					transitionStart: function () {
						toggleSwiperInnerVideos(this);
					},
				};

				swiper = new Swiper(plugins.swiper[i], options);
			}
		}

		/**
		 * RD Search
		 * @description Enables search
		 */
		if (plugins.search.length || plugins.searchResults) {
			var handler = "bat/rd-search.php";
			var defaultTemplate = '<h5 class="search-title"><a target="_top" href="#{href}" class="search-link">#{title}</a></h5>' +
					'<p>...#{token}...</p>' +
					'<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
			var defaultFilter = '*.html';

			if (plugins.search.length) {
				for (var i = 0; i < plugins.search.length; i++) {
					var searchItem = $(plugins.search[i]),
							options = {
								element:   searchItem,
								filter:    (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
								template:  (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
								live:      (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
								liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live'), 10) : 4,
								current:   0,
								processed: 0,
								timer:     {}
							};

					var $toggle = $('.rd-navbar-search-toggle');
					if ($toggle.length) {
						$toggle.on('click', (function (searchItem) {
							return function () {
								if (!($(this).hasClass('active'))) {
									searchItem.find('input').val('').trigger('propertychange');
								}
							}
						})(searchItem));
					}

					if (options.live) {
						var clearHandler = false;

						searchItem.find('input').on("keyup input propertychange", $.proxy(function () {
							this.term = this.element.find('input').val().trim();
							this.spin = this.element.find('.input-group-addon');

							clearTimeout(this.timer);

							if (this.term.length > 2) {
								this.timer = setTimeout(liveSearch(this), 200);

								if (clearHandler === false) {
									clearHandler = true;

									$body.on("click", function (e) {
										if ($(e.toElement).parents('.rd-search').length === 0) {
											$('#rd-search-results-live').addClass('cleared').html('');
										}
									})
								}

							} else if (this.term.length === 0) {
								$('#' + this.live).addClass('cleared').html('');
							}
						}, options, this));
					}

					searchItem.submit($.proxy(function () {
						$('<input />').attr('type', 'hidden')
						.attr('name', "filter")
						.attr('value', this.filter)
						.appendTo(this.element);
						return true;
					}, options, this))
				}
			}

			if (plugins.searchResults.length) {
				var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
				var match = regExp.exec(location.search);

				if (match !== null) {
					$.get(handler, {
						s:        decodeURI(match[1]),
						dataType: "html",
						filter:   match[2],
						template: defaultTemplate,
						live:     ''
					}, function (data) {
						plugins.searchResults.html(data);
					})
				}
			}
		}

		/**
		 * WOW
		 * @description Enables Wow animation plugin
		 */
		if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
			new WOW().init();
		}

		/**
		 * Bootstrap tabs
		 * @description Activate Bootstrap Tabs
		 */
		if (plugins.bootstrapTabs.length) {
			var i;
			for (i = 0; i < plugins.bootstrapTabs.length; i++) {
				var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

				//If have owl carousel inside tab - resize owl carousel on click
				if (bootstrapTabsItem.find('.owl-carousel').length) {
					// init first open tab
					var carouselObj = bootstrapTabsItem.find('.tab-content .tab-pane.active .owl-carousel');
					var setTimeOutTime = isNoviBuilder ? 1500 : 300;
					initOwlCarousel(carouselObj);

					//init owl carousel on tab change
					bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
						var $this = $(this);

						setTimeout(function () {
							var carouselObj = $this.find('.tab-content .tab-pane.active .owl-carousel').not('.owl-initialised');

							if (carouselObj.length) {
								for (var j = 0; j < carouselObj.length; j++) {
									var carouselItem = $(carouselObj[j]);
									initOwlCarousel(carouselItem);
									carouselItem.addClass('owl-initialised');
								}
							}
						}, setTimeOutTime);

					}, bootstrapTabsItem));
				}

				//If have slick carousel inside tab - resize slick carousel on click
				if (bootstrapTabsItem.find('.slick-slider').length) {
					bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
						var $this = $(this);
						var setTimeOutTime = isNoviBuilder ? 1500 : 300;

						setTimeout(function () {
							$this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
						}, setTimeOutTime);
					}, bootstrapTabsItem));
				}
			}
		}

		// RD Input Label
		if (plugins.rdInputLabel.length) {
			plugins.rdInputLabel.RDInputLabel();
		}

		// Regula
		if (plugins.regula.length) {
			attachFormValidator(plugins.regula);
		}

		/**
		 * Google ReCaptcha
		 * @description Enables Google ReCaptcha
		 */
		if (plugins.captcha.length) {
			$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
		}

		// RD Mailform
		if (plugins.rdMailForm.length) {
			var i, j, k,
					msg = {
						'MF000': 'Successfully sent!',
						'MF001': 'Recipients are not set!',
						'MF002': 'Form will not work locally!',
						'MF003': 'Please, define email field in your form!',
						'MF004': 'Please, define type of your form!',
						'MF254': 'Something went wrong with PHPMailer!',
						'MF255': 'Aw, snap! Something went wrong.'
					};

			for (i = 0; i < plugins.rdMailForm.length; i++) {
				var $form = $(plugins.rdMailForm[i]),
						formHasCaptcha = false;

				$form.attr('novalidate', 'novalidate').ajaxForm({
					data:         {
						"form-type": $form.attr("data-form-type") || "contact",
						"counter":   i
					},
					beforeSubmit: function (arr, $form, options) {
						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
								inputs = form.find("[data-constraints]"),
								output = $("#" + form.attr("data-form-output")),
								captcha = form.find('.recaptcha'),
								captchaFlag = true;

						output.removeClass("active error success");

						if (isValidated(inputs, captcha)) {

							// veify reCaptcha
							if (captcha.length) {
								var captchaToken = captcha.find('.g-recaptcha-response').val(),
										captchaMsg = {
											'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
											'CPT002': 'Something wrong with google reCaptcha'
										};

								formHasCaptcha = true;

								$.ajax({
									method: "POST",
									url:    "bat/reCaptcha.php",
									data:   {'g-recaptcha-response': captchaToken},
									async:  false
								})
								.done(function (responceCode) {
									if (responceCode !== 'CPT000') {
										if (output.hasClass("snackbars")) {
											output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

											setTimeout(function () {
												output.removeClass("active");
											}, 3500);

											captchaFlag = false;
										} else {
											output.html(captchaMsg[responceCode]);
										}

										output.addClass("active");
									}
								});
							}

							if (!captchaFlag) {
								return false;
							}

							form.addClass('form-in-process');

							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
								output.addClass("active");
							}
						} else {
							return false;
						}
					},
					error:        function (result) {
						if (isNoviBuilder)
							return;

						var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
								form = $(plugins.rdMailForm[this.extraData.counter]);

						output.text(msg[result]);
						form.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}
					},
					success:      function (result) {
						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
								output = $("#" + form.attr("data-form-output")),
								select = form.find('select');

						form
						.addClass('success')
						.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}

						result = result.length === 5 ? result : 'MF255';
						output.text(msg[result]);

						if (result === "MF000") {
							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active success");
							}
						} else {
							if (output.hasClass("snackbars")) {
								output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active error");
							}
						}

						form.clearForm();

						if (select.length) {
							select.select2("val", "");
						}

						form.find('input, textarea').trigger('blur');

						setTimeout(function () {
							output.removeClass("active error success");
							form.removeClass('success');
						}, 3500);
					}
				});
			}
		}

		/**
		 * @desc Initialize the gallery with set of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} addClass - additional gallery class
		 */
		function initLightGallery(itemsToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemsToInit).lightGallery({
					thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
					selector:  "[data-lightgallery='item']",
					autoplay:  $(itemsToInit).attr("data-lg-autoplay") === "true",
					pause:     parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
					addClass:  addClass,
					mode:      $(itemsToInit).attr("data-lg-animation") || "lg-slide",
					loop:      $(itemsToInit).attr("data-lg-loop") !== "false",
					download:  false
				});
			}
		}

		/**
		 * @desc Initialize the gallery with dynamic addition of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} addClass - additional gallery class
		 */
		function initDynamicLightGallery(itemsToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemsToInit).on("click", function () {
					$(itemsToInit).lightGallery({
						thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
						download:  false,
						selector:  "[data-lightgallery='item']",
						autoplay:  $(itemsToInit).attr("data-lg-autoplay") === "true",
						pause:     parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
						addClass:  addClass,
						mode:      $(itemsToInit).attr("data-lg-animation") || "lg-slide",
						loop:      $(itemsToInit).attr("data-lg-loop") !== "false",
						dynamic:   true,
						dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
					});
				});
			}
		}

		/**
		 * @desc Initialize the gallery with one image
		 * @param {object} itemToInit - jQuery object
		 * @param {string} addClass - additional gallery class
		 */
		function initLightGalleryItem(itemToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemToInit).lightGallery({
					selector:            "this",
					addClass:            addClass,
					counter:             false,
					youtubePlayerParams: {
						modestbranding: 1,
						showinfo:       0,
						rel:            0,
						controls:       0
					},
					vimeoPlayerParams:   {
						byline:   0,
						portrait: 0
					}
				});
			}
		}

		/**
		 * @desc Google map function for getting latitude and longitude
		 */
		function getLatLngObject(str, marker, map, callback) {
			var coordinates = {};
			try {
				coordinates = JSON.parse(str);
				callback(new google.maps.LatLng(
						coordinates.lat,
						coordinates.lng
				), marker, map)
			} catch (e) {
				map.geocoder.geocode({'address': str}, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						var latitude = results[0].geometry.location.lat();
						var longitude = results[0].geometry.location.lng();

						callback(new google.maps.LatLng(
								parseFloat(latitude),
								parseFloat(longitude)
						), marker, map)
					}
				})
			}
		}

		/**
		 * @desc Initialize Google maps
		 */
		function initMaps() {
			var key;

			for (var i = 0; i < plugins.maps.length; i++) {
				if (plugins.maps[i].hasAttribute("data-key")) {
					key = plugins.maps[i].getAttribute("data-key");
					break;
				}
			}

			$.getScript('//maps.google.com/maps/api/js?' + (key ? 'key=' + key + '&' : '') + 'sensor=false&libraries=geometry,places&v=quarterly', function () {
				var head = document.getElementsByTagName('head')[0],
						insertBefore = head.insertBefore;

				head.insertBefore = function (newElement, referenceElement) {
					if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
						return;
					}
					insertBefore.call(head, newElement, referenceElement);
				};
				var geocoder = new google.maps.Geocoder;
				for (var i = 0; i < plugins.maps.length; i++) {
					var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom"), 10) || 11;
					var styles = plugins.maps[i].hasAttribute('data-styles') ? JSON.parse(plugins.maps[i].getAttribute("data-styles")) : [];
					var center = plugins.maps[i].getAttribute("data-center") || "New York";

					// Initialize map
					var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
						zoom:        zoom,
						styles:      styles,
						scrollwheel: false,
						center:      {
							lat: 0,
							lng: 0
						}
					});

					// Add map object to map node
					plugins.maps[i].map = map;
					plugins.maps[i].geocoder = geocoder;
					plugins.maps[i].google = google;

					// Get Center coordinates from attribute
					getLatLngObject(center, null, plugins.maps[i], function (location, markerElement, mapElement) {
						mapElement.map.setCenter(location);
					});

					// Add markers from google-map-markers array
					var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");

					if (markerItems.length) {
						var markers = [];
						for (var j = 0; j < markerItems.length; j++) {
							var markerElement = markerItems[j];
							getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function (location, markerElement, mapElement) {
								var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
								var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
								var info = markerElement.getAttribute("data-description") || "";
								var infoWindow = new google.maps.InfoWindow({
									content: info
								});
								markerElement.infoWindow = infoWindow;
								var markerData = {
									position: location,
									map:      mapElement.map
								}
								if (icon) {
									markerData.icon = icon;
								}
								var marker = new google.maps.Marker(markerData);
								markerElement.gmarker = marker;
								markers.push({
									markerElement: markerElement,
									infoWindow:    infoWindow
								});
								marker.isActive = false;
								// Handle infoWindow close click
								google.maps.event.addListener(infoWindow, 'closeclick', (function (markerElement, mapElement) {
									var markerIcon = null;
									markerElement.gmarker.isActive = false;
									markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
									markerElement.gmarker.setIcon(markerIcon);
								}).bind(this, markerElement, mapElement));


								// Set marker active on Click and open infoWindow
								google.maps.event.addListener(marker, 'click', (function (markerElement, mapElement) {
									if (markerElement.infoWindow.getContent().length === 0) return;
									var gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
									for (var k = 0; k < markers.length; k++) {
										var markerIcon;
										if (markers[k].markerElement === markerElement) {
											currentInfoWindow = markers[k].infoWindow;
										}
										gMarker = markers[k].markerElement.gmarker;
										if (gMarker.isActive && markers[k].markerElement !== markerElement) {
											gMarker.isActive = false;
											markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")
											gMarker.setIcon(markerIcon);
											markers[k].infoWindow.close();
										}
									}

									currentMarker.isActive = !currentMarker.isActive;
									if (currentMarker.isActive) {
										if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")) {
											currentMarker.setIcon(markerIcon);
										}

										currentInfoWindow.open(map, marker);
									} else {
										if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")) {
											currentMarker.setIcon(markerIcon);
										}
										currentInfoWindow.close();
									}
								}).bind(this, markerElement, mapElement))
							})
						}
					}
				}
			});
		}

		// lightGallery
		if (plugins.lightGallery.length) {
			for (var i = 0; i < plugins.lightGallery.length; i++) {
				initLightGallery(plugins.lightGallery[i]);
			}
		}

		// lightGallery item
		if (plugins.lightGalleryItem.length) {
			// Filter carousel items
			var notCarouselItems = [];

			for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
				if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length && !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length && !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
					notCarouselItems.push(plugins.lightGalleryItem[z]);
				}
			}

			plugins.lightGalleryItem = notCarouselItems;

			for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
				initLightGalleryItem(plugins.lightGalleryItem[i]);
			}
		}

		// Dynamic lightGallery
		if (plugins.lightDynamicGalleryItem.length) {
			for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
				initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
			}
		}

		/**
		 * Custom Toggles
		 */
		if (plugins.customToggle.length) {
			for (var i = 0; i < plugins.customToggle.length; i++) {
				var $this = $(plugins.customToggle[i]);

				$this.on('click', $.proxy(function (event) {
					event.preventDefault();

					var $ctx = $(this);
					$($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
				}, $this));

				if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
					$body.on("click", $this, function (e) {
						if (e.target !== e.data[0]
								&& $(e.data.attr('data-custom-toggle')).find($(e.target)).length
								&& e.data.find($(e.target)).length === 0) {
							$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
						}
					})
				}

				if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
					$body.on("click", $this, function (e) {
						if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
							$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
						}
					})
				}
			}
		}

		/**
		 * Select2
		 * @description Enables select2 plugin
		 */
		if (plugins.selectFilter.length) {
			var i;
			for (i = 0; i < plugins.selectFilter.length; i++) {
				var select = $(plugins.selectFilter[i]);

				select.select2({
					theme: "bootstrap"
				}).next().addClass(select.attr("class").match(/(input-sm)|(input-lg)|($)/i).toString().replace(new RegExp(",", 'g'), " "));
			}
		}

		/**
		 * RD Audio player
		 * @description Enables RD Audio player plugin
		 */
		if (plugins.rdAudioPlayer.length && !isNoviBuilder) {
			var i;
			for (i = 0; i < plugins.rdAudioPlayer.length; i++) {
				$(plugins.rdAudioPlayer[i]).RDAudio();
			}
		}

		// Slick carousel
		if (plugins.slick.length) {
			for (let i = 0; i < plugins.slick.length; i++) {
				let $slickItem = $(plugins.slick[i]);

				$slickItem.on('init', function (slick) {
					initLightGallery($('[data-lightgallery="group-slick"]'), 'lightGallery-in-carousel');
					initLightGallery($('[data-lightgallery="item-slick"]'), 'lightGallery-in-carousel');
				});

				$slickItem.slick({
					slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll'), 10) || 1,
					asNavFor: $slickItem.attr('data-for') || false,
					dots: $slickItem.attr("data-dots") === "true",
					infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") === "true",
					focusOnSelect: true,
					arrows: $slickItem.attr("data-arrows") === "true",
					swipe: $slickItem.attr("data-swipe") === "true",
					autoplay: isNoviBuilder ? false : $slickItem.attr("data-autoplay") === "true",
					vertical: $slickItem.attr("data-vertical") === "true",
					centerMode: $slickItem.attr("data-center-mode") === "true",
					centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
					mobileFirst: true,
					rtl: isRtl,
					responsive: [
						{
							breakpoint: 0,
							settings: {
								slidesToShow: parseInt($slickItem.attr('data-items'), 10) || 1
							}
						},
						{
							breakpoint: 575,
							settings: {
								slidesToShow: parseInt($slickItem.attr('data-sm-items'), 10) || 1
							}
						},
						{
							breakpoint: 767,
							settings: {
								slidesToShow: parseInt($slickItem.attr('data-md-items'), 10) || 1
							}
						},
						{
							breakpoint: 991,
							settings: {
								slidesToShow: parseInt($slickItem.attr('data-lg-items'), 10) || 1
							}
						},
						{
							breakpoint: 1199,
							settings: {
								slidesToShow: parseInt($slickItem.attr('data-xl-items'), 10) || 1
							}
						}
					]
				})
				.on('afterChange', function (event, slick, currentSlide, nextSlide) {
					let $this = $(this),
							childCarousel = $this.attr('data-child');

					if (childCarousel) {
						$(childCarousel + ' .slick-slide').removeClass('slick-current');
						$(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
					}
				});

			}
		}

		/**
		 * RD Calendar
		 * @description Enables RD Calendar plugin
		 */
		if (plugins.calendar.length) {
			var i;
			for (i = 0; i < plugins.calendar.length; i++) {
				var calendarItem = $(plugins.calendar[i]);

				calendarItem.rdCalendar({
					days:  calendarItem.attr("data-days") ? calendarItem.attr("data-days").split(/\s?,\s?/i) : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
					month: calendarItem.attr("data-months") ? calendarItem.attr("data-months").split(/\s?,\s?/i) : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
				});
			}
		}

		/**
		 * RD Booking Calendar
		 * @description Enables RD Calendar plugin
		 */
		if (plugins.bookingCalendar.length) {
			var i;
			for (i = 0; i < plugins.bookingCalendar.length; i++) {
				var calendarItem = $(plugins.bookingCalendar[i]);

				calendarItem.rdCalendar({
					days:  calendarItem.attr("data-days") ? calendarItem.attr("data-days").split(/\s?,\s?/i) : ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
					month: calendarItem.attr("data-months") ? calendarItem.attr("data-months").split(/\s?,\s?/i) : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
				});

				var temp = $('.rdc-table_has-events');

				for (i = 0; i < temp.length; i++) {
					var $this = $(temp[i]);

					$this.on("click", i, function (event) {
						event.preventDefault();
						event.stopPropagation();

						$(this).toggleClass("opened");

						var tableEvents = $('.rdc-table_events'),
								ch = tableEvents.outerHeight(),
								currentEvent = $(this).children('.rdc-table_events'),
								eventCell = $('#calendarEvent' + event.data),
								animationDuration = 250;

						if ($(this).hasClass("opened")) {

							$(this).parent().after("<tr id='calendarEvent" + event.data + "' style='height: 0'><td colspan='7'></td></tr>");
							currentEvent.clone().appendTo($('#calendarEvent' + event.data + ' td'));
							$('#calendarEvent' + event.data + ' .rdc-table_events').css("height", "0");
							$('#calendarEvent' + event.data + ' .rdc-table_events').animate({height: ch + "px"}, animationDuration);

						} else {
							$('#calendarEvent' + event.data + ' .rdc-table_events').animate({height: "0"}, animationDuration);

							setTimeout(function () {
								eventCell.remove();
							}, animationDuration);

						}
					});
				}
				;

				$(window).on('resize', function () {
					if ($('.rdc-table_has-events').hasClass('active')) {
						var tableEvents = $('.rdc-table_events'),
								ch = tableEvents.outerHeight(),
								tableEventCounter = $('.rdc-table_events-count');
						tableEventCounter.css({
							height: ch + 'px'
						});
					}
				});

				$('input[type="radio"]').on("click", function () {
					if ($(this).attr("value") == "register") {
						$(".register-form").hide();
						$(".login-form").fadeIn('slow');
					}
					if ($(this).attr("value") == "login") {
						$(".register-form").fadeIn('slow');
						$(".login-form").hide();
					}
				});

				$('.rdc-next, .rdc-prev').on("click", function () {
					var temp = $('.rdc-table_has-events');

					for (i = 0; i < temp.length; i++) {
						var $this = $(temp[i]);

						$this.on("click", i, function (event) {
							event.preventDefault();
							event.stopPropagation();

							$(this).toggleClass("opened");

							var tableEvents = $('.rdc-table_events'),
									ch = tableEvents.outerHeight(),
									currentEvent = $(this).children('.rdc-table_events'),
									eventCell = $('#calendarEvent' + event.data),
									animationDuration = 250;

							if ($(this).hasClass("opened")) {

								$(this).parent().after("<tr id='calendarEvent" + event.data + "' style='height: 0'><td colspan='7'></td></tr>");
								currentEvent.clone().appendTo($('#calendarEvent' + event.data + ' td'));
								$('#calendarEvent' + event.data + ' .rdc-table_events').css("height", "0");
								$('#calendarEvent' + event.data + ' .rdc-table_events').animate({height: ch + "px"}, animationDuration);

							} else {
								$('#calendarEvent' + event.data + ' .rdc-table_events').animate({height: "0"}, animationDuration);

								setTimeout(function () {
									eventCell.remove();
								}, animationDuration);

							}
						});
					}
					;

					$(window).on('resize', function () {
						if ($('.rdc-table_has-events').hasClass('active')) {
							var tableEvents = $('.rdc-table_events'),
									ch = tableEvents.outerHeight(),
									tableEventCounter = $('.rdc-table_events-count');
							tableEventCounter.css({
								height: ch + 'px'
							});
						}
					});

					$('input[type="radio"]').on("click", function () {
						if ($(this).attr("value") == "login") {
							$(".register-form").hide();
							$(".login-form").fadeIn('slow');
						}
						if ($(this).attr("value") == "register") {
							$(".register-form").fadeIn('slow');
							$(".login-form").hide();
						}
					});
				});
			}
		}

		/**
		 * Bootstrap Date time picker
		 */
		if (plugins.bootstrapDateTimePicker.length) {
			var i;
			for (i = 0; i < plugins.bootstrapDateTimePicker.length; i++) {
				var $dateTimePicker = $(plugins.bootstrapDateTimePicker[i]);
				var options = {};

				options['format'] = 'dddd DD MMMM YYYY - HH:mm';
				if ($dateTimePicker.attr("data-time-picker") === "date") {
					options['format'] = 'dddd DD MMMM YYYY';
					options['minDate'] = new Date();
				} else if ($dateTimePicker.attr("data-time-picker") === "time") {
					options['format'] = 'HH:mm';
				}

				options["time"] = ($dateTimePicker.attr("data-time-picker") !== "date");
				options["date"] = ($dateTimePicker.attr("data-time-picker") !== "time");
				options["shortTime"] = true;

				$dateTimePicker.bootstrapMaterialDatePicker(options);
			}
		}

		/**
		 * Bootstrap collapse
		 *
		 */
		var bootstrapCollapse = $('.calendar-box-list-view');
		bootstrapCollapse.collapse({
			toggle: false
		});

		$("body").on("click", bootstrapCollapse, function (e) {
			bootstrapCollapse.collapse('hide');
		});

		/**
		 * Facebook widget
		 * @description  Enables official Facebook widget
		 */
		if (plugins.facebookWidget.length) {
			lazyInit(plugins.facebookWidget, function () {
				(function (d, s, id) {
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) return;
					js = d.createElement(s);
					js.id = id;
					js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
			});
		}

		/**
		 * RD Twitter Feed
		 * @description Enables RD Twitter Feed plugin
		 */
		if (plugins.twitterfeed.length) {

			window.twttr = (function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0],
						t = window.twttr || {};
				if (d.getElementById(id)) return t;
				js = d.createElement(s);
				js.id = id;
				js.src = "//platform.twitter.com/widgets.js";
				fjs.parentNode.insertBefore(js, fjs);

				t._e = [];
				t.ready = function (f) {
					t._e.push(f);
				};

				return t;
			}(document, "script", "twitter-timeline"));

		}

		/**
		 * RD Range
		 * @description Enables RD Range plugin
		 */
		if (plugins.rdRange.length && !isNoviBuilder) {
			plugins.rdRange.RDRange({});
		}

		/**
		 * Stepper
		 * @description Enables Stepper Plugin
		 */
		if (plugins.stepper.length) {
			plugins.stepper.stepper({
				labels: {
					up:   "",
					down: ""
				}
			});
		}

		/**
		 * Custom Waypoints
		 */
		if (plugins.customWaypoints.length && !isNoviBuilder) {
			var i;
			for (i = 0; i < plugins.customWaypoints.length; i++) {
				var $this = $(plugins.customWaypoints[i]);
				makeWaypointScroll($this);
			}
		}

		/**
		 *  Vide - v0.5.1
		 *  @description jQuery plugin for video backgrounds
		 */
		if (plugins.vide.length) {
			for (let i = 0; i < plugins.vide.length; i++) {
				let
						$element = $(plugins.vide[i]),
						options = $element.data('vide-options'),
						path = $element.data('vide-bg');

				if (!isMobile) {
					$element.vide(path, options);

					let
							videObj = $element.data('vide').getVideoObject(),
							scrollHandler = (function ($element) {
								if (isScrolledIntoView($element)) this.play();
								else this.pause();
							}).bind(videObj, $element);

					scrollHandler();
					if (isNoviBuilder) videObj.pause();
					else document.addEventListener('scroll', scrollHandler);
				} else {
					$element.css({'background-image': 'url(' + path + '.jpg)'});
				}
			}
		}

		/**
		 * Material Parallax
		 * @description Enables Material Parallax plugin
		 */
		if (plugins.materialParallax.length) {
			if (!isNoviBuilder && !isIE && !isMobile) {
				plugins.materialParallax.parallax();
			} else {
				for (var i = 0; i < plugins.materialParallax.length; i++) {
					var parallax = $(plugins.materialParallax[i]),
							imgPath = parallax.data("parallax-img");

					parallax.css({
						"background-image": 'url(' + imgPath + ')',
						"background-size":  "cover"
					});
				}
			}
		}

		/**
		 * Text Rotator
		 * @description Enables Text Rotator plugin
		 */
		if (plugins.textRotator.length && !isNoviBuilder) {
			var i;
			for (i = 0; i < plugins.textRotator.length; i++) {
				var textRotatorItem = plugins.textRotator[i];
				$(textRotatorItem).rotator();
			}
		}

		/**
		 * canvas animation
		 */
		if (plugins.particles.length) {
			particlesJS("particles-js", {
				"particles":     {
					"number":      {
						"value":   160,
						"density": {
							"enable":     true,
							"value_area": 5000
						}
					},
					"color":       {
						"value": "#ffffff"
					},
					"shape":       {
						"type":    "circle",
						"stroke":  {
							"width": 0,
							"color": "#000000"
						},
						"polygon": {
							"nb_sides": 5
						},
						"image":   {
							"src":    "img/github.svg",
							"width":  100,
							"height": 100
						}
					},
					"opacity":     {
						"value":  0.5,
						"random": false,
						"anim":   {
							"enable":      false,
							"speed":       1,
							"opacity_min": 0.1,
							"sync":        false
						}
					},
					"size":        {
						"value":  20,
						"random": true,
						"anim":   {
							"enable":   false,
							"speed":    100,
							"size_min": 0.1,
							"sync":     false
						}
					},
					"line_linked": {
						"enable":   true,
						"distance": 150,
						"color":    "#ffffff",
						"opacity":  0.4,
						"width":    1
					},
					"move":        {
						"enable":    true,
						"speed":     3,
						"direction": "none",
						"random":    false,
						"straight":  false,
						"out_mode":  "out",
						"bounce":    false,
						"attract":   {
							"enable":  false,
							"rotateX": 600,
							"rotateY": 1200
						}
					}
				},
				"interactivity": {
					"detect_on": "canvas",
					"events":    {
						"onhover": {
							"enable": true,
							"mode":   "grab"
						},
						"onclick": {
							"enable": true,
							"mode":   "push"
						},
						"resize":  true
					},
					"modes":     {
						"grab":    {
							"distance":    140,
							"line_linked": {
								"opacity": 1
							}
						},
						"bubble":  {
							"distance": 400,
							"size":     40,
							"duration": 2,
							"opacity":  8,
							"speed":    3
						},
						"repulse": {
							"distance": 200,
							"duration": 0.4
						},
						"push":    {
							"particles_nb": 4
						},
						"remove":  {
							"particles_nb": 2
						}
					}
				},
				"retina_detect": true
			});
		}

		// Circle carousel
		if (plugins.customCarousel.length) {
			for (var i = 0; i < plugins.customCarousel.length; i++) {
				var carousel = initCarousel({
					node:     plugins.customCarousel[i],
					speed:    plugins.customCarousel[i].getAttribute('data-speed'),
					autoplay: plugins.customCarousel[i].getAttribute('data-autoplay')
				});
			}
		}

		/**
		 * parallax scroll function
		 */
		if ($('[data-parallax-scroll]').length && !isNoviBuilder && !isMobile) {
			ParallaxScroll.init();
		}

		/**
		 * jScrollPane - v2.1.2-rc.1 - 2018-01-18
		 * @description  Enables jquery mousewheel plugin
		 */
		if (plugins.scroller.length) {
			var i;
			for (i = 0; i < plugins.scroller.length; i++) {
				var scrollerItem = $(plugins.scroller[i]);

				scrollerItem.jScrollPane({
					autoReinitialise: true
				});
			}
		}

		// Countdown
		if (plugins.countdown.length) {
			for (var i = 0; i < plugins.countdown.length; i++) {
				var
						node = plugins.countdown[i],
						countdown = aCountdown({
							node:  node,
							from:  node.getAttribute('data-from'),
							to:    node.getAttribute('data-to'),
							count: node.getAttribute('data-count'),
							tick:  100,
						});
			}
		}
	});
}());
