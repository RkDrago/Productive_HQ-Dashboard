const tabs = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view-section");
const pageTitle = document.querySelector(".view-section-title")

const themeBtn = document.querySelector("#darkModeToggle");
const themeIcon = themeBtn.querySelector("i");
const savedTheme = localStorage.getItem("theme");

const LogoImg = document.querySelector(".logo-img")


const taskInput = document.querySelector("#taskInput")
const addTaskBtn = document.querySelector("#addTaskBtn")
const taskList = document.querySelector("#taskList")
const searchTask = document.querySelector("#searchTask")

const progressFill = document.querySelector("#progressFill")
const progressText = document.querySelector("#progressText")

const clearCompleted = document.querySelector("#clearCompleted")

const filterBtns = document.querySelectorAll(".filter-btn")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []

let currentFilter = "All"


const plannerContainer = document.querySelector("#plannerContainer")
const plannerDate = document.querySelector("#plannerDate")
const clearPlanner = document.querySelector("#clearPlanner")
const plannerData = JSON.parse(localStorage.getItem("planner")) || {}

const hours = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"]


const goalInput = document.querySelector("#goalInput")
const addGoalBtn = document.querySelector("#addGoalBtn")
const goalList = document.querySelector("#goalList")

const clearGoals = document.querySelector("#clearGoals")

const goalProgressText = document.querySelector("#goalProgressText")
const goalProgressFill = document.querySelector("#goalProgressFill")

let goals = JSON.parse(localStorage.getItem("goals")) || []


const timerDisplay = document.querySelector("#timerDisplay")
const startPauseBtn = document.querySelector("#startPauseBtn")
const resetBtn = document.querySelector("#resetBtn")
const skipBtn = document.querySelector("#skipBtn")
const progressCircle = document.querySelector("#progressCircle")
const modeBtns = document.querySelectorAll(".mode-btn")
const sessionCount = document.querySelector("#sessionCount")

const radius = 110
const circumference = 2 * Math.PI * radius

progressCircle.style.strokeDasharray = circumference

let duration = 25 * 60
let timeLeft = duration

let timer = null
let running = false

let sessions = Number(localStorage.getItem("sessions")) || 0
sessionCount.textContent = sessions


const API_KEY = "462d59775eb8e5e20f3da75bd061488d";
const cityInput = document.querySelector("#cityInput");
const searchWeather = document.querySelector("#searchWeather");


const quoteText = document.querySelector("#quoteText")
const quoteAuthor = document.querySelector("#quoteAuthor")

const newQuoteBtn = document.querySelector("#newQuoteBtn")
const copyQuoteBtn = document.querySelector("#copyQuoteBtn")
const favoriteQuoteBtn = document.querySelector("#favoriteQuoteBtn")

let currentQuote = null

// For tab manipulation

tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
        e.preventDefault()

        tabs.forEach((item) => {
            item.classList.remove('active')
        })
        views.forEach((view) => {
            view.classList.remove('active')
        })
        tab.classList.add('active')

        const targetId = tab.dataset.target

        document.getElementById(targetId).classList.add("active")

        pageTitle.innerHTML = tab.dataset.title
    })
})

// For theme manipulation

if (savedTheme === "light") {
    document.body.classList.add("light-theme")
    themeIcon.classList.replace("ri-sun-line", "ri-moon-line")
    LogoImg.style.filter = "invert()"
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme")

    if (document.body.classList.contains("light-theme")) {
        themeIcon.classList.replace("ri-sun-line", "ri-moon-line")
        localStorage.setItem("theme", "light")
        LogoImg.style.filter = "invert()"
    } else {
        themeIcon.classList.replace("ri-moon-line", "ri-sun-line")
        localStorage.setItem("theme", "dark")
        LogoImg.style.filter = "none"
    }
});

// For todo list


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function updateProgress() {
    const completed = tasks.filter(task => task.completed).length

    const total = tasks.length
    progressText.textContent = `${completed} of ${total} completed`

    const percent = total === 0 ? 0 : (completed / total) * 100
    progressFill.style.width = percent + "%"
}

