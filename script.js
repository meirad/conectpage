
let emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
let numregex = /^\+?[0-9]+$/;

document.querySelector('.add').addEventListener('click', (event) => {
    let name = document.querySelector('.name-input').value;
    let email = document.querySelector('.email-input').value;
    let address = document.querySelector('.address-input').value;
    let phone = document.querySelector('.phone-input').value;

    if (!name || !address || !phone || !email) {
        alert('Please fill out all required fields.');
        event.preventDefault(); // Prevent form from submitting
        return;
    }

    if (!numregex.test(phone)) {
        alert('Please enter a valid phone number.');
        event.preventDefault(); // Prevent form from submitting
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        event.preventDefault(); // Prevent form from submitting
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
    console.log(employee.name);
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    let index = employees.findIndex(emp => emp.name === employee.name && emp.email === employee.email);
    if (index !== -1) {
        let oldSaveButton = document.querySelector('#editEmployeeModal .save-button');
        if (oldSaveButton) {

            let saveButton = oldSaveButton.cloneNode(true);
            oldSaveButton.parentNode.replaceChild(saveButton, oldSaveButton);

            let newNameInput = document.querySelector('#editEmployeeModal .name-input');
            let newEmailInput = document.querySelector('#editEmployeeModal .email-input');
            let newAddressInput = document.querySelector('#editEmployeeModal .address-input');
            let newPhoneInput = document.querySelector('#editEmployeeModal .phone-input');


            if (newNameInput && newEmailInput && newAddressInput && newPhoneInput) {
                newNameInput.value = employee.name; 
                newEmailInput.value = employee.email; 
                newAddressInput.value = employee.address; 
                newPhoneInput.value = employee.phone; 
                
            }
            saveButton.addEventListener('click', function(event) {
                // Retrieve the updated values from the input fields
                let newName = newNameInput.value;
                let newEmail = newEmailInput.value;
                let newAddress = newAddressInput.value;
                let newPhone = newPhoneInput.value;
            
                if (!newName || !newAddress || !newPhone || !newEmail) {
                    alert('Please fill out all required fields.');
                    event.preventDefault(); 
                    return;
                }
            
                if (!numregex.test(newPhone)) {
                    alert('Please enter a valid phone number.');
                    event.preventDefault(); 
                    return;
                }
            
                if (!emailRegex.test(newEmail)) {
                    alert('Please enter a valid email address.');
                    event.preventDefault(); 
                    return;
                }
            
                employees[index] = {
                    name: newName,
                    email: newEmail,
                    address: newAddress,
                    phone: newPhone,
                    Actions: ''
                };
            
                localStorage.setItem('employees', JSON.stringify(employees));
                displayEmployees();
            
                $('#editEmployeeModal').modal('hide');
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