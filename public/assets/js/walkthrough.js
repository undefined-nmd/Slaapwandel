const db = firebase.firestore()

const nextBtn = document.querySelector('#nextBtn')

nextBtn.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('next')
    makePeople()
})

const makePeople = () => {

    console.log('making people')

    //const userId = firebase.auth().currentUser.uid
    //console.log(userId)

    const name = document.querySelector('#name').value
    const gender = document.querySelector('#gender').value
    const hartslag = document.querySelector('#hartslag').value
    const hartslagmax = document.querySelector('#hartslag-max').value

    db.collection('Users').doc(localStorage.getItem('userId')).collection('People').add({
        name: name,
        gender: gender,
        hartslag: hartslag,
        hartslagmax: hartslagmax
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        //modal.style.display = "block";
        window.location.href = "/index.html";

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}