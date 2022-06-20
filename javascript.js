"use strict";
var gamingData = gaming;

function barGraph (options) {
	var devide = options.devide,
    	dataMax = options.max,
      graphData = gamingData[options.dataset],
      xAxisData = options.xAxisData,
      yAxisData = options.yAxisData,
      yAxisDataTwo = options.yAxisDataTwo,
      yAxisDataThree = options.yAxisDataThree,
      factor = options.factor,
      yAxisName = options.yAxisName,
    	width = 1000,
    	height = 600;



	// maak een schaal voor de breedte
	var xScale = d3.scale.ordinal()
		.domain(graphData.map(function(d) { return d[xAxisData]; }))
		.rangeRoundBands([0, width], .2);

	// maak een schaal voor de kleur
	var yScale = d3.scale.linear()
		.domain([0, d3.max(graphData, function(d){
      if (factor===true) {
        return d[yAxisDataTwo]/d[yAxisData];
      } else {
        return d[dataMax];
      }
    })])
		.range([ height,0]);

	var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")

	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")
			.tickFormat(function(d) { return d +" "+yAxisName; });

	// selecteer lege svg en maak vaste hoogtes en breetes
	var svg = d3.select("#graph").append("svg")
			.attr("width", width)
			.attr("height", height)

		svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.selectAll("text")
			        .style("text-anchor", "end")
		            .attr("dx", "-.8em")
		            .attr("dy", ".15em")
		            .attr("transform", "rotate(-65)" );

		svg.append("g")
				.attr("class", "y axis")
				.call(yAxis);

		svg.selectAll("text")
				.attr("fill","white" );

var bars = svg.selectAll(".bar")
		.data(graphData)
			.enter();
		bars.append("rect")
				.attr("class", "bar hours")
				.attr("fill", "#146b9d")
        .attr("x", function(d) { return xScale(d[xAxisData]) })
        .attr("width",xScale.rangeBand()/devide)
        .attr("y", function(d) {
          if (factor==true) {
            return yScale(d[yAxisDataTwo]/d[yAxisData]);
          } else {
            return yScale(d[yAxisData]);
          }
        })
        .attr("height", function(d) {
          if (factor==true) {
            return height - yScale(d[yAxisDataTwo]/d[yAxisData]);
          } else {
            return height - yScale(d[yAxisData]);
          }
        });
		if (devide>1) {
			bars.append("rect")
				//.data(gamingData.gametime)
					//.enter().append("rect")
					.attr("class", '"bar '+yAxisDataTwo+'"')
					.attr("fill", "#fc9701")
					.attr("x", function(d) {return xScale(d[xAxisData])+xScale.rangeBand()/devide})
					.attr("width",xScale.rangeBand()/devide)
          .attr("y", function(d) {
            if (factor==true) {
              return yScale(d[yAxisDataThree]/d[yAxisData]);
            } else {
              return yScale(d[yAxisDataTwo]);
            }
          })
          .attr("height", function(d) {
            if (factor==true) {
              return height - yScale(d[yAxisDataThree]/d[yAxisData]);
            } else {
              return height - yScale(d[yAxisDataTwo]);
            }
          });
		}
    if (devide>2) {
      bars.append("rect")
        //.data(gamingData.gametime)
          //.enter().append("rect")
          .attr("class", '"bar '+yAxisDataThree+'"')
          .attr("fill", "#143568")
          .attr("x", function(d) {return xScale(d[xAxisData])+xScale.rangeBand()/devide*2})
          .attr("width",xScale.rangeBand()/devide)
          .attr("y", function(d) { return yScale(d[yAxisDataThree]); })
          .attr("height", function(d) { return height - yScale(d[yAxisDataThree]); });
    }



	// Animatie greensock
	var tlBar = new TimelineMax();
		tlBar.staggerFrom('#graph rect', 0.5, { scaleY:0,transformOrigin:"50% 100%"}, 0.1,"start");
		tlBar.staggerFrom('#graph text', 0.5, { opacity:0 }, 0.1, "start");
}

