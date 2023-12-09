// EditorUtils.ts
import { Editor, StoreSnapshot, TLRecord } from "@tldraw/tldraw";

export class EditorUtils {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  firstLoadData(isDebugMode: boolean = false, currentTool: "eraser" | "draw" | "select" | "hand" = "draw"): void {
    this.editor.updateInstanceState({ isDebugMode: isDebugMode });
    this.editor.setCurrentTool(currentTool);
  }

  // scapshotからノートの生成
  loadSnapshot(snapshot: StoreSnapshot<TLRecord>): void {
    this.editor.store.loadSnapshot(snapshot);
  }

  getSnapshot(): StoreSnapshot<TLRecord> | undefined {
    return this.editor.store.getSnapshot();
  }

  getAllRecords(): TLRecord[] {
    return this.editor.store.allRecords();
  }

  async getSvg(): Promise<SVGElement | undefined> {
    try {
      return await this.editor.getSvg(this.editor.currentPageShapes);
    } catch (e) {
      console.error("エラーが発生しました。", e);
      return undefined;
    }
  }
}
