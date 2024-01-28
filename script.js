document.querySelector('.add').addEventListener('click', (event) => {
    let name = document.querySelector('.name-input').value;
    let email = document.querySelector('.email-input').value;
    let address = document.querySelector('.address-input').value;
    let phone = document.querySelector('.phone-input').value;

    if (!name || !email || !address || !phone) {
        alert('Please fill out all required fields.');
        return;
    }

    let employee = {
        name: name,
        email: email,
        address: address,
        phone: phone,
        Actions: ''
    };

    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    employees.push(employee);
    localStorage.setItem('employees', JSON.stringify(employees));

    $('#addEmployeeModal').modal('hide');
    displayEmployees();
});

function displayEmployees() {
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; 

    for (let employee of employees) {
        let tr = document.createElement('tr');

        for (let property in employee) {
            if (property !== 'Actions') { 
                let td = document.createElement('td');
                td.textContent = employee[property];
                tr.appendChild(td);
            }
        }

        let inputs = document.querySelectorAll('input[required]');
        for (let input of inputs) {
            input.value = '';
        }

        let deleteTd = document.createElement('td');
        let deleteButton = document.createElement('a');
        deleteButton.href = "#deleteEmployeeModal";
        deleteButton.className = "delete";
        deleteButton.dataset.toggle = "modal";
        deleteButton.innerHTML = `<i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>`;
        deleteTd.appendChild(deleteButton);

        let editTd = document.createElement('td');
        let editButton = document.createElement('a');
        editButton.href = "#editEmployeeModal";
        editButton.className = "edit";
        editButton.dataset.toggle = "modal";
        editButton.innerHTML = `<i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>`;
        editTd.appendChild(editButton);

        deleteButton.addEventListener('click', () => {
            let index = employees.findIndex(emp => emp.name === employee.name && emp.email === employee.email);
            if (index !== -1) {
                employees.splice(index, 1);
            }
            localStorage.setItem('employees', JSON.stringify(employees));
            displayEmployees();
        });

        editButton.addEventListener('click', function() {
            $('#editEmployeeModal').modal('hide');
            edit(employee);
        });

        tr.appendChild(editTd);
        tr.appendChild(deleteTd);

        tbody.appendChild(tr);
    }
}

document.addEventListener('DOMContentLoaded', displayEmployees);

function deleteAll() {
    if (confirm('Are you sure you want to delete all employees?')) {
        let employees = [];
        localStorage.setItem('employees', JSON.stringify(employees));
        displayEmployees();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    let deleteAllButton = document.querySelector('.delateAll');
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', deleteAll);
    } else {
        console.error('Element with class .delateAll not found');
    }
});


let currentRow = null;

function edit(employee) {
    console.log(employee);
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    let index = employees.findIndex(emp => emp.name === employee.name && emp.email === employee.email);
    if (index !== -1) {
        // Get the save button
        let oldSaveButton = document.querySelector('#editEmployeeModal .save-button');
        if (oldSaveButton) {
            // Clone the save button and replace the old save button with the clone
            let saveButton = oldSaveButton.cloneNode(true);
            oldSaveButton.parentNode.replaceChild(saveButton, oldSaveButton);

            saveButton.addEventListener('click', function() {
                // Get new data from the editEmployeeModal
                let newNameInput = document.querySelector('#editEmployeeModal .name-input');
                let newEmailInput = document.querySelector('#editEmployeeModal .email-input');
                let newAddressInput = document.querySelector('#editEmployeeModal .address-input');
                let newPhoneInput = document.querySelector('#editEmployeeModal .phone-input');

                if (newNameInput && newEmailInput && newAddressInput && newPhoneInput) {
                    let newName = newNameInput.value;
                    let newEmail = newEmailInput.value;
                    let newAddress = newAddressInput.value;
                    let newPhone = newPhoneInput.value;

                    employees[index] = {
                        name: newName,
                        email: newEmail,
                        address: newAddress,
                        phone: newPhone,
                        Actions: ''
                    };

                    localStorage.setItem('employees', JSON.stringify(employees));
                    displayEmployees();
                } else {
                    console.error('One or more input elements not found');
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let editButton = document.querySelector('.save-button');
    if (editButton) {
        editButton.addEventListener('click', edit);
        
    } else {
        console.error('Element with class .editButton not found');
        console.log(edit(employee));
    }
});