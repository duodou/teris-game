import { Game } from '../Game';
import GameConfig from '../GameConfig';
import { SquareGroup } from '../SquareGroup';
import { GameStatus, GameViewer } from '../types';
import PageConfig from './PageConfig';
import { SquarePageViewer } from './SquarePageViewer';
import $ from 'jquery';

export class GamePageViewer implements GameViewer {
  onGamePause(): void {
    this.msgDom.css({
      display: 'flex',
    });
    this.msgDom.find('p').html('游戏暂停');
  }
  onGameStart(): void {
    this.msgDom.hide();
  }
  onGameOver(): void {
    this.msgDom.css({
      display: 'flex',
    });
    this.msgDom.find('p').html('游戏结束');
  }
  showScore(score: number): void {
    this.scoreDom.html(score.toString());
  }
  private nextDom = $('#next');
  private panelDom = $('#panel');
  private scoreDom = $('#score');
  private msgDom = $('#msg');
  init(game: Game): void {
    //设置宽高
    this.panelDom.css({
      width: GameConfig.panelSize.width * PageConfig.SquareSize.width,
      height: GameConfig.panelSize.height * PageConfig.SquareSize.height,
    });
    this.nextDom.css({
      width: GameConfig.nextSize.width * PageConfig.SquareSize.width,
      height: GameConfig.nextSize.height * PageConfig.SquareSize.height,
    });

    //注册键盘事件
    $(document).keydown((e) => {
      if (e.key === 'ArrowLeft') {
        game.controlLeft();
      } else if (e.key === 'ArrowRight') {
        game.controlRight();
      } else if (e.key === 'ArrowDown') {
        game.controlDown();
      } else if (e.key === 'ArrowUp') {
        game.controlRotate();
      } else if (e.key === ' ') {
        if (game.gameStatus === GameStatus.playing) {
          game.pause();
        } else {
          game.start();
        }
      }
    });
  }
  showNext(teris: SquareGroup): void {
    teris.squares.forEach((sq) => {
      sq.viewer = new SquarePageViewer(sq, $('#next'));
    });
  }
  switch(teris: SquareGroup): void {
    teris.squares.forEach((sq) => {
      sq.viewer!.remove();
      sq.viewer = new SquarePageViewer(sq, $('#panel'));
    });
  }
}
