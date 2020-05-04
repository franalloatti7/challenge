 
--- EJERCICIO 4 - COMPLEJIDAD ALTA: 
--Sobre la consulta anterior (copiar y pegarla y modificarla) modificar la sql para que la consulta retorne solo los cursos cuya cantidad de inscripciones 
--supera su cupo maximo

select CA.nombre as nombre_carrera, CU.nombre as nombre_curso, count(*) as cantidad_inscriptos, CU.cupomaximo as cupo_maximo
from carrera CA join curso CU on CA.identificador = CU.idcarrera
join inscripciones_curso I on CU.identificador = I.idcurso
group by CU.identificador, CU.nombre, CA.nombre
having count(*) > CU.cupomaximo