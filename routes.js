const express = require('express');
const multer = require('multer');
const route = express.Router();
const homesController = require('./src/controllers/homesController');
const cadastroController = require('./src/controllers/cadastroController'); 
const administracaoController = require('./src/controllers/administracaoController');

//Rota da home 
route.get('/', homesController.paginaInicial);
//Qual cadastro
route.get('/cadastro', cadastroController.cadastros);
// Cadastros
route.get('/cadastro/curso', cadastroController.cadastroCurso);
route.get('/cadastro/matricula', cadastroController.cadastroMatricula);
route.get('/cadastro/disciplina', cadastroController.cadastroDisciplina);
route.get('/cadastro/horario', cadastroController.cadastroHorario);
route.get('/cadastro/estudante', cadastroController.cadastroEstudante);
route.get('/cadastro/responsavel', cadastroController.cadastroResponsavel);
route.get('/cadastro/horarioestudante', cadastroController.cadastroHorarioEstudante);
route.get('/cadastro/registro', cadastroController.cadastroRegistro);
//Salvando
route.post('/cadastro/cursosalvo', cadastroController.trataPost);
route.post('/cadastro/disciplinasalvo', cadastroController.trataPost);
route.post('/cadastro/horariosalvo', cadastroController.trataPost);
route.post('/cadastro/matriculasalvo', cadastroController.trataPost);
// Configuração de armazenamento de imagens
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/img/')
    },
    filename: function (req, file, cb) {
        // Extração da extensão do arquivo original:
        const extensaoArquivo = file.originalname.split('.')[1];
        // Cria um código randômico que será o nome do arquivo
        const novoNomeArquivo = require('crypto')
            .randomBytes(64)
            .toString('hex');
        // Indica o novo nome do arquivo:
        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
    }
});
let upload = multer({ storage });
route.post('/cadastro/estudantesalvo', upload.single('avatar'), cadastroController.trataPost);
route.post('/cadastro/responsavelsalvo', cadastroController.trataPost);
route.post('/cadastro/horarioestudantesalvo', cadastroController.trataPost);
route.post('/cadastro/registrosalvo', cadastroController.trataPost);

//Rotas do administrador
//Login do Administrador
route.get('/administracao/login', administracaoController.login);
//Horários de todos os alunos cadastrados
route.post('/administracao/paginainicial', administracaoController.paginaAdm);
// Configuração de armazenamento de imagens
storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/img/crachas/')
    },
    filename: function (req, file, cb) {
        // Extração da extensão do arquivo original:
        const extensaoArquivo = file.originalname.split('.')[1];
        // Cria um código randômico que será o nome do arquivo
        const novoNomeArquivo = require('crypto')
            .randomBytes(64)
            .toString('hex');
        // Indica o novo nome do arquivo:
        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
    }
});
upload = multer({ storage });
route.post('/administracao/horarios', upload.single('avatar'), administracaoController.horarios);
route.post('/administracao/requisicoes', administracaoController.requisicoes);
route.post('/administracao/responsavel', administracaoController.responsavel);
route.post('/administracao/editar', administracaoController.editar);
route.post('/administracao/editarSaidaEstudantes', administracaoController.editarSaidaEstudante);
route.post('/administracao/editadoEstudante', administracaoController.trataEditado);
route.post('/administracao/editadoSaida', administracaoController.trataEditado);

module.exports = route;
