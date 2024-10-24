var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get('id');

const txtPosic = document.querySelector('#txtPosic');
const txtSigno = document.querySelector('#txtSigno');
const txtRango = document.querySelector('#txtRango');
const txtElemento = document.querySelector('#txtElemento');
const txtAstro = document.querySelector('#txtAstro');
const txtPiedra = document.querySelector('#txtPiedra');
const txtArchi = document.querySelector('#txtArchi');
const signoImg = document.querySelector('#signoImg');
const btnUpdate = document.querySelector('#btnUpdate');

db.collection("datosZodiaco").doc(docId).get().then(function(doc) {
    if (doc.exists) {
        const data = doc.data();
        txtPosic.value = data.posic || '';
        txtSigno.value = data.signo || '';
        txtRango.value = data.rango || '';
        txtElemento.value = data.elemento || '';
        txtAstro.value = data.astro || '';
        txtPiedra.value = data.piedra || '';
        signoImg.src = data.url || '';
    } else {
        alert("No se encontró el signo con ese ID.");
    }
}).catch(function(error) {
    console.error("Error obteniendo el documento: ", error);
    alert("Error al obtener los datos: " + error.message);
});

btnUpdate.addEventListener('click', function() {
    const archivo = txtArchi.files[0];
    if (archivo) {
        const nomarch = archivo.name;
        const metadata = { contentType: archivo.type };
        const subir = container.child('zodiaco/' + nomarch).put(archivo, metadata);

        subir
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                actualizarDatos(url);
            })
            .catch(error => {
                console.error("Error al subir la imagen: ", error);
                alert("Error al subir la imagen: " + error);
            });
    } else {
        actualizarDatos();
    }
});

function actualizarDatos(url = null) {
    let updateData = {
        "posic": parseInt(txtPosic.value),
        "signo": txtSigno.value,
        "rango": txtRango.value,
        "elemento": txtElemento.value,
        "astro": txtAstro.value,
        "piedra": txtPiedra.value
    };

    if (url) {
        updateData["url"] = url;
    }

    db.collection("datosZodiaco").doc(docId).update(updateData)
        .then(() => {
            alert("Signo actualizado correctamente.");
            window.location.href = "lista.html";
        })
        .catch((error) => {
            console.error("Error al actualizar el documento: ", error);
            alert("Error al actualizar el signo: " + error.message);
        });
}
