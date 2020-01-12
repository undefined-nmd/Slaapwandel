const notyf = new Notyf();
const db = firebase.firestore()
const sensorRef = db.collection('sensoren');
const rateRef = db.collection('hartSensor');
const overlay = document.querySelector('.overlay')
const loginBtn = document.querySelector('#loginBtn');

const chartOverlay = document.querySelector('#chartOverlay');
const chartBtn = document.querySelector('#chartBtn');

// new dashboard
const newDashboardOverlay = document.querySelector('#newDashboardOverlay');
const newDashboardBtn = document.querySelector('#newDashboardBtn');
const createBtn = document.querySelector('#createBtn');

const usersBtn = document.querySelector('.usersBtn')

// modal
const modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];

// sign up
const signupBtn = document.querySelector('#signupBtn');
const makeAccountBtn = document.querySelector('#makeAccountBtn')

// settings
const settingsBtn = document.querySelector('#settingsBtn')
const settingsOverlay = document.querySelector('settingsOverlay')
const mainOverlay = document.querySelector('#mainOverlay');
const mainBtn = document.querySelector('#mainBtn');
const cameraOverlay = document.querySelector('#cameraOverlay');
const cameraBtn = document.querySelector('#cameraBtn');

const signoutBtn = document.querySelector('#signoutBtn');


let temperatureChart


const pushState = (name) => {
    // Get the current state
    const elementButton = document.querySelector(`#${name}Switch`)
    let currentState = false
    if (elementButton.classList.contains('-on')) { currentState = true }
    sensorRef.doc(name).update({
        isOn: !currentState
    })
        .catch(error => {
            console.error(error)
        })
}


const initEventListener = (name) => {
    const elementButton = document.querySelector(`#${name}Switch`)
    elementButton.addEventListener('click', (e) => {
        e.preventDefault()
        pushState(name)
    })
}



const watchSensors = (chart) => {
    sensorRef.doc('soundSensor').get(doc => {
        console.log(doc.data())
        const { dB } = doc.data()
        const humidityElement = document.querySelector(`#humidityValue`)
        const temperatureElement = document.querySelector(`#temperatureValue`)
        const outerRing = document.querySelector('#tempOuterRing')
        humidityElement.innerHTML = dB
        if (tempValue > 40) {
            outerRing.style.backgroundColor = 'rgb(236, 117, 61)'
        } else if (tempValue > 30) {
            outerRing.style.backgroundColor = 'rgb(61, 236, 90)'
        } else {
            outerRing.style.backgroundColor = 'rgb(61, 122, 236)'
        }
        temperatureElement.innerHTML = dB
        updateChart(chart, dB)

    })
}
const alarmsound = new Audio('./assets/sound/alarm.mp3')

const loopLights = () => {

    sensorRef.doc('lights').get()
        .then(lights => {
            const { isOn } = lights.data()
            sensorRef.doc('lights').set({
                isOn: !isOn
            })
        })
}

const activateAlarm = () => {
    alarmsound.play()
    alarmsound.loop = true
    sensorRef.doc("vibratieSensor").set({
        vibr: true
    })
    notyf.error({
    message: 'Accept the terms before moving forward',
    duration: 9000,
    icon: false
    })


}

const resetAlarm = () => {
    alarmsound.pause()
    alarmsound.currentTime = 0
    sensorRef.doc("vibratieSensor").set({
        isOn: false
    })

}

const checkAlarm = () => {
    sensorRef.doc("alarmCheck").get().onSnapshot(doc => {
        const { alarm } = doc.data()
        console.log(alarm)
        alarm ? activateAlarm() : resetAlarm()
    })
}

const updateChart = (chart, rate) => {
    dateLabel = new Date(rate.timestamp.seconds * 1000)
    chart.data.labels.push(dateLabel)
    chart.data.labels.shift()
    chart.data.datasets.forEach(dataset => {
        dataset.data.push({
            x: dateLabel,
            y: temperature.value,
        })
        dataset.data.shift()
    })
    chart.update()
}

