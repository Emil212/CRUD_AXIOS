const d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

const getAll = async () => {
  try {
    let res = await axios.get("http://localhost:3000/santos"),
      json = await res.data; //Axios nos da la informacion en formato json
    console.log(json);

    json.forEach((el) => {
      $template.querySelector(".name").textContent = el.nombre;
      $template.querySelector(".constellation").textContent = el.constelacion;
      $template.querySelector(".edit").dataset.id = el.id;
      $template.querySelector(".edit").dataset.name = el.nombre;
      $template.querySelector(".edit").dataset.constellation = el.constelacion;
      $template.querySelector(".delete").dataset.id = el.id;
      $template.querySelector(".delete").dataset.name = el.nombre;

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });

    $table.querySelector("tbody").appendChild($fragment);
  } catch (err) {
    let message = err.response.statusText || "Ocurrio un error";
    $table.insertAdjacentHTML(
      "afterend",
      `<p><b>Error ${err.response.status}: ${message}</b></p>`
    );
  }
};

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();

    if (!e.target.id.value) {
      //CREATE - POST
      try {
        let options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            data: JSON.stringify({
              nombre: e.target.nombre.value,
              constelacion: e.target.constelacion.value,
            }),
          },
          res = await axios("http://localhost:3000/santos", options),
          json = await res.data();
        // console.log(json);
        location.reload();
      } catch (err) {
        let message = err.response.statusText || "Ocurrio un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.response.status}: ${message}</b></p>`
        );
      }
    } else {
      //UPDATE - PUT
      try {
        let options = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            data: JSON.stringify({
              nombre: e.target.nombre.value,
              constelacion: e.target.constelacion.value,
            }),
          },
          res = await axios(
            `http://localhost:3000/santos/${e.target.id.value}`,
            options
          ), //traemos el id del formulario
          json = await res.data();
        // console.log(json);
        location.reload();
      } catch (err) {
        let message = err.response.statusText || "Ocurrio un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.response.status}: ${message}</b></p>`
        );
      }
    }
  }
});

d.addEventListener("click", async (e) => {
  if (e.target.matches(".edit")) {
    $title.textContent = "Editar Santo"; //Cambiamos el contenido de texto del titulo
    $form.nombre.value = e.target.dataset.name;
    $form.constelacion.value = e.target.dataset.constellation;
    $form.id.value = e.target.dataset.id;
  }
  if (e.target.matches(".delete")) {
    let isDelete = confirm(
      `¿Estás seguro de que quieres eliminar a ${e.target.dataset.name}?`
    );

    if (isDelete) {
      //DELETE
      try {
        let options = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          },
          res = await axios(
            `http://localhost:3000/santos/${e.target.dataset.id}`,
            options
          ); //traemos el id del del dataset
        location.reload();
      } catch (err) {
        let message = err.response.statusText || "Ocurrio un error";
        alert(`Error ${err.response.status}: ${message}`);
      }
    }
  }
});
