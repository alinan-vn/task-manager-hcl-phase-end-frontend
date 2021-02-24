window.onload=function(){
    const loginBtn = document.querySelector(".login-submit");
    const registerBtn = document.querySelector(".register-submit");
    const usersURL = "http://localhost:8083/users";
    const userURL = "http://localhost:8083/user";
    const tasksURL = "http://localhost:8083/tasks";
    const taskURL = "http://localhost:8083/task";

    let globalUser;
    
    loginBtn.addEventListener('click', loginUser);
    registerBtn.addEventListener('click', registerUser);

    function loginUser(e){
        console.log("logging user in....");
        e.preventDefault();
        fetch(usersURL)
            .then(r => r.json())
            .then(users => {
                console.log(users)
                logUserIn(users)
            })
    }

    function logUserIn(users){
        let filledUser = {
            username: "",
            password: ""
        }

        const usernameInput = document.querySelector(".login-username");
        const passwordInput = document.querySelector(".login-password");
        filledUser.username = usernameInput.value;
        filledUser.password = passwordInput.value;
        console.log('userinput', filledUser)

        console.log(users[0])

        users.forEach(user => {
            if (user.username == filledUser.username){
                if (user.password == filledUser.password){
                    console.log("CORRECT LOGIN!")
                    globalUser = user;
                    hideLoginForm();
                    hideRegisterForm();
                    showWelcomeUser(true, user.username);
                    showDashboard(user.id);
                }
            } else {
                showWelcomeUser(false, "no User");
            }
        });


    }

    function registerUser(e) {
        console.log("registering user....")
        e.preventDefault();

        let newUserData = {
            username: "",
            password: ""
        };

        const newUsername = document.querySelector(".register-username");
        const newPassword = document.querySelector(".register-password");
        newUserData.username = newUsername.value;
        newUserData.password = newPassword.value;
        
        const postForm = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUserData)
        };

        fetch(userURL, postForm)
            .then(r => r.json())
            .then(user => {
                console.log("put in", newUserData)
                if (user.username){
                    registerUserIn(user)
                    globalUser = user;
                }
            })
    }

    function registerUserIn(user){
        hideLoginForm();
        hideRegisterForm();
        showWelcomeUser(true, user.username);
        showDashboard(user.id);
    }

    function hideLoginForm(){
        const loginCard = document.querySelector(".login-card");
        loginCard.innerHTML = "";
    }

    function hideRegisterForm(){
        const registerCard = document.querySelector(".register-card");
        registerCard.innerHTML = "";
    }

    function showWelcomeUser(userExist, username){
        const welcomeCard = document.querySelector(".welcome-card")
        if (userExist){
            welcomeCard.innerHTML = `<h1>Welcome ${username}</h1>`;
        } else {
            welcomeCard.innerHTML = "<h3>INCORRECT USERNAME OR PASSWORD, PLEASE TRY AGAIN</h3>"
        }
    }

    function showDashboard(userId){
        fetch(tasksURL)
            .then(r => r.json())
            .then(tasks => {
                console.log(tasks);
                fillDashboard(tasks, userId);
            })
    }

    function fillDashboard(tasks, userId){
        const dashboardTasks = document.querySelector(".dashboard-tasks");

        let userTasks = [];
        tasks.forEach(task => {
            if (task.user.id == userId){
                userTasks.push(task)
            }
        })
        let htmlTasks = [];
        let i = 1;
        userTasks.forEach(task => {
            htmlTasks.push(`<p>No ${i}: NAME: ${task.name} ---- DESCRIPTION: ${task.description} ---- SEVERITY: ${task.severity}</p><br />`)
            i++;
        })
        const htmlString = htmlTasks.join('');
        dashboardTasks.innerHTML = htmlString;

        showNewTaskForm(userId)

    }

    function showNewTaskForm(userId){
        const dashboardNewTaskForm = document.querySelector(".dashboard-new-task");
        dashboardNewTaskForm.innerHTML = '<h2>Add a task!</h2><form class="new-task-form"><label>Name</label><br /><input class="task-name" /><br /><br /><label>Description</label><br /><input class="task-description" /><br /><br /><select class="severity-dropdown"><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select><br /><br /><button class="new-task-submit">ADD TASK</button></form>';

        const addTaskBtn = document.querySelector(".new-task-submit");
        addTaskBtn.addEventListener('click', handleAddTask);
    }

    function handleAddTask(e){
        e.preventDefault();
        let taskData = {
            user: globalUser,
            name: "",
            description: "",
            severity: ""
        };
        const inputTaskName = document.querySelector(".task-name");
        const inputTaskDescription = document.querySelector(".task-description");
        const dropdownInputSeverity = document.querySelector(".severity-dropdown");
        taskData.name = inputTaskName.value;
        taskData.description = inputTaskDescription.value;
        taskData.severity = dropdownInputSeverity.value;

        const postForm = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        };

        fetch(taskURL, postForm)
            .then(r => r.json())
            .then(task => {
                console.log('taskss', task)
                showDashboard(globalUser.id);
            })
    }
}