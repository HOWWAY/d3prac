
  //Import CSV file
	d3.csv("misc/frequence.csv",function(error,csvdata){

		//Reset datasets
		var wordset = [];
		var attiset = [];
		var ocurset = [];
		var percset = [];

		if(error){
			console.log(error);
			}
		else {
			for(var i=0;i<csvdata.length;i++){
            wordset.push(csvdata[i].word);
						attiset.push(parseInt(csvdata[i].attitude));
						ocurset.push(parseInt(csvdata[i].occurrence));
						percset.push(parseFloat(csvdata[i].percentage));
      }
		}

	//Set the canvas & create a new svg
	var width = 1400;
	var height = 300;

	var svg = d3.select("body")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	var padding = {left:50, right:50, top:20, bottom:20};

	//set color
	var color= d3.scale.linear()
	  .domain([0,2])
		.range(["#0f3443","#34e89e"]);

	//set xscale
	var xScale = d3.scale.ordinal()
		.domain(d3.range(1,wordset.length+1))
		.rangeRoundBands([0, width - padding.left - padding.right]);

	//set yscale
	var yScale = d3.scale.linear()
		.domain([0,d3.max(ocurset)])
		.range([height - padding.top - padding.bottom, 0]);

	//set x axis
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	//set y axis
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	var rectPadding = 8;

	//append new rects
	var rects = svg.selectAll(".MyRect")
		.data(ocurset)
		.enter()
		.append("rect")
		.attr("class","MyRect")
		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.attr("x", function(d,i){
			return xScale(i+1) + rectPadding/2;
		} )
		.attr("y",function(d){
			return yScale(d);
		})
		.attr("width", xScale.rangeBand() - rectPadding )
		.attr("height", function(d){
			return height - padding.top - padding.bottom - yScale(d);
		})
		.on("mouseover",function(d,i){
			d3.select(this)
				.attr("fill","#BD10E0");
			tooltip.html("Keyword: " + wordset[i]  + "<br />" +
				  "Occurrence: " + ocurset[i] + "<br />" +
				  "Percentage: " + percset[i])
				            .style("left", (d3.event.pageX) + "px")
				            .style("top", (d3.event.pageY + 20) + "px")
				            .style("opacity",0.8);
		})
		.on("mousemove",function(d,i){
		tooltip.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY + 20) + "px");
		})
		.on("mouseout",function(d,i){
			d3.select(this)
				.transition()
						.duration(500)
						.attr("fill",function(d){
							return color(d)
						});
			tooltip.style("opacity",0.0);
		});

	var rectcolor = svg.selectAll(".MyRect")
	                .data(attiset)
									.attr("fill",function(d){
										return color(d);
									});

	//draw x axis
	svg.append("g")
		.attr("class","axis")
		.attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
		.call(xAxis);

	//draw y axis
	svg.append("g")
		.attr("class","axis")
		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.call(yAxis);

  var tooltip = d3.select("body")
  .append("div")
  .attr("class","tooltip")
  .style("opacity",0.0);



	});
