// 로컬스토리지 복원 및 초기화 (예외 상황을 위한 빈 배열 숏서킷 처리 완료)
let todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];

// 현재 선택된 필터 상태 ('all', 'active', 'completed')
let currentFilter = 'all';

// 현재 사용자가 선택하여 보고 있는 날짜 객체 (기본값: 오늘)
let currentSelectedDate = new Date();

// 제어할 DOM 요소 객체 선택
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const tabButtons = document.querySelectorAll('.tab-btn');

// 주간 내비게이션 제어용 DOM 요소 선택
const monthDisplay = document.getElementById('month-display');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');
const weekDaysContainer = document.getElementById('week-days-container');

/**
 * 로컬스토리지 데이터 동기화 저장 함수
 */
function saveToLocalStorage() {
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

/**
 * Date 객체를 데이터 매칭용 포맷(YYYY-MM-DD)의 문자열로 변환하는 함수 (중복 로직 모듈화)
 * @param {Date} dateObj - 변환할 날짜 객체
 * @returns {string} - 'YYYY-MM-DD' 포맷 문자열
 */
function getFormattedDateKey(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 특정 일자의 주간 월요일 날짜 객체를 구하는 함수
 * @param {Date} date - 기준이 되는 날짜 객체
 * @returns {Date} - 해당 주의 월요일 Date 객체
 */
function getMondayOfThisWeek(date) {
    const current = new Date(date);
    const dayIndex = current.getDay(); 
    const distanceToMonday = dayIndex === 0 ? -6 : 1 - dayIndex;
    current.setDate(current.getDate() + distanceToMonday);
    return current;
}

/**
 * 실제 시스템상의 '오늘' 날짜와 일치하는지 비교하는 유틸 함수
 */
function isActualToday(dateObj) {
    const today = new Date();
    return dateObj.getDate() === today.getDate() &&
           dateObj.getMonth() === today.getMonth() &&
           dateObj.getFullYear() === today.getFullYear();
}

/**
 * 주간 가로 캘린더 뷰를 동적으로 렌더링하는 함수
 */
function renderWeekView() {
    weekDaysContainer.innerHTML = '';
    
    const monday = getMondayOfThisWeek(currentSelectedDate);
    
    const headerYear = monday.getFullYear();
    const headerMonth = String(monday.getMonth() + 1).padStart(2, '0');
    monthDisplay.textContent = `${headerYear}년 ${headerMonth}월`;
    
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    
    for (let i = 0; i < 7; i++) {
        const targetDay = new Date(monday);
        targetDay.setDate(monday.getDate() + i);
        
        const dateKey = getFormattedDateKey(targetDay);
        
        const dayCard = document.createElement('button');
        dayCard.className = 'day-card';
        
        if (isActualToday(targetDay)) {
            dayCard.classList.add('today');
        }
        
        if (dateKey === getFormattedDateKey(currentSelectedDate)) {
            dayCard.classList.add('active');
        }
        
        // 해당 날짜의 총 Todo 개수 실시간 연산
        const totalTodoCount = todoItems.filter(todo => todo.date === dateKey).length;
        
        dayCard.innerHTML = `
            <span class="day-name">${dayNames[i]}</span>
            <span class="day-date">${targetDay.getDate()}</span>
            <span class="todo-badge">${totalTodoCount}</span>
        `;
        
        dayCard.addEventListener('click', function() {
            changeSelectedDate(targetDay);
        });
        
        weekDaysContainer.appendChild(dayCard);
    }
}

/**
 * 사용자가 캘린더에서 일자를 선택했을 때 상태를 변경하는 함수
 */
function changeSelectedDate(targetDateObj) {
    currentSelectedDate = new Date(
        targetDateObj.getFullYear(),
        targetDateObj.getMonth(),
        targetDateObj.getDate()
    );
    updateAppView();
}

/**
 * 이전 주차로 이동 이벤트 리스너 (-7일)
 */
prevWeekBtn.addEventListener('click', function() {
    currentSelectedDate.setDate(currentSelectedDate.getDate() - 7);
    updateAppView();
});

/**
 * 다음 주차로 이동 이벤트 리스너 (+7일)
 */
nextWeekBtn.addEventListener('click', function() {
    currentSelectedDate.setDate(currentSelectedDate.getDate() + 7);
    updateAppView();
});

/**
 * Todo 등록 이벤트 리스너
 */
todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const todoText = todoInput.value.trim();
    
    // 예외 상황 처리: 빈 입력값 제출 차단
    if (todoText === '') {
        alert('할 일 내용을 입력해주세요!');
        return;
    }
    
    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        date: getFormattedDateKey(currentSelectedDate)
    };
    
    todoItems.push(newTodo);
    saveToLocalStorage();
    updateAppView();
    
    todoInput.value = '';
});

