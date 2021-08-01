import * as dayjs from 'dayjs';

export interface ISlip {
  id?: number;
  date?: dayjs.Dayjs | null;
  tbgr?: number | null;
  grade?: string | null;
  lotno?: number | null;
  weight?: number | null;
  price?: number | null;
}

export class Slip implements ISlip {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public tbgr?: number | null,
    public grade?: string | null,
    public lotno?: number | null,
    public weight?: number | null,
    public price?: number | null
  ) {}
}

export function getSlipIdentifier(slip: ISlip): number | undefined {
  return slip.id;
}
