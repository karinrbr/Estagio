import * as Joi from 'joi';
import * as _ from 'lodash';
import { ReadSign, ScheduleStatus } from './board.constant';

export const newBoardSchema = Joi.object({
  houseNumber: Joi.string().max(5).allow('').optional(),
  city: Joi.string().max(58).required(),
  address: Joi.string().max(36).required(),
  postalCode: Joi.string().max(8).required(),
  readSign: Joi.string().allow(ReadSign.letBy, ReadSign.sale, ReadSign.sold, ReadSign.toLet).required(),
  markerLatLng: Joi.object({ lat: Joi.number().required(), lng: Joi.number().required() }).required(),
  numBoards: Joi.number().positive().optional(),
  isActive: Joi.boolean().optional(),
  createdBy: Joi.string().guid().required(),
  // scheduleAt: Joi.date().optional(),
  // scheduleTo: Joi.string().guid().optional(),
  status: Joi.string().optional(),
  workType: Joi.string().optional(),
  notes:Joi.string().allow(null, '').optional(),
  scheduleTo: Joi.string().guid().allow(null, '').optional()
}).with('city', ['postalCode']);

export const editBoardSchema = Joi.object({
  houseNumber: Joi.string().max(5).allow('').optional(),
  city: Joi.string().max(120).optional(),
  address: Joi.string().max(36).optional(),
  postalCode: Joi.string().max(8).optional(),
  readSign: Joi.string().allow(ReadSign.letBy, ReadSign.sale, ReadSign.sold, ReadSign.toLet).optional(),
  markerLatLng: Joi.object({ lat: Joi.number().required(), lng: Joi.number().required() }).optional(),
  numBoards: Joi.number().positive().optional(),
  isActive: Joi.boolean().optional(),
  createdBy: Joi.when('status', {
    is: ScheduleStatus.pending,
    then: Joi.string().guid().required(),
    otherwise: Joi.forbidden(),
  }),
  // scheduleAt: Joi.date().optional(),
  // scheduleTo: Joi.string().guid().optional(),
  status: Joi.string().optional(),
  workType: Joi.string().optional(),
  notes: Joi.string().allow(null, '').optional(),
  scheduleTo: Joi.string().guid().allow(null, '').optional()
});
