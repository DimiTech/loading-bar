(function initLoadingBarWidget(global) {

	"use strict";

	// The constructor
	function LoadingBar(options) {
		this.maxBars = options.maxBars;
		this.loadingBarHTML = '<div class="loading-bar">';
		for (var i = 0; i < this.maxBars; i++)
			this.loadingBarHTML += '<div class="bar"></div>';
		this.loadingBarHTML += '</div>';

		this.loadingBars = {};
		this.barsLoaded = 0;
		this.loadIntoDiv(options.div);
		this.initializeStyle(options.style);
	}

	// Styles the widget
	LoadingBar.prototype.initializeStyle = function(style) {
		if (style !== undefined) { // if the user provided custom style

			// set the container color
			this.widget.containerColor = style.containerColor || '#111111';
			// set the bar color
			this.widget.barFilledColor = style.barFilledColor || '#FE8301';
			this.widget.barEmptyColor  = style.barEmptyColor  || '#050505';

		} else { // the user didn't provide his own style
			// default all colors
			this.widget.barFilledColor = '#FE8301';
			this.widget.barEmptyColor  = '#050505';
			this.widget.containerColor = '#111111';
		}

		this.applyStyles();
		this.show();
	};

	// Applies all the styles
	LoadingBar.prototype.applyStyles = function() {
		this.widget.style.backgroundColor = this.widget.containerColor;

		this.resetBars();
	};

	// Loads the widget into the element
	LoadingBar.prototype.loadIntoDiv = function(div) {
		if (div !== null) {
			if (div[0] !== undefined) { 	      // This means that the div is coming from jQuery
				
				if (div[0].localName === 'div')
					div[0].innerHTML = this.loadingBarHTML;

			} else if (div.localName === 'div')   // This means that the div is coming from document.getElementById
				div.innerHTML = this.loadingBarHTML;
			else
				throw 'LoadingBar failed to load! Invalid div element.';
		} else
			throw 'LoadingBar failed to load! Invalid div element.';
		this.widget = document.getElementsByClassName('loading-bar')[0];
		this.loadingBars = this.widget.getElementsByClassName('bar');
		this.hide();
	};

	// Shows or hides the widget
	LoadingBar.prototype.show = function() {
		this.widget.style.visibility = 'visible';
	};
	LoadingBar.prototype.hide = function() {
		this.widget.style.visibility = 'hidden';
	};

	// Just a plain animation
	LoadingBar.prototype.animate = function(speed) {
		var barsLoaded = this.barsLoaded;
		var maxBars = this.maxBars;
		var self = this;
		var barFilledColor = this.widget.barFilledColor;
		setInterval(function() {
			if (barsLoaded >= maxBars) {
				barsLoaded = 0;
				self.resetBars();
				return;
			}
			self.loadingBars[barsLoaded].style.backgroundColor = barFilledColor;
			barsLoaded++;
		}, speed || 100);
	};

	// Sets the colors of all the bars to black
	LoadingBar.prototype.resetBars = function() {
		var emptyColor = this.widget.barEmptyColor;
		for (var i = 0; i < this.maxBars; i++) {
			this.loadingBars[i].style.backgroundColor = emptyColor;
		}
	};

	// Make the constructor publicly available
	global.LoadingBar = LoadingBar;

})(window);