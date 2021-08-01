export interface IContact {
  id?: number;
  name?: string | null;
  phone?: number | null;
}

export class Contact implements IContact {
  constructor(public id?: number, public name?: string | null, public phone?: number | null) {}
}

export function getContactIdentifier(contact: IContact): number | undefined {
  return contact.id;
}
