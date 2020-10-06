# Fabric Extensions

This package contains a list of different plugins/extensions to use with [fabric.js](https://github.com/fabricjs/fabric.js). 🎉️

## Installation

Simply install the package by running:

```javascript
yarn add @yassidev/fabric-extensions
```

Then simply include it into your application.

```javascript
import { fabric } from 'fabric'
import { install } from '@yassidev/fabric-extensions'

install(fabric)
```

You may also simply need:

```javascript
import 'fabric'
import '@yassidev/fabric-extensions'
```

You may also only install the extensions you want:

```javascript
import { fabric } from 'fabric'
import { textVerticalAlign, canvasShortcuts, canvasDrop } from '@yassidev/fabric-extensions'

textVerticalAlign(fabric)
canvasShortcuts(fabric)
canvasDrop(fabric)
```

## Extensions

This is the list of current extensions.

##### Canvas Cover Background

This extension will simply automatically scale the canvas background/overlay image to cover it while keeping its aspect ratio. This will also saintore the backgroundImage/overlayImage property of the canvas.toJSON() as a string rather than an object.

```javascript
import { fabric } from 'fabric'
import { canvasCoverBackground } from '@yassidev/fabric-extensions'

canvasCoverBackground(fabric)

fabric.backgroundImage = 'https://source.unsplash.com/random'
```

##### Canvas Drop

This extension will allow you to drop elements on the canvas directly ! By default, the canvas can already insert images or text but you can extend your canvas to allow for other DataTransferItem types to be included.

```javascript
import { fabric } from 'fabric'
import { canvasDrop } from '@yassidev/fabric-extensions'

canvasDrop(fabric)

fabric.util.registerDataTransferType('image', (data: DataTransferItem, canvas: fabric.Canvas) => {
// do whatever you want with images.
})

fabric.util.registerDataTransferType('image/jpeg', (data: DataTransferItem, canvas: fabric.Canvas) => {
// do whatever you want with JPEG images specifically.
})
```

#### Canvas Guidelines

This extension will add centering and aligning guidelines to your canvas when placing objects.

```javascript
import { fabric } from 'fabric'
import { canvasGuidelines } from '@yassidev/fabric-extensions'

canvasGuidelines(fabric)
```

#### Canvas Shortcuts

This extension will allow you to register keyboard shortcuts to interact with you canvas. You may choose the shortcuts you want to include or register new ones using the below helper method.

```javascript
import { fabric } from 'fabric'
import { canvasShortcutsCopy, canvasShortcutsGroup } from '@yassidev/fabric-extensions'

canvasShortcutsCopy(fabric)
canvasShortcutsGroup(fabric)

fabric.util.registerShortcut('ctrl+alt+m', (canvas: Canvas, event: KeyboardEvent) => {
// do something
})
```

These are the currently available shortcuts:

* [ ] copy/paste: using the native copy/paste ClipboardEvent
* [ ] delete: Delete or Backspace key to remove an object
* [ ] group: Ctrl+G to group/ungroup the selection
* [ ] move: ArrowLeft/Right/Up/Down to move your selection (+/- 1)
* [ ] move more: ArrowLeft/Right/Up/Down + Shift to move your selection (+/- 10)


#### Image Import

This extension will allow you to very easily create new fabric.Image instances from a URL or a File. The extension only adds three helper methosd on the fabric.Image constructor.

```javascript
import { fabric } from 'fabric'
import { imageImport } from '@yassidev/fabric-extensions'

imageImport(fabric)

fabric.Image.from(string|File, ...options) => Promise<fabric.Image>
fabric.Image.fromSrc(string, ...options) => Promise<fabric.Image>
fabric.Image.fromFile(File, ...options) => Promise<fabric.Image>
```

#### Object Export Animations

This extension will allow you to export animations in your JSON. The concept is simple: you can register animations on your fabric instance and include them in the new "animations" array property of your fabric.Object instances.

```javascript
import { fabric } from 'fabric'
import { objectExportAnimations } from '@yassidev/fabric-extensions'

objectExportAnimations(fabric)

fabric.util.registerAnimation('rotate', (object: fabric.Object, animation: fabric.CustomAnimation) => {
	return {
		duration: 1000,
		delay: 0,
		times: 0, // 0 = Infinite, default: 1
		reverse: false, // Reverse after each iteration
		easing: 'easeInBack', // default: linear
		originX: 'center', // defaut: left
		originY: 'center', // defaut: top
		to: { angle: 360 },
		data: null // set any data you want
		...animation // merge with customized animation
	}
})

const object = new fabric.Rect({
	animations: [
		{
			name: 'rotate',
			trigger: 'mousedown',
			duration: 2000 // customize the default animation
		}, 
		{
			trigger: null,  // no trigger = on added
			duration: 1000,
			from: { opacity: 0 },
			to: { opacity: 1},
			delay: 1000
		}
	]
})
```

#### Object Export Events

This extension will allow you to export events in your JSON. The concept is simple: you can register events on your fabric instance and include them in the new "events" array property of your fabric.Object instances.

```javascript
import { fabric } from 'fabric'
import { objectExportAnimations } from '@yassidev/fabric-extensions'

objectExportAnimations(fabric)

fabric.util.regiterEvent('link', (object: fabric.Object, event: fabric.CustomEvent, e: fabric.IEvent) => {
	window.open(event.data.url)
})

const object = new fabric.Rect({
	events: [
		{
			name: 'link',
			data: { url: 'https://github.com' }
		}
	]
})
```

#### Text Vertical Align

This extension will allow you to set the vertical alignment of your fabric.Text/fabric.Textbox instances. The value of the new "verticalAlign" property can be set to "top" (default), "middle" or "bottom". This extension will also prevent the distorsion of your text while scaling.

```javascript
import { fabric } from 'fabric'
import { textVerticalAlign } from '@yassidev/fabric-extensions'

textVerticalAlign(fabric)

const object = new fabric.Textbox('Some text', {
	verticalAlign: 'middle',
	textAlign: 'center'
})
```

##### License

MIT