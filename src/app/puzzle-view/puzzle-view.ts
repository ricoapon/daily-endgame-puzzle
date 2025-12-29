import {Component, computed, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {ChessboardView} from '../chessboard-view/chessboard-view';
import {getPuzzle, getPuzzleIdOfToday, previousPuzzleId, totalNrOfPuzzles} from '../puzzles';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-puzzle-view',
  imports: [ChessboardView],
  templateUrl: './puzzle-view.html',
  styleUrl: './puzzle-view.css',
  standalone: true
})
export class PuzzleView implements OnInit {
  @ViewChild('boardParentDiv') boardParentDiv!: ElementRef
  @ViewChild('chessboard') chessboard!: ChessboardView

  protected readonly puzzleId = signal(getPuzzleIdOfToday())
  protected readonly fen = computed(() => getPuzzle(this.puzzleId()))

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const routePuzzleId = params.get('id')
      if (routePuzzleId !== null) {
        this.puzzleId.set(+routePuzzleId)
      }
    })
  }

  colorToMove(): 'White' | 'Black' {
    return this.fen().includes(" w ") ? 'White' : 'Black'
  }

  goToPuzzle() {
    const answer = prompt(`Enter Puzzle day (from 0 to ${totalNrOfPuzzles() - 1}):`)
    // Cancel was clicked.
    if (answer === null) {
      return;
    }
    const id = Number(answer);
    if (Number.isInteger(id) && id >= 0 && id < totalNrOfPuzzles()) {
      this.router.navigate(['/puzzle', id])
    } else if (id !== null) {
      alert("Please enter a valid integer.");
    }
  }

  previousPuzzle() {
    this.router.navigate(['/puzzle', previousPuzzleId(this.puzzleId())])
  }

  openInLichess() {
    const url = 'https://lichess.org/analysis/' + this.fen() + (this.colorToMove() === 'Black' ? '?color=black' : '')
    window.open(url, '_blank')
  }
}
