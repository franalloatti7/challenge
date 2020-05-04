 
--- EJERCICIO 6 -  COMPLEJIDAD ALTA: 
-- actualizar todas las fechas de inscripcion a cursados que posean el siguiente error: la fecha de inscripcion al cursado de un 
-- alumno es menor a la fecha de inscripcion a la carrera. La nueva fecha que debe tener es la fecha del dia. Se puede hacer en dos pasos, primero
-- realizando la consulta y luego realizando el update manual

update inscripciones_curso
set fechainscripcion = now() 
from (select ICU.idalumno, ICU.idcurso
    from alumno A join inscripciones_curso ICU on A.identificador = ICU.idalumno
    join curso CU on ICU.idcurso = CU.identificador
    join carrera CA on CA.identificador = CU.idcarrera 
    left join inscripciones_carrera ICA on ICA.idcarrera = CA.identificador and ICA.idalumno = A.identificador
    where ICU.fechainscripcion < ICA.fechainscripcion) as TEMP1
where TEMP1.idalumno = inscripciones_curso.idalumno and TEMP1.idcurso = inscripciones_curso.idcurso