import { IViewer, Point } from './types';
/**
 * 小方块
 */
export class Square {
  private _point: Point = {
    x: 0,
    y: 0,
  };
  private _color: string = '';

  //属性：显示者
  private _viewer?: IViewer;

  public get viewer(): IViewer | undefined {
    if (this._viewer) {
      return this._viewer;
    } else {
      console.log('没有显示者');
      return undefined;
    }
  }
  public set viewer(value: IViewer) {
    this._viewer = value;
    if (value) {
      value.show();
    }
  }

  public get point(): Point {
    return this._point;
  }
  public set point(value: Point) {
    this._point = value;
    //完成显示
    if (this._viewer) {
      this._viewer.show();
    }
  }
  public get color() {
    return this._color;
  }

  public set color(val) {
    this._color = val;
  }
  // constructor(point: Point, color: string) {
  //   this._point = point;
  //   this._color = color;
  // }
}
