// EditorUtils.ts
import { TLGroupDrawArea, TLStrokePressureInfo } from "@/@types/note";
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

  // Generate note from snapshot
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

  getAllDrawPoints(): {
    id: string;
    points: { x: number; y: number; z: number }[];
    x: number;
    y: number;
  }[] {
    return this.editor.store
      .allRecords()
      .filter((record: any) => {
        return record.type === "draw";
      })
      .map((record: any) => {
        return {
          id: record.id,
          points: record.props.segments[0].points,
          x: record.x,
          y: record.y,
        };
      });
  }

  getAllDrawAreas(): {
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
  }[] {
    const targetRecords = this.editor.store
      .allRecords()
      .filter((record: any) => {
        return record.type === "draw";
      });
    // left is the value obtained by adding the minimum x value of record.props.segments[0].points to x
    // top is the value obtained by adding the minimum y value of record.props.segments[0].points to y
    // width is the value obtained by subtracting the minimum value from the maximum x value of record.props.segments[0].points
    // height is the value obtained by subtracting the minimum value from the maximum y value of record.props.segments[0].points
    return targetRecords.map((record: any) => {
      const points = record.props.segments[0].points;
      const xList = points.map(
        (point: { x: number; y: number; z: number }) => point.x
      );
      const yList = points.map(
        (point: { x: number; y: number; z: number }) => point.y
      );
      return {
        id: record.id,
        left: Math.min(...xList) + record.x,
        top: Math.min(...yList) + record.y,
        width: Math.max(...xList) - Math.min(...xList),
        height: Math.max(...yList) - Math.min(...yList),
      };
    });
  }

  getGroupDrawAreas(
    strokePressureInfo: TLStrokePressureInfo
  ): TLGroupDrawArea[] {
    const allDrawArea = this.getAllDrawAreas();
    const groupDrawAreas: TLGroupDrawArea[] = [];
    Object.keys(strokePressureInfo).forEach((id) => {
      const groupID = strokePressureInfo[id].groupID;
      const groupPressure = strokePressureInfo[id].avg;
      const targetDrawArea = allDrawArea.find((drawArea) => drawArea.id === id);
      if (targetDrawArea) {
        const targetGroupDrawArea = groupDrawAreas.find(
          (groupDrawArea) => groupDrawArea.groupID === groupID
        );
        if (targetGroupDrawArea) {
          targetGroupDrawArea.ids.push(id);
          targetGroupDrawArea.left = Math.min(
            targetGroupDrawArea.left,
            targetDrawArea.left
          );
          targetGroupDrawArea.top = Math.min(
            targetGroupDrawArea.top,
            targetDrawArea.top
          );
          targetGroupDrawArea.width = Math.max(
            targetGroupDrawArea.width,
            targetDrawArea.width
          );
          targetGroupDrawArea.height = Math.max(
            targetGroupDrawArea.height,
            targetDrawArea.height
          );
        } else {
          groupDrawAreas.push({
            ids: [id],
            left: targetDrawArea.left,
            top: targetDrawArea.top,
            width: targetDrawArea.width,
            height: targetDrawArea.height,
            groupID: groupID,
            groupPressure: groupPressure,
          });
        }
      }
    });

    return groupDrawAreas;
  }

  getCameraData(): { x: number; y: number; z: number } {
    return {
      x: this.editor.camera.x,
      y: this.editor.camera.y,
      z: this.editor.camera.z,
    };
  }
}
