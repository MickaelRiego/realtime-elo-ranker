import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: any;

  const mockPlayerService = {
    // Le service retourne des Entités (avec 'elo')
    create: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: dto.id, elo: 1200 })),
    findAll: jest.fn().mockResolvedValue([{ id: 'A', elo: 1200 }]),
    findOne: jest.fn().mockResolvedValue({ id: 'A', elo: 1200 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [{ provide: PlayerService, useValue: mockPlayerService }],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get<PlayerService>(PlayerService);
  });

  it('create', async () => {
    const res = await controller.create({ id: 'A' });
    expect(res).toEqual({ id: 'A', rank: 1200 });
    expect(service.create).toHaveBeenCalled();
  });

  it('findAll', async () => {
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 'A', rank: 1200 }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne', async () => {
    const res = await controller.findOne('A');
    expect(res).toEqual({ id: 'A', rank: 1200 });
    expect(service.findOne).toHaveBeenCalledWith('A');
  });
});
