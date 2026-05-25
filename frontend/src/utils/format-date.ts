const emptyDateLabel = "Não informado";

export function formatBrazilianDate(value: string | null | undefined) {
  if (!value) {
    return emptyDateLabel;
  }

  const date = new Date(`${value}T00:00:00`);

  return [
    padDatePart(date.getDate()),
    padDatePart(date.getMonth() + 1),
    date.getFullYear(),
  ].join("/");
}

export function formatBrazilianDateTime(value: string | null | undefined) {
  if (!value) {
    return emptyDateLabel;
  }

  const date = new Date(value);
  const formattedDate = [
    padDatePart(date.getDate()),
    padDatePart(date.getMonth() + 1),
    date.getFullYear(),
  ].join("/");
  const formattedTime = [
    padDatePart(date.getHours()),
    padDatePart(date.getMinutes()),
  ].join(":");

  return `${formattedDate} ${formattedTime}`;
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}
