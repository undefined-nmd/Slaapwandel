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
const settingsProfileBtn = document.querySelector('.button_left');


const usersBtn = document.querySelector('.usersBtn')
const settingsUsersBtn = document.querySelector('.settingsUsersBtn')
// sign up
const signupBtn = document.querySelector('#signupBtn');
const makeAccountBtn = document.querySelector('#makeAccountBtn')

// settings
const settingsBtn = document.querySelector('#settingsBtn')
const settingsOverlay = document.querySelector('#settingsOverlay')
const mainOverlay = document.querySelector('#mainOverlay');
const mainBtn = document.querySelector('#mainBtn');
const cameraOverlay = document.querySelector('#cameraOverlay');
const cameraBtn = document.querySelector('#cameraBtn');

const signoutBtn = document.querySelector('#signoutBtn');


let temperatureChart

let activesleeper = 'Indy';

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        if (!overlay.classList.contains('-hidden')) {
            overlay.classList.add('-hidden')
            notyf.success('Welcome back!');
        }
        //initApp()
    } else {
        overlay.classList.remove('-hidden')
        notyf.success('Goodbye!');

    }
})

signoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    firebase.auth().signOut();

    localStorage.removeItem('email')
    localStorage.removeItem('userId')
    
})

loginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('clicked')
    const email = document.querySelector('#email').value
    const pass = document.querySelector('#password').value

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            firebase.auth().signInWithEmailAndPassword(email, pass).then(()=>{

                localStorage.setItem('email', email)
                localStorage.setItem('userId', firebase.auth().currentUser.uid)
                location.reload();
                notyf.success('Welcome back!');
            }).catch(error => {
                notyf.error('ohno: ' + error)
            })
            
        })
        .catch(error => {
            notyf.error('ohno: ' + error)
        })
})

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
/*
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
*/
sensorRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(doc => {
        console.log(doc.data());
    });
}).catch(err => {
    console.log('Error getting documents', err);
});
/*
Highcharts.chart('container', {
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series = this.series[0];
                console.log(series)
                setInterval(function () {
                    var x = (new Date()).getTime(), // current time
                        y = Math.random();
                    series.addPoint([x, y], true, true);
                }, 1000);
            }
        }
    },

    time: {
        useUTC: false
    },

    title: {
        text: 'Live random data'
    },

    accessibility: {
        announceNewData: {
            enabled: true,
            minAnnounceInterval: 15000,
            announcementFormatter: function (allSeries, newSeries, newPoint) {
                if (newPoint) {
                    return 'New point added. Value: ' + newPoint.y;
                }
                return false;
            }
        }
    },

    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },

    yAxis: {
        title: {
            text: 'Value'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },

    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
    },

    legend: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    series: [{
        name: 'Random data',
        data: (function () {
            // generate an array of random data
            
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -19; i <= 0; i += 1) {
                data.push({
                    x: time + i * 1000,
                    y: Math.random()
                });
            }
        */    
/*
           // generate an array and watch changes in heartrate
           var data = [],
                time = (new Date()).getTime()
                db.collection('Users').doc(localStorage.getItem('userId')).collection('People')
                .doc('Indy').collection('Sensors').doc('hartSensor').collection('refreshes').orderBy("timestamp", "desc")
                .onSnapshot(snapshot => {
                    //console.log(snapshot)
                    let changes = snapshot.docChanges();
                    changes.forEach(snap => {
                        //console.log(snap)
                        if(snap.type == 'added'){
                            data.push({
                                x: time + snap.newIndex, 
                                y: snap.doc.data().rate
                            })
                            console.log('added')
                        }
                    })
                    
                    //showHeartRate(snapshot.docs[0].data().rate)
                    //console.log(changes.data())

                })
           
        return data;
        }())
    }]
});     */
/*
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
*/


/*
* NAV
*/
chartBtn.addEventListener('click', (e) => {
    e.preventDefault()

    mainOverlay.style.display = "none";
    cameraOverlay.style.display = "none";
    chartOverlay.style.display = "block";
    settingsOverlay.style.display ="none"
    newDashboardOverlay.style.display ="none"
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
    settingsOverlay.style.display ="none"
    newDashboardOverlay.style.display ="none"
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
    settingsOverlay.style.display ="none"
    newDashboardOverlay.style.display ="none"
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
    newDashboardOverlay.style.display ="none"
    chartBtn.style.color = "#ffff";
    mainBtn.style.color = "#ffff";
    cameraBtn.style.color = "#ffff";
    settingsBtn.style.color ='#4198ad'

    settings();
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

const createSettings = () => {
    console.log('settings')
    db.collection('Users').doc(localStorage.getItem('userId')).collection('People').get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var button = document.createElement("button");
            button.setAttribute("id", doc.data().name );
            button.setAttribute("class", 'settingsbtn' );
            var name = document.createTextNode(doc.data().name); 
            // add the text node to the newly created div
            button.appendChild(name);  
            console.log(doc.id, " => ", doc.data());
            settingsUsersBtn.appendChild(button);
        });
    });
}

