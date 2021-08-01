export interface IVillage {
  id?: number;
  board?: string | null;
  village?: string | null;
}

export class Village implements IVillage {
  constructor(public id?: number, public board?: string | null, public village?: string | null) {}
}

export function getVillageIdentifier(village: IVillage): number | undefined {
  return village.id;
}
