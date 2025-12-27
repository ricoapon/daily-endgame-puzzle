import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Chessground} from '@lichess-org/chessground';
import {Config} from '@lichess-org/chessground/config';
import {Api} from '@lichess-org/chessground/api';

@Component({
  selector: 'app-chessboard-view',
  imports: [],
  templateUrl: './chessboard-view.html',
  styleUrl: './chessboard-view.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class ChessboardView implements AfterViewInit, OnChanges {
  @ViewChild('boardContainer') boardContainer!: ElementRef<HTMLDivElement>
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLDivElement>
  @Input() fen!: string
  chessgroundInstance!: Api

  @HostListener('window:resize')
  onResize() {
    this.resizeSquare()
  }

  // The board has no responsive functionality, so we resize it ourselves.
  private resizeSquare() {
    // Use the minimal size of the width and height. Subtract 2 to avoid scrollbars.
    const size = Math.min(
      this.wrapper.nativeElement.clientWidth,
      this.wrapper.nativeElement.clientHeight
    ) - 2

    this.boardContainer.nativeElement.style.width = size + 'px'
    this.boardContainer.nativeElement.style.height = size + 'px'
  }

  ngAfterViewInit() {
    // Create immutable board inside the container.
    const config: Config = {
      draggable: {
        enabled: false
      },
      movable: {
        free: false,
      },
      drawable: {
        enabled: false,
      },
      selectable: {
        enabled: false,
      }
    }
    this.chessgroundInstance = Chessground(this.boardContainer.nativeElement, config)

    this.updateBoardFromFen(this.fen)
    this.resizeSquare()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fen'] && !changes['fen'].firstChange) {
      this.updateBoardFromFen(changes['fen'].currentValue);
    }
  }

  private updateBoardFromFen(fen: string) {
    if (!this.chessgroundInstance) {
      return;
    }

    this.chessgroundInstance.set({
      fen: fen,
      orientation: this.determineOrientation(fen)
    });
  }

  private determineOrientation(fen: string): 'white' | 'black' {
    return fen.includes(" w ") ? 'white' : 'black'
  }
}