const createChart = (labels, data) => {
    const ctx = document.getElementById('tempChart')
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature',
                borderColor: 'rgba(169, 182, 211, 1)',
                backgroundColor: 'rgb(183, 198, 216)',
                data: data,
                pointBackgroundColor: 'rgba(223, 229, 236)',
                pointBorderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                scaleLabel: {
                    display: false,
                },
                xAxes: [{
                    type: 'time',
                    distribution: 'series',
                    time: {
                        unit: 'minute'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                        drawTicks: false,
                    },
                    ticks: {
                        display: false,
                        lineHeight: 0,
                        fontFamily: "'Nunito', sans-serif"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        drawBorder: false,
                        drawTicks: false,
                        display: false,
                    },
                    ticks: {
                        display: false,
                        beginAtZero: true,
                    }
                }]
            },
            legend: {
                display: false,
            }
        }
    })
    return myChart
}

sensorRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(doc => {
        console.log(doc.data());
    });
}).catch(err => {
    console.log('Error getting documents', err);
});

const initChart = () => {
    return new Promise((resolve, reject) => {
        rateRef.get().then(function (querySnapshot) {
            const chartData = []
            const labelPoints = []
            querySnapshot.forEach(doc => {
                console.log(doc.data())
                chartDate = new Date(doc.timestamp * 1000)
                chartData.unshift({
                    x: chartDate,
                    y: doc.data().rate,
                })
                labelPoints.unshift(chartDate)
                temperatureChart = createChart(labelPoints, chartData)
                resolve(temperatureChart)
            })
                .catch(error => {
                    reject(error)
                    console.log(error)
                })
        })

    })
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        if (!overlay.classList.contains('-hidden')) {
            overlay.classList.add('-hidden')
            notyf.success('Welcome back!');
        }
        initApp()
    } else {
        overlay.classList.remove('-hidden')
    }
})

signoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    firebase.auth().signOut();
})



loginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const email = document.querySelector('#email').value
    const pass = document.querySelector('#password').value

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            firebase.auth().signInWithEmailAndPassword(email, pass)
        })
        .catch(err => console.error(err))
})



/*
* NAV
*/
chartBtn.addEventListener('click', (e) => {
    e.preventDefault()

    mainOverlay.style.display = "none";
    cameraOverlay.style.display = "none";
    chartOverlay.style.display = "block";
    mainBtn.color = "#ffff";
    cameraBtn.style.color = "#ffff";
    chartBtn.style.color = "#4198ad";
    settingsBtn.style.color ='#ffff'
})

mainBtn.addEventListener('click', (e) => {
    e.preventDefault()

    chartOverlay.style.display = "none";
    cameraOverlay.style.display = "none";
    mainOverlay.style.display = "block";
    chartBtn.style.color = "#ffff";
    cameraBtn.style.color = "#ffff";
    mainBtn.style.color = "#4198ad";
    settingsBtn.style.color ='#ffff'
})

cameraBtn.addEventListener('click', (e) => {
    e.preventDefault()

    chartOverlay.style.display = "none";
    mainOverlay.style.display = "none";
    cameraOverlay.style.display = "block";
    chartBtn.style.color = "#ffff";
    mainBtn.style.color = "#ffff";
    cameraBtn.style.color = "#4198ad";
    settingsBtn.style.color ='#ffff'
})

settingsBtn.addEventListener('click', (e) => {
e.preventDefault()

chartOverlay.style.display = "none";
mainOverlay.style.display = "none";
cameraOverlay.style.display = "none";
settingsOverlay.style.display = "block";
chartBtn.style.color = "#ffff";
mainBtn.style.color = "#ffff";
cameraBtn.style.color = "#ffff";
settingsBtn.style.color ='#4198ad'
})
/*
* Reuseable function for nav buttons
*//*
function navButton(overlayShow, overlayOne, overlayTwo) {
    console.log('ok');
    overlayOne.style.display = "none";
    overlayShow.style.display = "block";
    overlayTwo.style.display = "none";
}

cameraBtn.addEventListener("click", navButton(cameraOverlay, chartOverlay, mainOverlay));*/


