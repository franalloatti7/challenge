 
--- EJERCICIO 1 - COMPLEJIDAD BAJA: 
--Realizar una consulta para consultar todos los alumnos existentes, mostrar: TipoDoc, Documento, Nombre, Apellido, Legajo.

select P.tipodoc, P.documento, P.nombre, P.apellido, A.legajo
from persona P join alumno A on P.identificador = A.idpersona
