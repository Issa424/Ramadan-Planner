const daysContainer = document.getElementById("daysContainer");
const darkToggle = document.getElementById("darkToggle");
const totalProgress = document.getElementById("totalProgress");
const prayerProgress = document.getElementById("prayerProgress");
const quranProgress = document.getElementById("quranProgress");
const dhikrProgress = document.getElementById("dhikrProgress");

const noteModal = document.getElementById("noteModal");
const noteText = document.getElementById("noteText");
const saveNoteBtn = document.getElementById("saveNote");
const closeModal = document.querySelector(".close");

const tasks = [
    {id:"prayer", name:"🕌 الصلاة"},
    {id:"quran", name:"📖 القرآن"},
    {id:"dhikr", name:"📿 الذكر"},
    {id:"qiyam", name:"🌙 قيام الليل"},
    {id:"charity", name:"💰 الصدقة"},
];

let data = JSON.parse(localStorage.getItem("ramadanUX")) || {};
let currentNoteDay = null;

// الوضع الليلي
darkToggle.onclick = () => document.body.classList.toggle("dark");

// إنشاء أيام رمضان
for(let d=1; d<=30; d++){
    const day = document.createElement("div");
    day.className="day-card";
    day.innerHTML = `
        <h3>اليوم ${d}</h3>
        <div class="tasks">
            ${tasks.map(t=>`
                <label>
                    <input type="checkbox" data-day="${d}" data-task="${t.id}">
                    ${t.name}
                </label>
            `).join("")}
        </div>
        <button class="noteBtn" data-day="${d}">📝 ملاحظات اليوم</button>
    `;
    daysContainer.appendChild(day);
}

// تحميل البيانات
document.querySelectorAll("input").forEach(el=>{
    const {day,task}=el.dataset;
    if(data[day]?.[task]!==undefined) el.checked=data[day][task];
    el.addEventListener("change",saveData);
});

// فتح نافذة الملاحظات
document.querySelectorAll(".noteBtn").forEach(btn=>{
    btn.onclick = ()=>{
        currentNoteDay = btn.dataset.day;
        noteText.value = data[currentNoteDay]?.note || "";
        noteModal.style.display="flex";
    }
});

// حفظ الملاحظات
saveNoteBtn.onclick = ()=>{
    data[currentNoteDay] = data[currentNoteDay] || {};
    data[currentNoteDay].note = noteText.value;
    localStorage.setItem("ramadanUX",JSON.stringify(data));
    noteModal.style.display="none";
};

// اغلاق المودال
closeModal.onclick = ()=>noteModal.style.display="none";

// حفظ البيانات عند checkbox
function saveData(){
    document.querySelectorAll("input").forEach(el=>{
        const {day,task}=el.dataset;
        data[day]=data[day]||{};
        data[day][task]=el.checked;
    });
    localStorage.setItem("ramadanUX",JSON.stringify(data));
    calcProgress();
}

// حساب التقدم
function calcProgress(){
    let total=0, done=0;
    let prayerDone=0,quranDone=0,dhikrDone=0;
    for(let d=1;d<=30;d++){
        tasks.forEach(t=>{
            if(data[d]?.[t.id]){ 
                done++; total++; 
                if(t.id==="prayer") prayerDone++;
                if(t.id==="quran") quranDone++;
                if(t.id==="dhikr") dhikrDone++;
            } else total++;
        });
    }
    totalProgress.style.width = Math.round(done/total*100)+"%";
    prayerProgress.style.width = Math.round(prayerDone/30*100)+"%";
    quranProgress.style.width = Math.round(quranDone/30*100)+"%";
    dhikrProgress.style.width = Math.round(dhikrDone/30*100)+"%";
}

calcProgress();