function horBar () {

	var margin = {top: 0, right: 0, bottom: 0, left: 0},
			width = 250,
			height = 400,
      gameTimeData=gamingData.gametime;

  gameTimeData.sort(function(a,b){ return d3.ascending(a.hours,b.hours); })

	var xScale = d3.scale.linear()
			.domain([0, d3.max(gameTimeData, function(d){return d.hours})])
			.range([0, width])


	var yScale = d3.scale.ordinal()
			.domain(gameTimeData.map(function(d) { return d.name; }))
			.rangeRoundBands([height, 0], .2);

	var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("top")
      .ticks(5)
			.tickFormat(function(d) { return d + "h"; });

	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")


	var svg = d3.select("#gametimegraph").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			//.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.selectAll(".bar")
				.data(gameTimeData)
			.enter().append("rect")
				.attr("class", "bar")
				.attr("fill", "#146b9d")
				.attr("width", function(d) { return xScale(d.hours); })
				.attr("y", function(d) { return yScale(d.name); })
				.attr("height", yScale.rangeBand());

		svg.append("g")
				.attr("class", "x axis")
				.attr("fill", "#9B9B9B")
				//.attr("transform", "translate(-20," + height + ")")
				.call(xAxis);

		svg.append("g")
				.attr("class", "y axis")
				.attr("fill", "#9B9B9B")
				.call(yAxis);

		svg.selectAll(".y text")
			.attr("transform", "translate(250,0 )")
			.attr("fill", "#ffffff");

		var tlHorBar = new TimelineMax();
		tlHorBar.staggerFrom('#gametimegraph rect', 0.5, { scaleX:0 }, 0.1, 'label')
		tlHorBar.staggerFrom('#gametimegraph text', 0.5, { opacity:0 }, 0.1, 'label');

}

var graphName = document.getElementById("graphname"),
		quote = document.getElementById("quote"),
		//button = document.getElementById("button"),
    buttons = document.getElementsByClassName("button"),
		barChartChoice="factorgoalsvswins";


for (var i = buttons.length - 1; i >= 0; i--) {
  buttons[i].addEventListener('click', function(i) {
    createBarChart(i.currentTarget.dataset.value);
    i.currentTarget.classList.add("selected");
  })
  // function
};

// button.onclick = function () {
// 	createBarChart();
// };

