
// id, nome, email, senha e expirado

const emails = [{
    id: 1,
    nome: "João Silva",
    email: "joao.silva@example.com",
    senha: "123456",
    expirado: false
}, {
    id: 2,
    nome: "Maria Souza",
    email: "mariasouza@example.com",
    senha: "123456",
    expirado: false
},

{
    id: 3,
    nome: "Paulo Oliveira",
    email: "paulo.oliveira@example.com",
    senha: "123456",
    expirado: false
},

{
    id: 4,
    nome: "Ana Santos",
    email: "ana.santos@example.com",
    senha: "123456",
    expirado: true
}];

export function obterlogin(email, senha) {
    for (let i = 0; i < emails.length; i++) {
        if (emails[i].email === email && emails[i].expirado === true) {
            throw new Error("Email expirado!");
        }

        if (emails[i].email === email && emails[i].senha === senha) {
            return "Login realizado com sucesso!";
        }

        
        if (emails[i].email === email && emails[i].senha !== senha) {
            throw new Error("Senha incorreta!"); 
        }
    }
    throw new Error("Credenciais inválidas. Tente novamente.");
}