import { Pipe, PipeTransform } from "@angular/core";
import { setValue } from "@ngneat/transloco";

@Pipe({
  name: "dateFormats",
})
export class DateFormatsPipe implements PipeTransform {
  transform(value: string): string {
    alert(value);
    //alert(new Date(value).toLocaleDateString("en-GB"));
    return new Date(value).toLocaleDateString("en-GB");
  }
}
