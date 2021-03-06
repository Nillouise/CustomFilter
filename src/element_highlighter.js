var ElementHighlighter = function () {
	this.hideElements = null;
	this.searchElements = null;
};
ElementHighlighter.prototype.highlightRule = function (rule)
{
	var searchNodes = [];
	var hideNodes = [];
	if (rule)
	{
		var searchNodes = (rule.block_anyway)?[]:(
				(rule.search_block_by_css)?
					CustomBlockerUtil.getElementsByCssSelector(rule.search_block_css)
					:
					CustomBlockerUtil.getElementsByXPath(rule.search_block_xpath)
				);
		rule.searchNodes = searchNodes;
		var hideNodes = (rule.hide_block_by_css)?
				CustomBlockerUtil.getElementsByCssSelector(rule.hide_block_css)
				:
				CustomBlockerUtil.getElementsByXPath(rule.hide_block_xpath);
		rule.hideNodes = hideNodes;
	}
	this.highlightSearchElements(searchNodes);
	this.highlightHideElements(hideNodes);
};
ElementHighlighter.prototype.highlightHideElements = function (elements)
{
	if (this.hideElements)
	{
		for (var i=0, l=this.hideElements.length; i<l; i++) {
			if (!CustomBlockerUtil.isContained(this.hideElements[i], document.getElementById('rule_editor_container')))
				ElementHighlighter.unselectForHide(this.hideElements[i]);
		}
	}
	//Apply Styles
	if (elements)
	{
		for (var i=0; i<elements.length; i++)
		{
			if (!CustomBlockerUtil.isContained(elements[i], document.getElementById('rule_editor_container')))
				ElementHighlighter.selectForHide(elements[i]);
		}
	}
	this.hideElements = elements;
};
ElementHighlighter.prototype.highlightSearchElements = function (elements)
{
	if (this.searchElements)
	{
		for (var i=0, l=this.searchElements.length; i<l; i++) {
			if (!CustomBlockerUtil.isContained(this.searchElements[i], document.getElementById('rule_editor_container')))
				ElementHighlighter.unselectForSearch(this.searchElements[i]);
		}
	}
	//Apply Styles
	if (elements)
	{
		for (var i=0; i<elements.length; i++)
		{
			if (!CustomBlockerUtil.isContained(elements[i], document.getElementById('rule_editor_container')))
				ElementHighlighter.selectForSearch(elements[i]);
		}
	}
	this.searchElements = elements;
};

ElementHighlighter.selectForHide = function (element)
{
	if (null==element.originalStyle)
		element.originalStyle = (null!=element.style.outline)?element.style.outline:" ";
	element.isSelectedForHide = true;
	element.style.outline = ElementHighlighter.STYLE_SELECT_FOR_HIDE;
	
	// Change background color
	if ('inline' == window.getComputedStyle(element).display)
	{
		element.originalBackgroundColor = window.getComputedStyle(element).backgroundColor;
		element.style.backgroundColor = '#bbb';
		element.backgroundColorChanged = true;
	}
	// Add transparent cover
	else
	{
		var elementsToCover = new Array();
		if ('TR'==element.tagName)
		{
			var children = element.childNodes;
			for (var i=0; i<children.length; i++)
			{
				if (children[i].tagName)
				{
					elementsToCover.push(children[i]);
				}
			}
		}
		else
		{
			elementsToCover.push(element);
		}
		if (elementsToCover.length > 0)
		{
			var coverDivs = new Array();
			for (var i=0; i<elementsToCover.length; i++)
			{
				var elementToCover = elementsToCover[i];
				elementToCover.style.position = 'relative';
				var div = document.createElement('DIV');
				with (div.style)
				{
					backgroundColor = 'black';
					position = 'absolute';
					left = '0px';
					top = '0px';
					opacity = 0.3;
					width = elementToCover.clientWidth + 'px';
					height = elementToCover.clientHeight + 'px';
				}
				elementToCover.appendChild(div);
				coverDivs.push(div);
			}
			element.coverDivs = coverDivs;
		}
	}
};

ElementHighlighter.unselectForHide = function (element)
{
	/* Remove transparent cover div elements */
	if (element.coverDivs)
	{
		for (var i=0; i<element.coverDivs.length; i++)
		{
			var coverDiv = element.coverDivs[i];
			coverDiv.parentNode.removeChild (coverDiv);
		}
		element.coverDivs = null;
	}
	if (element.backgroundColorChanged)
	{
		element.style.backgroundColor = element.originalBackgroundColor;
		element.originalBackgroundColor = null;
		element.backgroundColorChanged = false;
	}
	element.isSelectedForHide = false;
	if (element.isSelectedForSearch) 
		element.style.outline = ElementHighlighter.STYLE_SELECT_FOR_SEARCH;
	else
		element.style.outline = element.originalStyle;
};
ElementHighlighter.selectForSearch = function (element)
{
	if (null==element.originalStyle)
		element.originalStyle = (null!=element.style.outline)?element.style.outline:"";
	element.isSelectedForSearch = true;
	element.style.outline = ElementHighlighter.STYLE_SELECT_FOR_SEARCH;
};
ElementHighlighter.unselectForSearch = function (element)
{
	element.isSelectedForSearch = false;
	if (element.isSelectedForHide) 
		element.style.outline = ElementHighlighter.STYLE_SELECT_FOR_HIDE;
	element.style.outline = element.originalStyle;
};

ElementHighlighter.STYLE_FOCUS_FOR_HIDE = 'solid 2px black';
ElementHighlighter.STYLE_FOCUS_FOR_SEARCH = 'solid 2px #0db3ea';
ElementHighlighter.STYLE_TMP_SELECT_FOR_HIDE = 'dotted 2px black';
ElementHighlighter.STYLE_TMP_SELECT_FOR_SEARCH = 'dotted 2px #0db3ea';
ElementHighlighter.STYLE_SELECT_FOR_HIDE = 'solid 1px black';
ElementHighlighter.STYLE_SELECT_FOR_SEARCH = 'solid 1px #0db3ea';