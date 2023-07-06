import { Injectable, NotFoundException, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, IsNull, Not, Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { User } from './user.entity';
import { Role } from './user.constant';
import { PasswordService } from '../auth/password.service';
import { UserImage } from './user-image.file.entity';
import { editUserSchema } from './user.schema';
import { ConfigService } from '@nestjs/config';
import { assign, has, omit, unset } from 'lodash';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserImage)
    private readonly userImageRepo: Repository<UserImage>,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
    birthdate: Date,
    phone: string,
    address: string,
    role: Role,
    description: string,
    vatNumber: string,
    // userImage: UserImage,
    
  ): Promise<User> {
    try {
      const passwordHash = await this.passwordService.getHash(password);
      if (!passwordHash) {
        throw new UnprocessableEntityException('Problem creating new user phash.');
      }
      const user = email ? await this.userRepo.findOne({ where: { email } }) : null;
      if (user) {
        // if (!_.isEmpty(user.facebookId)) {
        //   throw new UnprocessableEntityException('Email já foi utilizado numa conta facebook.');
        // } else if (!_.isEmpty(user.linkedinId)) {
        //   throw new UnprocessableEntityException('Email já foi utilizado numa conta linkedin.');
        // }
        throw new UnprocessableEntityException('Email já foi utilizado numa outra conta.');
      }

      const newUser = await this.userRepo.save(
        new User({
          name,
          email,
          password: passwordHash,
          birthdate,
          phone,
          address,
          role,
          description,
          vatNumber,
        }),
      );

      if (newUser && newUser.email) {
        // Generate email
        // const emailTemplate = _.template(
        //   fs.readFileSync('./static/new-register.html', { encoding: 'utf8', flag: 'r' }),
        // );
        // Dispatch email
        // const emailResponse = await this.emailService.sendMail({
        //   to: newUser.email,
        //   subject: 'DSS | Bem-vindo(a)!',
        //   html: emailTemplate({
        //     projectName: 'DSS',
        //     userName: newUser.name,
        //   }),
        // });
        // console.log(`newRegister => email: ${email} response: ${JSON.stringify(emailResponse)}`);
        // const emailResponseAdmin = await this.emailService.sendMail({
        //   to: process.env.SMTP_FROM,
        //   subject: `DSS (Admin) | Novo registo: ${newUser.email}`,
        //   html: emailTemplate({
        //     projectName: 'DSS',
        //     userName: newUser.name,
        //   }),
        // });
        // console.log(`newRegisterAdmin => email: ${email} response: ${JSON.stringify(emailResponseAdmin)}`);
      }

      return newUser;
    } catch (Error) {
      console.error(Error);
      throw Error instanceof UnprocessableEntityException ? Error : new BadRequestException(Error.message);
    }
  }

  async changePassword(userId: string, password: string): Promise<User> {
    const passwordHash = await this.passwordService.getHash(password);
    return await this.updateUser(userId, { password: passwordHash, resetPasswordToken: null });
  }

  async fetchAllUser(
    searchOptions?: FindManyOptions<User>,
    paginateOption?: { page: string; limit: string },
    textSearchField?: string,
    professionalInfo?: {
      professionalCategoryId?: string;
      professionalActivityId?: string;
      professionalServiceId?: string;
    },
  ): Promise<Pagination<User | BadRequestException>> {
    try {
      // sanitize relations
      // searchOptions.relations = _.has(searchOptions, ['relations'])
      //   ? _.intersection(_.castArray(searchOptions.relations.toString), [
      //       'service',
      //       'sellerProposals',
      //       'buyerProposals',
      //       'lau1',
      //       'lau2',
      //     ])
      //   : [];

      // sanitize pagination
      const paginationOptions: IPaginationOptions = {
        page: has(paginateOption, 'page') && parseInt(paginateOption.page) > 0 ? parseInt(paginateOption.page) : 1,
        limit: has(paginateOption, 'limit') && parseInt(paginateOption.limit) >= 0 ? parseInt(paginateOption.limit) : 0,
        route: '/user',
      };

      return paginate<User>(this.userRepo, paginationOptions, searchOptions);
    } catch (Error) {
      console.error(Error);
      throw new BadRequestException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
    }
  }

  async fetchUser(userId: string, findOptions?: FindOneOptions<User>): Promise<User> {
    try {
      // if (_.has(findOptions, 'relations')) {
      //   findOptions.relations = _.has(findOptions, ['relations'])
      //     ? _.intersection(_.castArray(findOptions.relations), [
      //         // 'sellerProposals',
      //         // 'buyerProposals',
      //         'userImage',
      //       ])
      //     : [];
      // }
      const fetchOptions = assign({}, findOptions, { where: { id: userId } });
      delete fetchOptions.relations;
      console.log('cenas', fetchOptions);
      return userId ? await this.userRepo.findOneOrFail(fetchOptions) : null;
    } catch (Error) {
      console.error(Error);
      throw new NotFoundException(`Não foi possível encontrar o utilizador.`);
    }
  }

  // private async updateUserImage(user: User, newImage: UserImage) {
  //   let imageId = null;
  //   if (user.userImage && _.has(user, 'userImage.id')) {
  //     imageId = user.userImage.id;
  //   }

  //   if (imageId) {
  //     await this.userImageRepo.update(imageId, newImage);
  //   } else {
  //     const image = await this.userImageRepo.save(newImage);
  //     imageId = image.id;
  //   }

  //   return imageId;
  // }

  async fetchUserByEmail(email: string): Promise<User> {
    try {
      // TODO: refactor this to alternative createQueryBuilder!!
      const user = await this.userRepo
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();
      if (!user) {
        throw new NotFoundException('Não foi possível encontrar o utilizador.');
      }
      return user;
    } catch (Error) {
      console.error(Error);
      throw new NotFoundException('Não foi possível encontrar o utilizador.');
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const user = await this.fetchUser(userId, { relations: { requestedBoards: false } });
    try {
      const newUser = assign({}, user, userData);
      unset(newUser, 'requestedBoards');

      // Handle user relations
      // if (_.has(userData, 'userImage')) {
      //   newUser.userImage = await this.updateUserImage(newUser, userData.userImage);
      // }

      // // Safety check for specific fields for users company and freelancers
      // if (newUser.role === Role.company) {
      //   const notAllowed = ['city', 'region', 'hardSkills', 'softSkills', 'service', 'curriculumVitae'];
      //   throw new BadRequestException(`User of type ${Role.company} should not have any ${notAllowed}`);
      // }
      // if (newUser.role === Role.freelancer) {
      //   const notAllowed = ['vatNumber', 'isEndClient'];
      //   throw new BadRequestException(`User of type ${Role.freelancer} should not have any ${notAllowed}`);
      // }

      const savedUser = await this.userRepo.save(newUser);

      const updatedUser = await this.fetchUser(savedUser.id);

      return this.fetchUser(updatedUser.id);
    } catch (Error) {
      console.error(Error);
      throw user instanceof NotFoundException
        ? new NotFoundException('Não foi possível encontrar o utilizador.')
        : new BadRequestException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
    }
  }

  async validateUpdateUser(userId: string, userData: unknown): Promise<unknown | UnprocessableEntityException> {
    const user = userId ? await this.userRepo.findOneOrFail({ where: { id: userId } }) : null;
    try {
      const data = omit(assign({}, user.toJSON(), userData), ['id', 'createdAt', 'updatedAt', 'deletedAt']);

      return await editUserSchema.validateAsync(data);
    } catch (_Error) {
      throw new UnprocessableEntityException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
    }
  }

  // TODO validate delete not removing userImage and curriculumVitae (use soft-delete instead?)
  async deleteUser(userId: string): Promise<User> {
    const user = await this.fetchUser(userId);
    try {
      return await this.userRepo.softRemove(user);
    } catch (Error) {
      console.error(Error);
      throw user instanceof NotFoundException
        ? new NotFoundException('Não foi possível encontrar o utilizador.')
        : new BadRequestException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
    }
  }

  // async fetchUserImage(userId: string): Promise<UserImage> {
  //   try {
  //     const user = userId
  //       ? await this.userRepo.findOneOrFail({ where: { id: userId }, relations: { userImage: true } })
  //       : null;
  //     if (!user) {
  //       throw new NotFoundException('Não foi possível encontrar o utilizador.');
  //     }
  //     let image = await user.userImage;
  //     if (!image) {
  //       image = await this.userImageRepo.findOneOrFail({ where: { id: 'c88ac485-f823-4418-b1dd-e0e66a9af631' } });
  //     }
  //     return image;
  //   } catch (Error) {
  //     console.error(Error);
  //     throw Error instanceof NotFoundException
  //       ? Error
  //       : new BadRequestException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
  //   }
  // }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<User> {
    const user = await this.fetchUser(userId);

    // const isRefreshTokenMatching = await this.passwordService.compareHash(refreshToken, user.refreshToken);

    const isRefreshTokenMatching = refreshToken == user.refreshToken;

    if (isRefreshTokenMatching) {
      return user;
    }
  }
}
