import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player1ID: string;

  @Column()
  player2ID: string;

  @Column({ type: 'varchar', nullable: true })
  winnerID: string | null;

  @Column()
  playedAt: Date;
}
