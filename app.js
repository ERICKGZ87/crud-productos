// variables
let data=[]
const formulario = document.querySelector("#form");
const form = document.querySelectorAll("form input");
const BotonAgregar = document.querySelector(".btn");
const tabla = document.querySelector("tbody");

// inpust
const articul= document.querySelector("#articulo");
const stockMinimo= document.querySelector("#stock-minimo");
const saldo= document.querySelector("#Saldo");
const unidadMedida= document.querySelector("#unidadMedida");
console.log("🚀 ~ file: app.js ~ line 13 ~ unidadMedida", unidadMedida)
const Bodega= document.querySelector("#Bodega");
const Observacion= document.querySelector("#Observacion");

//expresiones reg

let RexNOmbre=/^[a-zA-ZÀ-ÿ\s-0-9]{1,40}$/;
let rgAmount =
  /^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/;


// listener
Listener();
function Listener() {
  form.forEach((inpu) => {
    inpu.addEventListener("blur", ValidarGeneral);
  });

  unidadMedida.addEventListener("blur", (e) => {
    if (e.target.value !== "") {
      e.target.classList.add("correcto");
      msjCorrecto("Esta correcto", 4);
      setTimeout(function () {
       limpiarMsj(unidadMedida, 4);
      }, 3000);
    }else{
      msjError("no puede estar vacio",4)
    }
  });
  BotonAgregar.addEventListener("click",AgregarData)
  tabla.addEventListener("click",EditarData)
  tabla.addEventListener("click",BorrarData)
  document.addEventListener("DOMContentLoaded",IniciarAPP)
}

function IniciarAPP (){

data=JSON.parse(localStorage.getItem("Productos") || [])
InyectarHtml(data);
}


function ValidarGeneral(e) {

  ValidarCampos(e, "articulo",RexNOmbre,"Esta correcto","no es correcto",1); //articulo
  ValidarCampos(e, "stock-minimo",rgAmount,"Esta correcto","no es correcto",2); //stock minimo
  ValidarCampos(e, "Saldo",rgAmount,"Esta correcto","no es correcto",3); //Saldo
  //ValidarCampos(e, "unidadMedida",e.target.value !=="","Esta correcto","no es correcto",4); //unidadMedida
  ValidarCampos(e, "Bodega",RexNOmbre,"Esta correcto","no es correcto",5); //Bodega
  ValidarCampos(e, "Observacion",RexNOmbre,"Esta correcto","no es correcto",6); //Observacion
}

function ValidarCampos(ev, clase,condicion,mensajeOK,mensajeError,n) {

  if (ev.target.classList.contains(clase)) {
    if (condicion.test(ev.target.value)) {
      ev.target.classList.remove("error");
      ev.target.classList.add("correcto");
    msjCorrecto(mensajeOK,n)

    setTimeout(function() {
        limpiarMsj(articul,1)
        limpiarMsj(stockMinimo,2)
        limpiarMsj(saldo,3)
        limpiarMsj(Bodega,5)
        limpiarMsj(Observacion,6)
    },3000)
    } else {

      ev.target.classList.remove("correcto");
      ev.target.classList.add("error");
      msjError(mensajeError,n)

      setTimeout(function() {
        limpiarMsj(articul,1)
        limpiarMsj(stockMinimo,2)
        limpiarMsj(saldo,3)
        limpiarMsj(unidadMedida,4)
        limpiarMsj(Bodega,5)
        limpiarMsj(Observacion,6)
    },3000)
    }
  }
}

function msjCorrecto(msj,n){

    const pmsj=document.querySelector(`#msj${n}`)
    pmsj.classList.remove("msjError")
    pmsj.classList.add("msjBien")
    pmsj.textContent=msj
   
}
function msjError(msj,n){

    const pmsj=document.querySelector(`#msj${n}`)
    pmsj.classList.remove("msjBien")
    pmsj.classList.add("msjError")
    pmsj.textContent=msj
   
}

function limpiarMsj(inpu,n){
    inpu.classList.remove("error")
    inpu.classList.remove("correcto")
    const pmsj=document.querySelector(`#msj${n}`)
    pmsj.textContent=""
}// fin validacion


