import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Player {
  @PrimaryColumn()
  id: string;

  @Column({ default: 1200 })
  elo: number;
}
