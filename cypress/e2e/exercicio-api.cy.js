/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contrato'

describe('Testes da Funcionalidade Usuários', () => {
  
  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response =>{
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response)=>{
        expect(response.status).equal(200)
        expect(response.body).to.have.property('usuarios')
            
      }) 
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let usuario = 'Usuario Ebac ' + Math.floor(Math.random() * 10000000)
    let email = Math.floor(Math.random() * 10000000) + '@qa.com'
 
    cy.cadastrarUsuario(usuario,email, 'Teste', 'true')
            .should((response) => {
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.cadastrarUsuario('Fulano da Silva', 'fulano@qa.com','teste','true')
      .should((response) => {
        expect(response.status).equal(400)
        expect(response.body.message).equal('Este email já está sendo usado')
      })  
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let usuario = 'Usuario Ebac ' + Math.floor(Math.random() * 10000000)
    let email = Math.floor(Math.random() * 10000000) + '@qa.com'
    
    cy.cadastrarUsuario(usuario, email, 'Teste', 'true')
      .then(response =>{
        let id = response.body._id
        cy.request({
          method: 'PUT',
          url: `usuarios/${id}`,
          body: {
            "nome": usuario,
            "email": email,
            "password": "Testee",
            "administrador": 'true'
          }
        }).then(response =>{
            expect(response.body.message).equal('Registro alterado com sucesso')
            expect(response.status).equal(200)
          })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let usuario = 'Usuario Ebac ' + Math.floor(Math.random() * 10000000)
    let email = Math.floor(Math.random() * 10000000) + '@qa.com'
    
    cy.cadastrarUsuario(usuario, email, 'Teste', 'true')
      .then(response =>{
        let id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`,
        }).then(response =>{
            expect(response.body.message).equal('Registro excluído com sucesso')
            expect(response.status).equal(200)
          })
    }) 
  });


});
