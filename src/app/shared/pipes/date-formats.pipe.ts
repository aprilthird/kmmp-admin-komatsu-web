import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateFormats",
})
export class DateFormatsPipe implements PipeTransform {
  transform(value: string): string {
    //alert(new Date(value).toLocaleDateString("en-GB"));
    return new Date(value).toLocaleDateString("en-GB");
  }
}
