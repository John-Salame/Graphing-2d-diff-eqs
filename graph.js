//global variables
var margin = 20; //margin on each side
var x0;
var y0;

var xMin;
var xMax;
var yMin;
var yMax;
var xInterval;
var yInterval;

var showVectors;
var vectorsShowing; //makes it so you only clear when you switch from show to hide
var showGrid;

function setup()
{
	x0 = 0;
	y0 = 0;	
	createCanvas(1000 + 2 * margin, 1000 + 2 * margin);
	background(230);
	fill(220);
	noStroke();
	rect(margin, margin, width-2*margin, height-2*margin);
}


/* FUNCTIONS FOR CONVERTING BETWEEN CALCULATION COORDINATES AND CANVAS COORDINATES */

//convert x to canvas x and return the result
function xToCanx(x)
{
	//percent of screen past the left side (screen means area inside margins)
	var percent = (x - xMin)/(xMax - xMin);
	return margin + percent*(width-2*margin);
}

//convert an x coordinate from the canvas to an x coordinate for calculations
function canxToX(canx)
{
	var percent = (canx - margin)/(width-2*margin);
	return xMin + percent*(xMax - xMin);
}

//convert y to canvas y and return the result
function yToCany(y)
{
	//percent of screen above bottom (screen means area inside margins)
	var percent = (y - yMin)/(yMax - yMin);
	return height - margin - percent*(height-2*margin);
}

//convert y coordinate from the canvas to a y coordinate for calculations
function canyToY(cany)
{
	//percent above bottom of screen (screen size is height-2*margin)
	var percent = ( height - (cany + margin) ) / (height-2*margin);
	return yMin + percent*(yMax - yMin);
}


//WHEN YOU CLICK INSIDE THE CANVAS (inside the margins), REFRESH THE GRAPH
function mouseClicked()
{
	if(mouseX > margin && mouseX < width - margin)
	{
		if(mouseY > margin && mouseY < height - margin)
		{
			x0 = canxToX(mouseX);
			y0 = canyToY(mouseY);
			drawGraph(x0, y0);
		}
	}
}


//A POINT IS AN OBJECT WITH AN X AND Y VALUE
function Point(x, y)
{
	this.x = x;
	this.y = y;
	
	this.display = function()
	{
		ellipse(xToCanx(this.x), yToCany(this.y), 5, 5);
	};
}


//SHOW THE VECTOR FIELD
function showVectorField()
{
	var htmlDoc = parent.document;	
	var xPrimeX = parseFloat(htmlDoc.getElementById("xPrimeX").value);
	var xPrimeY = parseFloat(htmlDoc.getElementById("xPrimeY").value);
	var yPrimeX = parseFloat(htmlDoc.getElementById("yPrimeX").value);
	var yPrimeY = parseFloat(htmlDoc.getElementById("yPrimeY").value);	
	var tStep = parseFloat(htmlDoc.getElementById("tStep").value);
	
	//green vectors
	stroke("green");
	
	//these values are global
	for(var x = xMin; x <= xMax; x += xInterval)
	{
		for(var y = yMin; y <= yMax; y += yInterval)
		{
			var newX = x + tStep*(xPrimeX*x + xPrimeY*y);
			var newY = y + tStep*(yPrimeX*x + yPrimeY*y);
			line(xToCanx(x), yToCany(y), xToCanx(newX), yToCany(newY));
		}
	}
}


