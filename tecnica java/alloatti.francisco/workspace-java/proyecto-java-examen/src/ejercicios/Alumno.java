/**
 * 
 */
package ejercicios;

/**
 * A. Crear una clase Alumnno con los siguientes campos
 * (con sus respectivos getters, setters y constructor)
 * 
 * Persona
 * Legajo - Integer
 * 
 *  
 * @author examen
 *
 */
public class Alumno {

	public static Persona persona;
	public static Integer legajo;
	
	
	public static Persona getPersona() {
		return persona;
	}

	public static void setPersona(Persona laPersona) {
		persona = laPersona;
	}

	public static Integer getLegajo() {
		return legajo;
	}

	public static void setLegajo(Integer elLegajo) {
		legajo = elLegajo;
	}

	/**
	 * 
	 */
	public Alumno(Persona persona, Integer legajo) {
		this.persona = persona;
		this.legajo = legajo;
	}
	
	public Alumno() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
