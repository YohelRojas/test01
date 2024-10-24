var db = firebase.apps[0].firestore();
const tabla = document.querySelector('#tabla');

db.collection("datosZodiaco").orderBy('posic', 'asc').get().then(function(query){
    tabla.innerHTML = "";
    var salida = "";
    query.forEach(function(doc){
        const data = doc.data();
        salida += `
            <div class="divAnuncio m-3">
                <div class="imgBlock">
                    <img src="${data.url}" width="100%" alt="Signo Zodiacal"/>
                </div>
                <div>
                    <strong>${data.signo}</strong><br/>
                    ${data.rango}<br/>
                    Elemento: ${data.elemento || 'N/A'}<br/>
                    Astro: ${data.astro || 'N/A'}<br/>
                    Piedra: ${data.piedra || 'N/A'}<br/>
                    <button class="btn btn-primary btn-sm mt-2" onclick="editarSigno('${doc.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm mt-2" onclick="eliminarSigno('${doc.id}')">Eliminar</button>
                </div>
            </div>
        `;
    });
    tabla.innerHTML = salida;
}).catch(function(error) {
    console.error("Error al obtener los datos de los signos: ", error);
    alert("Error al cargar los signos: " + error.message);
});

function editarSigno(id) {
    window.location.href = `editar.html?id=${id}`;
}

function eliminarSigno(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este signo?")) {
        db.collection("datosZodiaco").doc(id).get().then(function(doc) {
            if (doc.exists) {
                const imageUrl = doc.data().url;
                db.collection("datosZodiaco").doc(id).delete()
                    .then(() => {
                        if (imageUrl) {
                            const imageRef = firebase.storage().refFromURL(imageUrl);
                            imageRef.delete()
                                .then(() => {
                                    alert("Signo y su imagen eliminados correctamente.");
                                    window.location.reload(); 
                                })
                                .catch(error => {
                                    console.error("Error al eliminar la imagen: ", error);
                                    alert("Error al eliminar la imagen: " + error.message);
                                });
                        } else {
                            alert("Signo eliminado correctamente. No había imagen asociada.");
                            window.location.reload(); 
                        }
                    })
                    .catch((error) => {
                        console.error("Error al eliminar el signo: ", error);
                        alert("Error al eliminar el signo: " + error.message);
                    });
            } else {
                alert("No se encontró el signo para eliminar.");
            }
        }).catch((error) => {
            console.error("Error obteniendo el documento: ", error);
            alert("Error al obtener los datos del signo: " + error.message);
        });
    }
}
