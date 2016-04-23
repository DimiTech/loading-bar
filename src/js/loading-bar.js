(function initLoadingBarWidget(global) {

	"use strict";

	// The constructor
	function LoadingBar(options) {
		this.maxBars = options.maxBars || 12;
		this.loadingBarHTML = '<div class="loading-bar">';
		for (let i = 0; i < this.maxBars; i++)
			this.loadingBarHTML += '<div class="bar"></div>';
		if (options.showPercentage === true)
			this.loadingBarHTML += '<div class="percentage-container"><div id="percentage">0%</div></div>';
		this.percentage = 0;
		this.loadingBarHTML += '</div>';


		this.loadingBars = {};
		this.barsLoaded = 0;
		this.loadIntoDiv(options.div);
		if (options.showPercentage === true) {
			this.percentageDisplay = document.getElementById('percentage');
			this.centerPercentageLabel();
		}
		this.initializeStyle(options.style);
		
		return this;
	}

	// Loads the widget into the element
	LoadingBar.prototype.loadIntoDiv = function(div) {
		if (div !== null) {
			if (div[0] !== undefined) { 	      // This means that the div is coming from jQuery
				
				if (div[0].localName === 'div') {
					div[0].innerHTML = this.loadingBarHTML;
					this.parentDiv = div[0];
				}

			} else if (div.localName === 'div') { // This means that the div is coming from document.getElementById
				div.innerHTML = this.loadingBarHTML;
				this.parentDiv = div;
			}   
			else
				throw 'LoadingBar failed to load! Invalid div element.';
		} else
			throw 'LoadingBar failed to load! Invalid div element.';
		this.widget = document.getElementsByClassName('loading-bar')[0];
		this.loadingBars = this.widget.getElementsByClassName('bar');
		this.widget.style.visibility = 'hidden';
	};


	// Centers the percentage label
	LoadingBar.prototype.centerPercentageLabel = function() {
		var topMargin = (this.parentDiv.clientHeight - this.percentageDisplay.clientHeight) / 2  - 10;
		this.percentageDisplay.style.marginTop = topMargin + 'px';
	};

	// Styles the widget
	LoadingBar.prototype.initializeStyle = function(style) {
		if (style !== undefined) { // if the user provided custom style

			// set the container color
			this.widget.containerColor = style.containerColor || '#111111';
			// set the bar color
			this.widget.barFilledColor = style.barFilledColor || '#FE8301';
			this.widget.barEmptyColor  = style.barEmptyColor  || '#050505';
			// set the percentage text color
			this.widget.percentageColor = style.percentageColor || '#FFFFFF';
			// width of one bar
			this.widget.barWidth = style.barWidth;
		} else { // the user didn't provide his own style
			// default all colors
			this.widget.barFilledColor  = '#FE8301';
			this.widget.barEmptyColor   = '#050505';
			this.widget.containerColor  = '#111111';
			this.widget.percentageColor = '#FFFFFF';

		}

		this.applyStyles();
		this.show();
	};

	// Applies all the styles
	LoadingBar.prototype.applyStyles = function() {
		this.widget.style.backgroundColor = this.widget.containerColor;
		if (this.percentageDisplay !== undefined)
			this.percentageDisplay.style.color = this.widget.percentageColor;
		if (this.widget.barWidth !== undefined)
			this.setBarWidths();
		this.resetBars();
	};

	LoadingBar.prototype.setBarWidths = function() {
		for (let i = 0; i < this.maxBars; i++)
			this.loadingBars[i].style.width = this.widget.barWidth;
	};

	// Shows or hides the widget
	LoadingBar.prototype.show = function() {
		this.widget.style.visibility = 'visible';
	};
	LoadingBar.prototype.hide = function() {
		this.stopAnimation();
		this.widget.style.visibility = 'hidden';
	};

	// Just a plain animation
	LoadingBar.prototype.animate = function(speed) {
		this.stopAnimation();
		var barsLoaded = this.barsLoaded;
		var maxBars = this.maxBars;
		var self = this;
		var displayPercentage = (this.percentageDisplay !== undefined);
		var barFilledColor = this.widget.barFilledColor;
		var animationInterval = setInterval(function() {
			if (self.barsLoaded >= maxBars) {
				self.barsLoaded = 0;
				self.resetBars();
				this.percentage = 0;
				if (displayPercentage)
					self.updatePercentage(self.barsLoaded);
				return;
			}
			self.loadingBars[self.barsLoaded].style.backgroundColor = barFilledColor;

			self.barsLoaded++;

			if (displayPercentage)
				self.updatePercentage(self.barsLoaded);

		}, speed || 100);
		this.animationInterval = animationInterval;
		return this;
	};

	LoadingBar.prototype.stopAnimation = function() {
		clearInterval(this.animationInterval);
	};

	// Advance the loading by a given percentage
	LoadingBar.prototype.advanceByPercentage = function(percent) {
		if (this.barsLoaded <= this.maxBars && this.barsLoaded >= 0) {

			// Update the percentage display and property
			if (this.percentageDisplay !== undefined)
				this.updatePercentage(this.barsLoaded, percent);
			else
				this.addPercentage(percent);


			this.barsLoaded = ~~((this.percentage / 100) * this.maxBars); // Using the bitwise NOT operator to convert to int

			if (this.barsLoaded >= this.maxBars)
				this.barsLoaded = this.maxBars;

			if (this.barsLoaded < 0)
				this.barsLoaded = 0;

			if (percent < 0)
				this.resetBars();

			// Fill affected bars
			this.fillBars();
		}
		return this;
	};

	// Advance the loading by a given number of bars
	LoadingBar.prototype.advanceBy = function(noBars) {
		if (this.barsLoaded <= this.maxBars && this.barsLoaded >= 0) {
			this.barsLoaded += noBars;

			if (this.barsLoaded >= this.maxBars)
				this.barsLoaded = this.maxBars;

			if (this.barsLoaded < 0)
				this.barsLoaded = 0;

			if (noBars < 0)
				this.resetBars();

			// Fill affected bars
			this.fillBars();

			// Update the percentage display
			if (this.percentageDisplay !== undefined)
				this.updatePercentage(this.barsLoaded);
			else
				this.percentage = ~~((this.barsLoaded / this.maxBars) * 100);
		}
		return this;
	};

	// Sets the loading bar to the given percentage
	LoadingBar.prototype.setValue = function(percent) {
		if (this.barsLoaded <= this.maxBars && this.barsLoaded >= 0) {
			this.barsLoaded = ~~(this.maxBars * percent); // Using the bitwise NOT operator to convert to int

			if (this.barsLoaded >= this.maxBars)
				this.barsLoaded = this.maxBars;

			if (this.barsLoaded < 0)
				this.barsLoaded = 0;

			this.resetBars();

			// Fill affected bars
			this.fillBars();

			// Update the percentage display
			if (this.percentageDisplay !== undefined)
				this.updatePercentage(this.barsLoaded);
			else {
				this.percentage = 0;
				this.addPercentage(percent);
			}
		}
		return this;
	};

	LoadingBar.prototype.fillBars = function(percent) {
		for (let i = 0; i < this.barsLoaded; i++) {
			this.loadingBars[i].style.backgroundColor = this.widget.barFilledColor;
		}
	};
	
	// Update the percentage text
	LoadingBar.prototype.updatePercentage = function(barsLoaded, percent) {
		console.log();
		if (barsLoaded > this.maxBars)
			this.percentage = 0;
		else {
			if (percent === undefined)
				this.percentage = ~~((barsLoaded / this.maxBars) * 100); // Using the bitwise NOT operator to convert to int
			else {
				this.addPercentage(percent);
			}
										 
		}
		
		this.percentageDisplay.innerHTML = this.percentage + '%';
	};

	LoadingBar.prototype.addPercentage = function(percent) {
		this.percentage += percent * 100;
			if (this.percentage < 0)
				this.percentage = 0;
			if (this.percentage > 100)
				this.percentage = 100;
	};

	// Resets the entire loader
	LoadingBar.prototype.resetLoader = function() {
		this.barsLoaded = 0;
		this.percentage = 0;
		if (this.percentageDisplay !== undefined)
			this.updatePercentage(0);
		this.resetBars();
	};

	// Sets the colors of all the bars to black
	LoadingBar.prototype.resetBars = function() {
		var emptyColor = this.widget.barEmptyColor;
		for (let i = 0; i < this.maxBars; i++) {
			this.loadingBars[i].style.backgroundColor = emptyColor;
		}
	};

	// Make the constructor publicly available
	global.LoadingBar = LoadingBar;

})(window);