function createBarChart (choice) {
	var options,
      barChartChoice=choice;
	d3.select("#graph svg")
					 .remove();
  $("#tooltip").remove();
	if (barChartChoice=="speeltijd2weken") {
		options = {
			devide:1,
			max:"hours",
      dataset:"gametime",
      xAxisData:"name",
      yAxisData:"hours",
      factor:false
		};
		barGraph(options);
		graphName.innerHTML="Speeltijd afgelopen 2 weken";
		//quote.classList.remove("disabled");
		//button.innerHTML ="vs totale speeltijd";
	} else if (barChartChoice=="speeltijdvstotaal"){
		options = {
			devide:2,
			max:"total",
      dataset:"gametime",
      xAxisData:"name",
      yAxisData:"hours",
      yAxisDataTwo:"total",
      factor:false
		};
		barGraph(options);
		graphName.innerHTML="Speeltijd vs totale speeltijd";
		//quote.classList.add("disabled");
		//button.innerHTML ="speeltijd 2 weken";
	} else if (barChartChoice=="matchesvsgoalsvswins"){
    options = {
      devide:3,
      max:"goals",
      dataset:"rocket_league",
      xAxisData:"date",
      yAxisData:"matches",
      yAxisDataTwo:"goals",
      yAxisDataThree:"wins",
      yAxisName:"",
      factor:false
    }
  barGraph(options);
  graphName.innerHTML="Matches, goals and wins";
  } else if (barChartChoice=="totalmatches"){
    options = {
      devide:1,
      max:"matches",
      dataset:"rocket_league",
      xAxisData:"date",
      yAxisData:"matches",
      yAxisName:"",
      factor:false
    }
  barGraph(options);
  graphName.innerHTML="Matches Played";
  } else if (barChartChoice=="factorgoalsvswins"){
    options = {
      devide:2,
      max:"goals",
      dataset:"rocket_league",
      xAxisData:"date",
      yAxisData:"matches",
      yAxisDataTwo:"goals",
      yAxisDataThree:"wins",
      yAxisName:"/ match",
      factor:true
    };
  barGraph(options);
  graphName.innerHTML="Average goals and wins per match";
  } else if (barChartChoice=="goalspermatch"){
    options = {
      devide:1,
      max:"goals",
      dataset:"rocket_league",
      xAxisData:"date",
      yAxisData:"matches",
      yAxisDataTwo:"goals",
      yAxisName:"/ match",
      factor:true
    };
  barGraph(options);
  graphName.innerHTML="Average goals per match";
  } else if (barChartChoice=="winspermatch"){
    options = {
      devide:1,
      max:"goals",
      dataset:"rocket_league",
      xAxisData:"date",
      yAxisData:"matches",
      yAxisDataTwo:"wins",
      yAxisName:"/ match",
      factor:true
    };    
  barGraph(options);
  graphName.innerHTML="Average wins per match";
  } else if (barChartChoice=="winsandmvppermatch"){
    options = {
      devide:2,
      max:"goals",
      dataset:"rocket_league",
      xAxisData:"date",
      yAxisData:"matches",
      yAxisDataTwo:"wins",
      yAxisDataThree:"mvps",
      yAxisName:"/ match",
      factor:true
    };    
  barGraph(options);
  graphName.innerHTML="Average wins and mvp per match";
  } else if (barChartChoice=="assistsandgoalspermatch"){
    options = {
      devide:2,
      max:"goals",
      dataset:"rocket_league",
      xAxisData:"date",
      yAxisData:"matches",
      yAxisDataTwo:"assist",
      yAxisDataThree:"goals",
      yAxisName:"/ match",
      factor:true
    };    
  barGraph(options);
  graphName.innerHTML="Average assists and goals per match";
  } else if (barChartChoice=="assistspermatch"){
    options = {
      devide:1,
      max:"goals",
      dataset:"rocket_league",
      xAxisData:"date",
      yAxisData:"matches",
      yAxisDataTwo:"assist",
      yAxisName:"/ match",
      factor:true
    };    
  barGraph(options);
  graphName.innerHTML="Average Assists per match";
  } else if (barChartChoice=="assistsandsavespermatch"){
    options = {
      devide:2,
      max:"goals",
      dataset:"rocket_league",
      xAxisData:"date",
      yAxisData:"matches",
      yAxisDataTwo:"assist",
      yAxisDataThree:"saves",
      yAxisName:"/ match",
      factor:true
    };    
  barGraph(options);
  graphName.innerHTML="Average assists and saves per match";
  } else if (barChartChoice=="linechart") {
    createLineChart(false);
    graphName.innerHTML="Matches,wins, goals and mvp";
  } else if (barChartChoice=="factorlinechart") {
    createLineChart(true);
    options={factorlinechart:true};
    graphName.innerHTML="Average wins, goals, mvp per match vs total matches played";
  } else {
    console.log("error: no chart")
  }
  createBarLegend(options);
  for (var i = buttons.length - 1; i >= 0; i--) {
    buttons[i].classList.remove("selected");
  };

	var tl = new TimelineMax();
	tl.from(graphName, 1, { scale:0, transformOrigin:'50% 50%' })

}



