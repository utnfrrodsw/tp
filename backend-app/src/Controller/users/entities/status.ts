import { Column } from 'typeorm';

export class Status {
  @Column()
  State: string;
}

export enum State {
  ACTIVED = 'Actived',
  DELETED = 'Deleted',
}
