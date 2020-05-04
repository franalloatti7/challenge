 
--- EJERCICIO 2 - COMPLEJIDAD BAJA: 
--Realizar una consulta para consultar todas las carreras a la que un alumno esta inscripto, mostrar: Legajo, nombre, apellido, nombre carrera, fechainscripcioncarrera
--ordenado por legajo descendiente

select A.legajo as legajo_alumno, P.nombre as nombre_alumno, P.apellido as apellido_alumno, C.nombre as nombre_carrera, I.fechainscripcion as fecha_inscripcion
from persona P join alumno A on P.identificador = A.idpersona
join inscripciones_carrera I on A.identificador = I.idalumno
join carrera C on I.idcarrera = C.identificador
order by A.legajo desc