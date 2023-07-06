import * as Joi from 'joi';
import * as _ from 'lodash';
import { Role } from './user.constant';

export const newUserSchema = Joi.object({
  email: Joi.string()
    .max(300)
    .email({ minDomainSegments: 2, tlds: { allow: true } })
    .optional(),
  password: Joi.string().min(6).max(50).optional(),
  name: Joi.string().min(3).max(120).optional(),
  birthdate: Joi.date().max('now').optional(),
  phone: Joi.string().max(120).optional(),
  address: Joi.string().max(120).optional(),
  role: Joi.string().allow(Role.administrator, Role.company, Role.agent).only().optional(),
  description: Joi.string().max(1024).allow(null, '').optional(),
  vatNumber: Joi.string().min(9).max(50).optional(),
}).with('email', ['role', 'password']);

export const editUserSchema = Joi.object({
  email: Joi.string()
    .max(300)
    .email({ minDomainSegments: 2, tlds: { allow: true } }),
  name: Joi.string().min(3).max(120),
  birthdate: Joi.date().max('now'),
  phone: Joi.string().max(120),
  address: Joi.string().max(120),
  role: Joi.string().allow(Role.administrator, Role.company, Role.agent).only().optional(),
  description: Joi.string().max(1024).allow(null, ''),
  url: Joi.string().max(2000).allow(null, ''),
  vatNumber: Joi.string().min(9).max(50),
});

export const userEmailSchema = Joi.object({
  email: Joi.string()
    .max(300)
    .email({ minDomainSegments: 2, tlds: { allow: true } })
    .required(),
});

export const userPasswordSchema = Joi.object({
  password: Joi.string().min(6).max(50).required(),
});

export const userChangePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).max(50).required(),
  newPassword: Joi.string().min(6).max(50).disallow(Joi.ref('currentPassword')).required(),
});