function AgregarData(e) {
  e.preventDefault();

  const existeName= data.some(d=>d.articulo ===articul.value)// nombre articulo si existe
  const existeId= data.some(d=>d.id ===Date.now())// id articulo si existe
  

  if (articul.value !== "" && stockMinimo.value !== "" && saldo.value !== "" && Bodega.value !== "" && Observacion.value !== "" && unidadMedida.value !=="" && existeName==false && existeId==false) {

    function Producto(
      id,
      articulo,
      Stockminimo,
      saldo,
      unidadmedida,
      bodega,
      observacion
    ) {
      this.id = id;
      this.articulo = articulo;
      this.Stockminimo = Stockminimo;
      this.saldo = saldo;
      this.unidadmedida = unidadmedida;
      this.bodega = bodega;
      this.observacion = observacion;
    }

    const items = new Producto(
      Date.now(),
      articul.value,
      parseInt(stockMinimo.value) ,
      parseInt(saldo.value),
      unidadMedida.value,
      Bodega.value,
      Observacion.value
    );

    data = [...data, items];

    console.log("🚀 ~ file: app.js ~ line 122 ~ AgregarData ~ data", data);

    InyectarHtml(data);
    SincronizarST()
  msjCorrecto("Se agrego el nuevo articulo",7)
  setTimeout(function() {
    limpiarMsj(BotonAgregar,7)
},3000)
  formulario.reset();

  } else if(existeName){
    msjError("Ya existe el articulo.", 7);
    setTimeout(function() {
      limpiarMsj(BotonAgregar,7)
  },3000)
  }
  else {
    msjError("Son obligatorios todos los campos.", 7);
    setTimeout(function() {
      limpiarMsj(BotonAgregar,7)
  },3000)
  }
 
}

function EditarData(e) {
  const IdItems = parseInt(e.target.getAttribute("data-id"));
  console.log("🚀 ~ file: app.js ~ line 188 ~ EditarData ~ IdItems", IdItems);
  e.preventDefault();

  if (e.target.classList.contains("Editar")) {
    if (
      articul.value == "" &&
      stockMinimo.value == "" &&
      saldo.value == "" &&
      unidadMedida.value !== "" &&
      Bodega.value == "" &&
      Observacion.value == ""
    ) {
      console.log("desde llenar campos con datos para editar")
      data.forEach((d) => {
        if (d.id === IdItems) {
          BotonAgregar.disabled = true;
          articul.value = d.articulo;
          stockMinimo.value = d.Stockminimo;
          saldo.value = d.saldo;
          unidadMedida.value = d.unidadmedida;
          Bodega.value = d.bodega;
          Observacion.value = d.observacion;
        }
      });
    }
    const existeName = data.some((d) => d.articulo === articul.value); // nombre articulo si existe
    console.log(existeName);
    if (
      articul.value !== "" &&
      stockMinimo.value !== "" &&
      saldo.value !== "" &&
      Bodega.value !== "" &&
      Observacion.value !== "" &&
      unidadMedida.value !== ""
      //existeName == false
    ) {
      const Nuevadataa = data.map((c) => {
        tabla.innerHTML=""
        if (c.id === IdItems) {
          c.articulo = articul.value;
          c.Stockminimo = stockMinimo.value;
          c.saldo = saldo.value;
          c.unidadmedida = unidadMedida.value;
          c.bodega = Bodega.value;
          c.observacion = Observacion.value;
          msjCorrecto("se edito el articulo",7)
          setTimeout(function() {
            limpiarMsj(BotonAgregar,7)
        },3000)
          return c;

        } else {
          return c;
        }
      });
      data = [...Nuevadataa];
      InyectarHtml(data);

      console.log("nueva data", Nuevadataa);
      console.log("data", data);
    }
  }
  SincronizarST()
}

function BorrarData(e) {
  const IdItems = parseInt(e.target.getAttribute("data-id"));
  if (e.target.classList.contains("borrar")) {
   data=data.filter((d)=>d.id !==IdItems)
   InyectarHtml(data)
   msjCorrecto("se elimino el articulo",7)
   setTimeout(function() {
    limpiarMsj(BotonAgregar,7)
},3000)
  }
  SincronizarST()
}

function SincronizarST(){
localStorage.setItem("Productos",JSON.stringify(data))
}


function InyectarHtml(item){
  tabla.innerHTML=" "
item.forEach((d)=>{ 

  const {id,articulo,Stockminimo,saldo,unidadmedida,bodega,observacion}=d

const row=document.createElement("tr")
row.innerHTML=`<td>${articulo}</td>
<td>${Stockminimo}</td>
<td>${saldo}</td>
<td>${unidadmedida}</td>
<td>${bodega}</td>
<td>${observacion}</td>
<td><a href="" class="Editar" data-id="${id}">Editar</a></td>
<td><a href="" class="borrar msjError" data-id="${id}">Borrar</a></td>
`
tabla.appendChild(row)
})

}




