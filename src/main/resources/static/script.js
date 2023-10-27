function getRoleName(user) {
    let authority = [];
    user.roles.forEach(role => {
        authority += role.authority.replace("ROLE_", "");
        authority += " ";
    });
    return authority
}
function containsRole(array, role) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].authority === role.authority) {
            return true
        }

    }
    return false
}
function addUserTable() {
    fetch('api/users').then(res => res.json())
        .then(users => {
            users.forEach(user => {
                addNewUserToTable(user)
            })
        })

}


function dataOnTheServer( api, method, data) {
    return fetch(api, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
    }).catch(error => console.error(error));

}
//конец запроса

function getPrincipalData() {
    fetch('api/principal').then(res => res.json())
        .then(principal => {
            const nameCurrentUser = document.getElementById('nameCurrentUser')
            const sidebarData = document.getElementById('sidebarData')
            sidebarData.innerHTML = ''
            nameCurrentUser.innerHTML = `
        <span class="text-2">${principal.name}</span>
        <span> with roles: ${getRoleName(principal)} </span>
         `
        principal.roles.forEach(role => {
            const roleHref = role.authority.replace("ROLE_", "").toLowerCase();
            const roleText = roleHref.charAt(0).toUpperCase() + roleHref.slice(1)
            sidebarData.innerHTML += `
            <a style="text-decoration: none" href="/${roleHref}">
            <li class="list-group-item rounded ${roleHref === 'admin' ? 'active' : ''}" aria-current="true" >${roleText} </li>
            </a>
            `
        })

    })

}

function addNewUserToTable (user) {
    const tbody = document.querySelector('tbody')
    tbody.innerHTML += `
                        <tr id="tr${user.id}">
                            <td>${user.id}</td> 
                            <td id="tdName${user.id}">${user.name}</td>
                            <td id="tdAge${user.id}">${user.age}</td>
                            <td id="tdEmail${user.id}">${user.email}</td>  
                            <td id="tdRoles${user.id}">${getRoleName(user)}</td>
                            <td>
                        <button class ="btn1 btn btn-primary btn-block" id="btn${user.id}" data-toggle="modal" data-target="#exampleModal${user.id}" data-modal="edit" >Edit</button> <!--// todo attribute -->
                            </td>
                             <td>
                        <button class ="btn btn-block btn btn-danger" id="btn2${user.id}" data-toggle="modal" data-target="#exampleModal2${user.id}" data-modal="delete">Delete</button>
                            </td>
                        </tr>
                `;


}


