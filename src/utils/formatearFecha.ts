export const formatearFecha=(fecha:string)=>{
    const fechaObj = new Date(fecha)
    return fechaObj.toLocaleDateString("es-MX",{
        day:"2-digit",
        month: "long",
    year: "numeric",
    })
}