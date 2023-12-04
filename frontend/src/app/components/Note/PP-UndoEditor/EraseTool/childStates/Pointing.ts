import {
	HIT_TEST_MARGIN,
	StateNode,
	TLEventHandlers,
	TLFrameShape,
	TLGroupShape,
	TLPointerEventInfo,
	TLShapeId,
} from '@tldraw/tldraw'

export class Pointing extends StateNode {
	static override id = 'pointing'

  private info = {} as TLPointerEventInfo

	override onEnter = () => {
		const zoomLevel = this.editor.zoomLevel
		const currentPageShapesSorted = this.editor.currentPageShapesSorted
		const {
			inputs: { currentPagePoint },
		} = this.editor

		const erasing = new Set<TLShapeId>()

		const initialSize = erasing.size

		for (let n = currentPageShapesSorted.length, i = n - 1; i >= 0; i--) {
			const shape = currentPageShapesSorted[i]
			if (
				this.editor.isShapeOrAncestorLocked(shape) ||
				this.editor.isShapeOfType<TLGroupShape>(shape, 'group')
			) {
				continue
			}

			if (
				this.editor.isPointInShape(shape, currentPagePoint, {
					hitInside: false,
					margin: HIT_TEST_MARGIN / zoomLevel,
				})
			) {
				const hitShape = this.editor.getOutermostSelectableShape(shape)
				// If we've hit a frame after hitting any other shape, stop here
				if (
					this.editor.isShapeOfType<TLFrameShape>(hitShape, 'frame') &&
					erasing.size > initialSize
				) {
					break
				}

				erasing.add(hitShape.id)
			}
		}

		this.editor.setErasingShapes(Array.from(erasing))
	}

	override onPointerMove: TLEventHandlers['onPointerMove'] = (info) => {
		if (this.editor.inputs.isDragging) {
			this.parent.transition('pressure-erasing', info)
		}
	}

	override onPointerUp: TLEventHandlers['onPointerUp'] = () => {
		this.complete()
	}

	override onCancel: TLEventHandlers['onCancel'] = () => {
		this.cancel()
	}

	override onComplete: TLEventHandlers['onComplete'] = () => {
		this.complete()
	}

	override onInterrupt: TLEventHandlers['onInterrupt'] = () => {
		this.cancel()
	}

	complete() {
		const erasingShapeIds = this.editor.erasingShapeIds

		if (erasingShapeIds.length) {
			this.editor.mark('pressure-erase end')
			this.editor.deleteShapes(erasingShapeIds)
		}

		this.editor.setErasingShapes([])
		this.parent.transition('idle', this.info)
	}

	cancel() {
		this.editor.setErasingShapes([])
		this.parent.transition('idle', this.info)
	}
}