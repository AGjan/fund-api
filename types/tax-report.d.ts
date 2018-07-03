declare namespace TaxReport {
    interface FlatTransaction {
      account_id: number;
      account_name: string;
      custody_id: number;
      custody_name: string;
      custody_type: string;
      tax_month: number;
      security_id: number;
      security_name: string;
      // Transaction
      transaction_type: string;
      transaction_date: string;
      // (numbers)
      quantity: number;
      market_value_pc: number;
      buysell: number;
      trancost_pc: number;
      tax_pc: number;
      profit_loss_eq: number;
      profit_loss_cap: number;
      dividend_eq: number;
      dividend_cap: number;
      book_value_pc: number;
      balance: number;
    }
  
    interface Report {
      account: {
        id: number;
        owner: string;
      };
      custodies: Custody[];
    }
  
    interface Custody {
      id: number;
      name: string;
      tax_month: number;
      total: Total;
      securities: Security[];
    }
  
    interface Security {
      id: number;
      name: string;
      total: SecurityTotal;
      transactions: Transaction[];
    }
  
    interface Transaction {
      code: string;
      date: string;
      quantity: number;
      market_value_pc: number;
      buysell: number;
      trancost_pc: number;
      tax_pc: number;
      profit_loss_eq: number;
      profit_loss_cap: number;
      dividend_eq: number;
      dividend_cap: number;
      book_value_pc: number;
      balance: number;
    }
  
    interface Total {
      market_value_pc?: number;
      profit_loss_eq?: number;
      profit_loss_cap?: number;
      dividend_eq?: number;
      dividend_cap?: number;
    }
  
    interface SecurityTotal extends Total {
      balance: number;
    }
  }