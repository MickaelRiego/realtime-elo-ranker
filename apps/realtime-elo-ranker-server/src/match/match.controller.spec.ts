import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

describe('MatchController', () => {
  let controller: MatchController;
  let service: any;

  const mockMatchService = {
    create: jest.fn().mockResolvedValue({ winner: 'A', loser: 'B' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [{ provide: MatchService, useValue: mockMatchService }],
    }).compile();

    controller = module.get<MatchController>(MatchController);
    service = module.get<MatchService>(MatchService);
  });

  it('create', async () => {
    const res = await controller.create({
      winner: 'A',
      loser: 'B',
      draw: false,
    });
    expect(res).toEqual({ winner: 'A', loser: 'B' });
    expect(service.create).toHaveBeenCalled();
  });
});
