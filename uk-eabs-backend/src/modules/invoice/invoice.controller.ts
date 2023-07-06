import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { JoiValidationPipe } from 'src/shared/infra/postgres/joi.pipe';

@ApiTags('Invoices')
@Controller('invoice')
export class InvoiceController {

    @Post('create-invoice')
    @ApiCreatedResponse({ description: 'The board has been successfully created.' })
    @ApiUnprocessableEntityResponse({ description: 'The board data is not valid.' })
    @ApiBadRequestResponse({ description: 'Something went wrong.' })
    // @UsePipes(new JoiValidationPipe(newScheduleSchema))
    async completeWork(@Body() body: {completeStatus: boolean}) {
      return await {completeStatus: true}
    }

    @Post(':id/send-invoice')
    @ApiCreatedResponse({ description: 'The board has been successfully created.' })
    @ApiUnprocessableEntityResponse({ description: 'The board data is not valid.' })
    @ApiBadRequestResponse({ description: 'Something went wrong.' })
    // @UsePipes(new JoiValidationPipe(newScheduleSchema))
    async sendInvoice(@Body() body: {completeStatus: boolean}) {
      return await {completeStatus: true}
    }
}
