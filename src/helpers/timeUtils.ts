import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fi";
import relativeTime from "dayjs/plugin/relativeTime";

class TimeUtils {
  dayjs = dayjs;
  constructor() {
    dayjs.locale("fi");
    dayjs.extend(relativeTime);
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new TimeUtils();
