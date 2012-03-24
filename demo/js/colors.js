(function ($) {
	var MTA = {};

	// Set initial color system to hex
	var $main = $('#main').attr("data-color-system", "hex");

	// Underscore.js template for rendering MTA bullets and hex/panton/cmyk inputs nested inside a container.
	var bullet_template = _.template("\
		<div class='box'> \
			<div class='mta-bullet mta-<%= name.toLowerCase() %>'><%= name %></div> \
			<div class='info'> \
				<input class='hex' readonly='readonly' value='#<%= data.hex %>'/> \
				<input class='pantone' readonly='readonly' value='<%= data.pantone %>'/> \
				<input class='cmyk' readonly='readonly' value='<%= data.cmyk %>'/> \
			</div> \
		</div> \
	");

	// Basic constructor.
	MTA.Line = function (line_item) {
		this.data = line_item;	
	};

	// Add a render method.
	MTA.Line.prototype = {
		render: function () {
			this.html = bullet_template(this);
			return this;
		}
	}

	// Given a JSON array of MTA lines, create an interactive bullet for each.
	MTA.renderLines = function (lines_array) {
		_.each(lines_array, function (line_item) {
			// Only use subway lines, i.e., exclude LIRR and Metro North
			if (line_item.m === 'NYCT Subway') {
				// Extract individual lines (e.g., "D") from bundled lines (e.g., "B/D/F/M").
				_.each(line_item.line.split(/[\/ ]/), function (l) {
					var line = new MTA.Line(line_item);
					line.name = l;
					$main.append(line.render().html);	
				});
			}
		});
	};

	$.getJSON('data/mta-colors.json', function (json) {
		MTA.renderLines(json.data);

		// Auto-select all text in input field when clicked, to make copying easier.
		$('.box input').click(function () {
			this.select();
		});

		// Switch color systems based on <select> box.
		$('#top select').change(function () {
			var val = $(this + ':selected').val();
			$main.attr("data-color-system", val);
		});

	});	
}(window.jQuery));
