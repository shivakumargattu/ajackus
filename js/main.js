
    let employees = [];
    let currentPage = 1;
    let pageSize = 10;

    document.addEventListener('DOMContentLoaded', () => {
      seedFakeData();
      renderEmployees();
      document.getElementById('employeeForm').addEventListener('submit', handleFormSubmit);
    });

    function seedFakeData() {
      if (!localStorage.getItem('employees')) {
        employees = [];
        for (let i = 1; i <= 50; i++) {
          employees.push({
            id: i,
            firstName: `User${i}`,
            lastName: `Last${i}`,
            email: `user${i}@example.com`,
            department: ["HR", "IT", "Finance", "Marketing"][i % 4],
            role: ["Manager", "Developer", "Analyst", "Designer"][i % 4]
          });
        }
        localStorage.setItem('employees', JSON.stringify(employees));
      }
      employees = JSON.parse(localStorage.getItem('employees'));
    }

    function renderEmployees(data = employees) {
      const container = document.getElementById('employeeContainer');
      container.innerHTML = '';

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginated = data.slice(start, end);

      paginated.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'employee-card';
        card.innerHTML = `
          <h3>${emp.firstName} ${emp.lastName}</h3>
          <p><strong>Email:</strong> ${emp.email}</p>
          <p><strong>Department:</strong> ${emp.department}</p>
          <p><strong>Role:</strong> ${emp.role}</p>
          <button onclick="editEmployee(${emp.id})">Edit</button>
          <button onclick="deleteEmployee(${emp.id})">Delete</button>
        `;
        container.appendChild(card);
      });

      renderPagination(data.length);
    }

    function renderPagination(totalItems) {
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '';
      const totalPages = Math.ceil(totalItems / pageSize);

      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = currentPage === i ? 'active' : '';
        btn.onclick = () => {
          currentPage = i;
          renderEmployees();
        };
        pagination.appendChild(btn);
      }
    }

    function changePageSize() {
      pageSize = parseInt(document.getElementById('pageSize').value);
      currentPage = 1;
      renderEmployees();
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      const id = document.getElementById('empId').value;
      const emp = {
        id: id ? parseInt(id) : Date.now(),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        role: document.getElementById('role').value,
      };

      if (id) {
        employees = employees.map(e => e.id === parseInt(id) ? emp : e);
      } else {
        employees.push(emp);
      }

      localStorage.setItem('employees', JSON.stringify(employees));
      closeModal();
      renderEmployees();
    }

    function editEmployee(id) {
      const emp = employees.find(e => e.id === id);
      document.getElementById('empId').value = emp.id;
      document.getElementById('firstName').value = emp.firstName;
      document.getElementById('lastName').value = emp.lastName;
      document.getElementById('email').value = emp.email;
      document.getElementById('department').value = emp.department;
      document.getElementById('role').value = emp.role;
      document.getElementById('formTitle').innerText = 'Edit Employee';
      document.getElementById('employeeModal').classList.remove('hidden');
    }

    function deleteEmployee(id) {
      if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(e => e.id !== id);
        localStorage.setItem('employees', JSON.stringify(employees));
        renderEmployees();
      }
    }

    function showAddForm() {
      document.getElementById('employeeForm').reset();
      document.getElementById('empId').value = '';
      document.getElementById('formTitle').innerText = 'Add Employee';
      document.getElementById('employeeModal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('employeeModal').classList.add('hidden');
    }

    function applySort() {
      const criteria = document.getElementById('sortSelect').value;
      if (criteria) {
        employees.sort((a, b) => a[criteria].localeCompare(b[criteria]));
        renderEmployees();
      }
    }

    function applySearch() {
      const query = document.getElementById('searchInput').value.toLowerCase();
      const filtered = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query)
      );
      currentPage = 1;
      renderEmployees(filtered);
    }
  