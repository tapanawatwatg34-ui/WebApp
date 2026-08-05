// อ้างอิง Element จาก HTML
const incomeInput = document.getElementById('income');
const goalInput = document.getElementById('goal');
const periodSelect = document.getElementById('period');

const btnCalc = document.getElementById('btn-calc');
const btnSave = document.getElementById('btn-save');
const btnClear = document.getElementById('btn-clear');

const resultBox = document.getElementById('result-box');
const savePerMonthText = document.getElementById('save-per-month');
const savePercentageText = document.getElementById('save-percentage');
const statusBadge = document.getElementById('status-badge');

// โหลดข้อมูลเก่าจาก Local Storage เมื่อเปิดหน้าเว็บ (ถ้ามี)
window.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('financialData');
    if (savedData) {
        const data = JSON.parse(savedData);
        incomeInput.value = data.income;
        goalInput.value = data.goal;
        periodSelect.value = data.period;
        calculateSavings(); // คำนวณแสดงผลทันที
    }
});

// ฟังก์ชันคำนวณผล
function calculateSavings() {
    // แปลงค่าจาก Input เป็นตัวเลข (ดักจับค่าว่างให้เป็น 0)
    const income = parseFloat(incomeInput.value) || 0;
    const goal = parseFloat(goalInput.value) || 0;
    const period = parseInt(periodSelect.value) || 1;

    if (income <= 0 || goal <= 0) {
        alert("กรุณากรอกข้อมูลรายได้และเป้าหมายให้ถูกต้อง");
        return;
    }

    // คำนวณเงินออมต่อเดือนและเปอร์เซ็นต์
    const savePerMonth = goal / period;
    const percentage = (savePerMonth / income) * 100;

    // แสดงค่าบนหน้าเว็บ
    savePerMonthText.innerText = savePerMonth.toFixed(2);
    savePercentageText.innerText = percentage.toFixed(1);

    // ล้าง Class เก่าออกก่อน
    resultBox.className = "result-box";
    
    // Logic (if/else) ประเมินความยากง่ายตามสัดส่วนเงินออมต่อรายได้
    if (percentage <= 10) {
        resultBox.classList.add('easy');
        statusBadge.innerText = "ระดับ: ออมสบายๆ ชิลมาก 🎉";
        statusBadge.style.color = "#27ae60";
    } else if (percentage <= 30) {
        resultBox.classList.add('medium');
        statusBadge.innerText = "ระดับ: กำลังดีตามมาตรฐาน 👍";
        statusBadge.style.color = "#d35400";
    } else if (percentage <= 50) {
        resultBox.classList.add('hard');
        statusBadge.innerText = "ระดับ: ตึงมือ ต้องประหยัดหน่อยนะ ⚖️";
        statusBadge.style.color = "#e67e22";
    } else {
        resultBox.classList.add('impossible');
        statusBadge.innerText = "ระดับ: เป็นไปได้ยาก/เสี่ยงเกินไป ⚠️";
        statusBadge.style.color = "#c0392b";
    }

    // แสดงกล่องผลลัพธ์
    resultBox.classList.remove('hidden');
}

// Event Listeners สำหรับปุ่มต่างๆ
btnCalc.addEventListener('click', calculateSavings);

btnSave.addEventListener('click', () => {
    const dataToSave = {
        income: incomeInput.value,
        goal: goalInput.value,
        period: periodSelect.value
    };
    // บันทึกลง Local Storage ในรูปแบบ String JSON
    localStorage.setItem('financialData', JSON.stringify(dataToSave));
    alert("บันทึกข้อมูลเรียบร้อยแล้ว!");
});

btnClear.addEventListener('click', () => {
    localStorage.removeItem('financialData');
    incomeInput.value = '';
    goalInput.value = '';
    periodSelect.value = '1';
    resultBox.classList.add('hidden');
    alert("ล้างข้อมูลเรียบร้อย");
});
