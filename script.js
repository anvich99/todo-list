'use strict'

const root = document.getElementById('root');
root.classList.add('todo');

const content = document.createElement('div');
content.classList.add('todo-content');
root.append(content);

const title = document.createElement('h1');
title.classList.add('todo-content__title');
title.innerText = 'To Do List';
content.append(title);

const block_add = document.createElement('div');
block_add.classList.add('todo-content-block-add');
content.append(block_add);

const block_show = document.createElement('div');
block_show.classList.add('todo-content-block-show');
content.append(block_show);

const input = document.createElement('input');
input.classList.add('input_add');
input.placeholder = "Note";
block_add.append(input);

const button_add = document.createElement('button');
button_add.classList.add('button_add');
block_add.append(button_add);

const img_add = document.createElement('img');
img_add.src="./img/akar-icons_plus.svg";
button_add.append(img_add);

const button_delete = document.createElement('button');
button_delete.classList.add('button_delete');
block_add.append(button_delete);

const img_delete = document.createElement('img');
img_delete.src="./img/trash-solid.svg";
img_delete.classList.add('img_del');
button_delete.append(img_delete);

const block_search = document.createElement('div');
block_search.classList.add('block-search');
content.append(block_search);

const input_search = document.createElement('input');
input_search.classList.add('input_search');
input_search.placeholder = "Search";
block_search.append(input_search);

const btn_show = document.createElement('button');
btn_show.classList.add('button_show');
btn_show.innerText = "Show All";
block_show.append(btn_show);

const btn_completed = document.createElement('button');
btn_completed.classList.add('button_show');
btn_completed.innerText = "Completed";
block_show.append(btn_completed);

const btn_del_last = document.createElement('button');
btn_del_last.classList.add('button_show');
btn_del_last.innerText = "Delete last";
block_show.append(btn_del_last);

const counters = document.createElement('div');
counters.classList.add('counters');
block_search.append(counters);

const counter = document.createElement('div');
counter.classList.add('all_tasks');
counter.innerText = 'All: 0';
counters.append(counter);

const text_completed = document.createElement('div');
text_completed.classList.add('completed_task');
text_completed.innerText = 'Completed: 0';
counters.append(text_completed);

const list_todo = document.createElement('ul');
list_todo.classList.add('todo-list')
content.append(list_todo);
const tasks = [];

if(localStorage.length){
    getName();
}

button_add.addEventListener('click',()=>{
    const task_text = input.value;
    if(task_text){
        getTask(task_text);
        renderTaskElement(tasks);
        setName();
        counterAll();
    }
    input.value = '';
} 
)

function getTask(task_text){
    const date_now = new Date();
    const todo_item = {
        check: false,
        name: task_text,
        date: date_now
    }
    tasks.push(todo_item);
}
counterAll();

function renderTaskElement(todos){
    list_todo.innerHTML = '';
    todos.forEach((task, index)=>{
        const li_todo = document.createElement('li');
        li_todo.classList.add('list-item');

        const label_text =document.createElement('div');
        label_text.classList.add('label_text');

        const label_item = document.createElement('label');
        label_item.classList.add('label-item'); 

        const btns = document.createElement('div');
        btns.classList.add('btns');

        const check = document.createElement('input');
        check.type = "checkbox";
        check.classList.add('check-item');

        const date = document.createElement('div');
        date.classList.add('item-date');

        const btn_del = document.createElement('button');
        btn_del.classList.add('btn-item-del');

        const img_del = document.createElement('img');
        img_del.src = "./img/akar-icons_trash-can.svg"
        img_del.classList.add('img-item-del');
        if(task.check === true){
            check.checked = true;
            label_item.style.textDecoration = 'line-through';
            counterDoneTasks();
        }
        label_item.innerText = `${task.name}`;
        label_item.htmlFor = `item-check${index}`;
        check.id = `item-check${index}`;
        label_item.id = `label${index}`;
        btn_del.id = `${index}`;
        if(localStorage.length){
            const last_data = new Date(task.date);
            date.innerText = `${last_data.getDate()}.${last_data.getMonth()<10 ? '0'+ (last_data.getMonth()+1) : (last_data.getMonth()+1) }.${last_data.getFullYear()}`;
        }else date.innerText = `${task.date.getDate()}.${task.date.getMonth()<10 ? '0'+ (task.date.getMonth()+1) : (task.date.getMonth()+1) }.${task.date.getFullYear()}`;
        
        
        label_text.append(label_item, date);
        li_todo.append(label_text, btns);
        list_todo.append(li_todo);
        btn_del.append(img_del);
        btns.append(check,btn_del);
    })
}

list_todo.addEventListener('click',(event)=>{
    if(event.target.type === 'submit'){
        deleteTask(document.getElementById(`label${event.target.id}`)); //получим id кнопки-мусорки, которую нажали
        const parentNode = event.target.closest('.list-item');
        parentNode.remove();
        setName();
        counterDoneTasks();
        counterAll();
    }else{
        if(event.target.type === 'checkbox'){
            if(event.target.labels[0].style.textDecoration === 'line-through'){
                event.target.labels[0].style.textDecoration = 'none';
                tasks.forEach(item => {
                    if(event.target.labels[0].innerText === item.name){
                        item.check = false;
                    }
                })
                setName();
                counterDoneTasks();
            }else{
                event.target.labels[0].style.textDecoration = 'line-through';
                tasks.forEach(item => {
                    if(event.target.labels[0].innerText === item.name){
                        item.check = true;
                    }
                })
                setName();
                counterDoneTasks();
            }
        }
    }
})

function deleteTask(task){
    tasks.forEach((item, index)=>{
        if(item.name === task.innerText){
            tasks.splice(index, 1);
        }
    })
    counterDoneTasks();
    counterAll();
}

button_delete.addEventListener('click', ()=>{
    tasks.splice(0, tasks.length);
    list_todo.innerHTML = '';
    setName();
    counterDoneTasks();
    counterAll();
})

function setName(){
    localStorage.setItem('task_list',JSON.stringify(tasks));
}

function getName(){
    tasks.splice(0, tasks.length);
    JSON.parse(localStorage.getItem('task_list')).forEach(item =>{
        tasks.push(item);
        renderTaskElement(tasks)
    });
}

btn_del_last.addEventListener('click', ()=>{
    tasks.pop();
    list_todo.innerHTML = '';
    setName();
    counterDoneTasks();
    renderTaskElement(tasks);
    counterAll();
})

btn_completed.addEventListener('click', ()=>{
    renderTaskElement(tasks.filter(item=> item.check === true));
})

btn_show.addEventListener('click',()=>{
    renderTaskElement(tasks);
})

input_search.addEventListener('input', (event)=>{
    const search = []
    tasks.forEach(item=>{
        if(item.name.includes(input_search.value)){
            search.push(item);
        }
    })
    renderTaskElement(search);
})

function counterDoneTasks(){
    let count_compl = 0;
    tasks.forEach(item=>{
        if(item.check === true) count_compl++;
    })
    text_completed.innerText = `Completed: ${count_compl}`;
}

function counterAll(){
    counter.innerText = `All: ${list_todo.childNodes.length}`;
}