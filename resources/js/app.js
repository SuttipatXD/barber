console.log('join ./app.js')

async function refreshTasks() {
  const res = await fetch('/status')
  const data = await res.json()
  // console.log('data: ', data)


  let html = ''

  data.forEach(employee => {
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
