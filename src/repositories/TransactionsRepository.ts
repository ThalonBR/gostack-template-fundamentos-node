import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}


class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {

    return this.transactions;


  }

  public getBalance(): Balance {

    const sumIncome: number = this.transactions.filter(item => item.type === 'income').reduce((a, b) => {
      return a + b.value;
    }, 0)

    const sumOutcome: number = this.transactions.filter(item => item.type === 'outcome').reduce((a, b) => {
      return a + b.value;
    }, 0)


    const total: number = sumIncome - sumOutcome;

    const balance = {
      income: sumIncome,
      outcome: sumOutcome,
      total: total,
    }

    return balance;

  }

  private validaOutcome(value: number): boolean {

    const sumIncome: number = this.transactions.filter(item => item.type === 'income').reduce((a, b) => a + b.value, 0);
    const sumOutcome: number = this.transactions.filter(item => item.type === 'outcome').reduce((a, b) => a + b.value, 0)
    return  sumIncome - (sumOutcome + value) < 0 ? false : true;

  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {



    const transaction = new Transaction({ title, type, value });

    if (type === 'outcome' && !this.validaOutcome(value)) {
      throw Error('This transaction can not be completed');
    }


    const sumIncome: number = this.transactions.filter(item => item.type === 'income').reduce((a, b) => {
      return a + b.value;
    }, 0)


    this.transactions.push(transaction)
    return transaction;
  }
}

export default TransactionsRepository;
