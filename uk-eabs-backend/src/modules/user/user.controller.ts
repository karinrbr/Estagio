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
import { User } from './user.entity';
import { UserService } from './user.service';
import { JoiValidationPipe } from '../../shared/infra/postgres/joi.pipe';
import { newUserSchema, editUserSchema } from './user.schema';
import { AuthGuard } from '@nestjs/passport';
import { PoliciesGuard } from '../../shared/policies/policies.guard';
import { AppAbility, CheckPolicies } from '../../shared/policies/casl-ability.factory';
import { ACTION } from '../../shared/policies/casl.constant';
import { Role } from './user.constant';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserImage } from './user-image.file.entity';

@ApiTags('Users')
@Controller('api/v0/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt-access-token'), PoliciesGuard)
  // @UseGuards(AuthGuard('facebook'))
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION.Read, User)) // @CheckPolicies(new ReadUserPolicyHandler())
  @Get('')
  @ApiQuery({ name: 'role', enum: Role, required: false })
  @ApiQuery({ type: [String], name: 'relations', required: false, example: [] })
  @ApiQuery({ type: Number, name: 'page', required: false, example: '1' })
  @ApiQuery({ type: Number, name: 'limit', required: false, example: '10' })
  @ApiQuery({ type: String, name: 'search', required: false, example: '' })
  @ApiOkResponse({ description: 'Fetch all users requested with pagination.' })
  async findAll(@Query() query) {
    const page = query.page || 1;
    const limit = query.limit > 100 ? 100 : query.limit || 10; // 💥 don't crash our backend
    const relations = query.relations || [];
    const params = _.omit(query, ['page', 'limit', 'relations', 'search']);

    const professionalInfo = {};
    if (query.professionalCategoryId) professionalInfo['professionalCategoryId'] = query.professionalCategoryId;
    if (query.professionalActivityId) professionalInfo['professionalActivityId'] = query.professionalActivityId;
    if (query.professionalServiceId) professionalInfo['professionalServiceId'] = query.professionalServiceId;
    return await this.userService.fetchAllUser(
      { where: params, relations },
      { page, limit },
      query.search,
      professionalInfo,
    );
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt-access-token'), PoliciesGuard)
  // @UseGuards(AuthGuard('facebook'))
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION.Read, User)) // @CheckPolicies(new ReadUserPolicyHandler())
  @Get(':id')
  @ApiQuery({ type: [String], name: 'relations', required: false, example: [] })
  @ApiOkResponse({ description: 'Fetch the user requested.' })
  @ApiNotFoundResponse({ description: 'The user does not exist.' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) userId: string, @Query() query) {
    const relations = query.relations || [];
    return await this.userService.fetchUser(userId, { relations });
  }

  @ApiConsumes('multipart/form-data')
  @Post('')
  @ApiCreatedResponse({ description: 'The user has been successfully created.' })
  @ApiUnprocessableEntityResponse({ description: 'The user data is not valid.' })
  @ApiBadRequestResponse({ description: 'Something went wrong.' })
  @UsePipes(new JoiValidationPipe(newUserSchema))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'userImage', maxCount: 1 }]))
  async create(@Body() body: User, @UploadedFiles() files) {
    // TODO implement a upper limit to file being upload here!!!
    let userImage = null;
    if (_.has(files, 'userImage') && !_.isEmpty(files.userImage)) {
      const { originalname, buffer, size, encoding, mimetype } = files.userImage[0];
      const alloweduserImageMIMETypes = ['image/png', 'image/jpeg'];
      if (!_.includes(alloweduserImageMIMETypes, mimetype)) {
        throw new UnprocessableEntityException(
          `Uploaded file 'userImage' must be a image. Allow mimetypes [${alloweduserImageMIMETypes}]`,
        );
      }
      userImage = new UserImage({ originalName: originalname, buffer, size, encoding, mimeType: mimetype });
    }

    return await this.userService.createUser(
      body.name,
      body.email,
      body.password,
      body.birthdate,
      body.phone,
      body.address,
      body.role,
      body.description,
      body.vatNumber,
      // userImage,
    );
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt-access-token'), PoliciesGuard)
  // @UseGuards(AuthGuard('facebook'))
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION.Update, User)) // @CheckPolicies(new ReadUserPolicyHandler())
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @ApiOkResponse({ description: 'Patch the user requested.' })
  @ApiNotFoundResponse({ description: 'The user does not exist.' })
  @ApiUnprocessableEntityResponse({ description: 'The user data is not valid.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiBadRequestResponse({ description: 'Something went wrong.' })
  @UsePipes(new JoiValidationPipe(editUserSchema))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'curriculumVitae', maxCount: 1 },
      { name: 'userImage', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: User,
    @UploadedFiles() files,
  ) {
    // TODO IMPORTANT: check JoiPipes to PATCHS!!!
    // const validatedBody = await this.userService.validateUpdateUser(id, body);

    // TODO implement a upper limit to file being upload here!!!
    let userImage = null;
    if (_.has(files, 'userImage') && files.userImage[0]) {
      const { originalname, buffer, size, encoding, mimetype } = files.userImage[0];
      const alloweduserImageMIMETypes = ['image/png', 'image/jpeg'];
      if (!_.includes(alloweduserImageMIMETypes, mimetype)) {
        throw new UnprocessableEntityException(
          `Uploaded file 'userImage' must be a image. Allow mimetypes [${alloweduserImageMIMETypes}]`,
        );
      }
      userImage = new UserImage({ originalName: originalname, buffer, size, encoding, mimeType: mimetype });
    }

    const fileData = { userImage };
    if (_.isNull(userImage)) {
      delete fileData.userImage;
    }

    const final = _.assign({}, body, fileData);

    return await this.userService.updateUser(id, final);
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt-access-token'), PoliciesGuard)
  // @UseGuards(AuthGuard('facebook'))
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION.Delete, User)) // @CheckPolicies(new ReadUserPolicyHandler())
  @Delete(':id')
  @ApiOkResponse({ description: 'Delete the user requested.' })
  @ApiNotFoundResponse({ description: 'The user does not exist.' })
  @ApiBadRequestResponse({ description: 'Something went wrong.' })
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.userService.deleteUser(id);
  }

  // @ApiCookieAuth()
  // @UseGuards(AuthGuard('jwt-access-token'), PoliciesGuard)
  // // @UseGuards(AuthGuard('facebook'))
  // @CheckPolicies((ability: AppAbility) => ability.can(ACTION.Read, User)) // @CheckPolicies(new ReadUserPolicyHandler())
  // @Get(':id/image')
  // @ApiOkResponse({ description: 'Fetch the user requested.' })
  // @ApiNotFoundResponse({ description: 'The user does not exist.' })
  // async getUserImage(@Param('id', new ParseUUIDPipe({ version: '4' })) userId: string, @Res() res) {
  //   const userImage = await this.userService.fetchUserImage(userId);
  //   // console.log(userImage);
  //   res.set({
  //     // image
  //     'Content-Type': userImage.mimeType,
  //     'Content-Disposition': 'inline',
  //     'Content-Length': userImage.buffer.length,

  //     'Cache-Control': 'private',
  //     // Pragma: 'no-cache',
  //     // Expires: 0,
  //   });
  //   res.end(userImage.buffer);
  // }
}
