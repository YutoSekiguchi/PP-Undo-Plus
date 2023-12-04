"use client";

import { Editor, TLEditorComponents, TLEventMapHandler, Tldraw, useEditor, Box2d, TLUiOverrides, toolbarItem, useValue, } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useCallback, useEffect, useState } from 'react'

import { CardShapeTool } from './CardShape/CardShapeTool'
import { CardShapeUtil } from './CardShape/CardShapeUtil'
import { uiOverrides } from './ui-overrides'
import { EraserTool } from './EraseTool/EraserTool';
import { ToolPressureEraseIcon } from './EraseTool/icon/tool-pressure-erase';


const customShapeUtils = [CardShapeUtil]
const customTools = [EraserTool]


export default function PPUndoEditor() {
	const [editor, setEditor] = useState<Editor>()

	const setAppToState = useCallback((editor: Editor) => {
		// debugMode解除
		editor.updateInstanceState({ isDebugMode: false })
    editor.setCurrentTool('draw')
		setEditor(editor)
	}, [])

	const [storeEvents, setStoreEvents] = useState<string[]>([]);

	useEffect(() => {
		if (!editor) return

		function logChangeEvent(eventName: string) {
			// setStoreEvents((events) => [eventName, ...events])
		}

		// 何かChangeが行われたら発火
		const handleChangeEvent: TLEventMapHandler<'change'> = (change) => {
			console.log(editor.store.allRecords())
			if (change.source === 'user') {
				// Added
				for (const record of Object.values(change.changes.added)) {
					if (record.typeName === 'shape') {
						logChangeEvent(`created shape (${record.type})`)
					}
				}

				// Updated
				for (const [from, to] of Object.values(change.changes.updated)) {
					if (
						from.typeName === 'instance' &&
						to.typeName === 'instance' &&
						from.currentPageId !== to.currentPageId
					) {
						logChangeEvent(`changed page (${from.currentPageId}, ${to.currentPageId})`)
					}
				}

				// Removed
				for (const record of Object.values(change.changes.removed)) {
					if (record.typeName === 'shape') {
						logChangeEvent(`deleted shape (${record.type})`)
					}
				}
			}
		}

		editor.on('change', handleChangeEvent)

    // ボタンの表示
    const toolPressureEraesrButton = document.querySelector('button[data-testid="tools.pressure-eraser"]');
    if (toolPressureEraesrButton) {
      toolPressureEraesrButton.innerHTML = `<div style="display: flex; width: 18px; height: 18px; justify-content: center; align-items: center;">${ToolPressureEraseIcon}</div>`;
    }

		return () => {
			editor.off('change', handleChangeEvent)
		}
	}, [editor])

	return (
    <div style={{ width: '70vw', height: '100vh' }}>
      <Tldraw onMount={setAppToState}
        shapeUtils={customShapeUtils}
        tools={customTools}
        overrides={uiOverrides}
      />
    </div>
	)
}