import React, { useState, Fragment } from "react";

const FormLogin = ({ login }) => {
  const [documento, setDocumento] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeDocumento = (e) => {
    const { value } = e.target;
    setDocumento(value);
  };

  const handleChangePassword = (e) => {
    const { value } = e.target;
    setPassword(value);
  };

  const logine = (e) => {
    e.preventDefault();
    login({ documento, password });
  };

  return (
    <Fragment>
    <div className="container">
      <div className="row">
        <div className="col s5 m5 lg-col-4">
          <div className="card">
            <div className="card-content">
              <form onSubmit={logine}>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      name="documento"
                      onChange={handleChangeDocumento}
                      value={documento}
                      type="text"
                      placeholder="Documento"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      name="password"
                      onChange={handleChangePassword}
                      value={password}
                      type="password"
                      placeholder="Contraseña"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn light-blue btn-dark bg-primary"
                >
                    Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
      </Fragment>
  );
};

export default FormLogin;
