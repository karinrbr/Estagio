/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as _ from 'lodash';
import {
  Controller,
  Post,
  UsePipes,
  Query,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  UnprocessableEntityException,
  UploadedFiles,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiUnprocessableEntityResponse,
  ApiCookieAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { JoiValidationPipe } from '../../shared/infra/postgres/joi.pipe';
import { newBoardSchema, editBoardSchema } from './board.schema';
import { AuthGuard } from '@nestjs/passport';
import { PoliciesGuard } from '../../shared/policies/policies.guard';
import { AppAbility, CheckPolicies } from '../../shared/policies/casl-ability.factory';
import { ACTION } from '../../shared/policies/casl.constant';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { User } from '../user/user.entity';
import { isString } from 'lodash';

@ApiTags('Boards')
@Controller('api/v0/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt-access-token'), PoliciesGuard)
  // @UseGuards(AuthGuard('facebook'))
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION.Read, User)) // @CheckPolicies(new ReadBoardPolicyHandler())
  @Get('')
  @ApiQuery({ type: [String], name: 'relations', required: false, example: ['createdBy', 'schedule'] })
  @ApiQuery({ type: Number, name: 'page', required: false, example: '1' })
  @ApiQuery({ type: Number, name: 'limit', required: false, example: '10' })
  @ApiQuery({ type: String, name: 'createdBy', required: false, example: 'user-uuid' })
  @ApiOkResponse({ description: 'Fetch all boards requested with pagination.' })
  async findAll(@Query() query) {
    const page = query.page || 1;
    const limit = query.limit > 100 ? 100 : query.limit || 10; // 💥 don't crash our backend
    const relations: [string] = isString(query.relations) ? [query.relations] : query.relations || [''];
    const params = _.omit(query, ['page', 'limit', 'relations', 'search']);
    return await this.boardService.fetchAllBoard({ where: params, relations }, { page, limit }, query.search);
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt-access-token'), PoliciesGuard)
  // @UseGuards(AuthGuard('facebook'))
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION.Read, User)) // @CheckPolicies(new ReadBoardPolicyHandler())
  @Get(':id')
  @ApiQuery({ type: [String], name: 'relations', required: false, example: [] })
  @ApiOkResponse({ description: 'Fetch the board requested.' })
  @ApiNotFoundResponse({ description: 'The board does not exist.' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) boardId: string, @Query() query) {
    const relations = query.relations || [];
    return await this.boardService.fetchBoard(boardId, { relations });
  }

  @Post('')
  @ApiCreatedResponse({ description: 'The board has been successfully created.' })
  @ApiUnprocessableEntityResponse({ description: 'The board data is not valid.' })
  @ApiBadRequestResponse({ description: 'Something went wrong.' })
  @UsePipes(new JoiValidationPipe(newBoardSchema))
  async create(@Body() body: Board) {
    return await this.boardService.createBoard(
      body.houseNumber,
      body.city,
      body.address,
      body.postalCode,
      body.readSign,
      body.markerLatLng,
      body.numBoards,
      body.isActive,
      body.createdBy,
      body.workType,
      body.notes,
      body.schedule
    );
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt-access-token'), PoliciesGuard)
  // @UseGuards(AuthGuard('facebook'))
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION.Read, User)) // @CheckPolicies(new ReadBoardPolicyHandler())
  @Patch(':id')
  @ApiOkResponse({ description: 'Patch the board requested.' })
  @ApiNotFoundResponse({ description: 'The board does not exist.' })
  @ApiUnprocessableEntityResponse({ description: 'The board data is not valid.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiBadRequestResponse({ description: 'Something went wrong.' })
  @UsePipes(new JoiValidationPipe(editBoardSchema))
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body() body: Board) {
    const final = _.assign({}, body);
    return await this.boardService.updateBoard(id, final);
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt-access-token'), PoliciesGuard)
  // @UseGuards(AuthGuard('facebook'))
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION.Read, User)) // @CheckPolicies(new ReadBoardPolicyHandler())
  @Delete(':id')
  @ApiOkResponse({ description: 'Delete the board requested.' })
  @ApiNotFoundResponse({ description: 'The board does not exist.' })
  @ApiBadRequestResponse({ description: 'Something went wrong.' })
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.boardService.deleteBoard(id);
  }

}
