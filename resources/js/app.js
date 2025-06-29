console.log('join ./app.js')

async function refreshTasks() {
  const res = await fetch('/status')
  const data = await res.json()

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

// ฟังก์ชันสำหรับจัดการการคลิกปุ่ม "เริ่มรับงาน"
async function handleStartWorkButtonClick(buttonElement) {
  // ไม่มี user id ใน dataset ของปุ่มนี้แล้ว
  // const userIdToUpdate = buttonElement.dataset.userId; // ไม่ใช้แล้วเพราะไม่ได้ส่งไปใน URL
  const userIdToUpdate = 2 // กำหนด User ID เป็น 2 ตามที่เคยระบุใน Route (หรือดึงมาจากที่อื่น)

  // สลับค่า newStatusId ระหว่าง 1 และ 2
  // ถ้าสถานะปัจจุบันของปุ่มคือ 1 (เริ่มรับงาน) -> nextStatusId เป็น 2 (หยุดรับงาน)
  // ถ้าสถานะปัจจุบันของปุ่มคือ 2 (หยุดรับงาน) -> nextStatusId เป็น 1 (เริ่มรับงาน)
  const currentStatusId = parseInt(buttonElement.dataset.newStatusId, 10)
  const nextStatusId = currentStatusId === 1 ? 2 : 1 // สลับค่า 1 <-> 2

  // ดึง CSRF Token จากฟอร์มที่เกี่ยวข้อง
  const updateStatusForm = document.getElementById('startWorkForm') // หรือฟอร์มที่เกี่ยวข้อง
  if (!updateStatusForm) {
    console.error("Form 'startWorkForm' not found.")
    alert('Internal error: Form not found.')
    return
  }
  const formData = new FormData(updateStatusForm)
  const csrfToken = formData.get('_csrf')

  // หาปุ่มคู่กัน (เช่น ถ้าคลิกเริ่มงาน ก็หาปุ่มหยุดงาน)
  const stopWorkButton = document.getElementById('stopWorkButton')

  console.log(
    `ปุ่ม "${buttonElement.textContent.trim()}" ถูกคลิกแล้ว (AJAX). สถานะใหม่: ${nextStatusId}`
  )

  buttonElement.disabled = true // ปิดปุ่มชั่วคราว

  const url = `updatestatus` // ใช้ User ID ใน URL

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify({ statusId: nextStatusId }), // ส่งค่าสถานะใหม่
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update status')
    }

    const data = await response.json()
    console.log('Update successful:', data.message, 'New Status Set:', nextStatusId)

    // --- อัปเดต UI: ซ่อนปุ่มที่ถูกคลิก และแสดงปุ่มอีกปุ่ม ---
    buttonElement.style.display = 'none' // ซ่อนปุ่มปัจจุบัน (เริ่มรับงาน)

    if (stopWorkButton) {
      stopWorkButton.style.display = 'inline-block' // แสดงปุ่มหยุดรับงาน
      stopWorkButton.disabled = false // ทำให้ปุ่มหยุดรับงานใช้งานได้
      // อัปเดต data-new-status-id ของปุ่มหยุดรับงานให้พร้อมสำหรับคลิกครั้งถัดไป
      // ถ้า 'เริ่มรับงาน' ตั้งค่าเป็น 1, 'หยุดรับงาน' ควรตั้งค่าเป็น 2 เพื่อให้สลับกลับมาได้
      stopWorkButton.dataset.newStatusId = '2' // กำหนดให้ปุ่มหยุดรับงานตั้งสถานะเป็น 2
      stopWorkButton.innerHTML = '<span class="ms-2">งดรับงาน</span>' // ตั้งข้อความคืน
      stopWorkButton.classList.remove('btn-success', 'btn-primary') // ลบสีเก่าออก
      stopWorkButton.classList.add('btn-info') // ตั้งสีใหม่
    }
    refreshTasks()
  } catch (error) {
    console.error('Error updating status:', error)
    alert(`เกิดข้อผิดพลาด: ${error.message}`)
    // คืนค่าปุ่มกลับสู่สถานะเดิมหากเกิดข้อผิดพลาด
    buttonElement.innerHTML = '<span class="ms-2">เริ่มรับงาน</span>'
    buttonElement.disabled = false
    buttonElement.style.display = 'inline-block' // แสดงปุ่มกลับมา (เผื่อโดนซ่อน)
  }
}

