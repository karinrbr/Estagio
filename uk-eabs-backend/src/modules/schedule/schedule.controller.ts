import { Body, Controller, Delete, Param, ParseUUIDPipe, Post, UnprocessableEntityException, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiCookieAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiValidationPipe } from 'src/shared/infra/postgres/joi.pipe';
import { AppAbility, CheckPolicies } from 'src/shared/policies/casl-ability.factory';
import { ACTION } from 'src/shared/policies/casl.constant';
import { PoliciesGuard } from 'src/shared/policies/policies.guard';
import { Board } from '../board/board.entity';
import { BoardService } from '../board/board.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Schedule, ScheduleDTO } from './schedule.entity';
import { newScheduleSchema } from './schedule.schema';
import { ScheduleService } from './schedule.service';


@ApiTags('Schedules')
@Controller('schedule')
export class ScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly userService: UserService,
        private readonly boardService: BoardService
    ) { }

    @Post('')
    @ApiCreatedResponse({ description: 'The schedule has been successfully created.' })
    @ApiUnprocessableEntityResponse({ description: 'The schedule data is not valid.' })
    @ApiBadRequestResponse({ description: 'Something went wrong.' })
    @UsePipes(new JoiValidationPipe(newScheduleSchema))
    async create(@Body() body: ScheduleDTO) {
        let worker = await this.userService.fetchUser(body.worker)
        let bPromises = []
        body.boards.forEach(boardId => {
            bPromises.push(
                this.boardService.fetchBoard(boardId, {relations: ['schedule']})
            )
        });
        let boards: Board[] = await Promise.all(bPromises)

        boards.forEach(board => {
            console.log("porra do schedule", board.schedule)
            if (board.schedule != null) {
                throw new UnprocessableEntityException('Ocorreu um erro! O board já está scheduled');
            }
        })

        return await this.scheduleService.createSchedule(
            body.scheduleAt,
            worker,
            boards
        );
    }

    @ApiCookieAuth()
    @UseGuards(AuthGuard('jwt-access-token'), PoliciesGuard)
    // @UseGuards(AuthGuard('facebook'))
    @CheckPolicies((ability: AppAbility) => ability.can(ACTION.Read, User)) // @CheckPolicies(new ReadBoardPolicyHandler())
    @Delete(':id')
    @ApiOkResponse({ description: 'Delete the schedule requested.' })
    @ApiNotFoundResponse({ description: 'The schedule does not exist.' })
    @ApiBadRequestResponse({ description: 'Something went wrong.' })
    async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
      return await this.scheduleService.deleteSchedule(id);
    }

    @Post(':id/board/:id/complete-work')
    @ApiCreatedResponse({ description: 'The board has been successfully created.' })
    @ApiUnprocessableEntityResponse({ description: 'The board data is not valid.' })
    @ApiBadRequestResponse({ description: 'Something went wrong.' })
    @UsePipes(new JoiValidationPipe(newScheduleSchema))
    async completeWork(@Body() body: {completeStatus: boolean}) {
      return await {completeStatus: true}
    }

}
