import {
    Pipe,
    PipeTransform
} from '@angular/core'
import { isEmpty } from 'lodash-es';

@Pipe({
    name: 'DateToString'
})


export class DateToStringPipe implements PipeTransform {
    transform(value: string, ...args: any[]) {
        if(isEmpty(value)) {
            return ""
        }
        let date = new Date(value)
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        // return year + '-' + month + '-' + day;
        return day + '/' + month + '/' + year
    }
}