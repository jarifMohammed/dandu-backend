import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomLoggerService } from '../common/services/custom-logger.service';

describe('UserService', () => {
  let service: UserService;

  const mockCustomLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: CustomLoggerService,
          useValue: mockCustomLoggerService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return a message about adding a new user', () => {
      const createUserDto: CreateUserDto = {
        // Add properties based on your CreateUserDto
      };

      const result = service.create(createUserDto);

      expect(result).toBe('This action adds a new user');
    });

    it('should accept any CreateUserDto input', () => {
      const createUserDto: CreateUserDto = {} as CreateUserDto;

      const result = service.create(createUserDto);

      expect(typeof result).toBe('string');
      expect(result).toContain('adds a new user');
    });
  });

  describe('findAll', () => {
    it('should return a message about returning all users', () => {
      const result = service.findAll();

      expect(result).toBe('This action returns all user');
    });

    it('should return a string', () => {
      const result = service.findAll();

      expect(typeof result).toBe('string');
    });
  });

  describe('findOne', () => {
    it('should return a message with the user id', () => {
      const userId = 1;

      const result = service.findOne(userId);

      expect(result).toBe('This action returns a #1 user');
    });

    it('should work with different ids', () => {
      const userId = 42;

      const result = service.findOne(userId);

      expect(result).toBe('This action returns a #42 user');
      expect(result).toContain(`#${userId}`);
    });

    it('should handle zero as an id', () => {
      const userId = 0;

      const result = service.findOne(userId);

      expect(result).toBe('This action returns a #0 user');
    });

    it('should handle negative ids', () => {
      const userId = -5;

      const result = service.findOne(userId);

      expect(result).toContain(`#${userId}`);
    });
  });

  describe('update', () => {
    it('should return a message about updating a user', () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {};

      const result = service.update(userId, updateUserDto);

      expect(result).toBe('This action updates a #1 user');
    });

    it('should work with different ids and update data', () => {
      const userId = 10;
      const updateUserDto: UpdateUserDto = {
        // Add some update properties
      };

      const result = service.update(userId, updateUserDto);

      expect(result).toBe('This action updates a #10 user');
      expect(result).toContain(`#${userId}`);
    });

    it('should accept empty UpdateUserDto', () => {
      const userId = 5;
      const updateUserDto: UpdateUserDto = {};

      const result = service.update(userId, updateUserDto);

      expect(typeof result).toBe('string');
      expect(result).toContain('updates');
    });
  });

  describe('remove', () => {
    it('should return a message about removing a user', () => {
      const userId = 1;

      const result = service.remove(userId);

      expect(result).toBe('This action removes a #1 user');
    });

    it('should work with different ids', () => {
      const userId = 99;

      const result = service.remove(userId);

      expect(result).toBe('This action removes a #99 user');
      expect(result).toContain(`#${userId}`);
    });

    it('should return a string for any valid id', () => {
      const userId = 7;

      const result = service.remove(userId);

      expect(typeof result).toBe('string');
      expect(result).toContain('removes');
    });
  });
});
