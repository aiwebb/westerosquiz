var questions = {
	social: {
		marriage: "Marriage should be about love, not politics",
		sex:      "There should be no restrictions on consensual sex",
		religion: "We should be tolerant of other people's religious beliefs",
		culture:  "Other cultures have values we might not agree with, and that's okay",
		maesters: "Maesters are honorable, trustworthy, and worthy of respect"
	},

	crown: {
		weakness: "The weak are not the responsibility of the mighty",
		nobility: "Authority comes from blood right, not popular support",
		power:    "Stability comes from centralized authority, not a balance of powers",
		enemies:  "Defeated enemies should be dealt with harshly",
		honor:    "Honor is less important than winning"
	}
}

window.Grid = function(config) {
	this.config = config
	this.initialize()
	return this
}

Grid.prototype.initialize = function() {
	this.canvas = new fabric.Canvas('canvas')

	var cx = this.config.centerX
	var cy = this.config.centerY
	var w  = this.config.width
	var h  = this.config.height

	var gridOptions = {stroke: 'black', fill: 'transparent', selectable: false, hoverCursor: 'default'}

	// Gridlines
	gridOptions.strokeWidth = 0.2

	for (var i = 0; i < 10; i++) {
		this.canvas.add(new fabric.Line([
			cx + (w  * i / 20) - (w  / 2), cy - (h * i / 20),
			cx + (w  * i / 20),            cy - (h * i / 20) + (h / 2)
		], gridOptions))
	}

	for (i = 0; i < 10; i++) {
		this.canvas.add(new fabric.Line([
			cx + (w  * i / 20) - (w  / 2), cy + (h * i / 20),
			cx + (w  * i / 20),            cy + (h * i / 20) - (h / 2)
		], gridOptions))
	}

	// Outline
	gridOptions.strokeWidth = 2

	this.canvas.add(new fabric.Polyline([
		{x: cx - (w / 2), y: cy          },
		{x: cx,           y: cy - (h / 2)},
		{x: cx + (w / 2), y: cy          },
		{x: cx,           y: cy + (h / 2)},
		{x: cx - (w / 2), y: cy          }
	], gridOptions))

	// Grid section separations
	gridOptions.strokeWidth = 1.5

	this.canvas.add(new fabric.Polyline([
		{x: cx - (w * 0.15), y: cy - (h * 0.15)},
		{x: cx + (w * 0.15), y: cy - (h * 0.15)},
		{x: cx + (w * 0.15), y: cy + (h * 0.15)},
		{x: cx - (w * 0.15), y: cy + (h * 0.15)},
		{x: cx - (w * 0.15), y: cy - (h * 0.15)}
	], gridOptions))

	this.canvas.add(new fabric.Line([cx - (w * 0.25), cy - (h * 0.25), cx - (w * 0.15), cy - (h * 0.15)], gridOptions))
	this.canvas.add(new fabric.Line([cx + (w * 0.25), cy - (h * 0.25), cx + (w * 0.15), cy - (h * 0.15)], gridOptions))
	this.canvas.add(new fabric.Line([cx - (w * 0.25), cy + (h * 0.25), cx - (w * 0.15), cy + (h * 0.15)], gridOptions))
	this.canvas.add(new fabric.Line([cx + (w * 0.25), cy + (h * 0.25), cx + (w * 0.15), cy + (h * 0.15)], gridOptions))

	// Axis labels
	var labelOptions = {
		originX: 'center',
		originY: 'center',
		textAlign: 'center',
		fill: '#6f9028',
		stroke: 'transparent',
		fontFamily: 'Helvetica',
		fontSize: 11,
		fontWeight: 'bold',
		lineHeight: 1,
		selectable: false,
		hoverCursor: 'pointer'
	}

	this.canvas.add(new fabric.Text('SOCIAL LIBERTY', Object.assign(labelOptions, {
		left: cx - (w / 4) - 10, top: cy + (w / 4) + 10, angle: 45
	})))

	this.canvas.add(new fabric.Text('CROWN AUTHORITY', Object.assign(labelOptions, {
		left: cx + (w / 4) + 10, top: cy + (w / 4) + 10, angle: -45
	})))

	// Section labels
	labelOptions.fill  = '#25354C'
	labelOptions.angle = 0

	this.canvas.add(new fabric.Text('POPULIST',     Object.assign(labelOptions, {left: cx - (w / 4) - 15, top: cy})))
	this.canvas.add(new fabric.Text('TYRANT',       Object.assign(labelOptions, {left: cx + (w / 4) + 15, top: cy})))
	this.canvas.add(new fabric.Text('REGRESSIVIST', Object.assign(labelOptions, {left: cx, top: cy + (h / 4) + 15})))
	this.canvas.add(new fabric.Text('VISIONARY',    Object.assign(labelOptions, {left: cx, top: cy - (h / 4) - 15})))
	this.canvas.add(new fabric.Text('CENTRIST',     Object.assign(labelOptions, {left: cx, top: cy})))

	// 0 / 100 labels
	this.canvas.add(new fabric.Text('0',   Object.assign(labelOptions, {left: cx, top: cy + (h / 2) + 10})))
	this.canvas.add(new fabric.Text('100', Object.assign(labelOptions, {left: cx - (w / 2) - 12, top: cy + 1})))
	this.canvas.add(new fabric.Text('100', Object.assign(labelOptions, {left: cx + (w / 2) + 12, top: cy + 1})))
}