function renderTasks() {
    taskList.innerHTML = ""

    let filtered = [...tasks]

    if (currentFilter === "Active") {
        filtered = filtered.filter(task => !task.completed)
    }
    if (currentFilter === "Completed") {
        filtered = filtered.filter(task => task.completed)
    }

    const keyword = searchTask.value.toLowerCase()

    filtered = filtered.filter(task => task.text.toLowerCase().includes(keyword))

    filtered.forEach(task => {
        const li = document.createElement("li")

        li.className = `task ${task.completed ? "completed" : ""}`

        li.innerHTML = `<div class="task-left">
            <input type="checkbox"${task.completed ? "checked" : ""} onchange="toggleTask(${task.id})">
            <span>${task.text}</span>
            ${task.important ? '<i class="ri-star-fill" style="color:gold"></i>' : ""}
        </div>
        <div class="task-actions">
            <button onclick="importantTask(${task.id})">
                <i class="ri-star-line"></i>
            </button>
            <button onclick="editTask(${task.id})">
                <i class="ri-pencil-line"></i>
            </button>
            <button onclick="deleteTask(${task.id})">
                <i class="ri-delete-bin-line"></i>
            </button>
        </div>`

        taskList.appendChild(li)
    })

    updateProgress()
    saveTasks()
}

function addTask() {
    const text = taskInput.value.trim()
    if (text === "") return

    tasks.unshift({
        id: Date.now(),
        text,
        completed: false,
        important: false
    })

    taskInput.value = ""

    renderTasks()
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id)

    renderTasks()
}

function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task)

    renderTasks()
}

function importantTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, important: !task.important } : task)

    renderTasks()
}

function editTask(id) {
    const task = tasks.find(task => task.id === id)
    const newText = prompt("Edit Task", task.text)

    if (newText === null) return
    if (newText.trim() === "") return

    task.text = newText.trim()

    renderTasks()
}

addTaskBtn.addEventListener("click", addTask)

taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        addTask()
    }
})

searchTask.addEventListener("input", renderTasks)

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(button =>
            button.classList.remove("active")
        )

        btn.classList.add("active")
        currentFilter = btn.textContent

        renderTasks()
    })
})

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed)

    renderTasks()
});

renderTasks()




function renderPlanner() {
    plannerContainer.innerHTML = ""

    const today = new Date()
    plannerDate.textContent = today.toDateString()

    const currentHour = today.getHours()

    hours.forEach(time => {
        const div = document.createElement("div")

        div.className = "time-slot"
        let hour24 = parseInt(time)

        if (time.includes("PM") && hour24 !== 12) {
            hour24 += 12
        }
        if (time.includes("AM") && hour24 === 12) {
            hour24 = 0
        }
        if (hour24 === currentHour) {
            div.classList.add("current-hour")
        }

        div.innerHTML = `<div class="time">${time}</div>
            <input class="plan-input" value="${plannerData[time] || ""}" placeholder="Enter your plan...">
            <button class="save-plan">
                <i class="ri-save-line"></i>
            </button>`

        const input = div.querySelector(".plan-input")
        const btn = div.querySelector(".save-plan")

        btn.addEventListener("click", () => {
            plannerData[time] = input.value

            localStorage.setItem("planner", JSON.stringify(plannerData))

            btn.innerHTML = '<i class="ri-check-line"></i>'

            setTimeout(() => {
                btn.innerHTML = '<i class="ri-save-line"></i>'
            }, 1000)
        })
        plannerContainer.appendChild(div)
    })
}

clearPlanner.addEventListener("click", (e) => {
    e.preventDefault()

    localStorage.removeItem("planner")
    Object.keys(plannerData).forEach(key => delete plannerData[key])

    renderPlanner()
})

renderPlanner()




function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals))
}

function updateGoalProgress() {
    const completed = goals.filter(goal => goal.completed).length
    const total = goals.length

    goalProgressText.textContent = `${completed} of ${total} Completed`
    goalProgressFill.style.width = total === 0 ? "0%" : `${completed / total * 100}%`
}

