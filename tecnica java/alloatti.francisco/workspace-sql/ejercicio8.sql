 
--- EJERCICIO 8 -  COMPLEJIDAD BAJA: 
-- si se desea comenzar a persistir de ahora en mas el dato de direccion de un alumno y considerando que este es un único cambio string de 200 caracteres.
-- Determine sobre que tabla seria mas conveniente persistir esta información y realizar la modificación de estructuras correspondientes.

-- Creo que seria conveniente persistir esta información en la tabla "persona". Se muestra la modificación a continuación

ALTER TABLE persona 
ADD COLUMN direccion CHARACTER(200);