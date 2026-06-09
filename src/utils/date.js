/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환합니다.
 * @param {Date} dateObj - 변환할 날짜 객체
 * @returns {string} - YYYY-MM-DD 포맷 문자열
 */
export function getFormattedDateKey(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 특정 일자의 주간 월요일 날짜 객체를 구합니다. (1차 과제 월~일 기준 준수)
 * @param {Date} date - 기준 날짜
 * @returns {Date} - 해당 주의 월요일 Date 객체
 */
export function getMondayOfThisWeek(date) {
  const current = new Date(date);
  const dayIndex = current.getDay(); 
  const distanceToMonday = dayIndex === 0 ? -6 : 1 - dayIndex;
  current.setDate(current.getDate() + distanceToMonday);
  return current;
}

/**
 * 주어진 날짜 객체가 실제 오늘 날짜와 년/월/일이 일치하는지 비교합니다.
 * @param {Date} dateObj - 비교할 날짜 객체
 * @returns {boolean}
 */
export function isActualToday(dateObj) {
  const today = new Date();
  return dateObj.getDate() === today.getDate() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getFullYear() === today.getFullYear();
}