function renderGoals() {
    goalList.innerHTML = ""

    goals.forEach(goal => {
        const li = document.createElement("li")

        li.className = `goal ${goal.completed ? "completed" : ""}`

        li.innerHTML = `<div class="goal-left">
            <input type="checkbox" ${goal.completed ? "checked" : ""}>
            <span>${goal.text}</span>
        </div>
        <div class="goal-actions">
            <button class="editGoal">
                <i class="ri-pencil-line"></i>
            </button>
            <button class="deleteGoal">
                <i class="ri-delete-bin-line"></i>
            </button>
        </div>`

        li.querySelector("input")
            .addEventListener("change", () => {
                goal.completed = !goal.completed

                saveGoals()
                renderGoals()

            })

        li.querySelector(".editGoal")
            .addEventListener("click", () => {
                const text = prompt("Edit Goal", goal.text)

                if (text) {
                    goal.text = text.trim()

                    saveGoals()
                    renderGoals()
                }
            })

        li.querySelector(".deleteGoal")
            .addEventListener("click", () => {
                goals = goals.filter(g => g.id !== goal.id)

                saveGoals()
                renderGoals()
            })
        goalList.appendChild(li)
    })
    updateGoalProgress()
}

addGoalBtn.addEventListener("click", () => {
    const text = goalInput.value.trim()
    if (!text) return

    goals.unshift({
        id: Date.now(),
        text,
        completed: false
    })
    goalInput.value = ""

    saveGoals()
    renderGoals()
})

goalInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        addGoalBtn.click()
    }
});

renderGoals()

clearGoals.addEventListener("click", () => {
    goals = []
    localStorage.removeItem("goals")

    renderGoals()
})





function updateDisplay() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, "0")
    const sec = String(timeLeft % 60).padStart(2, "0")

    timerDisplay.textContent = `${min}:${sec}`

    const progress = timeLeft / duration

    progressCircle.style.strokeDashoffset = circumference * (1 - progress)

}

function startPause() {
    if (running) {
        clearInterval(timer)
        running = false

        startPauseBtn.innerHTML = '<i class="ri-play-fill"></i>'
        return
    }
    running = true

    startPauseBtn.innerHTML = '<i class="ri-pause-fill"></i>'

    timer = setInterval(() => {

        timeLeft--

        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer)
            running = false

            startPauseBtn.innerHTML = '<i class="ri-play-fill"></i>'

            sessions++

            localStorage.setItem("sessions", sessions)
            sessionCount.textContent = sessions
            alert("Time's Up!")
        }
    }, 1000)

}

resetBtn.addEventListener("click", () => {
    clearInterval(timer)
    running = false
    timeLeft = duration

    updateDisplay();

    startPauseBtn.innerHTML = '<i class="ri-play-fill"></i>'
})

skipBtn.addEventListener("click", () => {
    clearInterval(timer)
    running = false
    timeLeft = 0

    updateDisplay()
})

modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        modeBtns.forEach(b => b.classList.remove("active"))
        btn.classList.add("active")

        duration = Number(btn.dataset.time) * 60
        timeLeft = duration

        clearInterval(timer)

        running = false
        startPauseBtn.innerHTML = '<i class="ri-play-fill"></i>'

        updateDisplay()
    })
})

startPauseBtn.addEventListener("click", startPause)

updateDisplay();






async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            alert("City not found");
            return;
        }
        const data = await response.json();

        document.querySelector("#temperature").textContent = `${Math.round(data.main.temp)}°C`
        document.querySelector("#cityName").textContent = data.name
        document.querySelector("#description").textContent = data.weather[0].description
        document.querySelector("#humidity").textContent = `${data.main.humidity}%`
        document.querySelector("#wind").textContent = `${data.wind.speed} km/h`
        document.querySelector("#feelsLike").textContent = `${Math.round(data.main.feels_like)}°C`
        document.querySelector("#visibility").textContent = `${data.visibility / 1000} km`
        document.querySelector("#weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
    }
    catch (err) {
        console.log(err);
    }
}

searchWeather.addEventListener("click", () => {
    if (cityInput.value.trim()) {
        getWeather(cityInput.value);
    }
});

cityInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        searchWeather.click();
    }
});

getWeather("Delhi");