document.addEventListener('click',function(e){
    if(e.target && e.target.className== 'settingsbtn'){
          console.log('settingsbtn')
          console.log(e.target.id)
          // get 'people' with this id out of the firestore
          getSettings(e.target.id)
     }
 });

 const getSettings = (id) => {
    console.log('settings')
    console.log(id)
    db.collection('Users').doc(localStorage.getItem('userId')).collection('People').doc(id).get()
    .then(function(querySnapshot) {
        console.log(querySnapshot.data())
    });
 } 

//function to show all data in the dashboard
const showData = () => {
    console.log('showdata')
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
    //getPeople();
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

const showHeartRate = (rate) => {
    // create hartrate object with color based on rate
    let heart = sensorRef.doc('hartSensor');
    let pulse = document.querySelector('.temperature');
    document.getElementById("heartrate").innerHTML = rate;
            if(rate > 110){
                pulse.classList.remove('-outer')
                pulse.classList.add('red')
            }else{
                pulse.classList.remove('red')
                pulse.classList.add('-outer')
            }
    // getting the heart rate from the document
    /*
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
        */
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
       /*
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
    */
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
/*
const getPeople = () => {
    //const userId = firebase.auth().currentUser.uid
    // people names and make buttons for dashboard
    console.log('getpeople')
    console.log(localStorage.getItem('userId'))
    db.collection('Users').doc(localStorage.getItem('userId')).collection('People').get()
    .then(function(querySnapshot) {
        let i = 0 
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //<button><i class="fas fa-user-alt"></i> Milo's</button>
            var button = document.createElement("button");
            button.setAttribute("id", doc.data().name );
            button.setAttribute("class", 'dashboardbtn' );
            var name = document.createTextNode(doc.data().name); 
            // add the text node to the newly created div
            button.appendChild(name);  
            console.log(doc.id, " => ", doc.data());
            usersBtn.appendChild(button);

            getDashboard(doc.data().name)

        });
    });
}
*/

document.addEventListener('click',function(e){
    if(e.target && e.target.className== 'dashboardbtn'){
          console.log('dashboardbtn')
          console.log(e.target.id)
          // get 'people' with this id out of the firestore
          getDashboard(e.target.id)
     }
 });

const getDashboard = (id) => {
    // people with this id
    console.log(id)
    db.collection('Users').doc(localStorage.getItem('userId')).collection('People').doc(id).get()
    .then(function(querySnapshot){
        console.log(querySnapshot.data())
        makeDashboard(querySnapshot.data()) 
        getDashboardSensors(id)
        settings(querySnapshot.data())
        
        activesleeper = id
        notyf.success('geswitched naar ' + id)
    })
}

// get sensordata of current people
const getDashboardSensors = (id) => {
    db.collection('Users').doc(localStorage.getItem('userId')).collection('People').doc(id).collection('Sensors').get()
        .then(function(querySnapshot){
            console.log(querySnapshot)
            // alarm
            console.log(querySnapshot.docs[0].data())
            //hartsensor
            console.log(querySnapshot.docs[1].data())
            //const heartrate = document.getElementById('heartrate');
            //showHeartRate(querySnapshot.docs[1].data().rate)
            //heartrate.innerHTML = querySnapshot.docs[1].data().rate
            //humid
            console.log(querySnapshot.docs[2].data())
            if(querySnapshot.docs[2].data()){
                const humidityValue = document.getElementById('humidityValue');
                humidityValue.innerHTML = querySnapshot.docs[2].data().humid
            }else{
                const humidityValue = document.getElementById('humidityValue');
                humidityValue.innerHTML = 'no value'
            }
            //keypad
            console.log(querySnapshot.docs[3].data())
            //soundSensor
            console.log(querySnapshot.docs[4].data())

            if(querySnapshot.docs[4].data()){
                const sound = document.getElementById('sound');
                sound.innerHTML = querySnapshot.docs[4].data().db
            }else{
                const sound = document.getElementById('sound');
                sound.innerHTML = 'no value'
            }
            //tempSensor
            console.log(querySnapshot.docs[5].data())
            if(querySnapshot.docs[5].data()){
                const temperature = document.getElementById('temperature');
                temperature.innerHTML = querySnapshot.docs[5].data().temp
            }else{
                const temperature = document.getElementById('temperature');
                temperature.innerHTML = 'no value'
            }
            
            //vibratieSensor
            console.log(querySnapshot.docs[6].data())
            //makeDashboard(querySnapshot.data()) 

            getHeartRatePeople(id)
        })
}

// watch changes in heartrate
    const getHeartRatePeople = (id) =>{
        db.collection('Users').doc(localStorage.getItem('userId')).collection('People')
        .doc(id).collection('Sensors').doc('hartSensor').collection('refreshes').orderBy("timestamp", "desc").limit(1)
        .onSnapshot(snapshot => {
            console.log(snapshot.docs[0].data().rate)
            let changes = snapshot.docChanges();
            showHeartRate(snapshot.docs[0].data().rate)
            //console.log(changes.data())
            console.log(changes)
            console.log('refreshes')
        })
    }
    
const getPeople = ()=> {
    // watch changes in people
    db.collection('Users').doc(localStorage.getItem('userId')).collection('People').onSnapshot(snapshot =>{
        console.log('people')
        console.log(snapshot)
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            console.log(change.doc.data())
            if(change.type == 'added'){
                console.log(change.doc.data())
                var button = document.createElement("button");
                button.setAttribute("id", change.doc.data().name );
                button.setAttribute("class", 'dashboardbtn' );
                var name = document.createTextNode(change.doc.data().name); 
                // add the text node to the newly created div
                button.appendChild(name);  
                usersBtn.appendChild(button);

                getDashboard(change.doc.data().name)
                        }
                    })

                })
            }

            getPeople()

