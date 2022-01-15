// variables
let data=[]
const formulario = document.querySelector("#form");
console.log("🚀 ~ file: test.js ~ line 4 ~ formulario", formulario)
const form = document.querySelectorAll("form input");
const BotonAgregar = document.querySelector(".btn");
const tabla = document.querySelector("tbody");

// inpust
const articul= document.querySelector("#articulo");
const stockMinimo= document.querySelector("#stock-minimo");
const saldo= document.querySelector("#Saldo");
const unidadMedida= document.querySelector("#unidadMedida");
const Bodega= document.querySelector("#Bodega");
const Observacion= document.querySelector("#Observacion");

//expresiones reg

let RexNOmbre=/^[a-zA-ZÀ-ÿ\s-0-9]{1,40}$/;
let rgAmount =
  /^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/;

  function Producto(id,articulo,Stockminimo,saldo,unidadmedida,bodega,observacion) {
    this.id = id;
    this.articulo = articulo;
    this.Stockminimo = Stockminimo;
    this.saldo = saldo;
    this.unidadmedida = unidadmedida;
    this.bodega = bodega;
    this.observacion = observacion;
  }
  let items=new Producto()
  console.log("🚀 ~ file: test.js ~ line 32 ~ items", items)

// listener
Listener();
function Listener() {
  form.forEach((inpu) => {
    inpu.addEventListener("blur", ValidarGeneral);
  });

  unidadMedida.addEventListener("blur", (e) => {
    if (e.target.value !== "") {

      e.target.classList.add("correcto");
      items.MostrarMensajes("Has seleccionado una unidad de medida","msjBien",e)

    }else{
      e.target.classList.add("error");
      items.MostrarMensajes("No puede estar vacio","Error",e)
      
    }
  });
 
  BotonAgregar.addEventListener("click",(e)=>{
    items.AgregarArticulo(e);
  })
 tabla.addEventListener("click",(e)=>{
  items.EditarProductos(e)

 })
 tabla.addEventListener("click",(e)=>{
items.BorrarData(e)

 })

  document.addEventListener("DOMContentLoaded",()=>{
items.cargarProductos()

  })
}

Producto.prototype.cargarProductos= function (){
  data=JSON.parse(localStorage.getItem("Productos") || [])
InyectarHtml(data);

}
function ValidarGeneral(e) {

  ValidarCampos(e, "articulo",RexNOmbre,"Esta correcto el Articulo !","no es correcto el items !",1,); //articulo
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

   items.MostrarMensajes(mensajeOK,"msjBien",ev)

    } else {

      ev.target.classList.remove("correcto");
      ev.target.classList.add("error");
   

      items.MostrarMensajes(mensajeError,"Error",ev)
    }
  }
}
Producto.prototype.MostrarMensajes=(Mensaje,tipo,ev)=>{
  const Divv=document.createElement("div")

if(tipo==="msjBien"){
  Divv.classList.add("msjBien")
  Divv.textContent=Mensaje
//formulario.insertBefore(Divv,document.querySelector(ref))
const DivvNUmero=document.querySelectorAll(".msjBien")

if(DivvNUmero.length===0){
  formulario.appendChild(Divv)
}


}else if(tipo==="Error"){

  Divv.classList.add("Error")
  Divv.textContent=Mensaje
  //formulario.insertBefore(Divv,document.querySelector(ref))
  const DivvNU=document.querySelectorAll(".Error")
 

if(DivvNU.length===0){
  formulario.appendChild(Divv)
}

}
setTimeout(function() {
  Divv.remove()
  ev.target.classList.remove("error");
  ev.target.classList.remove("correcto");
},2000)
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

//funciones de producto

Producto.prototype.AgregarArticulo= function (e){

  e.preventDefault()
  //console.log(e.target)
const existe=data.some((d)=>d.articulo === articul.value)

if(articul.value !== "" && stockMinimo.value !== "" && saldo.value !== "" && Bodega.value !== "" && Observacion.value !== "" && unidadMedida.value !=="" && existe==false ){

  items=new Producto(Date.now(),articul.value.toUpperCase(), parseInt(stockMinimo.value),parseInt(saldo.value),unidadMedida.value.toUpperCase(),Bodega.value.toUpperCase(),Observacion.value.toUpperCase())

data=[...data,items]

console.log("🚀 ~ file: test.js ~ line 148 ~ data", data)
InyectarHtml(data)
SincronizarST()
formulario.reset();

items.MostrarMensajes("Has agregado un item !","msjBien")
}else if(existe){
  items.MostrarMensajes("Ya existe el articulo.","Error")
 
}else{
  items.MostrarMensajes("Son obligatorios todos los campos.","Error")

}
}

Producto.prototype.EditarProductos=function (e){
  e.preventDefault()
  const IdItems = parseInt(e.target.getAttribute("data-id"));
if(e.target.classList.contains("Editar")){
  if (
    articul.value == "" &&
    stockMinimo.value == "" &&
    saldo.value == "" &&
    unidadMedida.value == "" &&
    Bodega.value == "" &&
    Observacion.value == ""
  ){
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
      unidadMedida.value !== "" &&
      existeName == false
    ) {
      const Nuevadataa = data.map((c) => {
        console.log("desde map")
        tabla.innerHTML=""
        if (c.id === IdItems) {
          c.articulo = articul.value;
          c.Stockminimo = stockMinimo.value;
          c.saldo = saldo.value;
          c.unidadmedida = unidadMedida.value;
          c.bodega = Bodega.value;
          c.observacion = Observacion.value;
          return c;

        } else {
          return c;
        }
      });
      data = [...Nuevadataa];
      InyectarHtml(data);
      items.MostrarMensajes("Has Editado un item !","msjBien")

      console.log("nueva data", Nuevadataa);
      console.log("data", data);
      formulario.reset();
      BotonAgregar.disabled = false;
    }
  }

  SincronizarST()

}

Producto.prototype.BorrarData=function (e){
  const IdItems = parseInt(e.target.getAttribute("data-id"));
  if (e.target.classList.contains("borrar")) {
   data=data.filter((d)=>d.id !==IdItems)
   InyectarHtml(data)
   items.MostrarMensajes("Has Eliminado un item !","msjBien")
  }
  SincronizarST()

}


//inyectar html
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

function SincronizarST(){
  localStorage.setItem("Productos",JSON.stringify(data))
  }



