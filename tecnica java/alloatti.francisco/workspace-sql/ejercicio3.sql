 
--- EJERCICIO 3 - COMPLEJIDAD MEDIA: 
--Realizar una consulta para consultar la cantidad de inscriptos por curso, mostrando: nombre carrera, nombre curso, cantidad inscriptos, cupo máximo por curso

select CA.nombre as nombre_carrera, CU.nombre as nombre_curso, count(*) as cantidad_inscriptos, CU.cupomaximo as cupo_maximo
from carrera CA join curso CU on CA.identificador = CU.idcarrera
join inscripciones_curso I on CU.identificador = I.idcurso
group by CU.identificador, CU.nombre, CA.nombre