function createBarLegend (options) {
  var firstBar=document.getElementById("firstBar"),
      secondBar=document.getElementById("secondBar"),
      thirdBar=document.getElementById("thirdBar");
  firstBar.classList.remove("legendbox");
  secondBar.classList.remove("legendbox");
  thirdBar.classList.remove("legendbox");
  firstBar.innerHTML="";
  secondBar.innerHTML="";
  thirdBar.innerHTML="";
  firstBar.style.backgroundColor="#146b9d";  
  if (options!=undefined) {
    hideLegend();
    if (typeof options.factorlinechart != "undefined") {
      firstBar.innerHTML="Total matches played";
      firstBar.classList.add("legendbox");
      firstBar.style.backgroundColor="#000000";
    } else if (options.factor===true) {
      firstBar.innerHTML=options.yAxisDataTwo
      if (options.yAxisDataThree) {
      secondBar.innerHTML=options.yAxisDataThree};
      //thirdBar.innerHTML=
    } else {
      firstBar.innerHTML=options.yAxisData
      if (options.yAxisDataTwo) {
      secondBar.innerHTML=options.yAxisDataTwo};
      if (options.yAxisDataThree) {
      thirdBar.innerHTML=options.yAxisDataThree};
    }
    firstBar.classList.add("legendbox");
    if (options.devide>1) {
      secondBar.classList.add("legendbox");
    };
    if (options.devide>2) {
      thirdBar.classList.add("legendbox");
    };
  };
}

horBar();
createBarChart("factorlinechart");
buttons[0].classList.add("selected");

function hideLegend() {
  var _legend = document.querySelector('#legend');
  _legend.classList.add("hide");

  //$('#legend').attr("style","opacity:0");
  // var _hideTimeline = new TimelineMax();
  // console.log('no');

  // _hideTimeline.to(_legend, 0.4,{
  //     scale: 0,
  //     opacity: 0,
  //     transformOrigin: '50% 100%',
  //     ease: Power1.easeIn
  // });
}

function createLineChart(factor){
  var factor = factor;
  d3.select("#graph svg")
           .remove();
  lineChart(factor);
}

