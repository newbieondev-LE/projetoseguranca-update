const client = require("../../server");

function Estudante(body) {
  this.body = body;
}

Estudante.save = async (body, filename) => {
  try {
    filename = "/assets/img/" + filename;
    await client.query(
      "INSERT INTO estudantes(nome_estudante, email_institucional, cpf, ra, foto, id_responsaveis) VALUES($1,$2,$3,$4,$5,$6)",
      [
        body.nome_estudante,
        body.email_institucional,
        body.cpf,
        body.ra,
        filename,
        body.id_responsaveis,
      ]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.salvarSaida = async (body) => {
  try {
    let horario = await client.query("SELECT CURRENT_TIMESTAMP");
    if (body.liberacao == "on") {
      await client.query("UPDATE estudantes SET saida_anormal = $1", [horario]);
    }
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.update = async (body) => {
  try {
    await client.query(
      "UPDATE estudantes SET nome_estudante = $1, cpf = $2, ra = $3 WHERE ra = $4",
      [body.nome_estudante, body.cpf, body.ra, body.ra2]
    );
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.buscaPorRA = async (body) => {
  try {
    const estudantes = await client.query(
      `SELECT * FROM estudantes WHERE ra = $1 ORDER BY id`,
      [body.ra]
    );
    return estudantes.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.buscaPorCPF = async (body) => {
  try {
    const estudantes = await client.query(
      `SELECT * FROM estudantes WHERE cpf = $1 ORDER BY id`,
      [body.cpf]
    );
    return estudantes.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.buscaPorNome = async(body) => {
  try {
    const estudantes = await client.query(
      `SELECT * FROM estudantes WHERE nome_estudante = $1 ORDER BY id`, [body.nome]
    );
    return estudantes.rows;
  } catch (e) {
    console.log(e)
  }
}

Estudante.buscaEstudantes = async () => {
  try {
    const estudantes = await client.query(
      `SELECT * FROM estudantes ORDER BY id`
    );
    return estudantes.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.buscaHorarios = async (body, filename) => {
  try {
    let estudantes;
    filename = "/assets/img/crachas/" + filename;
    if (filename != 'null') {
      // // criar um leitor de código de barras
    }
    if(body != 'null'){
      if (body.ra != '') {
        estudantes = await client.query(
          `
          SELECT ra, cpf, nome_estudante, nome_disciplina, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, horariosestudantes
          WHERE ra = $1 AND id_estudantes = estudantes.id AND id_horarios = horarios.id AND id_disciplinas = disciplinas.id
          ORDER BY estudantes.id
          `,
            [body.ra]
          );
      }
      if(body.cpf != ''){
        estudantes = await client.query(
          `
          SELECT ra, cpf, nome_estudante, nome_disciplina, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, horariosestudantes
          WHERE cpf = $1 AND id_estudantes = estudantes.id AND id_horarios = horarios.id AND id_disciplinas = disciplinas.id
          ORDER BY estudantes.id
          `,
            [body.cpf]
          );
      }
      if(body.nome != ''){
        estudantes = await client.query(
          `
          SELECT ra, cpf, nome_estudante, nome_disciplina, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, horariosestudantes
          WHERE nome_estudante = $1
          AND id_estudantes = estudantes.id
          AND id_horarios = horarios.id
          AND id_disciplinas = disciplinas.id
          ORDER BY estudantes.id
          `, [body.nome]
        );
      }
    }
    return estudantes.rows;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

Estudante.liberacao = async (body, ra) => {
  try {
    let estudantes;
    if (ra != 'null') {
      console.log(ra)
      estudantes = await client.query(
        `
          SELECT id_estudantes, ra, cpf, nome_estudante, foto, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, horariosestudantes
          WHERE ra = $1 
          AND id_estudantes = estudantes.id
          AND id_horarios = horarios.id
          AND id_disciplinas = disciplinas.id
          ORDER BY estudantes.id
        `,
        [ra]);
    }
    
    if(typeof body == 'object'){
      if(body.nome != 'null'){
        body.nome = body.nome.trim();
        body.nome = body.nome.replace(' ', '%');
        estudantes = await client.query(
          `
          SELECT id_estudantes, ra, cpf, nome_estudante, foto, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, horariosestudantes
          WHERE upper(nome_estudante) LIKE upper('%${body.nome}%')
          AND id_estudantes = estudantes.id
          AND id_horarios = horarios.id
          AND id_disciplinas = disciplinas.id
          ORDER BY estudantes.id
          `
        );
      }
      if(body.cpf != ''){
        body.cpf = body.cpf.trim()
        estudantes = await client.query(
          `
          SELECT id_estudantes, ra, cpf, nome_estudante, foto, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, horariosestudantes
          WHERE cpf = $1 
          AND id_estudantes = estudantes.id
          AND id_horarios = horarios.id
          AND id_disciplinas = disciplinas.id
          ORDER BY estudantes.id
          `,
            [body.cpf]
        );
      }
      if (body.ra != '') {
        body.ra = body.ra.trim()
        estudantes = await client.query(
          `
          SELECT id_estudantes, ra, cpf, nome_estudante, foto, periodo_horarios, dia_semana, tempo_inicio, tempo_fim
          FROM estudantes, horarios, disciplinas, horariosestudantes
          WHERE ra = $1 
          AND id_estudantes = estudantes.id
          AND id_horarios = horarios.id
          AND id_disciplinas = disciplinas.id
          ORDER BY estudantes.id
          `, [body.ra]
        );
      }
    }

    const hoje = new Date();
    let status = [estudantes.rows, { aula: "Estudante sem aula!" }];
    let listaMatutino = [
      { hora: 07, minuto: 00 },
      { hora: 07, minuto: 45 },
      { hora: 08, minuto: 30 },
      { hora: 09, minuto: 15 },
      { hora: 10, minuto: 20 },
      { hora: 11, minuto: 05 },
      { hora: 11, minuto: 50 },
    ];
    let listaVespertino = [
      { hora: 13, minuto: 00 },
      { hora: 13, minuto: 45 },
      { hora: 14, minuto: 30 },
      { hora: 15, minuto: 15 },
      { hora: 16, minuto: 20 },
      { hora: 17, minuto: 05 },
      { hora: 17, minuto: 50 },
    ];
    let listaNoturno = [
      { hora: 19, minuto: 00 },
      { hora: 19, minuto: 45 },
      { hora: 20, minuto: 30 },
      { hora: 21, minuto: 15 },
      { hora: 22, minuto: 20 },
      { hora: 23, minuto: 05 },
      { hora: 23, minuto: 50 },
    ];

    let listas = [listaMatutino, listaVespertino, listaNoturno];

    let diaSemana = [
      "Segunda-Feira",
      "Terça-Feira",
      "Quarta-Feira",
      "Quinta-Feira",
      "Sexta-Feira",
    ];
    let periodo = ["Matutino", "Vespertino", "Noturno"];

    estudantes.rows.forEach((estudante) => {
      for (let i = 1; i < 6; i++) {
        //Define dia da semana
        if (hoje.getDay() == i && estudante.dia_semana == diaSemana[i - 1]) {
          for (let j = 0; j <= 2; j++) {
            //Periodo, matutino, vespertino, noturno
            if (estudante.periodo_horarios == periodo[j]) {
              //Se a aula termina no mesmo tempo que começa
              if(estudante.tempo_inicio == estudante.tempo_fim){
                if(hoje.getHours() == listas[j][estudante.tempo_inicio - 1].hora){
                  //verifica os minutos
                  if (hoje.getMinutes() > listas[j][estudante.tempo_fim - 1].minuto) {
                    status = [estudantes.rows, { aula: "Estudante em aula!" }];
                  }
                }else{
                  status = [estudantes.rows, { aula: "Estudante sem aula!" }];
                }
              }else{
                //horaAtual <= hora que aula termina, e horaAtual >= hora que aula começa
                if (hoje.getHours() >= listas[j][estudante.tempo_inicio - 1].hora && hoje.getHours() <= listas[j][estudante.tempo_fim - 1].hora) {
                  // hora igual a hora que começa
                  if (hoje.getHours() == listas[j][estudante.tempo_inicio - 1].hora) {
                    //verifica os minutos
                    if (hoje.getMinutes() > listas[j][estudante.tempo_fim - 1].minuto) {
                      status = [estudantes.rows, { aula: "Estudante em aula!" }];
                    }
                  }
                } else {
                  status = [estudantes.rows, { aula: "Estudante sem aula!" }];
                }
              }
            }
          }
        }
      }
    });
    status = [estudantes.rows, { aula: "Estudante em aula!" }];
    return status;
  } catch (e) {
    console.log(`Houve um erro ${e}`);
  }
};

module.exports = Estudante;
