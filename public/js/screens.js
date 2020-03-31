'use strict';

const ws = new WebSocket('wss://juniper.beer/socket/screens');

ws.onmessage = (event) => {
    const {questions} = JSON.parse(event.data);
    console.log(questions);
    displayQuestions(questions);
};

// Just puts red border around students for now
function displayQuestions (questions) {
    for (const uuid in questions) {
        console.log(uuid);
        const student = document.getElementById(uuid);
        if (!student) {
            continue;
        }
        student.classList.add("needs-help")
    }
}

document.querySelector('body').onload = main;
let students = [];
let idMap = {};

async function main(){
    const res = await fetch('https://juniper.beer/proctor/courses/connectedStudents', {
        method: "GET",
    });
    if (res.status !== 200) {
        return alert('Failed to fetch students');
    }
    const data = await res.json();
    students = data.students;
    const noStudents = document.getElementById("no-students");
    if (students.length === 0) {
        noStudents.classList.remove("hidden");
    } else {
        noStudents.classList.add("hidden");
    }
    renderStudents();
}

function renderStudents () {
    students.forEach((student) => {
        let container = document.getElementById("container");

        let studentHeader = document.createElement('h2');
        studentHeader.align = "center";
        const [ name, id ] = student.split(':');
        idMap[name] = id;
        studentHeader.textContent = name+' : '+id;
        studentHeader.id = name;

        let studentImg = document.createElement('img');
        studentImg.src ="https://via.placeholder.com/100";
        studentImg.alt = name;
        studentImg.id = name;

        let connectedStudent = document.createElement("div");
        connectedStudent.className = "card";
        connectedStudent.id = id;
        connectedStudent.onclick = function oneOnOne(event){
            const name = event.target.id;
            const id = idMap[name];
            window.location = `https://juniper.beer/view?id=${id}&name=${name}`;
            
        }
        connectedStudent.appendChild(studentImg);
        connectedStudent.appendChild(studentHeader);

        container.appendChild(connectedStudent);
    });
}
