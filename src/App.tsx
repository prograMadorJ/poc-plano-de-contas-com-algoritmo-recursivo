import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { getData } from './api';
import { useCallback, useEffect, useState } from 'react';

interface DataType {
  key: React.ReactNode;
  descricao: string;
  classificacao: string;
  janeiro: any;
  children?: DataType[];
}

const formCurrency = (value: any) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);

const columns: TableColumnsType<DataType> = [
  {
    title: 'Classificacao',
    dataIndex: 'classificacao',
    key: 'classificacao',
    width: 700,
    render: (value, record) => `${value} - ${record.descricao}`,
  },
  {
    title: 'Janeiro',
    dataIndex: 'janeiro',
    key: 'janeiro',
    render: (value) => formCurrency(value),
  },
  {
    title: 'fevereiro',
    dataIndex: 'fevereiro',
    key: 'fevereiro',
    render: (value) => formCurrency(value),
  },
  {
    title: 'março',
    dataIndex: 'marco',
    key: 'março',
    render: (value) => formCurrency(value),
  },
  {
    title: 'abril',
    dataIndex: 'abril',
    key: 'abril',
    render: (value) => formCurrency(value),
  },
  {
    title: 'maio',
    dataIndex: 'maio',
    key: 'maio',
    render: (value) => formCurrency(value),
  },
  {
    title: 'junho',
    dataIndex: 'junho',
    key: 'junho',
    render: (value) => formCurrency(value),
  },
  {
    title: 'julho',
    dataIndex: 'julho',
    key: 'julho',
    render: (value) => formCurrency(value),
  },
  {
    title: 'agosto',
    dataIndex: 'agosto',
    key: 'agosto',
    render: (value) => formCurrency(value),
  },
  {
    title: 'setembro',
    dataIndex: 'setembro',
    key: 'setembro',
    render: (value) => formCurrency(value),
  },
  {
    title: 'outubro',
    dataIndex: 'outubro',
    key: 'outubro',
    render: (value) => formCurrency(value),
  },
  {
    title: 'novembro',
    dataIndex: 'novembro',
    key: 'novembro',
    render: (value) => formCurrency(value),
  },
  {
    title: 'dezembro',
    dataIndex: 'dezembro',
    key: 'dezembro',
    render: (value) => formCurrency(value),
  },
];

const App = () => {
  const [dataSource, setDataSource] = useState();

  const handleData = useCallback(async () => {
    return setDataSource((await getData()) as any);
  }, [getData]);

  useEffect(() => {
    handleData();
  }, []);

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: '3000px' }}
      />
    </>
  );
};

export default App;
