# Attribute-and-Style-Editor
A firefox addon that allows you to change HTML attributes and CSS properties automatically on pages you define.

# Getting started:
1. Download the addon from the Firefox add on store.
2. Left click on the add ons icon, and select the Define rules button from the popup.
3. I recommend taking the rules from the recommendedRules.json file in this repository, pasting them into the rules text area, and clicking the Save button below the rules text area.
4. These recommended rules add controls (time scrub bar, volume bar) to videos on instagram.com and tiktok.com.
5. They are also a good starting point for you to create your own rules. Some features I couldn't find a use case for, so they've been featured in the exampleRules.json file in this repository which I don't recommend you actually use, but that you take a look at if you need more clarification than the documentation below provides.

# Documentation:
## Getting started writing rules
JSON is used to specify rules/what elements will get changed and how. Your rules will be defined as a JSON array:
```
[
]
```
Each individual rule will be an object with some key properties:
```
[
  {
    "url": "tumblr.com/",
	"elements": [
	]
  }
]
```
Each rule must have a url that the rule will run on, and will have an array of elements, each allowing the user to specify various selectors to make sure the addon only changes the desired element, and allowing the user to specify various changes to apply to the element. All selectors will be checked first before the rules/changes are applied.

Adding an element with a selector:
```
[
  {
    "url": "tumblr.com/",
	"elements": [
	  {
	    "selector": "div > video"
	  }
	]
  }
]
```
This is a simple CSS selector that specifies any video element contained in a div. Now we add something to happen when it finds such a video:
```
[
  {
    "url": "tumblr.com/",
	"elements": [
	  {
	    "selector": "div > video",
		"setAttributes": {
		  "controls": "true"
		}
	  }
	]
  }
]
```
This sets the attribute controls on the video to a value of true. On a simpler website that might be enough to get a volume bar where there was not one previously, but Tumblr requires a bit more work. In recommendedRules.json you may find a completed rule that enables volume bars on Tumblr videos.

##Further documentation
Identifiers: You can check for specific computed styles by defining a property on the element level called hasStyles. Give it a value of an object with properties of the styles you want to check for. You can specify your element does not have specific properties or that they don't have certain values using notStyles. You can make sure an element has a child by defining the property hasChildren with a value of an array. Each element of the array should be a string that is a valid CSS selector (you can put ":scope > " before your selector to specify it must be a direct child of the element). You can make sure an element has specific attributes using default css selector mechanics (see: https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) (which would go in the normal selector property).

Other features:
For websites that load more content after the page is loaded, you can put either a tryAgain property or a refresh property on the rule/site level (same level as the url property). Put a millisecond value for either and refresh will try to apply the rules again each time that number of milliseconds passes, or tryAgain will just apply them again just one time, that many milliseconds after the page loads. If you put a value less than 1000 in refresh, it will still only refresh every 1000 milliseconds (1 second) for performance reasons. If multiple url's have the refresh property and they all apply on one page, only one refresh event will be created with the shortest refresh time of all the refresh properties.

Other usage notes:
The notes property you see in the recommendedRules and exampleRules isn't a special property or reserved word; rather, you're just allowed to put any extra properties you want in your rules and it won't be a problem unless they are one of the reserved words of the add on like hasChildren, hasStyles, etc. or if it is invalid JSON. The validity of your JSON is checked when saving rules and if invalid you will be warned and given details below the save button.
