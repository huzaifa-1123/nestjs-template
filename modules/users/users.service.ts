import { Injectable, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../../src/repository/user.repository';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Response } from '../../src/common/helpers/response.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly response: Response,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      return this.response.failedResponse(null, null, 'User already exists', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.create(createUserDto);
    return this.response.successResponse(user, null, 'User created successfully', HttpStatus.CREATED);
  }

  async findAll() {
    const users = await this.userRepository.findAll();
    return this.response.successResponse(users, null, 'Users retrieved successfully');
  }

  async findOne(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return this.response.failedResponse(null, null, 'User not found', HttpStatus.NOT_FOUND);
    }
    return this.response.successResponse(user, null, 'User retrieved successfully');
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return this.response.failedResponse(null, null, 'User not found', HttpStatus.NOT_FOUND);
    }
    const updatedUser = await this.userRepository.update(id, updateUserDto);
    return this.response.successResponse(updatedUser, null, 'User updated successfully');
  }

  async remove(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return this.response.failedResponse(null, null, 'User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete(id);
    return this.response.successResponse(null, null, 'User deleted successfully');
  }
}
