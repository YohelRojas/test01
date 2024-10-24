
const INACTIVITY_TIME_LIMIT = 3 * 60 * 1000; 
let inactivityTimer;

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logoutUser, INACTIVITY_TIME_LIMIT);
}

function logoutUser() {
    alert('Cerrando sesión por inactividad.');
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html"; 
    }).catch((error) => {
        console.error('Error cerrando sesión: ', error);
    });
}

window.onload = resetInactivityTimer;
document.onmousemove = resetInactivityTimer;
document.onkeypress = resetInactivityTimer;
document.ontouchstart = resetInactivityTimer;