//DRAW THE GRAPH
function drawGraph(x0, y0)
{
	//ellipse(xToCanx(x0), yToCany(y0), 5, 5);
	
	var htmlDoc = parent.document;
	
	var xPrimeX = parseFloat(htmlDoc.getElementById("xPrimeX").value);
	var xPrimeY = parseFloat(htmlDoc.getElementById("xPrimeY").value);
	var yPrimeX = parseFloat(htmlDoc.getElementById("yPrimeX").value);
	var yPrimeY = parseFloat(htmlDoc.getElementById("yPrimeY").value);
	
	var tStep = parseFloat(htmlDoc.getElementById("tStep").value);
	var tMin = parseFloat(htmlDoc.getElementById("tMin").value);
	var tMax = parseFloat(htmlDoc.getElementById("tMax").value);
	
	//ARRAY TO HOLD POINTS ALONG THE LINE
	var points = [new Point(x0, y0)];
	
	
	//start calculating points by going in reverse
	var t = 0;
	while(t > tMin)
	{
		t -= tStep;
		var x = points[points.length - 1].x; //x of last point in array
		var y = points[points.length - 1].y; //y of last point in array
		
		var newX = x - tStep*(xPrimeX*x + xPrimeY*y);
		var newY = y - tStep*(yPrimeX*x + yPrimeY*y);
		points.push(new Point(newX, newY));
	}
	
	//reverse the array so the last point is (x0, y0)
	points.reverse();
	while(t < tMax)
	{
		t += tStep;
		var x = points[points.length - 1].x; //x of last point in array
		var y = points[points.length - 1].y; //y of last point in array
		
		var newX = x + tStep*(xPrimeX*x + xPrimeY*y);
		var newY = y + tStep*(yPrimeX*x + yPrimeY*y);
		points.push(new Point(newX, newY));
	}	
	
	//display the points
	stroke(30);
	fill(30);
	for(i = 0; i < points.length; i++)
	{
		points[i].display();
	}
	
	//SHOW VECTOR FIELD
	showVectors = htmlDoc.getElementById("showVectors").value;
	//console.log(showVectors);
	if(showVectors == "show")
	{
		vectorsShowing = true;
		//console.log("Show Vectors");
		showVectorField();
	}
	else if(showVectors == "hide" && vectorsShowing)
	{
		vectorsShowing = false;
		//console.log("Hide Vectors and Clear");
		clear();
		newGraph();
	}
}


//CREATE A NEW GRAPH WHEN YOU CLICK UPDATE GRAPH (set up window, then call drawGraph(x0, y0))
function newGraph()
{
	clear();
	createCanvas(1000 + 2 * margin, 1000 + 2 * margin);
	background(230);
	fill(220);//
	noStroke();//
	rect(margin, margin, width-2*margin, height-2*margin);//
	stroke(30); //for axes
	fill(30);
	
	var htmlDoc = parent.document;
	xMin = parseFloat(htmlDoc.getElementById("xMin").value);
	xMax = parseFloat(htmlDoc.getElementById("xMax").value);
	yMin = parseFloat(htmlDoc.getElementById("yMin").value);
	yMax = parseFloat(htmlDoc.getElementById("yMax").value);
	xInterval = parseFloat(htmlDoc.getElementById("xInterval").value);
	yInterval = parseFloat(htmlDoc.getElementById("yInterval").value);
	
	
	//SET THE Y VALUE OF THE X-AXIS (in canvas coordinates)
	var xAxis;
	if(yMin < 0)
	{
		xAxis = yToCany(0); //y value of x-axis in canvas coordinates
	}
	else
	{
		xAxis = height - margin; //bottom of screen
	}
	
	
	//SET THE X VALUE OF THE Y-AXIS (in canvas coordinates)
	var yAxis;
	if(xMin < 0)
	{
		yAxis = xToCanx(0); //x value of y-axis in canvas coordinates
	}
	else
	{
		yAxis = margin; //left side of screen
	}
	
	//draw the x-axis
	line(margin, xAxis, width-margin, xAxis);
	//DRAW THE LABELS ON THE X-AXIS
	for(var x = xMin; x <= xMax; x += xInterval)
	{
		//position on the canvas
		var xPos = xToCanx(x);
		text(x, xPos+4, xAxis - 2);
		line(xPos, xAxis-10, xPos, xAxis+10);
	}
	
	//draw the y-axis
	line(yAxis, margin, yAxis, height-margin);
	//DRAW THE LABELS ON THE Y-AXIS
	for(var y = yMin; y <= yMax; y += yInterval)
	{
		var yPos = yToCany(y);
		text(y, yAxis - 0.75*margin, yPos - 2);
		line(yAxis-10, yPos, yAxis+10, yPos);
	}
	
	drawGraph(x0, y0);
}