const quotes = [

    {
        text: "Success is the sum of small efforts repeated day after day.",
        author: "Robert Collier"
    },

    {
        text: "Discipline is choosing between what you want now and what you want most.",
        author: "Abraham Lincoln"
    },

    {
        text: "The future depends on what you do today.",
        author: "Mahatma Gandhi"
    },

    {
        text: "Dream big. Start small. Act now.",
        author: "Robin Sharma"
    },

    {
        text: "Do something today that your future self will thank you for.",
        author: "Sean Patrick Flanery"
    },

    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },

    {
        text: "Consistency beats motivation.",
        author: "Unknown"
    },

    {
        text: "Your only limit is your mind.",
        author: "Unknown"
    },

    {
        text: "Small progress is still progress.",
        author: "Unknown"
    },

    {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    }
];



function showRandomQuote() {
    const random = quotes[Math.floor(Math.random() * quotes.length)];

    currentQuote = random

    quoteText.textContent = `"${random.text}"`
    quoteAuthor.textContent = `— ${random.author}`

}

newQuoteBtn.addEventListener("click", showRandomQuote)

copyQuoteBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(`${currentQuote.text} - ${currentQuote.author}`)
    copyQuoteBtn.innerHTML = `<i class="ri-check-line"></i> Copied`

    setTimeout(() => {
        copyQuoteBtn.innerHTML = `<i class="ri-file-copy-line"></i> Copy`
    }, 1500)
});

favoriteQuoteBtn.addEventListener("click", () => {
    let favorites = JSON.parse(localStorage.getItem("favoriteQuotes")) || []

    favorites.push(currentQuote);

    localStorage.setItem("favoriteQuotes", JSON.stringify(favorites))

    favoriteQuoteBtn.innerHTML = `<i class="ri-heart-fill"></i> Saved`

    setTimeout(() => {
        favoriteQuoteBtn.innerHTML = `<i class="ri-heart-line"></i> Favorite`
    }, 1500)
});

showRandomQuote();




function updateClock() {
    const now = new Date()
    document.querySelector("#liveClock").innerHTML = now.toLocaleTimeString()
    document.querySelector("#liveDate").innerHTML = now.toDateString()

    const hour = now.getHours();
    let greeting = "Good Evening"

    if (hour < 12) {
        greeting = "Good Morning"
    }
    else if (hour < 18) {
        greeting = "Good Afternoon"
    }

    let dashboardHeader = document.querySelector(".view-section-title")
    if (dashboardHeader.innerHTML === "") dashboardHeader.innerHTML = `${greeting} `
}

setInterval(updateClock, 1000);

updateClock();


function updateDashboardTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []
    const completed = tasks.filter(task => task.completed).length

    document.querySelector("#dashboardTasks").innerHTML = `${completed}/${tasks.length}`
}

function updateDashboardGoals() {
    const goals = JSON.parse(localStorage.getItem("goals")) || []
    const completed = goals.filter(goal => goal.completed).length

    document.querySelector("#dashboardGoals").innerHTML = `${completed}/${goals.length}`
}

function updateDashboardPomodoro() {
    const sessions = localStorage.getItem("sessions") || 0

    document.querySelector("#dashboardPomodoro").innerHTML = sessions
}

function updateDashboardProductivity() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []
    const goals = JSON.parse(localStorage.getItem("goals")) || []
    const sessions = Number(localStorage.getItem("sessions")) || 0

    const taskPercent = tasks.length ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0
    const goalPercent = goals.length ? (goals.filter(g => g.completed).length / goals.length) * 100 : 0

    const sessionScore = Math.min(sessions * 10, 100)
    const score = Math.round((taskPercent + goalPercent + sessionScore) / 3)

    document.querySelector("#dashboardProductivity").innerHTML = `${score}%`
}

function updateDashboardQuote() {
    const quote = document.querySelector("#quoteText")

    if (quote) { document.querySelector("#dashboardQuote").innerHTML = quote.innerHTML }
}

function updateDashboard() {
    updateDashboardTasks()
    updateDashboardGoals()
    updateDashboardPomodoro()
    updateDashboardProductivity()
    updateDashboardQuote()
}

updateDashboard()