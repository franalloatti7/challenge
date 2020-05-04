 
--- EJERCICIO 7 - COMPLEJIDAD BAJA:  
--INSERTAR un nuevo registro de alumno con tus datos personales, (hacer todos inserts que considera necesario)

INSERT INTO public.persona(
	identificador, tipodoc, documento, nombre, apellido, fechanac)
	VALUES (6, 'DNI', 36952027, 'Francisco', 'Alloatti', '1992-06-29');
    
INSERT INTO public.alumno(
	identificador, idpersona, legajo)
	VALUES (6, 6, 22431);