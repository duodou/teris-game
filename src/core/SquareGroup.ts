import { Square } from './Square';
import { Point, Shape } from './types';
/**
 * 组合方块
 */
export class SquareGroup {
  private _squares: readonly Square[] = [];

  public get squares() {
    return this._squares;
  }

  public get shape() {
    return this._shape;
  }
  public get centerPoint() {
    return this._centerPoint;
  }
  public set centerPoint(point: Point) {
    this._centerPoint = point;
    //同时设置其他所有小方块坐标
    this.setSquarePoints();
  }

  /**
   * 根据中心点坐标，以及形状，设置每一个小方块的坐标
   */
  private setSquarePoints() {
    this._shape.forEach((point, i) => {
      this._squares[i].point = {
        x: this._centerPoint.x + point.x,
        y: this._centerPoint.y + point.y,
      };
    });
  }
  constructor(
    private _shape: Shape,
    private _centerPoint: Point,
    private _color: string
  ) {
    //设置小方块数组
    const temp: Square[] = [];
    this._shape.forEach((point) => {
      const sq = new Square();
      sq.color = this._color;
      sq.point = {
        x: this._centerPoint.x + point.x,
        y: this._centerPoint.y + point.y,
      };
      temp.push(sq);
    });
    this._squares = temp;
  }
  /**
   * 旋转方向是否为顺时针
   */
  protected isClock = true;
  afterRotateShape(): Shape {
    if (this.isClock) {
      return this._shape.map((p) => {
        const newP: Point = {
          x: -p.y,
          y: p.x,
        };
        return newP;
      });
    } else {
      return this._shape.map((p) => {
        const newP: Point = {
          x: p.y,
          y: -p.x,
        };
        return newP;
      });
    }
  }

  rotate() {
    const newShape = this.afterRotateShape();
    this._shape = newShape;
    this.setSquarePoints();
  }
}
