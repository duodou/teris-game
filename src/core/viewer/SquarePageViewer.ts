import { Square } from '../Square';
import $ from 'jquery';
import { IViewer } from '../types';
import PageConfig from './PageConfig';

/**
 * 显示一个小方块到页面上
 */
export class SquarePageViewer implements IViewer {
  private square: Square;
  private container: JQuery<HTMLElement>;
  private dom?: JQuery<HTMLElement>;
  private isRemoved = false;
  constructor(square: Square, container: JQuery<HTMLElement>) {
    this.square = square;
    this.container = container;
  }
  public show() {
    if (this.isRemoved) return;
    if (!this.dom) {
      this.dom = $('<div></div>')
        .css({
          position: 'absolute',
          width: PageConfig.SquareSize.width,
          height: PageConfig.SquareSize.height,
          border: '1px solid #333',
          boxSizing: 'border-box',
        })
        .appendTo(this.container);
    }
    this.dom.css({
      left: this.square.point.x * PageConfig.SquareSize.width,
      top: this.square.point.y * PageConfig.SquareSize.height,
      backgroundColor: this.square.color,
    });
  }
  public remove() {
    if (this.dom && !this.isRemoved) {
      this.dom?.remove();
      this.dom = undefined;
      this.isRemoved = true;
    }
  }
}
