import moment from "moment";

export function setFormatDate(date: Date): string {
  const currentMonth = Number(date.getMonth()) + 1;
  return (
    date.getFullYear() +
    "-" +
    addZero(currentMonth) +
    "-" +
    addZero(date.getUTCDate())
  );
}

function addZero(value): string {
  if (value < 10) return "0" + value;
  return value;
}

export function getDateTime(date: string): string {
  let month: any = new Date(date).getMonth() + 1;
  let day = new Date(date).getDate().toString();

  if (month < 10) {
    month = "0".concat(month);
  }

  if (day.length === 0) {
    day = "0".concat(day);
  }
  if (new Date(date).getFullYear() < 2010) {
    return moment().format("yyyy-MM-DDT00:00:00");
  } else {
    return `${new Date(date).getFullYear()}-${month}-${day}T${
      new Date(date).toTimeString().split(" ")[0]
    }`;
  }
}