/*
* Make personal dashboard with people data
*
*/
const makeDashboard = (data) => {
    console.log('make dashboard')
    console.log(data)
    const peoplename = document.getElementById('peoplename')

    // change innerhtml to the data 
    peoplename.innerHTML = data.name
}

const settings = (data) => {
    console.log(data)
    document.getElementById('userSettings').innerHTML = data.name;
    document.querySelector('.naamSetting').value = data.name;
    document.querySelector('.geslachtSetting').value = data.gender;
    document.querySelector('.leeftijdSetting').value = data.leeftijd;

}


settingsProfileBtn.addEventListener('click', (e) => {
    // make new 'people' in database
    e.preventDefault()
    const name = document.querySelector('.naamSetting').value
    const newgender = document.querySelector('.geslachtSetting').value
    const leeftijd =  document.querySelector('.leeftijdSetting').value
    let hartslagmax =  220 - leeftijd;



   db.collection('Users').doc(localStorage.getItem('userId')).collection('People').doc(name).update({
        name: name,
        gender: newgender,
        leeftijd: leeftijd,
        hartslagmax: hartslagmax
    })
    .catch(function(error) {
        notyf.error("Error adding data: ", error);
    });
    notyf.success('De data is aangepast')
});

newDashboardBtn.addEventListener('click', (e) => {
    // open new dashboard screen
    e.preventDefault()
    console.log('plusbtn');
    chartOverlay.style.display = "none";
    cameraOverlay.style.display = "none";
    mainOverlay.style.display = "none";
    settingsOverlay.style.display ="none";
    newDashboardOverlay.style.display ="block"
})


createBtn.addEventListener('click', (e) => {
    // make new 'people' in database
    e.preventDefault()
    const newname = document.querySelector('#newname').value
    const newgender = document.querySelector('#newgender').value
    const newhartslag = document.querySelector('#newhartslag').value
    const leeftijd = document.querySelector('#leeftijd').value
    let hartslagmax =  220 - leeftijd;
    const userId = firebase.auth().currentUser.uid
    
    db.collection('Users').doc(userId).collection('People').doc(newname).set({
        name: newname,
        gender: newgender,
        hartslag: newhartslag,
        leeftijd: leeftijd,
        hartslagmax: hartslagmax
    })
    .then(function(docRef) {
        //console.log("Document written with ID: ", docRef.id);
        db.collection('Users').doc(userId).collection('People').doc(newname).collection('Sensors').doc('alarmCheck').set({
            alarm: false ,
        }).then(function() {
            notyf.success('New dashboard succesfully made!');
        })

        
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        notyf.error('ohno: ' + error)
    });
    
})



showData();
createSettings();
//showAllHeartRate();


// chart
let hartslagChart;


const getDataChart = () => {

    db.collection('Users').doc(localStorage.getItem('userId')).collection('People')
    .doc(activesleeper).collection('Sensors').doc('hartSensor').collection('refreshes').orderBy("timestamp", "desc").limit(1)
    .limit(1).get().then(function(data){
        console.log(data.docs[0].data().rate)
        // get data from db and give it to hartslag
        hartslagChart = data.docs[0].data().rate
        
    })

    return hartslagChart;
}

var trace1 = {
    y: [getDataChart()],
    type: 'line'
  };
  var cnt = 0
  setInterval(function(){
    Plotly.extendTraces(chart,{y:[[getDataChart()]]}, [0])
    cnt ++;

    if(cnt > 20){
        Plotly.relayout(chart, {
            xaxis : {
                range: [cnt-20,cnt]
            }
        })
    }
},2000)

  var data = [trace1];
  var layout = {
    font: {size: 18},

    margin: {
      l: 50,
      r: 50,
      b: 100,
      t: 100,
      pad: 4
    },
    paper_bgcolor: '#7f7f7f',
    plot_bgcolor: '#c7c7c7'
  };
// make chart

Plotly.newPlot('chart', data, layout, {responsive: true});