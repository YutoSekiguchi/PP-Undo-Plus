// EditorUtils.ts
import { Editor, StoreSnapshot, TLRecord } from "@tldraw/tldraw";

export class EditorUtils {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  firstLoadData(
    isDebugMode: boolean = false,
    currentTool: "eraser" | "draw" | "select" | "hand" = "draw"
  ): void {
    this.editor.updateInstanceState({ isDebugMode: isDebugMode });
    this.editor.setCurrentTool(currentTool);
  }

  // scapshotからノートの生成
  loadSnapshot(
    snapshot: StoreSnapshot<TLRecord>,
    isDebugMode: boolean = false
  ): void {
    this.editor.store.loadSnapshot(snapshot);
    this.editor.updateInstanceState({ isDebugMode: isDebugMode });
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

  getCameraData(): { x: number; y: number; z: number } {
    return {
      x: this.editor.camera.x,
      y: this.editor.camera.y,
      z: this.editor.camera.z,
    };
  }
}
