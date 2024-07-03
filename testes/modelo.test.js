const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro das 10 primeiras perguntas', () => {
  // Cadastrar as 10 primeiras perguntas
  for (let i = 1; i <= 10; i++) {
    modelo.cadastrar_pergunta(`Pergunta ${i}`);
  }

  // Verificar se todas as perguntas foram cadastradas corretamente
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(10);

  for (let i = 0; i < 10; i++) {
    expect(perguntas[i].texto).toBe(`Pergunta ${i + 1}`);
  }
});

test('Testando cadastro de resposta para uma pergunta', () => {
  // Cadastrar uma pergunta
  const id_pergunta = modelo.cadastrar_pergunta('Qual é a capital do Brasil?');

  // Cadastrar uma resposta para a pergunta
  const id_resposta = modelo.cadastrar_resposta(id_pergunta, 'Brasília');

  // Verificar se a resposta foi cadastrada corretamente
  expect(id_resposta).toBeDefined();

  // Verificar se a resposta está listada corretamente junto às respostas da pergunta
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('Brasília');
});

test('Testando recuperação de uma pergunta pelo ID', () => {
  // Cadastrar uma pergunta
  const id_pergunta = modelo.cadastrar_pergunta('Qual é a capital do Brasil?');

  // Recuperar a pergunta pelo ID cadastrado
  const pergunta = modelo.get_pergunta(id_pergunta);

  // Verificar se a pergunta foi recuperada corretamente
  expect(pergunta).toBeDefined();
  expect(pergunta.id_pergunta).toBe(id_pergunta);
  expect(pergunta.texto).toBe('Qual é a capital do Brasil?');
});
