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
} from "tldraw";

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
      return await this.editor.getSvg(this.editor.getCurrentPageShapes());
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

  getGroupPressureByStrokeID(
    strokeID: string,
    strokePressureInfo: TLStrokePressureInfo
  ): number | undefined {
    return strokePressureInfo[strokeID] ? strokePressureInfo[strokeID].group : undefined;
  }

  getZoomLevel(): number {
    return this.editor.getZoomLevel();
  }

  getCameraData(): { x: number; y: number; z: number } {
    return {
      x: this.editor.getCamera().x,
      y: this.editor.getCamera().y,
      z: this.editor.getCamera().z,
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
    | "white"
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
          if (strokePressureInfo[id] && strokePressureInfo[id].groupID) {
            const groupID = strokePressureInfo[id].groupID;
            const groupPressure = strokePressureInfo[id].group;
            const color:
              | "white"
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
          if (strokePressureInfo[id] && strokePressureInfo[id].color) {
            const color:
              | "white"
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
      }
    });
  }

  // ストロークのバウンディングボックスを取得する関数
  getBounds(stroke: any): { minX: number; minY: number; maxX: number; maxY: number }{
    if (!stroke || !stroke.props || !stroke.props.segments) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    const points = stroke.props.segments[0].points;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
  
    for (const point of points) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    minX += stroke.x;
    minY += stroke.y;
    maxX += stroke.x;
    maxY += stroke.y;
  
    return { minX, minY, maxX, maxY };
  };

  isStrokeEnclosed(stroke: any, enclosingStroke: any): boolean {
    const strokeBounds = this.getBounds(stroke);
    const enclosingStrokeBounds = this.getBounds(enclosingStroke);
    
    console.log(stroke);
    console.log(strokeBounds);
    console.log(enclosingStrokeBounds);

    return (
      strokeBounds.minX >= enclosingStrokeBounds.minX &&
      strokeBounds.maxX <= enclosingStrokeBounds.maxX &&
      strokeBounds.minY >= enclosingStrokeBounds.minY &&
      strokeBounds.maxY <= enclosingStrokeBounds.maxY
    );
  };
  
  setErasingShapes(erasingShapeIds: TLShapeId[]): void {
    const erasingShapeIdsCopy = [...erasingShapeIds];
    this.editor.setErasingShapes(erasingShapeIdsCopy);
  }

  getErasingShapes(): TLShapeId[] {
    return this.editor.getCurrentPageState().erasingShapeIds;
  }

  // ストロークの削除
  deleteShapes(shapeIds: TLShapeId[]): void {
    this.editor.deleteShapes(shapeIds);
  }

  setEnclosingShapeStyles(
    enclosingShapeId: TLShapeId,
    color: string,
    strokeStyle?: "dashed" | "dotted" | "draw" | "solid",
    strokeWidth?: "s" | "m" | "l" | "xl",
  ): void {
    const allRecords = this.editor.store.allRecords();
    allRecords.forEach((record: any) => {
      if (record.type === "draw") {
        const shape = this.editor.getShape(record.id as TLShapeId);
        if (shape && "props" in shape && "color" in shape.props) {
          if (this.isStrokeEnclosed(shape, enclosingShapeId)) {
            this.editor.updateShape({
              id: record.id,
              props: {
                ...shape.props,
                strokeStyle: strokeStyle || "dashed",
                strokeWidth: strokeWidth || "s",
                color: color,
              },
            } as { id: TLShapeId; type: string; props?: object | undefined; meta?: Partial<JsonObject> | undefined } & Partial<Omit<TLUnknownShape, "props" | "id" | "meta" | "type">>);
          }
        }
      }
    }
    );
  }
}