/**
 * 필터 탭 버튼들에 클릭 이벤트 리스너 바인딩
 */
tabButtons.forEach(function(button) {
    button.addEventListener('click', function(event) {
        currentFilter = event.target.getAttribute('data-filter');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        renderTodos();
    });
});

/**
 * 상태 데이터를 필터링하여 목록창을 그려주는 함수
 */
function renderTodos() {
    todoList.innerHTML = '';
    
    const targetDateKey = getFormattedDateKey(currentSelectedDate);
    
    // 복합 데이터 필터링 가동 (날짜 매칭 -> 탭 상태 매칭)
    const filteredTodos = todoItems.filter(function(todo) {
        if (todo.date !== targetDateKey) {
            return false;
        }
        if (currentFilter === 'active') {
            return !todo.completed;
        }
        if (currentFilter === 'completed') {
            return todo.completed;
        }
        return true; 
    });
    
    // [수정 보완] 빈 상태(데이터 없음)에 대한 화면 UX 예외 처리 추가
    if (filteredTodos.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'empty-state';
        
        // 현재 선택된 필터 탭에 맞추어 문구 가변 처리
        if (currentFilter === 'active') {
            emptyLi.textContent = '진행 중인 할 일이 없습니다.';
        } else if (currentFilter === 'completed') {
            emptyLi.textContent = '완료된 할 일이 없습니다.';
        } else {
            emptyLi.textContent = '할 일이 없습니다. 새로운 일정을 등록해보세요!';
        }
        
        todoList.appendChild(emptyLi);
        return; // 렌더링 조기 종료
    }
    
    // 데이터가 있을 경우 목록 렌더링 수행
    filteredTodos.forEach(function(todo) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        const completedClass = todo.completed ? 'completed' : '';
        
        li.innerHTML = `
            <span class="todo-text ${completedClass}">${todo.text}</span>
            <div class="btn-group">
                <button class="action-btn complete-btn" onclick="toggleCompleteTodo(${todo.id})">
                    ${todo.completed ? '취소' : '완료'}
                </button>
                <button class="action-btn edit-btn" onclick="editTodoText(${todo.id})">수정</button>
                <button class="action-btn delete-btn" onclick="deleteTodoItem(${todo.id})">삭제</button>
            </div>
        `;
        
        todoList.appendChild(li);
    });
}

/**
 * Todo의 완료 유무(상태)를 반전시키는 함수
 */
function toggleCompleteTodo(id) {
    todoItems = todoItems.map(function(todo) {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveToLocalStorage();
    updateAppView(); 
}

/**
 * 선택한 Todo의 내용을 변경하는 함수
 */
function editTodoText(id) {
    const todoToEdit = todoItems.find(todo => todo.id === id);
    if (!todoToEdit) return;
    
    const newText = prompt('할 일을 수정하세요:', todoToEdit.text);
    
    if (newText === null) return; 
    if (newText.trim() === '') {
        alert('수정 내용을 올바르게 입력해주세요.');
        return;
    }
    
    todoItems = todoItems.map(function(todo) {
        if (todo.id === id) {
            return { ...todo, text: newText.trim() };
        }
        return todo;
    });
    
    saveToLocalStorage();
    updateAppView(); 
}

/**
 * 특정 Todo를 삭제하는 함수
 */
function deleteTodoItem(id) {
    todoItems = todoItems.filter(todo => todo.id !== id);
    saveToLocalStorage();
    updateAppView(); 
}

/**
 * 주간 정보 패널과 할 일 목록을 함께 동기화하여 그리는 통합 마스터 뷰 컨트롤러 함수
 */
function updateAppView() {
    renderWeekView();
    renderTodos();
}

// [초기화 구동] 최초 앱 실행 시 마스터 뷰 컨트롤러 최초 실행
updateAppView();