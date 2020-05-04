import React, { useState, Fragment } from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const UPDATE_PASSWORD = gql`
  mutation UpdatePassword(
    $token: String!
    $newpassword: String!
  ) {
    updatePassword(
      token: $token
      newpassword: $newpassword
    ) {
        token
    }
  }
`;

const Changepassword = () => {
  const [token, setToken] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [updatePassword] = useMutation(UPDATE_PASSWORD);
  const handleChangeNewPassword = (e) => {
    const { value } = e.target;
    setNewPassword(value);
  };

  const handleChangeRePassword = (e) => {
    const { value } = e.target;
    setRePassword(value);
    };
    
    const submitForm = (e) => {
        e.preventDefault();
        setToken(sessionStorage.getItem("token"));
        if (newpassword === repassword) {
            updatePassword({
                variables: {
                  token: sessionStorage.getItem("token"),
                  newpassword,
                },
              }).then(({data}) => {
                console.log(data);
              }).catch(({message}) => {
                console.log(message);
              });
        } else {
            alert("Las contraseñas no coinciden");
        }
      };

  return (
    <Fragment>
    <div className="container">
      <div className="row">
        <div className="col s5 m5 lg-col-4">
          <div className="card">
            <div className="card-content">
              <form onSubmit={(e) => {
                submitForm(e);
              }}>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      name="password"
                      onChange={handleChangeNewPassword}
                      value={newpassword}
                      type="password"
                      placeholder="Ingresa tu nueva contraseña"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      name="repassword"
                      onChange={handleChangeRePassword}
                      value={repassword}
                      type="password"
                      placeholder="Repite la Contraseña"
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

export default Changepassword;
