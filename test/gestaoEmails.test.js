import {obterlogin} from "../src/gestaoEmails.js";
import assert from "assert";

describe("Teste de login", () => {
    it("Deve realizar login com sucesso", () => {
        // Arrange
        const email = "joao.silva@example.com";
        const senha = "123456";

        // Act
        const resultado = obterlogin(email, senha);

        // Assert
        assert.equal(resultado, "Login realizado com sucesso!");
    });

    it("Deve lançar erro para email expirado", () => {
        // Arrange
        const email = "ana.santos@example.com";
        const senha = "123456";

        // Act & Assert
        assert.throws(() => obterlogin(email, senha), Error, "Email expirado!");
    });

    it("Deve lançar erro para usuário não encontrado", () => {
        // Arrange
        const email = "emailincorreto@example.com";
        const senha = "123456";

        // Act & Assert
        assert.throws(() => obterlogin(email, senha), Error, "Credenciais inválidas. Tente novamente.");
    });

    it("Deve lançar erro para senha incorreta para o usuário encontrado", () => {
        // Arrange
        const email = "mariasouza@example.com";
        const senha = "654321";

        // Act & Assert
        assert.throws(() => obterlogin(email, senha), Error, "Senha incorreta!");
    });
});