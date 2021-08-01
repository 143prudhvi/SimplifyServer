export interface IBoard {
  id?: number;
  board?: string | null;
}

export class Board implements IBoard {
  constructor(public id?: number, public board?: string | null) {}
}

export function getBoardIdentifier(board: IBoard): number | undefined {
  return board.id;
}
