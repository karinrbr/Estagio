import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { assign } from 'lodash';
import { FindOneOptions, Repository } from 'typeorm';
import { Board } from '../board/board.entity';
import { User } from '../user/user.entity';
import { Schedule } from './schedule.entity';
import { ScheduleStatus } from './../board/board.constant';
import { BoardService } from '../board/board.service';

@Injectable()
export class ScheduleService {

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Schedule)
        private readonly scheduleRepo: Repository<Schedule>,
        private readonly boardService: BoardService
    ) { }

    async createSchedule(
        scheduleAt: Date,
        worker: User,        
        boards: Board[],
    ): Promise<Schedule> {
        try {

            let bPromises = []
            boards.forEach(board => {
                bPromises.push(
                    this.boardService.updateBoard(board.id, {status:  ScheduleStatus.scheduled})
                )
            })
            await Promise.all([bPromises])
            const entity = await this.scheduleRepo.save(
                new Schedule({
                    scheduleAt,
                    worker,
                    boards
                }),
            );    
            return entity;
        } catch (Error) {
            console.error(Error);
            throw Error instanceof UnprocessableEntityException ? Error : new BadRequestException(Error.message);
        }
    }

    
  async fetchSchedule(scheduleId: string, findOptions?: FindOneOptions<Schedule>): Promise<Schedule> {
    try {
      // if (has(findOptions, 'relations')) {
      //   findOptions.relations = has(findOptions, ['relations'])
      //     ? intersection(castArray(findOptions.relations.toString), [
      //         // 'sellerProposals',
      //         // 'buyerProposals',
      //         // 'boardImage',
      //         'schedule'
      //       ])
      //     : [];
      // }
      const fetchOptions = assign({}, findOptions, { where: { id: scheduleId } });
      // delete fetchOptions.relations;
      console.log('cenas', fetchOptions);
      const board = await this.scheduleRepo.findOneOrFail(fetchOptions);
      console.log(board);
      return scheduleId ? await this.scheduleRepo.findOneOrFail(fetchOptions) : null;
    } catch (Error) {
      console.error(Error);
      throw new NotFoundException(`Não foi possível encontrar o schedule.`);
    }
  }

    async deleteSchedule(scheduleId: string): Promise<Schedule> {
    const instance = await this.fetchSchedule(scheduleId);
    try {
      return await this.scheduleRepo.softRemove(instance);
    } catch (Error) {
      console.error(Error);
      throw instance instanceof NotFoundException
        ? new NotFoundException('Não foi possível encontrar o schedule.')
        : new BadRequestException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
    }
  }

}
