import dayjs from "dayjs";
import "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime";

class TimeUtils {
  dayjs = dayjs;
  constructor() {
    dayjs.locale("en");
    dayjs.extend(relativeTime);
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new TimeUtils();