/**
 * Initialize app
 */
/* const initApp = () => {
    // initialize controls
    // Initialize chart
    initChart().then(chart => {
        // initialize sensors
        watchSensors(chart)

    })
    .catch(error => {
        console.error(error);
    })
    checkAlarm()
} */


//function to show all data in the dashboard
const showData = () => {
    //show current date
    console.log(localStorage.getItem('email'))
    n = new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    document.getElementById("date").innerHTML = d + "/" + m + "/" + y;

    //show current time
    startTime();

    //show last heart rate
    showHeartRate();

    //get users
    getPeople();
}

// function to get the current time
const startTime = () => {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

const showHeartRate = () => {
    // creating the path to the database
    let heart = sensorRef.doc('hartSensor');
    let pulse = document.querySelector('.temperature');
    // getting the heart rate from the document
    db.collection('hartSensor').orderBy("timestamp", "desc").limit(1).get().then(function (doc) {
        // if the document excist and is found
        console.log(doc.docs[0].id)
        let docid = doc.docs[0].id
    
        db.collection('hartSensor').doc(docid).get().then(function (d){
            console.log(d.data())
            document.getElementById("heartrate").innerHTML = d.data().rate;
            if(d.data().rate > 110){
                pulse.classList.remove('-outer')
                pulse.classList.add('red')
            }else{
                pulse.classList.remove('red')
                pulse.classList.add('-outer')
            }
        })
        /*
        if (doc.exists) {
            console.log("Document data:", doc.data());
            console.log("heart rate is:", doc.data().rate);
            // place the value in the html element
            document.getElementById("heartrate").innerHTML = doc.data().rate;
            //if the document doesn't excist, or isn't found
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        */
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

const showAllHeartRate = () => {
    // making an object to store the data for usage in the chart
    let data = {
        labels: [],
        series: [],
    }
    let serie = [];
    //get all the heart rate data from the database and order it by timestamp
    var heartData = db.collection("hartSensor").orderBy("timestamp", "asc").get().then(function (querySnapshot) {
        //loop all the objects received from the database call
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            // pushing the data in the data object
            serie.push(doc.data().rate);
            data.labels.push(doc.data().timestamp.toDate());
        });
        data.series.push(serie);
        console.log(data);
        makeChart(data);
    });
}

const makeChart = (data) => {
    console.log(data.series);
    new Chartist.Line('.ct-chart', data);
    console.log("test");
}



/*
** USER DASHBOARD
**
*/

const getPeople = () => {

    //const userId = firebase.auth().currentUser.uid
    // people names and make buttons for dashboard
    db.collection('Users').doc(localStorage.getItem('userId')).collection('People').get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //<button><i class="fas fa-user-alt"></i> Milo's</button>
            var button = document.createElement("button");
            var name = document.createTextNode(doc.data().name); 
            // add the text node to the newly created div
            button.appendChild(name);  
            console.log(doc.id, " => ", doc.data());
            usersBtn.appendChild(button);
        });
    });
}

const getDashboard = () => {
    // 
}


newDashboardBtn.addEventListener('click', (e) => {
    e.preventDefault()

    console.log('plusbtn');
    chartOverlay.style.display = "none";
    cameraOverlay.style.display = "none";
    mainOverlay.style.display = "none";
    newDashboardOverlay.style.display ="block"
})


createBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const name = document.querySelector('#name').value
    const gender = document.querySelector('#gender').value

    const userId = firebase.auth().currentUser.uid
    
    db.collection('Users').doc(userId).collection('People').add({
        name: name,
        gender: gender,
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        modal.style.display = "block";
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    
})

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

showData();

showAllHeartRate();