function lineChart(factor){
    var factor=factor;
    // Define width and height of the svg
    //var maxValue = 24;
    var margin = { top: 20, right: 30, bottom: 160, left: 50};
    var width = 960;
    var height = 500;
    //var translate = { x : 93, y : 9 };

    // Handles chart, set chart and animate chart
    function ChartHandler(id) {

      var _this = this;
      var _chartId = id;
      var _xScale;
      var _yScale;
      var _yScale2;
      var _xAxis;
       var _xScale2;
      var _yAxis;
      var _yAxis2;
      var _chart;

      function createScale() {

        // set xScale map from input domain to output range (used if x axis is text instead of numbers)
        _xScale = d3.scale.ordinal().rangeRoundBands([0, width], 1);
        _xScale2 = d3.scale.ordinal().rangeRoundBands([0, width], 0.2);

        // set yScale
        _yScale = d3.scale.linear().range([height, 0]);

                // set yScale2
        _yScale2= d3.scale.linear().range([height, 0]);

      }

      function createAxis() {

        // Set x and y axis begin bottom and left
        _xAxis = d3.svg.axis()
            .scale(_xScale)
            .orient('bottom');

        _yAxis = d3.svg.axis()
            .scale(_yScale)
            .orient('left');

        _yAxis2 = d3.svg.axis()
            .scale(_yScale2)
            .orient('left');
      }

      function createChart() {
          // Create chart append width and height
          // Add extra group to position (fix-position)
        _chart = d3.select(_chartId)
                .append('svg')
                .attr('class',"linechart" )
                .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('class', 'fix-position')
          //.attr('transform', 'translate(' + translate.x + ', ' + translate.y + ')');

      }

      function initChart() {

        // D3 get JSON
        // d3.json(dataUrl, function(error, data){
        // Private vars
          var _data = gamingData.rocket_league;

          // Set domain
        _yScale.domain([0, d3.max(_data,
          function(d){
            if (factor===true) {
              return d.goals/d.matches;
            } else {
              return d.matches;
            }
          })
        ]);
        if (factor==true) {
          _yScale2.domain([0, d3.max(_data,
            function(d){ return d.matches;})
          ]);
        };
        _xScale.domain(_data.map(function(d){ return d.date }));
        _xScale2.domain(_data.map(function(d){ return d.date }));

        // Create tooltip and place a div in the body with visibility not shown
        var tooltip = d3.select('body')
          .append('div')
          .attr('id', 'tooltip')
          .style('position', 'absolute')
          .style('z-index', '10')
          .style('visibility', 'hidden');
        if (factor==true) {
          var bar = _chart.selectAll(".bar")
      		.data(_data)
      			.enter();
      		bar.append("rect")
      				.attr("class", "bar totalmatches")
      				.attr("fill", "#000000")
              .attr("x", function(d) { return (_xScale(d.date)-_xScale2.rangeBand()/2) })
              .attr("width",_xScale2.rangeBand())
              .attr("y", function(d) {
                  return _yScale2(d.matches);
              })
              .attr("height", function(d) {
                  return height - _yScale2(d.matches);
              });
        };
        // Create line-1 set interpolate to linear (for none curved lines or cardinal to make curved lines)
        if (factor===false) {
          var line = d3.svg.line()
              .interpolate('linear')
              .x(function(d) { return _xScale(d.date); })
              .y(function(d) { return _yScale(d.matches); });

          // Draw line and attr data-item and class for a filter function
          // Call line(_data) function to drawn line with the data
          _chart.append('g')
          .attr('class', 'line-1')
          .attr('data-item', 'line-1')
          .append('path')
          .attr('d', line(_data))
          .attr('class', 'line')
          .attr('stroke', '#6cc489')
          .attr('stroke-width', 2)
          .attr('fill', 'none');

          // Position lines and attr data-item for filter
          // Return position for cx and cy (x and y coordinates of the center of the line)

          _chart.selectAll('line-1')
              .data(_data)
              .enter()
              .append('circle')
              .attr('data-item', 'line-1')
              .attr('data-number', _data.matches)
              .attr({
                  cx: function (d) { return _xScale(d.date);},
                  cy: function (d) { return _yScale(d.matches); },
                  r: 4,
                  class: 'line-1-cirkel'
              })
              // Create mouseover for tooltip (event.pageX or Y gives position of mouse coordinates)
              .on('mouseover', function(d) {

                d3.select('#tooltip')
                  .style('visibility', 'visible')
                  .style('left', (d3.event.pageX + 20) + 'px')
                      .style('top', (d3.event.pageY - 30) + 'px')
                      .text(d.matches + ' matches');

              })
            .on('mouseout', function() {
              return tooltip.style('visibility', 'hidden');
            });
        }
          // Line 2 3 and 4 are a straight copy of one only data is changed
          var line2 = d3.svg.line()
              .interpolate('linear')
              .x(function(d) { return _xScale(d.date); })
              .y(function(d) {
                if(factor==true){
                  return _yScale(d.wins/d.matches);
                } else {
                  return _yScale(d.wins);
                }
              });

        _chart.append('g')
          .attr('class', 'line-2')
          .attr('data-item', 'line-2')
          .append('path')
            .attr('d', line2(_data))
            .attr('class', 'line')
            .attr('stroke', '#5ca9da')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        _chart.selectAll('line-2-cirkel')
            .data(_data)
            .enter()
            .append('circle')
            .attr('data-item', 'line-2')
            .attr('data-number', _data.wins)
            .attr({
                cx: function (d) { return _xScale(d.date);},
                cy: function (d) { if(factor==true){
                  return _yScale(d.wins/d.matches);
                } else {
                  return _yScale(d.wins);
                }},
                r: 4,
                class: 'line-2-cirkel'
            })
            .on('mouseover', function(d) {

              d3.select('#tooltip')
                .style('visibility', 'visible')
                .style('left', (d3.event.pageX + 20) + 'px')
                    .style('top', (d3.event.pageY - 30) + 'px')
                    .text(d.wins + ' wins');

            })
          .on('mouseout', function() {
            return tooltip.style('visibility', 'hidden');
          });

        var line3 = d3.svg.line()
              .interpolate('linear')
              .x(function(d) { return _xScale(d.date); })
              .y(function(d) { if(factor==true){
                  return _yScale(d.goals/d.matches);
                } else {
                  return _yScale(d.goals);
                } });

        _chart.append('g')
          .attr('class', 'line-3')
          .attr('data-item', 'line-3')
          .append('path')
            .attr('d', line3(_data))
            .attr('class', 'line')
            .attr('stroke', '#e26066')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        _chart.selectAll('line-3')
            .data(_data)
            .enter()
            .append('circle')
            .attr('data-item', 'line-3')
            .attr('data-number', _data.goals)
            .attr({
                cx: function (d) { return _xScale(d.date);},
                cy: function (d) { if(factor==true){
                  return _yScale(d.goals/d.matches);
                } else {
                  return _yScale(d.goals);
                }},
                r: 4,
                class: 'line-3-cirkel'
            })
            .on('mouseover', function(d) {

              d3.select('#tooltip')
                .style('visibility', 'visible')
                .style('left', (d3.event.pageX + 20) + 'px')
                    .style('top', (d3.event.pageY - 30) + 'px')
                    .text(d.goals + ' goals');

            })
          .on('mouseout', function() {
            return tooltip.style('visibility', 'hidden');
          });

        var line4 = d3.svg.line()
              .interpolate('linear')
              .x(function(d) { return _xScale(d.date); })
              .y(function(d) { if(factor==true){
                  return _yScale(d.mvps/d.matches);
                } else {
                  return _yScale(d.mvps);
                } });

        _chart.append('g')
          .attr('class', 'line-4')
          .attr('data-item', 'line-4') 
          .append('path')
            .attr('d', line4(_data))
            .attr('class', 'line')
            .attr('stroke', '#fc9701')
            .attr('stroke-width', 2)
            .attr('fill', 'none');  

        _chart.selectAll('line-4')
            .data(_data)
            .enter()
            .append('circle')
            .attr('data-item', 'line-4')
            .attr('data-number', function (d) { return d.mvps; })
            .attr({
                cx: function (d) { return _xScale(d.date);},
                cy: function (d) { if(factor==true){
                  return _yScale(d.mvps/d.matches);
                } else {
                  return _yScale(d.mvps);
                }},
                r: 4,
                class: 'line-4-cirkel'
            })
            .on('mouseover', function(d) {

              d3.select('#tooltip')
                .style('visibility', 'visible')
                .style('left', (d3.event.pageX + 20) + 'px')
                    .style('top', (d3.event.pageY - 30) + 'px')
                    .text(d.mvps + ' Most Valuable Player');

            })
          .on('mouseout', function() {
            return tooltip.style('visibility', 'hidden');
          });

        // Create and set line chart
          // Set anchor to begin at the starting point of the line
          _chart.append('g')
                  .attr('transform', 'translate('+ 0+ ',' + (height) + ')')
                  .attr('class', 'x axis')
                  .call(_xAxis)
                  .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-15px')
                .attr('transform', 'rotate(-65)');

              _chart.append('g')
                  //.attr('transform', 'translate(' + (margin.left - translate.x + 22 ) + ', 0)')
                  .attr('class', 'y axis')
                  .call(_yAxis);
                if (factor==true) {
                  _chart.append('g')
                    //.attr('transform', 'translate(' + (margin.left - translate.x + 22 ) + ', 0)')
                    .attr('class', 'y2 axis')
                    .attr('fill', "#000000")
                    .call(_yAxis2);
                };
                _chart.selectAll('circle')
                  .data(_data)
                  .enter()
                  .append('div');
             // Create axis text
                _chart.append('text')
            .attr('text-anchor', 'end')
            .attr('dx','450px')
            .attr('dy', '580px')
            .attr('transform', 'rotate(0)')
            .text('date');
            if (factor==true) {
              _chart.append('text')
              .attr('class', 'black')
              .attr('text-anchor', 'end')
              .attr('dx','0px')
              .attr('dy', '-45px')
              .attr('transform', 'rotate(-30)')
              .text('number')
              .attr("fill", "#000000");
              _chart.append('text')
              .attr('text-anchor', 'end')
              .attr('dx','60px')
              .attr('dy', '-10px')
              .attr('transform', 'rotate(-30)')
              .text('average');              
            };




          initChartAnimation();

        ;

      }

      function initLegend() {

        var _element = document.querySelector('#legend');
        var _buttons = [].slice.call(_element.querySelectorAll('li'));
        var _items = [].slice.call(document.querySelectorAll('[data-item]'));
        var _self = this;
        var _current = document.querySelector('.active');

        _buttons.forEach(function(button){

          var _attr = button.getAttribute('data-line');

          button.addEventListener('mouseover', function(e) {

            e.preventDefault();
            hover(_attr, e);

          });

          button.addEventListener('mouseout', function(e) {
            
            e.preventDefault();
            hover(_attr, e);

          });

          button.addEventListener('click', function(e) {
            
            e.preventDefault();
            this.classList.add('active');
                _current.classList.remove('active');
                _current = this;
            filter(_attr);

          });

        });

        function hover(attr, event) {
        
        var _lineCircles = document.querySelectorAll('.' + attr + '-cirkel');
          
        if( event.type === 'mouseover' ) {
          
          TweenMax.to(_lineCircles, 0.3, {
              scale: 1.3,
                transformOrigin: '50% 100%',
                ease: Power1.easeIn
            });

        } else {
          
          TweenMax.to(_lineCircles, 0.3, {
              scale: 1,
                transformOrigin: '50% 100%',
                ease: Power1.easeIn
            });
        }

        }

        function filter(data) {

          _items.forEach(function(item){
            
            if(item.getAttribute('data-item') == data){
              
              item.style.opacity = 1;

            } else if(data == "all"){
              
              item.style.opacity = 1;

            } else {
              
              item.style.opacity = .2;

            }

          });

        }

        console.log(_element, _buttons);

      }

      function initChartAnimation() {

        var _mainTimeline = new TimelineMax();
        var _lines = document.querySelectorAll('.line');
        var _circlesOne = document.querySelectorAll('.line-1-cirkel');
        var _circlesTwo = document.querySelectorAll('.line-2-cirkel');
        var _circlesThree = document.querySelectorAll('.line-3-cirkel');
        var _circlesFour = document.querySelectorAll('.line-4-cirkel');
        var _legend = document.querySelector('#legend');
        _mainTimeline.staggerFrom(_lines, 0.2,{
          scale: 0,
          opacity: 0,
          transformOrigin: '50% 100%',
          ease: Power1.easeIn
        }, 0.2);

        _mainTimeline.staggerFrom(_circlesOne, 0.1,{
          scale: 0,
          opacity: 0,
          transformOrigin: '50% 100%',
          ease: Power1.easeIn
        }, 0.1,"bla");

        _mainTimeline.staggerFrom(_circlesTwo, 0.1,{
          scale: 0,
          opacity: 0,
          transformOrigin: '50% 100%',
          ease: Power1.easeIn
        }, 0.1,"bla");

        _mainTimeline.staggerFrom(_circlesThree, 0.1,{
          scale: 0,
          opacity: 0,
          transformOrigin: '50% 100%',
          ease: Power1.easeIn
        }, 0.1,"bla");

        _mainTimeline.staggerFrom(_circlesFour, 0.1,{
          scale: 0,
          opacity: 0,
          transformOrigin: '50% 100%',
          ease: Power1.easeIn,
          onComplete: showLegend
        }, 0.1,"bla");



        function showLegend() {

          _legend.classList.remove("hide");
          console.log('hi');
          _mainTimeline.to(_legend, 0.4,{
              scale: 1,
              opacity: 1,
              transformOrigin: '50% 100%',
              ease: Power1.easeIn
          });
          var liOne = document.querySelector('#legend li:first-of-type');
          if(factor===true) {
                liOne.classList.add("hide");
          }  else {
            liOne.classList.remove("hide");      
          } 
        }

        initLegend();

      }

      function init() {
        createScale();
        createAxis();
        createChart();
        initChart();
      }

      init();

    }

    var main = new Main();
    main.init();

    function Main() {

      var _this = this;
      var _chart;

      _this.init = function() {

        _chart = new ChartHandler('#graph');

      }

    }
    
};
