export function ReferenceId() {
  let randomNumber =
    new Date().getMilliseconds() + Math.floor(Math.random() * 9999) + 1111;
  let traceIdMs = "" + new Date().getTime() + randomNumber;
  let traceId = DecimalToHexString(Number(traceIdMs));
  return traceId;
}

function DecimalToHexString(number) {
  if (number < 0) {
    number = 0xffffffff + number + 1;
  }
  return number.toString(16).toLowerCase().padEnd(16, "0");
}