Grid.prototype.addRecord = function(record) {
	// Calculate social/crown scores
	record.social = record.crown = 0

	for (var key in record.beliefs.social) {
		record.social += record.beliefs.social[key][0]
	}

	for (var key in record.beliefs.crown) {
		record.crown += record.beliefs.crown[key][0]
	}

	// Get point location
	var dx = this.config.width  / 20
	var dy = this.config.height / 20

	var x = this.config.centerX                            - (record.social * dx) + (record.crown * dx)
	var y = this.config.centerY + (this.config.height / 2) - (record.social * dy) - (record.crown * dy)

	// Draw marker
	var marker = new fabric.Circle({
		left: x,
		top: y,
		originX: 'center',
		originY: 'center',
		radius: 5,
		strokeWidth: 0.5,
		fill: '#f00',
		stroke: '#000',
		opacity: 0.25,
		selectable: false,
		hoverCursor: 'pointer',
		isUser: !!record.isUser
	})

	// Draw name
	var label = new fabric.Text(record.name, {
		left: x + (record.nameLeft || 0),
		top: record.nameBelow ? y + 6 + (record.nameTop || 0) : y - 6 + (record.nameTop || 0),
		originX: 'center',
		originY: record.nameBelow ? 'top' : 'bottom',
		textAlign: 'center',
		fill: '#f00',
		stroke: 'transparent',
		fontFamily: 'Helvetica',
		fontSize: 14,
		opacity: 0.25,
		lineHeight: 1,
		selectable: false,
		hoverCursor: 'pointer',
		isUser: !!record.isUser
	})

	if (record.isUser) {
		_(grid.canvas.getObjects()).filter({isUser: true}).each(o => o.remove())

		// marker.setFill('green')
		// label.setFill('green')
		label.setFontWeight('bold')
		marker.setOpacity(1)
		label.setOpacity(1)
	}

	this.canvas.add(marker)
	this.canvas.add(label)

	// Set opacity on hover
	marker.on('mouseover', () => {select(marker, label, record)})
	label .on('mouseover', () => {select(marker, label, record)})

	function select(marker, label, record) {
		if (record.isUser) {return}

		_(grid.canvas.getObjects()).filter({isUser: false}).each(o => o.setOpacity(0.25))

		marker.setOpacity(1)
		label .setOpacity(1)
		grid.canvas.renderAll()
		grid.showRationale(record)
	}
}

