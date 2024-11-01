import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { Album } from './album.entity';
import { AlbumDTO } from './album.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { GENRE } from '../genre/genre.enum';
import { RECORD_LABEL } from '../recordlabel/recordlabel.enum';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<Album>;

  const mockAlbumRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumService,
        {
          provide: getRepositoryToken(Album),
          useValue: mockAlbumRepository,
        },
      ],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<Album>>(getRepositoryToken(Album));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all albums', async () => {
    const result = [{ id: 1, name: 'Album 1' }];
    mockAlbumRepository.find.mockResolvedValue(result);

    expect(await service.findAll()).toEqual(result);
    expect(mockAlbumRepository.find).toHaveBeenCalledWith({ relations: ["tracks", "performers", "comments"] });
  });

  it('should return a single album by id', async () => {
    const albumId = 1;
    const result = { id: albumId, name: 'Album 1' };
    mockAlbumRepository.findOne.mockResolvedValue(result);

    expect(await service.findOne(albumId)).toEqual(result);
    expect(mockAlbumRepository.findOne).toHaveBeenCalledWith(albumId, { relations: ["tracks", "performers", "comments"] });
  });

  it('should throw NOT_FOUND exception if album not found', async () => {
    const albumId = 1;
    mockAlbumRepository.findOne.mockResolvedValue(null);

    try {
      await service.findOne(albumId);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe("The album with the given id was not found");
      expect(error.type).toBe(BusinessError.NOT_FOUND);
    }
  });

  it('should create a new album', async () => {
    const albumDTO = {
      name: 'New Album',
      cover: 'cover.jpg',
      releaseDate: new Date(),
      description: 'Description',
      genre: GENRE.ROCK,
      recordLabel: RECORD_LABEL.FANIA,
    } as AlbumDTO;  // Casteo a AlbumDTO sin 'id'
    
    const savedAlbum = { ...albumDTO, id: 1 };
    mockAlbumRepository.save.mockResolvedValue(savedAlbum);

    expect(await service.create(albumDTO)).toEqual(savedAlbum);
    expect(mockAlbumRepository.save).toHaveBeenCalled();
  });

  it('should update an existing album', async () => {
    const albumId = 1;
    const albumDTO = {
      name: 'Updated Album',
      cover: 'cover2.jpg',
      releaseDate: new Date(),
      description: 'Updated Description',
      genre: GENRE.CLASSICAL,
      recordLabel: RECORD_LABEL.EMI,
    } as AlbumDTO;  // Casteo a AlbumDTO sin 'id'

    const existingAlbum = { id: albumId, ...albumDTO };
    mockAlbumRepository.findOne.mockResolvedValue(existingAlbum);
    mockAlbumRepository.save.mockResolvedValue(existingAlbum);

    expect(await service.update(albumId, albumDTO)).toEqual(existingAlbum);
    expect(mockAlbumRepository.save).toHaveBeenCalledWith(existingAlbum);
  });

  it('should throw NOT_FOUND exception if album to update does not exist', async () => {
    const albumId = 1;
    const albumDTO = {
      name: 'Updated Album',
      cover: 'cover2.jpg',
      releaseDate: new Date(),
      description: 'Updated Description',
      genre: GENRE.ROCK,
      recordLabel: RECORD_LABEL.EMI,
    } as AlbumDTO;
  
    mockAlbumRepository.findOne.mockResolvedValue(null);
  
    try {
      await service.update(albumId, albumDTO);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe("The album with the given id was not found");
      expect(error.type).toBe(BusinessError.NOT_FOUND);
    }
  });

  it('should delete an album by id', async () => {
    const albumId = 1;
    const album = { id: albumId, name: 'Album to delete' };
    mockAlbumRepository.findOne.mockResolvedValue(album);
    mockAlbumRepository.remove.mockResolvedValue(album);

    expect(await service.delete(albumId)).toEqual(album);
    expect(mockAlbumRepository.remove).toHaveBeenCalledWith(album);
  });

  it('should throw NOT_FOUND exception if album to delete does not exist', async () => {
    const albumId = 1;
    mockAlbumRepository.findOne.mockResolvedValue(null);
  
    try {
      await service.delete(albumId);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe("The album with the given id was not found");
      expect(error.type).toBe(BusinessError.NOT_FOUND);
    }
  });

  it('should throw BAD_REQUEST exception if album data is invalid in create', async () => {
    const invalidAlbumDTO = {
      name: '',
      cover: 'cover.jpg',
      releaseDate: new Date(),
      description: 'Description',
      genre: 'INVALID_GENRE' as GENRE,
      recordLabel: RECORD_LABEL.ELEKTRA,
    };

    try {
      await service.create(invalidAlbumDTO as AlbumDTO);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain("ValidationError");
      expect(error.type).toBe(BusinessError.BAD_REQUEST);
    }
  });

  it('should throw BAD_REQUEST exception if album data is invalid in update', async () => {
    const albumId = 1;
    const invalidAlbumDTO = {
      name: 'Album Name',
      cover: 'cover.jpg',
      releaseDate: new Date(),
      description: 'Description',
      genre: 'INVALID_GENRE' as GENRE,
      recordLabel: RECORD_LABEL.EMI,
    };

    mockAlbumRepository.findOne.mockResolvedValue({ id: albumId }); 

    try {
      await service.update(albumId, invalidAlbumDTO as AlbumDTO);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain("ValidationError");
      expect(error.type).toBe(BusinessError.BAD_REQUEST);
    }
  });
});
