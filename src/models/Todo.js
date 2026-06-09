export class Todo {
  /**
   * Todo 모델 생성자
   * @param {string} text - 할 일 내용
   * @param {string} date - 해당 할 일의 날짜 (포맷: YYYY-MM-DD)
   */
  constructor(text, date) {
    // 고유 ID 자동 생성 (crypto.randomUUID 지원 여부에 따른 폴백 적용)
    this.id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    
    this.text = text;
    this.completed = false;
    this.date = date;
  }

  /**
   * 일반 객체 데이터를 바탕으로 Todo 클래스 인스턴스를 재생성하는 팩토리 메서드
   * @param {Object} data 
   * @returns {Todo}
   */
  static from(data) {
    const instance = Object.create(Todo.prototype);
    return Object.assign(instance, data);
  }
}

