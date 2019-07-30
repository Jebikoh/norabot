import { Message } from "discord.js";
import { deleteTimer } from "./config.json";

export function isUndefined(v: any): v is undefined {
  return typeof v === "undefined";
}

export function isNull(n: any): n is null {
  return n === null;
}

export function isString(s: any): s is string {
  return typeof s === "string";
}

export function isNumber(n: any): n is string {
  return typeof n === "number";
}

export function deleteMessage(
  messages: Message | Message[],
  timer: number = deleteTimer
) {
  if (messages instanceof Array) {
    for (let message of messages) {
      message.delete(timer);
    }
  } else {
    messages.delete(timer);
  }
}

export function dateDifference(firstDate: number, secondDate: number) {
  const secondDiff: number = (secondDate - firstDate) / 1000;
  return secondDiff / 60 / 60 / 24;
}

export function isValidUrl(str: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}
