console.log('join ./app.js')

async function refreshTasks() {
  const res = await fetch('/status')
  const data = await res.json()
  // console.log('data: ', data)

  let html = ''

  data.forEach((employee) => {
    const isStatus = employee.status === 2
    html += `
      <div class="col">
        <div class="card h-100 shadow-sm border-0 rounded-3">
          <div class="card-body p-3 d-flex flex-column justify-content-between">
            <div class="d-grid gap-1">
              <h6 class="card-title text-muted">
                ชื่อ: ${employee.fullName}
              </h6>
              <div class="d-flex align-items-center">
                สถานะ:
                <i class="bi bi-circle-fill ${isStatus ? 'text-success' : 'text-danger'} mx-1"></i>
                <span class="${isStatus ? 'text-success' : 'text-danger'} fw-medium">
                  ${isStatus ? 'ว่าง' : 'ไม่ว่าง'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  document.getElementById('taskList').innerHTML = html
}

function prefillDataAdmin() {
  document.getElementById('email').value = 'admin@example.com'
  document.getElementById('password').value = '123456'
}
function prefillDataEmployee() {
  document.getElementById('email').value = 'employee@example.com'
  document.getElementById('password').value = '123456'
}
function prefillDataCustomer() {
  document.getElementById('email').value = 'customer@example.com'
  document.getElementById('password').value = '123456'
}

function toggleBarberSelect(checkbox) {
  const select = document.getElementById('barberSelect')
  if (checkbox.checked) {
    select.disabled = true
    // ตั้งค่าให้ value เป็น 0 ถ้าไม่ระบุ
    const opt = document.createElement('option')
    opt.value = 0
    opt.textContent = 'ระบบสุ่มให้'
    opt.selected = true
    select.innerHTML = ''
    select.appendChild(opt)
    console.log(select.appendChild(opt))
  } else {
    select.disabled = false
    window.location.reload() // โหลดใหม่เพื่อแสดงรายชื่อช่าง
  }
}

// ฟังก์ชันสำหรับเปิด/ปิดช่องเลือกช่าง (เหมือนเดิม)
function toggleBarberSelect(checkbox) {
  const barberSelect = document.getElementById('barberSelect')
  if (checkbox.checked) {
    barberSelect.value = ''
    barberSelect.setAttribute('disabled', 'disabled')
    barberSelect.removeAttribute('required')
  } else {
    barberSelect.removeAttribute('disabled')
    barberSelect.setAttribute('required', 'required')
  }
}

const genderMaleCheck = document.getElementById('genderMale')
const genderFemaleCheck = document.getElementById('genderFemale')
const serviceSelect = document.getElementById('serviceSelect')
const noBarberCheck = document.getElementById('noBarberCheck') // Checkbox "ไม่ระบุช่าง"
const barberSelect = document.getElementById('barberSelect')
const timeSelect = document.getElementById('timeSelect')
const submitButton = document.querySelector('button[type="submit"]')

// ฟังก์ชันใหม่สำหรับจัดการการเปลี่ยนแปลงของ Checkbox เพศ
async function handleGenderChange() {
  // ตรวจสอบว่ามีการเลือกเพศอย่างน้อยหนึ่งตัวหรือไม่
  const isGenderSelected = genderMaleCheck.checked || genderFemaleCheck.checked

  // อัปเดตสถานะ disabled ของช่องต่างๆ
  serviceSelect.disabled = !isGenderSelected

  // หากไม่มีเพศถูกเลือก ให้รีเซ็ตค่าของช่องที่ถูก disabled ด้วย
  if (!isGenderSelected) {
    serviceSelect.value = ''
    noBarberCheck.checked = false // ยกเลิกการเลือก "ไม่ระบุช่าง"
    barberSelect.value = ''
    barberSelect.setAttribute('required', 'required') // ให้กลับมา required ถ้าไม่เลือกช่าง
    timeSelect.value = ''
    noBarberCheck.disabled = !isGenderSelected
    barberSelect.disabled = !isGenderSelected
    timeSelect.disabled = !isGenderSelected
    submitButton.disabled = !isGenderSelected
  }

  // ทำให้แน่ใจว่าเลือกได้เพียงเพศเดียว (เหมือนโค้ดเดิมของคุณ)
  if (genderMaleCheck.checked) {
    genderFemaleCheck.checked = false
  } else if (genderFemaleCheck.checked) {
    genderMaleCheck.checked = false
  }

  let isSending = false

  if (isSending) {
    console.log('กำลังส่งข้อมูล โปรดรอ...')
    return
  }
}

function handleServiceChange() {
  const isServiceSelected = serviceSelect.value !== '' // จะเป็น true ถ้าเลือกบริการแล้ว, false ถ้ายังไม่ได้เลือก

  console.log('บริการที่เลือก:', serviceSelect.value)
  console.log('มีการเลือกบริการแล้ว?:', isServiceSelected)

  // ปิดใช้งานถ้ายังไม่เลือกบริการ
  noBarberCheck.disabled = !isServiceSelected
  barberSelect.disabled = !isServiceSelected

  // หากไม่มีบริการถูกเลือก ให้รีเซ็ตค่าของช่องที่ถูก disabled ด้วย
  if (!isServiceSelected) {
    noBarberCheck.checked = false // ยกเลิกการเลือก "ไม่ระบุช่าง"
    barberSelect.value = '' // รีเซ็ตค่าเลือกช่าง
    barberSelect.setAttribute('required', 'required') // ทำให้กลับมา required ถ้าไม่มีการเลือกช่าง
  }
}

// ฟังก์ชันเดิมสำหรับการเปิด/ปิดช่องเลือกช่าง (ปรับปรุงเล็กน้อยเพื่อเรียก handleBarberOrNoBarberChange)
function toggleBarberSelect(checkbox) {
  // อันนี้จะจัดการการ disabled ของ barberSelect เอง
  if (checkbox.checked) {
    barberSelect.value = '' // เคลียร์การเลือกช่าง
    barberSelect.setAttribute('disabled', 'disabled')
    barberSelect.removeAttribute('required') // ไม่ต้องบังคับเลือกช่าง
  } else {
    barberSelect.removeAttribute('disabled')
    barberSelect.setAttribute('required', 'required') // บังคับเลือกช่าง
  }
}

// ฟังก์ชันใหม่ที่จัดการการเปิด/ปิดช่อง 'เลือกช่วงเวลา' และปุ่ม 'ยืนยัน'
function handleBarberOrNoBarberChange() {
  // ตรวจสอบว่า "ไม่ระบุช่าง" ถูกเลือกอยู่หรือไม่
  const isNoBarberChecked = noBarberCheck.checked
  // ตรวจสอบว่ามีการเลือกช่างแล้วหรือไม่ (ค่าว่างคือยังไม่เลือก)
  const isBarberSelected = barberSelect.value !== ''

  // ถ้ามีการเลือก "ไม่ระบุช่าง" หรือ "เลือกช่าง" แล้ว ให้เปิดใช้งาน timeSelect และ submitButton
  const enableTime = isNoBarberChecked || isBarberSelected

  timeSelect.disabled = !enableTime

  // หากไม่มีการเลือกทั้ง "ไม่ระบุช่าง" และ "เลือกช่าง" ให้รีเซ็ตค่าของ timeSelect
  if (!enableTime) {
    timeSelect.value = ''
  }
}

function handleBarberSelect() {
  // ให้ใส่โค้ดที่นี่
}

// ฟังก์ชันใหม่ที่จัดการการเปิด/ปิดช่อง 'เลือกช่วงเวลา' และปุ่ม 'ยืนยัน'
function handleTimeChange() {
  // ตรวจสอบว่า "ไม่ระบุช่าง" ถูกเลือกอยู่หรือไม่
  // ตรวจสอบว่ามีการเลือกช่างแล้วหรือไม่ (ค่าว่างคือยังไม่เลือก)
  const istimeSelected = timeSelect.value !== ''

  // ถ้ามีการเลือก "ไม่ระบุช่าง" หรือ "เลือกช่าง" แล้ว ให้เปิดใช้งาน timeSelect และ submitButton
  const enableSubmit = istimeSelected

  submitButton.disabled = !enableSubmit // เปิด/ปิดปุ่มยืนยันตามการเลือกช่าง/ไม่ระบุช่าง

  // หากไม่มีการเลือกทั้ง "ไม่ระบุช่าง" และ "เลือกช่าง" ให้รีเซ็ตค่าของ timeSelect
  if (!enableSubmit) {
    timeSelect.value = ''
  }
}

// ตัวแปรสำหรับเก็บสถานะการส่งข้อมูล เพื่อป้องกันการส่งซ้ำ
let isSending = false

// ฟังก์ชันหลักสำหรับส่งข้อมูล (เรียกใช้เมื่อมีการเปลี่ยนแปลงในฟอร์ม)
async function sendBookingDataAuto() {
  // 1. รับ Element ของฟอร์ม
  const reservingForm = document.getElementById('reservingForm')
  if (!reservingForm) {
    console.error('Error: Form ID "reservingForm" not found.')
    return
  }

  // 2. ดึงค่าจากฟอร์ม
  const genderMaleCheck = document.getElementById('genderMale')
  const genderFemaleCheck = document.getElementById('genderFemale')
  const serviceSelect = document.getElementById('serviceSelect')
  const noBarberCheck = document.getElementById('noBarberCheck')
  const barberSelect = document.getElementById('barberSelect')
  const timeSelect = document.getElementById('timeSelect')

  // 3. ตรวจสอบเงื่อนไขการส่งข้อมูล (ฟอร์มต้อง "valid" ระดับหนึ่งก่อนส่ง)
  // เงื่อนไข: ต้องมีการเลือกเพศ, บริการ, และ (ช่าง หรือ ไม่ระบุช่าง), และเวลา
  const isGenderSelected =
    (genderMaleCheck && genderMaleCheck.checked) || (genderFemaleCheck && genderFemaleCheck.checked)
  const isServiceSelected = serviceSelect && serviceSelect.value !== ''
  const isBarberOrNoBarberSelected =
    (noBarberCheck && noBarberCheck.checked) || (barberSelect && barberSelect.value !== '')
  const isTimeSelected = timeSelect && timeSelect.value !== ''

  // ตรวจสอบว่าเงื่อนไขทั้งหมดเป็นจริงก่อนส่ง
  if (!isGenderSelected || !isServiceSelected || !isBarberOrNoBarberSelected) {
    console.log('ข้อมูลยังไม่ครบถ้วนสำหรับการจองอัตโนมัติ.')
    return // ไม่ส่งข้อมูลถ้ายังไม่ครบ
  }

  // 4. ป้องกันการส่งข้อมูลซ้ำในขณะที่ Request เก่ากำลังประมวลผลอยู่
  if (isSending) {
    console.log('กำลังส่งข้อมูล โปรดรอ...')
    return
  }
  isSending = true // ตั้งค่าสถานะว่ากำลังส่งข้อมูล

  // 5. รวบรวมข้อมูลทั้งหมดเพื่อส่ง
  const formData = new FormData(reservingForm)
  const csrfToken = formData.get('_csrf')

  const dataToSend = {
    // ใช้ ternary operator หรือ logical OR เพื่อกำหนดค่า null ถ้าไม่ได้เลือก
    gender:
      genderMaleCheck && genderMaleCheck.checked
        ? genderMaleCheck.value
        : genderFemaleCheck && genderFemaleCheck.checked
          ? genderFemaleCheck.value
          : null,
    service_id: serviceSelect ? serviceSelect.value || null : null,
    noBarberCheck: noBarberCheck ? noBarberCheck.checked : false,
    barber_id: barberSelect ? barberSelect.value || null : null,
  }

  // 6. กำหนด URL ปลายทาง
  BOOKING_API_URL = 'reservetime'
  const url = window.BOOKING_API_URL // Or whatever variable you're using

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify(dataToSend),
    })

    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log('Send data:', data)

      // 1. นำ availableTimes ไปเติมใน dropdown (ตามที่เราทำไปแล้ว)
      timeSelect.innerHTML = '<option value="">-- กรุณาเลือกเวลา --</option>' // ล้างของเก่า

      if (data.availableTimes && data.availableTimes.length > 0) {
        data.availableTimes.forEach((time) => {
          const option = document.createElement('option')
          option.value = time.id
          option.textContent = time.time
          timeSelect.appendChild(option)
        })
        timeSelect.disabled = false // เปิดใช้งาน
        console.log('มีว่างให้เลือก.')
      } else {
        // ไม่มีเวลาว่าง
        timeSelect.disabled = true
        console.log('ไม่มีเวลาที่ว่างให้เลือก.')
      }
    } else {
      const textResponse = await response.text()
      console.error('Server did not return JSON. Full response:', textResponse)
    }
  } catch (error) {
    console.error('Network error during booking:', error)
  } finally {
    isSending = false
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // อ้างอิงถึง element ต่างๆ ใน HTML ที่เราจะแก้ไขเนื้อหา
  const timeSelect = document.getElementById('timeSelect')
  const selectedTimeDisplay = document.querySelector('.selected-time-display')
  const selectedTimeValueSpan = document.querySelector('.selected-time-value')

  // --- Event Listener สำหรับเมื่อผู้ใช้เลือกเวลาใน dropdown ---
  timeSelect.addEventListener('change', () => {
    const selectedTimeValue = timeSelect.value
    if (selectedTimeValue) {
      const selectedTimeText = timeSelect.options[timeSelect.selectedIndex].textContent // ใช้ textContent เพื่อเอาข้อความที่แสดง
      console.log(`เลือกเวลา ID: ${selectedTimeValue}, เวลา: ${selectedTimeText}`)
      handleTimeChange()
    } else {
      selectedTimeDisplay.classList.add('d-none') // ซ่อนถ้ายังไม่ได้เลือก
    }
  })
})

// เรียกใช้ฟังก์ชันครั้งแรกเมื่อโหลดหน้า เพื่อกำหนดสถานะเริ่มต้น
document.addEventListener('DOMContentLoaded', () => {
  handleGenderChange() // นี้จะควบคุม serviceSelect, noBarberCheck, barberSelect
  handleServiceChange() // นี้จะควบคุม noBarberCheck, barberSelect อีกที (พิจารณาว่าควรซ้อนกันไหม)
  handleBarberOrNoBarberChange() // นี้จะควบคุม timeSelect
  handleTimeChange() // นี้จะควบคุม submitButton
})
