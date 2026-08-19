const SUPABASE_URL = 'https://ajqxbaovaokxxvylxkgm.supabase.co';

const SUPABASE_KEY = 'sb_publishable_XsqaoStpuCuATFv2Vc7tEA_bsKeapqA';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
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

function calculateSavings() {

    const income = parseFloat(incomeInput.value) || 0;
    const goal = parseFloat(goalInput.value) || 0;
    const period = parseInt(periodSelect.value) || 1;

    if (income <= 0 || goal <= 0) {
        alert("กรุณากรอกข้อมูลรายได้และเป้าหมายให้ถูกต้อง");
        return;
    }

    // เงินที่ต้องออมต่อเดือน
    const savePerMonth = goal / period;

    // เปอร์เซ็นต์ของรายได้ที่ต้องออม
    const percentage = (savePerMonth / income) * 100;

    // แสดงผล
    savePerMonthText.innerText = savePerMonth.toFixed(2);
    savePercentageText.innerText = percentage.toFixed(1);

    // ล้าง class เดิม
    resultBox.className = "result-box";

    // ประเมินระดับการออม
    if (percentage <= 10) {

        resultBox.classList.add('easy');

        statusBadge.innerText =
            "ระดับ: ออมสบายๆ ชิลมาก 🎉";

        statusBadge.style.color = "#27ae60";

    } else if (percentage <= 30) {

        resultBox.classList.add('medium');

        statusBadge.innerText =
            "ระดับ: กำลังดีตามมาตรฐาน 👍";

        statusBadge.style.color = "#d35400";

    } else if (percentage <= 50) {

        resultBox.classList.add('hard');

        statusBadge.innerText =
            "ระดับ: ตึงมือ ต้องประหยัดหน่อยนะ ⚖️";

        statusBadge.style.color = "#e67e22";

    } else {

        resultBox.classList.add('impossible');

        statusBadge.innerText =
            "ระดับ: เป็นไปได้ยาก/เสี่ยงเกินไป ⚠️";

        statusBadge.style.color = "#c0392b";
    }

    // แสดงกล่องผลลัพธ์
    resultBox.classList.remove('hidden');
}

async function saveToSupabase() {

    const income = parseFloat(incomeInput.value) || 0;
    const goal = parseFloat(goalInput.value) || 0;
    const period = parseInt(periodSelect.value) || 1;

    // ตรวจสอบข้อมูล
    if (income <= 0 || goal <= 0) {
        alert("กรุณากรอกข้อมูลรายได้และเป้าหมายก่อนบันทึก");
        return;
    }

    // คำนวณข้อมูล
    const savePerMonth = goal / period;
    const percentage = (savePerMonth / income) * 100;

    // ส่งข้อมูลไป Supabase
    const { data, error } = await supabaseClient
        .from('savings')
        .insert([
            {
                income: income,
                goal: goal,
                period: period,
                save_per_month: savePerMonth,
                percentage: percentage
            }
        ])
        .select();

    // ถ้าเกิด Error
    if (error) {

        console.error("Supabase Error:", error);

        alert(
            "บันทึกข้อมูลไม่สำเร็จ\n\n" +
            error.message
        );

        return;
    }

    // สำเร็จ
    console.log("Saved:", data);

    // เก็บข้อมูลล่าสุดไว้ในเครื่องด้วย
    const localData = {
        income: income,
        goal: goal,
        period: period
    };

    localStorage.setItem(
        'financialData',
        JSON.stringify(localData)
    );

    alert("บันทึกข้อมูลลง Supabase เรียบร้อยแล้ว! ✅");
}

async function loadLastData() {

    const { data, error } = await supabaseClient
        .from('savings')
        .select('income, goal, period')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {

        console.error("Load Supabase Error:", error);

        // ถ้า Supabase โหลดไม่ได้
        // ลองโหลดจาก Local Storage แทน
        loadLocalData();

        return;
    }

    if (data && data.length > 0) {

        const latest = data[0];

        incomeInput.value = latest.income;
        goalInput.value = latest.goal;
        periodSelect.value = latest.period;

        calculateSavings();

        return;
    }

    loadLocalData();
}

function loadLocalData() {

    const savedData = localStorage.getItem('financialData');

    if (!savedData) {
        return;
    }

    try {

        const data = JSON.parse(savedData);

        incomeInput.value = data.income || '';
        goalInput.value = data.goal || '';
        periodSelect.value = data.period || '1';

        calculateSavings();

    } catch (error) {

        console.error(
            "Local Storage Error:",
            error
        );

    }
}

async function clearData() {

    // ล้างข้อมูลจากหน้าจอ
    incomeInput.value = '';
    goalInput.value = '';
    periodSelect.value = '1';

    resultBox.classList.add('hidden');

    // ล้าง Local Storage
    localStorage.removeItem('financialData');

    alert("ล้างข้อมูลจากหน้าเว็บเรียบร้อยแล้ว");
}

btnCalc.addEventListener(
    'click',
    calculateSavings
);

btnSave.addEventListener(
    'click',
    saveToSupabase
);

btnClear.addEventListener(
    'click',
    clearData
);

window.addEventListener(
    'DOMContentLoaded',
    () => {

        loadLastData();

    }
);
