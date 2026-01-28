import { Controller, Get, Post, Put, Body, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async createItem(@Body() body: any) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error("ASDASD")
    return {
      message: 'Item created successfully',
      data: body,
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  async updateItem(@Param('id') id: string, @Body() body: any) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      message: 'Item updated successfully',
      id: id,
      data: body,
      timestamp: new Date().toISOString(),
    };
  }
}
