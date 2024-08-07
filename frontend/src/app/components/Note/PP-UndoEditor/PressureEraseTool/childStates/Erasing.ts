import { getDefaultStore } from "jotai";
import {
  StateNode,
  TLEventHandlers,
  TLFrameShape,
  TLGroupShape,
  TLPointerEventInfo,
  TLShapeId,
  pointInPolygon,
} from "tldraw";
import { pModeAtom, strokePressureInfoAtom } from "@/app/hooks";

const HIT_TEST_MARGIN = 4;

export class Erasing extends StateNode {
  static override id = "pressure-erasing";

  private info = {} as TLPointerEventInfo;
  private scribbleId = "id";
  private markId = "";
  private excludedShapeIds = new Set<TLShapeId>();

  override onEnter = (info: TLPointerEventInfo) => {
    this.markId = "pressure-erase scribble begin";
    this.editor.mark(this.markId);
    this.info = info;

    const { originPagePoint } = this.editor.inputs;
    this.excludedShapeIds = new Set(
      this.editor
        .getCurrentPageShapes()
        .filter((shape) => {
          //If the shape is locked, we shouldn't erase it
          if (this.editor.isShapeOrAncestorLocked(shape)) return true;
          //If the shape is a group or frame, check we're inside it when we start erasing
          if (
            this.editor.isShapeOfType<TLGroupShape>(shape, "group") ||
            this.editor.isShapeOfType<TLFrameShape>(shape, "frame")
          ) {
            const pointInShapeShape = this.editor.getPointInShapeSpace(
              shape,
              originPagePoint
            );
            const geometry = this.editor.getShapeGeometry(shape);
            return geometry.bounds.containsPoint(pointInShapeShape);
          }

          return false;
        })
        .map((shape) => shape.id)
    );

    const scribble = this.editor.scribbles.addScribble({
      color: "muted-1",
      size: 12,
    });
    this.scribbleId = scribble.id;

    this.update();
  };

  private pushPointToScribble = () => {
    const { x, y } = this.editor.inputs.currentPagePoint;
    this.editor.scribbles.addPoint(this.scribbleId, x, y);
  };

  override onExit = () => {
    this.editor.scribbles.stop(this.scribbleId);
  };

  override onPointerMove = () => {
    this.update();
  };

  override onPointerUp: TLEventHandlers["onPointerUp"] = () => {
    this.complete();
  };

  override onCancel: TLEventHandlers["onCancel"] = () => {
    this.cancel();
  };

  override onComplete: TLEventHandlers["onComplete"] = () => {
    this.complete();
  };

  update() {
    const erasingShapeIds = this.editor.getErasingShapeIds();
    const zoomLevel = this.editor.getZoomLevel();
    const currentPageShapes = this.editor.getCurrentPageShapes();
    const {
      inputs: { currentPagePoint, previousPagePoint },
    } = this.editor;

    const store = getDefaultStore();
    const strokePressureInfo = store.get(strokePressureInfoAtom);
    const pMode = store.get(pModeAtom);

    const { excludedShapeIds } = this;

    this.pushPointToScribble();

    const erasing = new Set<TLShapeId>(erasingShapeIds);

    for (const shape of currentPageShapes) {
      if (this.editor.isShapeOfType<TLGroupShape>(shape, "group")) continue;

      // Avoid testing masked shapes, unless the pointer is inside the mask
      const pageMask = this.editor.getShapeMask(shape.id);
      if (pageMask && !pointInPolygon(currentPagePoint, pageMask)) {
        continue;
      }

      // Hit test the shape using a line segment
      const geometry = this.editor.getShapeGeometry(shape);
      const A = this.editor.getPointInShapeSpace(shape, previousPagePoint);
      const B = this.editor.getPointInShapeSpace(shape, currentPagePoint);

      // shapeのzの平均値を取得
      const shapeProps: any = shape.props;

      try {
        switch (pMode) {
          case "average":
            if (
              geometry.hitTestLineSegment(A, B, HIT_TEST_MARGIN / zoomLevel)
            ) {
              const avg =
                shapeProps.segments[0].points.reduce(
                  (acc: number, cur: any) => acc + cur.z,
                  0
                ) / shapeProps.segments[0].points.length;
              let isErase = false;
              if (0.3 >= currentPagePoint.z && 0.3 >= avg) {
                isErase = true;
              } else if (
                0.7 >= currentPagePoint.z &&
                0.7 >= avg &&
                0.3 < currentPagePoint.z &&
                0.3 < avg
              ) {
                isErase = true;
              } else if (0.7 <= currentPagePoint.z && 0.7 <= avg) {
                isErase = true;
              }

              if (isErase) {
                erasing.add(this.editor.getOutermostSelectableShape(shape).id);
              }
            }
            break;
          case "grouping":
            if (
              geometry.hitTestLineSegment(A, B, HIT_TEST_MARGIN / zoomLevel)
            ) {
              const groupPressure = strokePressureInfo[shape.id].group;
              let isErase = false;
              if (0.3 >= currentPagePoint.z && 0.3 >= groupPressure) {
                isErase = true;
              } else if (
                0.7 >= currentPagePoint.z &&
                0.7 >= groupPressure &&
                0.3 < currentPagePoint.z &&
                0.3 < groupPressure
              ) {
                isErase = true;
              } else if (0.7 <= currentPagePoint.z && 0.7 <= groupPressure) {
                isErase = true;
              }

              if (isErase) {
                erasing.add(this.editor.getOutermostSelectableShape(shape).id);
              }
            }
            break;
          default:
            break;
        }
      } catch (e) {
        continue;
      }
    }

    this.editor.setErasingShapes(
      Array.from(erasing).filter((id) => !excludedShapeIds.has(id))
    );
  }

  complete() {
    this.editor.deleteShapes(this.editor.getCurrentPageState().erasingShapeIds);
    this.editor.setErasingShapes([]);
    this.parent.transition("idle", this.info);
  }

  cancel() {
    this.editor.setErasingShapes([]);
    this.editor.bailToMark(this.markId);
    this.parent.transition("idle", this.info);
  }
}
