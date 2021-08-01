export interface IGrade {
  id?: number;
  grade?: string | null;
}

export class Grade implements IGrade {
  constructor(public id?: number, public grade?: string | null) {}
}

export function getGradeIdentifier(grade: IGrade): number | undefined {
  return grade.id;
}
