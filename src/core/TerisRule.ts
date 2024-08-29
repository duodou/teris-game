import GameConfig from './GameConfig';
import { Square } from './Square';
import { SquareGroup } from './SquareGroup';
import { Point, Shape, MoveDirection } from './types';

function isPoint(obj: any): obj is Point {
  if (typeof obj.x === 'undefined') {
    return false;
  }
  return true;
}

/**
 * 该类中提供一系列的函数，根据游戏规则判断这种情况
 */
export class TerisRule {
  /**
   * 判断某个形状的方块，是否能够移动到目标位置
   */
  static canIMove(shape: Shape, targetPoint: Point, exists: Square[]): boolean {
    //假设中心点已经移动到了目标位置，算出每个小方块的坐标
    const targetSquarePoints: Point[] = shape.map((it) => {
      return {
        x: it.x + targetPoint.x,
        y: it.y + targetPoint.y,
      };
    });
    //边界判断
    let result = targetSquarePoints.some((point) => {
      //是否超出了边界
      return (
        point.x < 0 ||
        point.x >= GameConfig.panelSize.width ||
        point.y < 0 ||
        point.y >= GameConfig.panelSize.height
      );
    });
    if (result) {
      return false;
    }
    //判断是否与已有的方块有重叠
    result = targetSquarePoints.some((point) =>
      exists.some((sq) => point.x === sq.point.x && point.y === sq.point.y)
    );
    if (result) {
      return false;
    }

    return true;
  }

  static move(
    teris: SquareGroup,
    targetPoint: Point,
    exists: Square[]
  ): boolean;
  static move(
    teris: SquareGroup,
    direction: MoveDirection,
    exists: Square[]
  ): boolean;

  static move(
    teris: SquareGroup,
    targetPointOrDirection: Point | MoveDirection,
    exists: Square[]
  ): boolean {
    if (isPoint(targetPointOrDirection)) {
      if (TerisRule.canIMove(teris.shape, targetPointOrDirection, exists)) {
        //移动成功

        teris.centerPoint = targetPointOrDirection;
        return true;
      }
      return false;
    } else {
      const direction = targetPointOrDirection;
      let targetPoint: Point;
      if (direction === MoveDirection.down) {
        targetPoint = {
          x: teris.centerPoint.x,
          y: teris.centerPoint.y + 1,
        };
      } else if (direction === MoveDirection.left) {
        targetPoint = {
          x: teris.centerPoint.x - 1,
          y: teris.centerPoint.y,
        };
      } else {
        targetPoint = {
          x: teris.centerPoint.x + 1,
          y: teris.centerPoint.y,
        };
      }
      return this.move(teris, targetPoint, exists);
    }
  }

  /**
   * 将当前的方块，移动到目标方向的终点
   * @param teris
   * @param direction
   */
  static moveDirectly(
    teris: SquareGroup,
    direction: MoveDirection,
    exists: Square[]
  ) {
    while (this.move(teris, direction, exists)) {}
  }
  static rotate(teris: SquareGroup, exists: Square[]): boolean {
    const newShape = teris.afterRotateShape(); // 得到旋转后新的形状
    if (this.canIMove(newShape, teris.centerPoint, exists)) {
      teris.rotate();
      return true;
    } else {
      return false;
    }
  }

  /**
   * 获取指定行的所有方块
   *
   * @param exists - 现有的方块数组
   * @param y - 要获取方块的行号
   * @returns 包含指定行所有方块的数组
   */
  private static getLineSquares(exists: Square[], y: number): Square[] {
    return exists.filter((sq) => sq.point.y === y);
  }

  /**
   * 删除存在的方块集中的指定方块
   * @param exists - 现有的方块数组，这些方块将被检查
   * @param squares - 要删除的方块数组
   * @returns 返回消除的行数
   */
  static deleteSquares(exists: Square[]): number {
    //获得y坐标数组
    const ys = exists.map((sq) => sq.point.y);

    //获得最大和最小的y坐标
    const maxY = Math.max(...ys);
    const minY = Math.min(...ys);

    let lineNum: number = 0;

    //循环判断每一行是否可以消除
    for (let y = minY; y <= maxY; y++) {
      //获取当前行的所有方块
      if (this.deleteLine(exists, y)) {
        lineNum++;
      }
    }

    return lineNum;
  }

  private static deleteLine(exists: Square[], y: number): boolean {
    const squares = exists.filter((sq) => sq.point.y === y);
    //如果当前行的方块数量等于总宽度，说明该行可以消除
    if (squares.length === GameConfig.panelSize.width) {
      squares.forEach((sq) => {
        //从界面移除
        if (sq.viewer) {
          sq.viewer.remove();
        }

        const index = exists.indexOf(sq);
        exists.splice(index, 1);
      });
      //剩下的，y坐标比当前y小的方块，y+1
      exists
        .filter((sq) => sq.point.y < y)
        .forEach((sq) => {
          sq.point = {
            x: sq.point.x,
            y: sq.point.y + 1,
          };
        });

      return true;
    }
    return false;
  }
}
