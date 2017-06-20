
		//Enable sidebar toggle
		$(".menu_panel_button").click(function () {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active')
				$('.left_panel').animate({
					right: -300
				}, 500);
				$(".right_panel").animate({
					"margin-right": "0px"
				}, 500);
			} else {
				$(this).addClass('active')
				//Else, enable content streching
				$('.left_panel').animate({
					right: 0
				}, 500);
				$(".right_panel").animate({
					"margin-right": "-240px"
				}, 500);
			}
			return false;
		});
	
