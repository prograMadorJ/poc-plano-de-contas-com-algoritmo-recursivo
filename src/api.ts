export const getData = async () => {
  let response = {} as any;
  try {
    response = await fetch('data.json');
  } catch (err) {
    alert(err);
    return [];
  }

  let dataSource = (await response.json()).value as any;

  dataSource.sort(
    (a: { classificacao: number }, b: { classificacao: number }) =>
      a.classificacao > b.classificacao ? -1 : 0
  );

  /**
   *
   *
   * use o comando abaixo para evitar separar os itens, e criar um pai
   * para agrupar os itens orfãos
   * 
   * os itens da estrutura dataSource, a qual deja criar um pai, NÃO deve conter
   * um campo "orfao": true ou "orfao": 1, pode conter "orfao": false, "orfao": 0 
   * ou pode conter o campo "classificacao_pai": null
   *
   * COMANDO:  dataSource = normalize(dataSource, [], null, false, []);
   *
   * Para deixar os itens ofãos externos como itens de cabeçalho
   * use o comando abaixo
   * 
   * o item da estrutura dataSource, a qual deja destacar, deve conter
   * um campo "orfao": true ou "orfao": 1 
   *
   * COMANDO:  dataSource = normalize(dataSource, [], null, true, []);
   * 
   *
   */
  dataSource = normalize(dataSource, [], null, false, []);

  dataSource.data.sort(
    (a: { classificacao: number }, b: { classificacao: number }) =>
      a.classificacao > b.classificacao ? -1 : 0
  );
  dataSource.orfans.sort(
    (a: { classificacao: number }, b: { classificacao: number }) =>
      a.classificacao > b.classificacao ? -1 : 0
  );
  const dataResult = buildData(dataSource.data, [], null, null);
  const dataOrfans = buildData(dataSource.orfans, [], null, null);
  const data = [...dataOrfans, ...dataResult];
  data.sort((a, b) => (a.classificacao > b.classificacao ? -1 : 0));
  return data.reverse();
};

function normalize(
  data: any[],
  normalizedData: any[],
  next: {
    classificacao: string;
    classificacao_pai: any;
    descricao: any;
    orfao: boolean;
    key: any;
  } | null,
  isCaptureOfans: boolean,
  orfans: any[]
) {
  if (next) {
    const splited = next.classificacao.split('.');
    splited.pop();
    const classificacao = next.classificacao_pai ?? splited.join('.');
    const isHead = next.classificacao.length == 1;
    const parent = data.find((s) => s.classificacao == classificacao);
    if ((!parent && !isHead) || next.orfao) {
      if (splited.length) {
        console.warn('item sem pai', JSON.stringify(next, null, 1));

        if (isCaptureOfans) {
          next.orfao = true;
          orfans.push(next);
        } else {
          let findedNewParent = normalizedData.find(s => s.classificacao == classificacao)
          const newParent = findedNewParent ?? makeItem(classificacao, null, next.descricao);
          next.classificacao_pai = newParent.classificacao;

          if (!findedNewParent) {
              data.splice(0, 0, newParent);
          }
        
        }
      }
    } else if (parent && !next.orfao) {
      next.classificacao_pai = parent.classificacao;
    }

    next.key = next.classificacao;
    if (!next.orfao) normalizedData.push(next);
  }

  if (!data.length) {
    orfans.push(
      ...normalizedData.filter((e) => {
        if (
          orfans.some(
            (s) =>
              e.classificacao_pai &&
              e.classificacao_pai.includes(s.classificacao)
          )
        )
          return e;
      })
    );
    normalizedData = normalizedData.filter((e) => {
      if (
        !orfans.some(
          (s) =>
            e.classificacao_pai && e.classificacao_pai.includes(s.classificacao)
        )
      )
        return e;
    });

    return {
      data: normalizedData,
      orfans,
    };
  }

  return normalize(data, normalizedData, data.shift(), isCaptureOfans, orfans);
}

function buildData(
  data: any[],
  list: any[] | any,
  next: null,
  prev: { classificacao: any; children: any[] } | any
) {
  function linkedList() {
    const last = list.at(-1);
    const isParent = last && prev?.classificacao == last.classificacao_pai;

    if (isParent) {
      const item = list.pop();

      sumMonths(prev, item);

      if (!prev?.children) {
        prev.children = [item];
      } else {
        prev.children.push(item);
      }

      return linkedList();
    } else if (prev) {
      list.push(prev);
    }
    return;
  }

  linkedList();

  if (!data.length && !next) {
    return list;
  }

  return buildData(data, list, data.shift(), next);
}

function makeItem(
  classificacao: any,
  classificacao_pai: null,
  descricao: string
) {
  return {
    classificacao,
    classificacao_pai,
    descricao: `*${descricao}`,
    janeiro: 0,
    fevereiro: 0,
    marco: 0,
    abril: 0,
    maio: 0,
    junho: 0,
    julho: 0,
    agosto: 0,
    setembro: 0,
    outubro: 0,
    novembro: 0,
    dezembro: 0,
  };
}

function sumMonths(
  prev: { [x: string]: any },
  item: { [x: string]: any },
  months = [
    'janeiro',
    'fevereiro',
    'marco',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ]
) {
  months.forEach((month) => {
    prev[month] += item[month] ?? 0;
  });
}
