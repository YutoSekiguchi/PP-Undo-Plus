// EditorUtils.ts
import { TLGroupDrawArea, TLStrokePressureInfo } from "@/@types/note";
import {
  DefaultDashStyle,
  DefaultSizeStyle,
  Editor,
  JsonObject,
  StoreSnapshot,
  TLParentId,
  TLRecord,
  TLShape,
  TLShapeId,
  TLUnknownShape,
} from "@tldraw/tldraw";

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

  async getSvgWithStroke(
    shapes: TLShape[] | TLShapeId[]
  ): Promise<SVGElement | undefined> {
    try {
      return await this.editor.getSvg(shapes);
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
      const groupPressure = strokePressureInfo[id].group;
      const targetDrawArea = allDrawArea.find((drawArea) => drawArea.id === id);

      if (targetDrawArea) {
        const targetGroupDrawArea = groupDrawAreas.find(
          (groupDrawArea) => groupDrawArea.groupID === groupID
        );

        if (targetGroupDrawArea) {
          targetGroupDrawArea.ids.push(id);

          // Calculate the right and bottom coordinates
          const right = Math.max(
            targetGroupDrawArea.left + targetGroupDrawArea.width,
            targetDrawArea.left + targetDrawArea.width
          );
          const bottom = Math.max(
            targetGroupDrawArea.top + targetGroupDrawArea.height,
            targetDrawArea.top + targetDrawArea.height
          );

          // Update left and top coordinates
          const newLeft = Math.min(
            targetGroupDrawArea.left,
            targetDrawArea.left
          );
          const newTop = Math.min(targetGroupDrawArea.top, targetDrawArea.top);

          // Update width and height based on the new left and top coordinates
          targetGroupDrawArea.width = right - newLeft;
          targetGroupDrawArea.height = bottom - newTop;

          // Update left and top coordinates
          targetGroupDrawArea.left = newLeft;
          targetGroupDrawArea.top = newTop;
        } else {
          // Calculate the right and bottom coordinates for the first draw area in the group
          const right = targetDrawArea.left + targetDrawArea.width;
          const bottom = targetDrawArea.top + targetDrawArea.height;

          groupDrawAreas.push({
            ids: [id],
            left: targetDrawArea.left,
            top: targetDrawArea.top,
            width: right - targetDrawArea.left,
            height: bottom - targetDrawArea.top,
            groupID: groupID,
            groupPressure: groupPressure,
          });
        }
      }
    });

    return groupDrawAreas;
  }

  getGroupDrawAreasByGroupID(
    groupID: number,
    strokePressureInfo: TLStrokePressureInfo
  ): TLGroupDrawArea | undefined {
    const groupDrawAreas = this.getGroupDrawAreas(strokePressureInfo);
    return groupDrawAreas.find(
      (groupDrawArea) => groupDrawArea.groupID === groupID
    );
  }

  getGroupDrawAreaPressureByGroupID(
    groupID: number,
    strokePressureInfo: TLStrokePressureInfo
  ): number | undefined {
    const groupDrawAreas = this.getGroupDrawAreas(strokePressureInfo);
    const targetGroupDrawArea = groupDrawAreas.find(
      (groupDrawArea) => groupDrawArea.groupID === groupID
    );
    return targetGroupDrawArea ? targetGroupDrawArea.groupPressure : undefined;
  }

  getZoomLevel(): number {
    return this.editor.zoomLevel;
  }

  getCameraData(): { x: number; y: number; z: number } {
    return {
      x: this.editor.camera.x,
      y: this.editor.camera.y,
      z: this.editor.camera.z,
    };
  }

  setStrokeShape(strokeShape: "dashed" | "dotted" | "draw" | "solid"): void {
    this.editor.setStyleForNextShapes(DefaultDashStyle, strokeShape);
  }

  setStrokeSize(size: "s" | "m" | "l" | "xl"): void {
    this.editor.setStyleForNextShapes(DefaultSizeStyle, size);
  }

  undo(): void {
    this.editor.undo();
  }

  getShapeById(id: TLParentId): TLShape | undefined {
    return this.editor.getShape(id);
  }

  getShapeColor(
    id: TLParentId
  ):
    | "black"
    | "blue"
    | "green"
    | "grey"
    | "light-blue"
    | "light-green"
    | "light-red"
    | "light-violet"
    | "orange"
    | "red"
    | "violet"
    | "yellow" {
    const shape = this.editor.getShape(id);
    if (shape && "props" in shape && "color" in shape.props) {
      return shape.props.color;
    }
    return "black";
  }

  setColorOfGroupingShapes(strokePressureInfo: TLStrokePressureInfo): void {
    const allRecords = this.editor.store.allRecords();
    allRecords.forEach((record: any) => {
      if (record.type === "draw") {
        const shape = this.editor.getShape(record.id as TLShapeId);
        if (shape && "props" in shape && "color" in shape.props) {
          const id = shape.id;
          const groupID = strokePressureInfo[id].groupID;
          const groupPressure = strokePressureInfo[id].group;
          const color:
            | "black"
            | "blue"
            | "green"
            | "grey"
            | "light-blue"
            | "light-green"
            | "light-red"
            | "light-violet"
            | "orange"
            | "red"
            | "violet"
            | "yellow" =
            groupPressure > 0.8
              ? "red"
              : groupPressure > 0.7
              ? "orange"
              : groupPressure > 0.6
              ? "yellow"
              : groupPressure >= 0.5
              ? "green"
              : groupPressure > 0.4
              ? "light-green"
              : groupPressure > 0.3
              ? "light-blue"
              : "blue";

          if (groupID === 0) {
            shape.props.color = color;
          } else {
            const groupShape = this.editor.getShape(record.id);
            if (
              groupShape &&
              "props" in groupShape &&
              "color" in groupShape.props
            ) {
              console.log("groupShape", groupShape);
              console.log(groupShape.props);
              this.editor.getShape(groupShape.id);
              this.editor.updateShape({
                id: groupShape.id,
                props: {
                  ...groupShape.props,
                  color: color,
                },
              } as { id: TLShapeId; type: string; props?: object | undefined; meta?: Partial<JsonObject> | undefined } & Partial<Omit<TLUnknownShape, "props" | "id" | "meta" | "type">>);
            }
          }
        }
      }
    });
  }

  // strokePressureInfoを渡してidが一致するもののストロークの色をstrokePressureInfo.colorに変える
  setColorOfShapes(strokePressureInfo: TLStrokePressureInfo): void {
    const allRecords = this.editor.store.allRecords();
    allRecords.forEach((record: any) => {
      if (record.type === "draw") {
        const shape = this.editor.getShape(record.id as TLShapeId);
        if (shape && "props" in shape && "color" in shape.props) {
          const id = shape.id;
          const color:
            | "black"
            | "blue"
            | "green"
            | "grey"
            | "light-blue"
            | "light-green"
            | "light-red"
            | "light-violet"
            | "orange"
            | "red"
            | "violet"
            | "yellow" = strokePressureInfo[id].color;

          this.editor.updateShape({
            id: record.id,
            props: {
              ...shape.props,
              color: color,
            },
          } as { id: TLShapeId; type: string; props?: object | undefined; meta?: Partial<JsonObject> | undefined } & Partial<Omit<TLUnknownShape, "props" | "id" | "meta" | "type">>);
        }
      }
    });
  }
}
