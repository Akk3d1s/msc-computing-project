import * as fs from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { Controller, Delete, Get, HttpStatus, Post, Put, Req, Res } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Response } from 'express';
import * as MOCKED_10_RESPONSE from '../assets/10.json';
import * as MOCKED_100_RESPONSE from '../assets/100.json';
import * as MOCKED_1000_RESPONSE from '../assets/1000.json';
import * as MOCKED_10000_RESPONSE from '../assets/10000.json';
import * as MOCKED_100000_RESPONSE from '../assets/100000.json';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  generateDummyData(): any {
    const users = [];

    // generate 10 rows
    Array.from({ length: 10 }).forEach(() => {
      users.push({
        userId: faker.datatype.uuid(),
        status: faker.helpers.arrayElement(['ACTIVE', 'PENDING', 'INACTIVE']),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        name: faker.name.firstName(),
        surname: faker.name.lastName(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
      });
    });


    return users;
  }

  @Get('/10')
  get10(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(MOCKED_10_RESPONSE);
  }

  @Get('/100')
  get100(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(MOCKED_100_RESPONSE);
  }

  @Get('/1000')
  get1000(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(MOCKED_1000_RESPONSE);
  }

  @Get('/10000')
  get10000(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(MOCKED_10000_RESPONSE);
  }

  @Get('/100000')
  get100000(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(MOCKED_100000_RESPONSE);
  }

  @Delete('delete')
  deleteUsers(@Req() request: Request, @Res() res: Response): any {
    res.status(HttpStatus.OK).json(request.body);
  }

  @Put('update')
  updateUsers(@Req() request: Request, @Res() res: Response): any {
    res.status(HttpStatus.OK).json(request.body);
  }

  @Post('add')
  addUser(@Req() request: Request, @Res() res: Response): any {
    res.status(HttpStatus.OK).json(request.body);
  }

  @Put('log')
  async createLog(@Req() request: Request, @Res() res: Response): Promise<any> {
    try {
      const data = await this.getFile();
      let logs;

      try {
        logs = JSON.parse(data);
      } catch (error) {
        logs = [];
      }

      logs.push(request.body); // Append the new log to the existing logs

      await this.writeFile(JSON.stringify(logs, null, 2)); // Write the logs to the file in JSON format

      res.status(HttpStatus.OK).json(request.body);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to read the file');
    }
  }

  async getFile(): Promise<any> {
    const readFile = promisify(fs.readFile);
    return await readFile(join(process.cwd(), 'assets/logs.json'), {encoding: 'utf8'});
  }

  async writeFile(data: string): Promise<void> {
    const writeFile = promisify(fs.writeFile);
    return await writeFile(join(process.cwd(), 'assets/logs.json'), data);
  }
}
