# angular-rateit

This directive was inspired by the jQuery (star)rating plugin [RateIt](http://rateit.codeplex.com/).
However this package will work without jQuery and is very light weight.

![ng-rate-it](ng-rate-it.png?raw=true)

[Live demo](http://akempes.github.io/angular-rateit/)

## Getting Started

You can install an angular-rateit package easily using Bower:

```shell
bower install angular-rateit
```

And add the files to your index page:

```html
<link rel="stylesheet" href="angular-rateit/dist/rateit.css" />
<script src="angular-rateit/dist/rateit.js"></script>
```

Finally add 'ngRateIt' to your main module's list of dependencies:

```js
angular.module('myApp', [
	...
    'ngRateIt',
    ...
]);
```

## How to use

To get it working simply add this block of code to your view:

```html
<ng-rate-it ng-model="test.rateit"></ng-rate-it>
```
**N.B.** When using angular 1.2.* use `<div ng-rate-it ng-model="test.rateit"></div>`

For more advanced functionality you can add a couple attributes:

```html
<ng-rate-it 
	ng-model = "String, Number, Array"
	min = "Double"
	max = "Double"
	step = "Double"
	read-only = "Boolean"
	pristine = "Boolean"
	resetable = "Boolean"
	star-width = "Integer"
	star-height = "Integer"
	rated = "Function"
	reset = "Function"
	before-rated = "Function: return promise"
	before-reset = "Function: return promise"
	>
</ng-rate-it>
```

### Attributes

| Attribute | Description | Value | Default |
|---|---|---|---|
| ng-model     	| Object bound to control. (Required) | String, Number, Array | - |
| min          	| Minimal value. | Double | 0 |
| max          	| Maximal value. The difference between min and max will provide the number of stars. | Double | 5 |
| step         	| Step size. | Double | 0.5 |
| read-only    	| Whether or not is readonly. | Boolean | false |
| pristine     	| Whether or not the current value is the initial value. | Boolean | true |
| resetable    	| When not readonly, whether to show the reset button. | Boolean | true |
| star-width   	| Width of the star picture. | Integer | 16 |
| star-height  	| Height of the star picture. | Integer | 16 |
| cancel-width  | Width of the cancel icon. | Integer | star-width |
| cancel-height | Height of the cancel icon. | Integer | star-height |
| rated        	| Fired when a rating happened. (Obtain the rated value by the model) | Function | - |
| reset        	| Fired when the reset button was clicked. | Function | - |
| before-rated 	| Fired before the item is actually rated. By rejecting the promise it is possible to cancel the rating. | Function: return promise | - |
| before-reset 	| Fired before the item is actually reset. By rejecting the promise it is possible to cancel the reset. | Function: return promise | - |


### Customization

You can easily add your own star style via css. You can use the star-width and star-height attributes to make the 'stars' bigger if necessary.

```html
<style>
	.custom.ngrateit .ngrateit-star{
		background-image: url('custom.png');
	}
</style>
<ng-rate-it ng-model="model.custom" class="custom"></ng-rate-it>
```

### Release Note:

V3.0.0

* BREAKING: The `over` callback is removed.
* BREAKING: If you're using your own template, you need to update it.
* Template and CSS file are refactored in order to support mobile divices.
* Moved calculations from template to controller.