Grid.prototype.showRationale = function(record) {
	if (record.isUser) {return}

	$('#rationale').empty().append(
		$('<h4>').text(record.name),
		$('<ul>')
	)

	var badges = [
		'<span class="label label-danger" >DISAGREE</span>',
		'<span class="label label-primary">NEUTRAL</span>',
		'<span class="label label-success">AGREE</span>'
	]

	_.each(record.beliefs, (list, category) => {
		_.each(list, (belief, key) => {
			$('#rationale ul').append(
				$('<li>').append(
					$('<span>').addClass('rationale-question').text(key),
					$(badges[belief[0]]).addClass('rationale-answer'),
					$('<span>').addClass('rationale-answer-text').text(belief[1])
				)
			)
		})
	})
}

Grid.prototype.clearRationale = function() {
	$('#rationale').empty()
}

let grid = new Grid({
	centerX: 180,
	centerY: 170,
	width:   300,
	height:  300
})

$.get('./data.json').then(data => {
	_.each(data, record => {
		grid.addRecord(record)
	})
})

$('#submit').on('click', () => {
	var results = _.map($('.question'), q => {
		return {
			category: $(q).data('category'),
			key:      $(q).data('key'),
			answer:   $(q).find('input:checked').val() * 1
		}
	})

	var beliefs = {
		social: _(results).filter(r => r.category == 'social')
			.map(o => [o.key, [o.answer]])
			.fromPairs()
			.value(),
		crown: _(results).filter(r => r.category == 'crown')
			.map(o => [o.key, [o.answer]])
			.fromPairs()
			.value()
	}

	grid.addRecord({
		name: 'You',
		isUser: true,
		beliefs: beliefs
	})

	window.scrollTo(0, 0)
})

_.each(questions, (list, category) => {
	var $list = $('.questions.' + category)

	_.each(list, (q, key) => {
		$list.append(
			$('<div>').addClass('question').data('key', key).data('category', category).append(
				$('<span>').addClass('options').append(
					$('<label>').addClass('radio-inline').append(
						$('<input>').attr('type', 'radio').attr('name', key).attr('value', 2), $('<i>').addClass('fa fa-thumbs-o-up')
					),
					$('<label>').addClass('radio-inline').append(
						$('<input>').attr('type', 'radio').attr('name', key).attr('value', 1).attr('checked', true), $('<i>').addClass('fa fa-meh-o')
					),
					$('<label>').addClass('radio-inline').append(
						$('<input>').attr('type', 'radio').attr('name', key).attr('value', 0), $('<i>').addClass('fa fa-thumbs-o-down')
					)
				),
				$('<span>').addClass('question-text').text(q)
			)
		)
	})
})

$('.info-button').on('click', () => {
	bootbox.dialog({
		title: "Westeros's Smallest Political Quiz",
		message: `
			<p>This is inspired by the <i><a href="https://www.theadvocates.org/quiz/quiz.php" target="advocates">World's Smallest Political Quiz</a></i>.</p>

			<p>There are probably quite a few ways to think about politics in Westeros, but the one explored here is a two-axis system taking into account views on social liberty and crown authority. This gives us four main camps: tyrants, populists, regressivists, and visionaries.</p>

			<p><b>Tyrants</b> suppress social liberty and desire large amounts of power for themselves.</p>

			<p><b>Populists</b> promote social liberty and are more comfortable with the idea of a republic.</p>

			<p><b>Regressivists</b> seek to yank society back into a time when it was every man for himself.</p>

			<p><b>Visionaries</b> have a strong, unique, positive vision for the future and try to single-handedly reshape the world - through force, if necessary - into a better place.</p>

			<p>I've come up with ten questions that relate (to varying degrees) to issues of social liberty and crown authority, and provided the answers to those questions from the perspective of several major ASOIAF characters as a way to test them out. You can hover over any name in the graph for their answers and the rationale for them.</p>

			<p>Lastly, you can answer the questions yourself to see how your own views stack up in the world of Westerosi politics.</p>
		`
	})
})

if (!window.localStorage.getItem('hasVisited')) {
	window.localStorage.setItem('hasVisited', 1)
	$('.info-button').click()
}