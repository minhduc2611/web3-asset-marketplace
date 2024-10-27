import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fi";
import relativeTime from "dayjs/plugin/relativeTime";
import { getLang } from "./languageUtils";

class TimeUtils {
  dayjs = dayjs;
  constructor() {
    dayjs.locale(getLang());
    dayjs.extend(relativeTime);
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new TimeUtils();
