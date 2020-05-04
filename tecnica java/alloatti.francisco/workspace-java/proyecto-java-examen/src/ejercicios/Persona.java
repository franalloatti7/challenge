package ejercicios;

//import java.sql.Date;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;  

/**
 * A. Crear una clase Persona con los siguientes campos
 * (con sus respectivos getters, setters y constructor)
 * 
 * TipoDocumento - enum (dni/libretacivica) 
 * NroDocumento - Integer
 * Nombre - String
 * Apellido - String
 * FechaNacimiento - Date
 * 
 * B. En el método main de la clase "Ejercicio2" crear una nueva instancia
 * de la clase persona y settearle valores reales con tus datos
 * 
 * 
 * C. En el método main de la clase "Ejercicio 2" imprimir los valores en 
 * consola 
 * (crear método main e imprimir valores) 
 *  
 * @author examen
 *
 */
public class Persona {

	public enum TipoDoc {
		DNI,LIBRETACIVICA;
	}
	public TipoDoc TipoDocumento;
	public static Integer NroDocumento;
	public static String Nombre;
	public static String Apellido;
	public static Date FechaNacimiento;
	
	public Persona() {
		// TODO Auto-generated constructor stub
	}
	
	public Persona(TipoDoc tipoDoc, Integer nroDoc, String nombre, String apellido, Date df) {
		this.TipoDocumento = tipoDoc;
		this.NroDocumento = nroDoc;
		this.Nombre = nombre;
		this.Apellido = apellido;
		this.FechaNacimiento = df;
	}
	
	public TipoDoc getTipoDocumento() {
		return TipoDocumento;
	}

	public void setTipoDocumento(TipoDoc tipoDocumento) {
		TipoDocumento = tipoDocumento;
	}

	public static Integer getNroDocumento() {
		return NroDocumento;
	}

	public static void setNroDocumento(Integer nroDocumento) {
		NroDocumento = nroDocumento;
	}

	public static String getNombre() {
		return Nombre;
	}

	public static void setNombre(String nombre) {
		Nombre = nombre;
	}

	public static String getApellido() {
		return Apellido;
	}

	public static void setApellido(String apellido) {
		Apellido = apellido;
	}

	public static Date getFechaNacimiento() {
		return FechaNacimiento;
	}

	public static void setFechaNacimiento(Date fechaNacimiento) {
		FechaNacimiento = fechaNacimiento;
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		
		SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
		Date date = new Date();
		try {
			date = df.parse("29/06/1992");
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		Persona ejercicio2 = new Persona(TipoDoc.valueOf("DNI"), 36952027, "Francisco", "Alloatti", date);

		System.out.println("Tipo de Documento: " + ejercicio2.getTipoDocumento().toString());
		System.out.println("Numero de Documento: " + ejercicio2.getNroDocumento().toString());
		System.out.println("Nombre: " + ejercicio2.getNombre().toString());
		System.out.println("Apellido: " + ejercicio2.getApellido().toString());
		System.out.println("Fecha de Nacimiento: " + df.format(ejercicio2.getFechaNacimiento()));
	}

}
