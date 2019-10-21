$(document).ready(function() {
	//fixed menu
	if ($(".header").offset().top >= 1) {
		$(".header").addClass("animated");
	}

	$(window).scroll(function() {
		if ($(window).scrollTop() >= 1) {
			$(".header").addClass("animated");
		} else {
			$(".header").removeClass("animated");
		}
	});

	// scroll section
	let scrollLink = $(".menu__item>a");
	scrollLink.click(function(e) {
		e.preventDefault();
		scrollLink.removeClass("active");
		$(this).addClass("active");
		$("body,html").animate(
			{
				scrollTop: $(this.hash).offset().top
			},
			1000
		);
	});

	const slideWrapper = $(".slider");

	function postMessageToPlayer(player, command) {
		if (player == null || command == null) return;
		player.contentWindow.postMessage(JSON.stringify(command), "*");
	}

	// When the slide is changing
	function playPauseVideo(slick, control) {
		let currentSlide, slideType, player;

		currentSlide = slick.find(".slick-current");
		slideType = currentSlide.attr("class").split(" ")[1];
		player = currentSlide.find("iframe").get(0);

		if (slideType === "youtube") {
			switch (control) {
				case "play":
					postMessageToPlayer(player, {
						event: "command",
						func: "mute"
					});
					postMessageToPlayer(player, {
						event: "command",
						func: "playVideo"
					});
					break;
				case "pause":
					postMessageToPlayer(player, {
						event: "command",
						func: "pauseVideo"
					});
					break;
			}
		}
	}

	// DOM Ready
	$(function() {
		// Initialize
		slideWrapper.on("init", function(slick) {
			slick = $(slick.currentTarget);
			setTimeout(function() {
				playPauseVideo(slick, "play");
			}, 1000);
		});
		slideWrapper.on("beforeChange", function(event, slick) {
			slick = $(slick.$slider);
			playPauseVideo(slick, "pause");
		});
		slideWrapper.on("afterChange", function(event, slick) {
			slick = $(slick.$slider);
			playPauseVideo(slick, "play");
		});

		//start the slider
		slideWrapper.slick({
			arrows: true,
			dots: true,
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: 576,
					settings: {
						arrows: false
					}
				}
			]
		});
	});

	// scroll animation
	let motionPath = MorphSVGPlugin.pathDataToBezier("#path", { align: "#Ov" });
	let tl = new TimelineMax({ onUpdate: updatePercentage });
	const controller = new ScrollMagic.Controller();
	TweenLite.set("#Ov", { xPercent: -50, yPercent: -50 });
	tl.to("#Ov", 1, { bezier: { values: motionPath, type: "cubic" } });
	const scene = new ScrollMagic.Scene({
		triggerElement: ".services",
		triggerHook: "onLeave",
		duration: 1600
	})
		.setTween(tl)
		.addTo(controller);

	function updatePercentage() {
		tl.progress();
	}

	// menu
	$(".menu__btn").on("click", function() {
		$(this).toggleClass("active");
		$(".menu").toggleClass("open");
	});

	$(window).resize(function() {
		if ($(window).width() >= 1024) {
			$(".menu").css("display", "flex");
		} else if ($(window).width() <= 1023) {
			$(".menu").css("display", "block");
		}
	});

	$(window).scroll(function() {
		if ($(window).scrollTop() >= 1) {
			$(".menu__btn").removeClass("active");
			$(".menu").removeClass("open");
		}
	});
});
