import { Test, TestingModule } from '@nestjs/testing';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { AlbumDTO } from './album.dto';
import { GENRE } from "../genre/genre.enum";
import { RECORD_LABEL } from "../recordlabel/recordlabel.enum";

describe('AlbumController', () => {
  let controller: AlbumController;
  let service: AlbumService;

  const mockAlbumService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumController],
      providers: [
        {
          provide: AlbumService,
          useValue: mockAlbumService,
        },
      ],
    }).compile();

    controller = module.get<AlbumController>(AlbumController);
    service = module.get<AlbumService>(AlbumService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all albums', async () => {
    const result = [{ id: 1, name: 'Album 1', cover: 'cover1.jpg', releaseDate: new Date(), description: 'Description 1', genre: GENRE.CLASSICAL, recordLabel: RECORD_LABEL.SONY }];
    mockAlbumService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
    expect(mockAlbumService.findAll).toHaveBeenCalled();
  });

  it('should return a single album by id', async () => {
    const albumId = 1;
    const result = { id: albumId, name: 'Album 1', cover: 'cover1.jpg', releaseDate: new Date(), description: 'Description 1', genre: GENRE.FOLK, recordLabel: RECORD_LABEL.SONY };
    mockAlbumService.findOne.mockResolvedValue(result);

    expect(await controller.findOne(albumId)).toEqual(result);
    expect(mockAlbumService.findOne).toHaveBeenCalledWith(albumId);
  });

  it('should create a new album', async () => {
    const albumDTO: AlbumDTO = { id: 1, name: 'New Album', cover: 'cover2.jpg', releaseDate: new Date(), description: 'New Description', genre: GENRE.ROCK, recordLabel: RECORD_LABEL.ELEKTRA };
    const result = { ...albumDTO };
    mockAlbumService.create.mockResolvedValue(result);

    expect(await controller.create(albumDTO)).toEqual(result);
    expect(mockAlbumService.create).toHaveBeenCalledWith(albumDTO);
  });

  it('should update an album by id', async () => {
    const albumId = 1;
    const albumDTO: AlbumDTO = { id: albumId, name: 'Updated Album', cover: 'cover3.jpg', releaseDate: new Date(), description: 'Updated Description', genre: GENRE.ROCK, recordLabel: RECORD_LABEL.FUENTES };
    const result = { ...albumDTO };
    mockAlbumService.update.mockResolvedValue(result);

    expect(await controller.update(albumId, albumDTO)).toEqual(result);
    expect(mockAlbumService.update).toHaveBeenCalledWith(albumId, albumDTO);
  });

  it('should delete an album by id', async () => {
    const albumId = 1;
    mockAlbumService.delete.mockResolvedValue(undefined);

    expect(await controller.delete(albumId)).toBeUndefined();
    expect(mockAlbumService.delete).toHaveBeenCalledWith(albumId);
  });
});
