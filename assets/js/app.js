const db = firebase.firestore()
const sensorRef = db.collection('sensoren');
const rateRef = db.collection('hartSensor');
const overlay = document.querySelector('.overlay')
const loginBtn = document.querySelector('#loginBtn')
let temperatureChart


const pushState = (name) => {
    // Get the current state
    const elementButton = document.querySelector(`#${name}Switch`)
    let currentState = false
    if(elementButton.classList.contains('-on')) { currentState = true }
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
        if(tempValue > 40) {
            outerRing.style.backgroundColor = 'rgb(236, 117, 61)'
        } else if(tempValue > 30) {
            outerRing.style.backgroundColor = 'rgb(61, 236, 90)'
        } else {
            outerRing.style.backgroundColor = 'rgb(61, 122, 236)'
        }
        temperatureElement.innerHTML = dB
        updateChart(chart, dB)

    })
}
const alarmsound = new Audio('./assets/sound/swamp.mp3')

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
            datasets:[{
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

sensorRef.get().then(function(querySnapshot){
    querySnapshot.forEach(doc => {
       console.log(doc.data());
    });
  }).catch(err => {
     console.log('Error getting documents', err);
  });

const initChart = () => {
    return new Promise((resolve, reject) => {
            rateRef.get().then(function(querySnapshot){
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
  if(user) {
    if(!overlay.classList.contains('-hidden')) {
      overlay.classList.add('-hidden')
    }
    initApp()
  } else {
    overlay.classList.remove('-hidden')
  }
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

/**
 * Initialize app
 */
const initApp = () => {
    // initialize controls
    // Initialize chart
    initChart().then(chart => {
        // initialize sensors
        watchSensors(chart)

    })
    .catch(error => {
        console.error(error)
    })
    checkAlarm()
}