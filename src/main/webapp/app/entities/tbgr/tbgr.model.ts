export interface ITbgr {
  id?: number;
  board?: string | null;
  village?: string | null;
  tbgr?: number | null;
  name?: string | null;
}

export class Tbgr implements ITbgr {
  constructor(
    public id?: number,
    public board?: string | null,
    public village?: string | null,
    public tbgr?: number | null,
    public name?: string | null
  ) {}
}

export function getTbgrIdentifier(tbgr: ITbgr): number | undefined {
  return tbgr.id;
}
