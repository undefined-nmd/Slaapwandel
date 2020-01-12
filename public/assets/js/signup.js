const db = firebase.firestore()

const makeAccountBtn = document.querySelector('#makeAccountBtn')

makeAccountBtn.addEventListener('click', (e) => {
    e.preventDefault()
    getSignup()
})

const getSignup = () => {
//
console.log('sign up')

    const email = document.querySelector('#emailsignup').value
    const password = document.querySelector('#passwordsignup').value

    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(cred => {
        console.log(cred)
        
        db.collection('Users').doc(cred.user.uid).set({
            email: email,
        }).then(()=>{
            localStorage.setItem('userId', cred.user.uid )
            localStorage.setItem('email',email)
    
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
    
                firebase.auth().signInWithEmailAndPassword(email, password)
                console.log(email)
                window.location.href = "/walkthrough.html";
    
            })
            .catch(err => console.error(err))
        }).catch(err => console.error(err))


    })
}