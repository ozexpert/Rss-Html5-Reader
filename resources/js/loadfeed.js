(function(){
	google.load("feeds", "1");

	$("#feed_container").delegate(".eachfeed", "click", function(){
		$(".feedmain").hide();
		$('#feed_detail').html($(this).find('.detailfeed').html());
		$('#feed_detail_container').show();
	});

	$("#btn_more").on("click", function(e){
		initialize();
	});

	$("#btn_back").on("click", function(e){
		$('#feed_detail_container').hide();
		$(".feedmain").show();
	});

	$("#btn_note").on("click", function(e){
		$(".tg-panel").toggle();
		highlight("yellow");
	});

	$("#btn_insert_note").on("click", function(e){
		if(Modernizr.localstorage){
			/* if localstorage is supported */
			localStorage.setItem($("#feed_detail input[type=hidden]").val(), $("#txt_note").val());
		}
	});

	$("#feed_detail").on("mouseup", function(e){
		var highlighted = '';
		if(window.getSelection){
			highlighted = window.getSelection();
		} else if(document.getSelection){
			highlighted = document.getSelection();
		}

		if(highlighted.toString().length > 0){
			$("#pop_note").css({"top":e.pageY + 20, "left":e.pageX - 20}).fadeIn();
		}
	});

	$("#icon_close").on("click", function(e){
		$(this).closest(".pop").hide();
	});

	/* ------------------------------------------------------------------------
	 * makeEditableAndHighlight, highlight
	 * from:
	 * http://stackoverflow.com/questions/3223682/change-css-of-selected-text-using-javascript
	 * ---------------------------------------------------------------------- */
	function makeEditableAndHighlight(colour) {
	    var range, sel = window.getSelection();
	    if (sel.rangeCount && sel.getRangeAt) {
	        range = sel.getRangeAt(0);
	    }
	    document.designMode = "on";
	    if (range) {
	        sel.removeAllRanges();
	        sel.addRange(range);
	    }
	    // Use HiliteColor since some browsers apply BackColor to the whole block
	    if (!document.execCommand("HiliteColor", false, colour)) {
	        document.execCommand("BackColor", false, colour);
	    }
	    document.designMode = "off";
	}

	function highlight(colour) {
		var range, sel;
		if (window.getSelection) {
			// IE9 and non-IE
			try {
				if (!document.execCommand("BackColor", false, colour)) {
						makeEditableAndHighlight(colour);
				}
			} catch (ex) {
				makeEditableAndHighlight(colour);
			}
		} else if (document.selection && document.selection.createRange) {
			// IE <= 8 case
			range = document.selection.createRange();
			range.execCommand("BackColor", false, colour);
		}
	}

	function appendContent(entry){
		/*
		 * This function will calculate each heights of each column and
		 * append items to the shortest height dom.
		 */
		var min_height = $('#feed_container div.three:first-child').height();
		var selected_column = $('#feed_container div.three:first-child');

		console.log(entry);

		$.each($("#feed_container div.three"), function(i, val){
			var this_height = $(this).height();

			if(this_height < min_height){
				selected_column = $(this);
				min_height = this_height;
			}
		});

		var eachfeed = $("<div class='eachfeed'></div>");
		eachfeed.html(entry.title);
		var detailfeed = $("<div class='detailfeed' style='display: none;'></div>");
		detailfeed.html("<input type='hidden' name='rssguid' value='"+entry.link+"' />");
		detailfeed.append(entry.content);
		var featured_img = detailfeed.find("img:first");
		var cloned_img = featured_img.clone();
		eachfeed.prepend(cloned_img);
		eachfeed.append("<div class='clear'></div>");
		eachfeed.append(detailfeed);

		selected_column.append(eachfeed);
	}

	var totalEntries = 0, prevEntries = 0;

	function initialize(){
		$('.btn_more').toggle();
		totalEntries += 20;

		var feedurl = "http://feeds.feedburner.com/TechCrunch/";
		var feed = new google.feeds.Feed(feedurl);

		feed.includeHistoricalEntries();
		feed.setNumEntries(totalEntries);

		feed.load(function(result) {
			if(!result.error){
				for(var i = prevEntries; i < result.feed.entries.length; i++){
					var entry = result.feed.entries[i];
					appendContent(entry);
				}
				prevEntries = totalEntries;
			}

			$('.btn_more').toggle();
		});
	}
	google.setOnLoadCallback(initialize);
})();
