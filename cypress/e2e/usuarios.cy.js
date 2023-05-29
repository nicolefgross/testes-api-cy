/// <reference types="cypress" />

import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     const email = `arieldasilva3${Date.now()}@qa.com.br`
     let id


     it('Deve cadastrar um usuário com sucesso', () => {
          cy.cadastrarUsuario(`Ariel da Silva 3 ${Date.now()}`, email, 'teste', 'true')
               .then((response) => {
                    id = response.body._id
                    expect(response.status).to.equal(201)
                    expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               })
     });

     it('Deve tentar cadastrar usuário com e-mail já cadastrado - cenário negativo', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "José da Silva",
                    "email": email,
                    "password": "teste",
                    "administrador": "true"
               },
               failOnStatusCode: false
          }).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')
          })

     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios',
          }).then((response) => {
               expect(response.status).to.equal(200)
          })
     });

     it('Deve apresentar mensagem de erro ao pesquisar usuário inexistente', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios/LThJuqo8oPngdjQ0',
               failOnStatusCode: false
          }).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Usuário não encontrado')
          })
     });


     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request({
               method: 'PUT',
               url: `usuarios/${id}`,
               body: {
                    "nome": "José da Silva",
                    "email": `joseedasilva_1${Date.now()}@qa.com.br`,
                    "password": "teste",
                    "administrador": "true"
               }
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Registro alterado com sucesso')
          })
     });

     it('Deve editar um usuário previamente cadastrado - cenário negativo', () => {
          const novoEmail = `email_${Date.now()}@email.com`
          cy.cadastrarUsuario(`Ariel da Silva 3 ${Date.now()}`, novoEmail, 'teste', 'true')
               .then((response) => {
                    expect(response.status).to.equal(201)
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         body: {
                              "nome": `José da Silva ${Date.now()}`,
                              "email": novoEmail,
                              "password": "teste",
                              "administrador": "true"
                         },
                         failOnStatusCode: false
                    }).then((response) => {
                         expect(response.status).to.equal(400)
                         expect(response.body.message).to.equal('Este email já está sendo usado')
                    })
               })

     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          cy.request({
               method: 'DELETE',
               url: `usuarios/${id}`
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Registro excluído com sucesso')
          })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then((response) => {
               console.log(response)
               return contrato.validateAsync(response.body)
          })
     });
})
