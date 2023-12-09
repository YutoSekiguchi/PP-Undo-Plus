import { StateNode } from '@tldraw/tldraw'
import { Erasing } from './childStates/Erasing'
import { Idle } from './childStates/Idle'
import { Pointing } from './childStates/Pointing'

/** @public */
export class PressureEraserTool extends StateNode {
	static override id = 'pressure-eraser'
	static override initial = 'idle'
	static override children = () => [Idle, Pointing, Erasing]

	override onEnter = () => {
		this.editor.setCursor({ type: 'cross', rotation: 0 })
	}
}