// ฟังก์ชันสำหรับจัดการการคลิกปุ่ม "หยุดรับงาน" (ที่สลับมา)
async function handleStopWorkButtonClick(buttonElement) {
  const userIdToUpdate = 2 // กำหนด User ID เป็น 2 (หรือดึงมาจากที่อื่น)

  // สลับค่า newStatusId ระหว่าง 1 และ 2
  const currentStatusId = parseInt(buttonElement.dataset.newStatusId, 10)
  const nextStatusId = currentStatusId === 1 ? 2 : 1 // สลับค่า 1 <-> 2

  // ดึง CSRF Token จากฟอร์มที่เกี่ยวข้อง (อาจจะเป็นฟอร์มเดียวกับปุ่มเริ่มงาน)
  const stopWorkForm = document.getElementById('stopWorkForm') // หรือฟอร์มที่เกี่ยวข้อง
  if (!stopWorkForm) {
    console.error("Form 'stopWorkForm' not found.")
    alert('Internal error: Form not found.')
    return
  }
  const formData = new FormData(stopWorkForm)
  const csrfToken = formData.get('_csrf')

  const startWorkButton = document.getElementById('startWorkButton')

  console.log(
    `ปุ่ม "${buttonElement.textContent.trim()}" ถูกคลิกแล้ว (AJAX). สถานะใหม่: ${nextStatusId}`
  )

  buttonElement.disabled = true

  const url = `updatestatus` // ใช้ User ID ใน URL

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify({ statusId: nextStatusId }), // ส่งค่าสถานะใหม่
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update status')
    }

    const data = await response.json()
    console.log('Update successful:', data.message, 'New Status Set:', nextStatusId)

    // --- อัปเดต UI: ซ่อนปุ่มที่ถูกคลิก และแสดงปุ่มอีกปุ่ม ---
    buttonElement.style.display = 'none' // ซ่อนปุ่มปัจจุบัน (หยุดรับงาน)

    if (startWorkButton) {
      startWorkButton.style.display = 'inline-block' // แสดงปุ่มเริ่มรับงาน
      startWorkButton.disabled = false // ทำให้ปุ่มเริ่มรับงานใช้งานได้
      // อัปเดต data-new-status-id ของปุ่มเริ่มรับงานให้พร้อมสำหรับคลิกครั้งถัดไป
      // ถ้า 'หยุดรับงาน' ตั้งค่าเป็น 2, 'เริ่มรับงาน' ควรตั้งค่าเป็น 1 เพื่อให้สลับกลับมาได้
      startWorkButton.dataset.newStatusId = '1' // กำหนดให้ปุ่มเริ่มรับงานตั้งสถานะเป็น 1
      startWorkButton.innerHTML = '<span class="ms-2">เริ่มรับงาน</span>' // ตั้งข้อความคืน
      startWorkButton.classList.remove('btn-success', 'btn-info') // ลบสีเก่าออก
      startWorkButton.classList.add('btn-primary') // ตั้งสีใหม่
    }
    refreshTasks()
  } catch (error) {
    console.error('Error updating status:', error)
    alert(`เกิดข้อผิดพลาด: ${error.message}`)
    // คืนค่าปุ่มกลับสู่สถานะเดิมหากเกิดข้อผิดพลาด
    buttonElement.innerHTML = '<span class="ms-2">งดรับงาน</span>'
    buttonElement.disabled = false
    buttonElement.style.display = 'inline-block' // แสดงปุ่มกลับมา
  }
}

// ฟังก์ชันสำหรับเริ่มต้นการทำงานเมื่อ DOM โหลดเสร็จ
function initializeUserStatusButtons() {
  const startWorkButton = document.getElementById('startWorkButton')
  const stopWorkButton = document.getElementById('stopWorkButton')
  const currentUserStatusInput = document.getElementById('currentUserStatus')

  if (startWorkButton && stopWorkButton && currentUserStatusInput) {
    const userStatus = parseInt(currentUserStatusInput.value, 10)

    // ตั้งค่า data-new-status-id เริ่มต้นให้กับปุ่ม
    startWorkButton.dataset.newStatusId = '1' // ปุ่มเริ่มงานควรส่งค่า 1
    stopWorkButton.dataset.newStatusId = '2' // ปุ่มหยุดงานควรส่งค่า 2

    if (userStatus === 1) {
      // User สถานะ "เริ่มรับงาน"
      stopWorkButton.style.display = 'none'
      startWorkButton.style.display = 'inline-block'
    } else if (userStatus === 2) {
      // User สถานะ "หยุดรับงาน"
      startWorkButton.style.display = 'none'
      stopWorkButton.style.display = 'inline-block'
    } else {
      // ซ่อนทั้งคู่หากสถานะไม่ตรง
      startWorkButton.style.display = 'none'
      stopWorkButton.style.display = 'none'
      console.warn('Current user status does not match button conditions. Both buttons hidden.')
    }

    // แนบ Event Listeners ให้กับปุ่ม
    startWorkButton.addEventListener('click', () => handleStartWorkButtonClick(startWorkButton))
    stopWorkButton.addEventListener('click', () => handleStopWorkButtonClick(stopWorkButton))
  } else {
    console.log('ERROR: One or more status buttons or hidden input not found in the DOM.')
  }
}

// เรียกฟังก์ชัน initializeUserStatusButtons เมื่อ DOM โหลดเสร็จสมบูรณ์
document.addEventListener('DOMContentLoaded', initializeUserStatusButtons)

// เรียกใช้ฟังก์ชันครั้งแรกเมื่อโหลดหน้า เพื่อกำหนดสถานะเริ่มต้น
document.addEventListener('DOMContentLoaded', () => {
  handleGenderChange() // นี้จะควบคุม serviceSelect, noBarberCheck, barberSelect
  handleServiceChange() // นี้จะควบคุม noBarberCheck, barberSelect อีกที (พิจารณาว่าควรซ้อนกันไหม)
  handleBarberOrNoBarberChange() // นี้จะควบคุม timeSelect
  handleTimeChange() // นี้จะควบคุม submitButton
  handleStartWorkButtonClick()
  initializeUserStatusButtons()
})
