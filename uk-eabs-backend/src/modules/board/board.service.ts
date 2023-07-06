import { Injectable, NotFoundException, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, IsNull, Not, Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Board } from './board.entity';
import { editBoardSchema } from './board.schema';
import { ConfigService } from '@nestjs/config';
import { LatLng, ReadSign, ScheduleStatus, WorkSign } from './board.constant';
import { User } from '../user/user.entity';
import { StringSchema } from 'joi';
import { assign, castArray, get, has, hasIn, includes, intersection, omit, unset } from 'lodash';
import { Schedule } from '../schedule/schedule.entity';

@Injectable()
export class BoardService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  async createBoard(
    houseNumber: string,
    city: string,
    address: string,
    postalCode: string,
    readSign: ReadSign,
    markerLatLng: LatLng,
    numBoards: number,
    isActive: boolean,
    createdBy: User,
    workType: WorkSign,
    notes: string,
    schedule: Schedule,
  ): Promise<Board> {
    try {
      const newBoard = await this.boardRepo.save(
        new Board({
          houseNumber,
          city,
          address,
          postalCode: postalCode.toUpperCase(),
          readSign,
          markerLatLng,
          numBoards,
          isActive,
          createdBy,
          status: ScheduleStatus.pending,
          workType,
          notes,
          schedule
        }),
      );
      return newBoard;
    } catch (Error) {
      console.error(Error);
      throw Error instanceof UnprocessableEntityException ? Error : new BadRequestException(Error.message);
    }
  }

  async fetchAllBoard(
    query: { where: any; relations: [string] },
    paginateOption?: { page: string; limit: string },
    textSearchField?: string,
  ): Promise<Pagination<Board | BadRequestException>> {
    try {
      // sanitize relations

      // searchOptions.relations = has(searchOptions, ['relations'])
      //   ? intersection(castArray(searchOptions.relations.toString), [
      //       'service',
      //       'sellerProposals',
      //       'buyerProposals',
      //       'lau1',
      //       'lau2',
      //     ])
      //   : [];

      const searchOptions: FindManyOptions<Board> = {};

      searchOptions.relations = {
        createdBy: includes(query.relations, 'createdBy'),
        // scheduleTo: includes(query.relations, 'scheduleTo'),
      };

      searchOptions.where = {
        createdBy: includes(query.where, 'createdBy')
          ? {
              id: get(query, 'where.createdBy', null),
            }
          : {},
        // scheduleTo: includes(query.where, 'scheduleTo')
        //   ? {
        //       id: get(query, 'where.scheduleTo', null),
        //     }
        //   : {},
        status: hasIn(query.where, 'status') ? query.where.status : null,
      };

      console.log('FUuuuuuck ', searchOptions);

      // sanitize pagination
      const paginationOptions: IPaginationOptions = {
        page: has(paginateOption, 'page') && parseInt(paginateOption.page) > 0 ? parseInt(paginateOption.page) : 1,
        limit: has(paginateOption, 'limit') && parseInt(paginateOption.limit) >= 0 ? parseInt(paginateOption.limit) : 0,
        route: '/board',
      };

      return paginate<Board>(this.boardRepo, paginationOptions, searchOptions);
    } catch (Error) {
      console.error(Error);
      throw new BadRequestException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
    }
  }

  async fetchBoard(boardId: string, findOptions?: FindOneOptions<Board>): Promise<Board> {
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
      const fetchOptions = assign({}, findOptions, { where: { id: boardId } });
      // delete fetchOptions.relations;
      console.log('cenas', fetchOptions);
      const board = await this.boardRepo.findOneOrFail(fetchOptions);
      console.log(board);
      return boardId ? await this.boardRepo.findOneOrFail(fetchOptions) : null;
    } catch (Error) {
      console.error(Error);
      throw new NotFoundException(`Não foi possível encontrar o board.`);
    }
  }

  async updateBoard(boardId: string, boardData: Partial<Board>): Promise<Board> {
    const board = await this.fetchBoard(boardId, {
      // relations: {
      //   scheduleTo: true,
      // },
    });
    try {
      const newBoard = assign({}, board, boardData);
      unset(newBoard, 'createdBy');
      newBoard.postalCode = newBoard.postalCode.toUpperCase();
      const savedBoard = await this.boardRepo.save(newBoard);
      const updatedBoard = await this.fetchBoard(savedBoard.id);

      updatedBoard.postalCode = updatedBoard.postalCode.toUpperCase();

      return this.fetchBoard(updatedBoard.id);
    } catch (Error) {
      console.error(Error);
      throw board instanceof NotFoundException
        ? new NotFoundException('Não foi possível encontrar o board.')
        : new BadRequestException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
    }
  }

  async validateUpdateBoard(boardId: string, boardData: unknown): Promise<unknown | UnprocessableEntityException> {
    const board = boardId ? await this.boardRepo.findOneOrFail({ where: { id: boardId } }) : null;
    try {
      const data = omit(assign({}, board.toJSON(), boardData), ['id', 'createdAt', 'updatedAt', 'deletedAt']);
      return await editBoardSchema.validateAsync(data);
    } catch (_Error) {
      throw new UnprocessableEntityException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
    }
  }

  // TODO validate delete not removing boardImage and curriculumVitae (use soft-delete instead?)
  async deleteBoard(boardId: string): Promise<Board> {
    const board = await this.fetchBoard(boardId);
    try {
      return await this.boardRepo.softRemove(board);
    } catch (Error) {
      console.error(Error);
      throw board instanceof NotFoundException
        ? new NotFoundException('Não foi possível encontrar o board.')
        : new BadRequestException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
    }
  }
}
