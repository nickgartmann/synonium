// Put your application scripts here
$(function(){

	function search() {
		$.ajax("/synonym/" + $("ul.inputs li").map(function(idx,el){return $(el).text()}).toArray().join("+"),{
			success: function(synonyms) {
				$("ul.synonyms li").remove();
				$.each(synonyms, function(idx, it) {
					var synonymElement = $("<li title=\"Add to inputs\">" + it + "</li>");
					synonymElement.on("click", function(e) {
						addInput($(this).text());
						search();
					});
					$("ul.synonyms").append(synonymElement);
				});
			}
		});
	}

	function addInput(input) {
		var synonymElement = $("<li title=\"Delete\">" + input + "</li>");
		synonymElement.on("click", function(e) {
			$(this).remove();
			search();
			hideOrShowHR();
		});

		$("ul.inputs").append(synonymElement);
		$("input").val("");
	}

	function hideOrShowHR() {
		if($("ul.inputs").length > 0) {
			$("hr").show();
		} else {
			$("hr").hide();
		}
	}

	$("form").on("submit", function(e) {
		e.preventDefault();
		if($("input").val().length <= 0) {
			return null;
		}

		addInput($("input").val());

		hideOrShowHR();
		
		search();
		
		return false;
	});
});