function addNewUser() {
    fetch('api/roles').then(pr => pr.json())
        .then(pr => {
            const inputRoles = document.getElementById('inputRoles')
            pr.forEach(role => {
                inputRoles.innerHTML += `
                    <input type="checkbox" name="roles" value='${JSON.stringify(role)}'>${role.authority.replace("ROLE_", "")}
                    <br>
                    `
            })
        })
    const form = document.getElementById('formNewUser');
    form.addEventListener('submit', async event => {
        event.preventDefault()
        const myFormData = new FormData(event.target);
        const formDataObj = Object.fromEntries(myFormData.entries());
        formDataObj.roles = myFormData.getAll('roles').map(el => JSON.parse(el))
        event.target.reset()
        await dataOnTheServer( 'api/users', 'POST', JSON.stringify(formDataObj)); // todo
         fetch('api/users').then(res=>res.json()).then(users => {
           addNewUserToTable(users[users.length-1])
        })
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////

function switchBtwUserTableAndNewUserDiv() {

const newUserBtn = document.querySelector('#newUserBtn')
const newUserDiv = document.querySelector('#newUser')
const userTableBtn = document.querySelector('#userTableBtn')
const userTableDiv = document.querySelector('#allUsers')

newUserBtn.addEventListener('click', e => {
    newUserBtn.classList.add('active');
    userTableBtn.classList.remove('active')
    userTableDiv.classList.add('d-none');
    newUserDiv.classList.remove('d-none');

})
userTableBtn.addEventListener('click', e => {
    userTableBtn.classList.add('active');
    newUserBtn.classList.remove('active')
    newUserDiv.classList.add('d-none');
    userTableDiv.classList.remove('d-none');
})
}

 function addModalDeleteUser() {
     const tbody = document.querySelector('tbody')
     let modalDelete = document.getElementById('modalDelete').querySelector('.modal')
     let formWrapper = document.getElementById('formWrapper')
      tbody.addEventListener('click', event => {
        let button = event.target; // где был клик?
        if (button.tagName === 'BUTTON'   && button.getAttribute('data-modal') === 'delete') {
            fetch(`api/users/${button.id.replace('btn2', '')}`).then(res => res.json())
                .then(user => {
                    formWrapper.innerHTML = `
                <form id="form2${user.id}">
                        <div class="form-group text-3">
                            <label for="input20">ID</label>
                            <input type="text" class="form-control" name="id" value="${user.id}" id="input20" disabled >
                        </div>
                        <div class="form-group text-3">
                            <label for="input21">Name</label>
                            <input type="text" class="form-control" name="name" value="${user.name}"  id="input21" disabled>
                        </div>
                        <div class="form-group text-3">
                            <label for="input22">Age</label>
                            <input type="text" class="form-control" name="age" value="${user.age}" id="input22" disabled>
                        </div>
                        <div class="form-group text-3">
                            <label for="input23">Email</label>
                            <input type="email" class="form-control" name="email" value="${user.email}" id="input23" disabled>
                        </div>
                        <p class="text-3">Role</p>
                        <div class="form-group text-3 text-left" id="subWrapper">
                        </div>
                </form>
                `
                    fetch('api/roles').then(pr => pr.json())
                        .then(pr => {
                            const subWrapper = document.getElementById('subWrapper')
                            pr.forEach(role => {
                                subWrapper.innerHTML += `
                                        <input type="checkbox" name="roles" value='${JSON.stringify(role)}' ${containsRole(user.roles, role) ? 'checked' : ''} disabled>${role.authority.replace("ROLE_", "")}
                                        <br>
                                        `
                            })
                        })
                    const deleteSubmit = document.getElementById('deleteSubmit')
                    deleteSubmit.setAttribute('form', `form2${user.id}`)
                    $(`#${modalDelete.id}`).modal('show')
                });

        }
      })


     formWrapper.addEventListener("submit", async event => {
         event.preventDefault()
         console.log(event.target)
         const userId = event.target.getAttribute('id').replace('form2', '');
        await dataOnTheServer(`api/users/${userId}`, 'DELETE', '')
         $(`#${modalDelete.id}`).modal('hide')
         document.getElementById(`tr${userId}`).remove()
     })

}




function addModalEditUser() {
    const tbody = document.querySelector('tbody')
    let modalEdit = document.getElementById('modalEdit').querySelector('.modal')
    let formWrapper = document.getElementById('formWrapper1')
    tbody.addEventListener('click', async event => {
        let button = event.target; // где был клик?
        if (button.tagName === 'BUTTON'   && button.getAttribute('data-modal') === 'edit') {
            fetch(`api/users/${button.id.replace('btn', '')}`).then(res => res.json())
                .then(async user => {
                    formWrapper.innerHTML = `
                <form id="form${user.id}">
                        <div class="form-group text-3">
                            <label for="input0">ID</label>
                            <input type="text" class="form-control" value="${user.id}" id="input0" disabled>
                       </div>
                        <div class="form-group text-3">
                            <label for="input1">Name</label>
                            <input type="text" class="form-control" name="name" value="${user.name}"  id="input1" >
                        </div>
                        <div class="form-group text-3">
                            <label for="input2">Age</label>
                            <input type="text" class="form-control" name="age" value="${user.age}" id="input2">
                        </div>
                        <div class="form-group text-3">
                            <label for="input3">Email</label>
                            <input type="email" class="form-control" name="email" value="${user.email}" id="input3">
                        </div>
                        <div class="form-group text-3">
                            <label for="input4">Password</label>
                            <input type="password" class="form-control" name="password"  id="input4">
                        </div>
                        <p class="text-3">Role</p>
                        <div class="form-group text-3 text-left" id="subWrapper2">
                        </div>
                    </form>                 `

                   fetch('api/roles').then(pr => pr.json())
                        .then(pr => {
                         const subWrapper = document.getElementById('subWrapper2')
                            pr.forEach(role => {
                                subWrapper.innerHTML += `
                                        <input type="checkbox" name="roles" value='${JSON.stringify(role)}' ${containsRole(user.roles, role) ? 'checked' : ''}>${role.authority.replace("ROLE_", "")}
                                        <br>
                                        `
                            })
                        })
                    const editSubmit = document.getElementById('editSubmit')
                    editSubmit.setAttribute('form', `form${user.id}`)
                    $(`#${modalEdit.id}`).modal('show')
                });

        }

    })

    formWrapper.addEventListener("submit", async event => {
        event.preventDefault()
        const userId = event.target.getAttribute('id').replace('form', '');
        const myFormData = new FormData(event.target);
        const formDataObj = Object.fromEntries(myFormData.entries());
        formDataObj.roles = myFormData.getAll('roles').map(el => JSON.parse(el))
        await dataOnTheServer( `api/users/${userId}`, 'PUT', JSON.stringify(formDataObj));
        document.getElementById(`tdName${userId}`).textContent = formDataObj.name;
        document.getElementById(`tdAge${userId}`).textContent = formDataObj.age;
        document.getElementById(`tdEmail${userId}`).textContent = formDataObj.email;
        document.getElementById(`tdRoles${userId}`).textContent = getRoleName(formDataObj);
        await getPrincipalData();
        $(`#${modalEdit.id}`).modal('hide')

    })
}

getPrincipalData();
addUserTable();
addModalEditUser()
addModalDeleteUser()
switchBtwUserTableAndNewUserDiv()
addNewUser();


