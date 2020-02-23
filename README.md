# Attribute-and-Style-Editor
A firefox addon that allows you to change HTML attributes and CSS properties automatically on pages you define.

# Getting started:
1. Download the addon from the Firefox add on store.
2. Left click on the add ons icon, and select the Define rules button from the popup.
3. I recommend taking the rules from the recommendedRules.json file in this repository, pasting them into the rules text area, and clicking the Save button below the rules text area.
4. These recommended rules add controls (time scrub bar, volume bar) to videos on instagram.com and tiktok.com.
5. They are also a good starting point for you to create your own rules. Some features I couldn't find a use case for, so they've been featured in the exampleRules.json file in this repository which I don't recommend you actually use, but that you take a look at if you need more clarification than the documentation below provides.

# Documentation:
JSON is used to specify rules/what elements will get changed and how. Each url will have an array of elements, each allowing the user to specify various filters/identifiers to make sure the addon only changes the desired element, and allowing the user to specify various changes to apply to the element. All identifiers will be checked first before the rules/changes are applied.

Identifiers: You can check for specific computed styles by defining an object called hasStyles. You can specify your element does not have specific properties or that they don't have certain values using notStyles. You can make sure an element has a child by declaring an array of selectors called hasChildren. (you can put ":scope > " before your selector to specify it must be a direct child of the element) You can make sure an element has attributes using default css selector mechanics (see: https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).

Other features:
For websites that load more content after the page is loaded, you can put either a tryAgain property or a refresh property on the site level (same level as the url property). Put a millisecond value for either and refresh will try to apply the rules again each time that number of milliseconds passes, or tryAgain will just apply them again just one time, that many milliseconds after the page loads. If you put a value less than 1000 in refresh, it will still only refresh every 1000 milliseconds (1 second) for performance reasons. If multiple url's have the refresh property and they all apply on one page, only one refresh event will be created with the shortest refresh time of all the refresh properties.

Other usage notes:
The notes property you see in the recommendedRules and exampleRules isn't a special property or reserved word or anything, you're just allowed to put any extra properties you want in your rules and it won't be a problem unless they are one of the reserved words of the add on like hasChildren, hasStyles, etc. or if it is invalid JSON. The validity of your JSON is checked when saving rules and you will be warned below the save button and given details.
