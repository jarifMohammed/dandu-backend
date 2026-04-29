import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomLoggerService } from '../common/services/custom-logger.service';

describe('UserController', () => {
  let controller: UserController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockCustomLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: CustomLoggerService,
          useValue: mockCustomLoggerService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', () => {
      const createUserDto: CreateUserDto = {} as CreateUserDto;
      const expectedResult = 'This action adds a new user';

      mockUserService.create.mockReturnValue(expectedResult);

      const result = controller.create(createUserDto);

      expect(result).toBe(expectedResult);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
    });

    it('should pass the correct DTO to the service', () => {
      const createUserDto: CreateUserDto = {} as CreateUserDto;

      mockUserService.create.mockReturnValue('result');

      controller.create(createUserDto);

      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should return whatever the service returns', () => {
      const createUserDto: CreateUserDto = {} as CreateUserDto;
      const serviceResponse = 'Custom response from service';

      mockUserService.create.mockReturnValue(serviceResponse);

      const result = controller.create(createUserDto);

      expect(result).toBe(serviceResponse);
    });
  });

  describe('findAll', () => {
    it('should return all users', () => {
      const expectedResult = 'This action returns all user';

      mockUserService.findAll.mockReturnValue(expectedResult);

      const result = controller.findAll();

      expect(result).toBe(expectedResult);
      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call service without any parameters', () => {
      mockUserService.findAll.mockReturnValue('result');

      controller.findAll();

      expect(mockUserService.findAll).toHaveBeenCalledWith();
    });

    it('should return whatever the service returns', () => {
      const serviceResponse = 'Custom list of users';

      mockUserService.findAll.mockReturnValue(serviceResponse);

      const result = controller.findAll();

      expect(result).toBe(serviceResponse);
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', () => {
      const userId = '1';
      const expectedResult = 'This action returns a #1 user';

      mockUserService.findOne.mockReturnValue(expectedResult);

      const result = controller.findOne(userId);

      expect(result).toBe(expectedResult);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', () => {
      const userId = '42';

      mockUserService.findOne.mockReturnValue('result');

      controller.findOne(userId);

      expect(mockUserService.findOne).toHaveBeenCalledWith(42);
    });

    it('should work with different ids', () => {
      const userId = '999';

      mockUserService.findOne.mockReturnValue('result');

      controller.findOne(userId);

      expect(mockUserService.findOne).toHaveBeenCalledWith(999);
    });

    it('should return whatever the service returns', () => {
      const userId = '5';
      const serviceResponse = 'User with id 5';

      mockUserService.findOne.mockReturnValue(serviceResponse);

      const result = controller.findOne(userId);

      expect(result).toBe(serviceResponse);
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {};
      const expectedResult = 'This action updates a #1 user';

      mockUserService.update.mockReturnValue(expectedResult);

      const result = controller.update(userId, updateUserDto);

      expect(result).toBe(expectedResult);
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(mockUserService.update).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', () => {
      const userId = '10';
      const updateUserDto: UpdateUserDto = {};

      mockUserService.update.mockReturnValue('result');

      controller.update(userId, updateUserDto);

      expect(mockUserService.update).toHaveBeenCalledWith(10, updateUserDto);
    });

    it('should pass the correct DTO to the service', () => {
      const userId = '7';
      const updateUserDto: UpdateUserDto = {};

      mockUserService.update.mockReturnValue('result');

      controller.update(userId, updateUserDto);

      expect(mockUserService.update).toHaveBeenCalledWith(7, updateUserDto);
    });

    it('should return whatever the service returns', () => {
      const userId = '3';
      const updateUserDto: UpdateUserDto = {};
      const serviceResponse = 'User updated successfully';

      mockUserService.update.mockReturnValue(serviceResponse);

      const result = controller.update(userId, updateUserDto);

      expect(result).toBe(serviceResponse);
    });
  });

  describe('remove', () => {
    it('should remove a user', () => {
      const userId = '1';
      const expectedResult = 'This action removes a #1 user';

      mockUserService.remove.mockReturnValue(expectedResult);

      const result = controller.remove(userId);

      expect(result).toBe(expectedResult);
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
      expect(mockUserService.remove).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', () => {
      const userId = '25';

      mockUserService.remove.mockReturnValue('result');

      controller.remove(userId);

      expect(mockUserService.remove).toHaveBeenCalledWith(25);
    });

    it('should work with different ids', () => {
      const userId = '888';

      mockUserService.remove.mockReturnValue('result');

      controller.remove(userId);

      expect(mockUserService.remove).toHaveBeenCalledWith(888);
    });

    it('should return whatever the service returns', () => {
      const userId = '12';
      const serviceResponse = 'User deleted successfully';

      mockUserService.remove.mockReturnValue(serviceResponse);

      const result = controller.remove(userId);

      expect(result).toBe(serviceResponse);
    });
  });
});
