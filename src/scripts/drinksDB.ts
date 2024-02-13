import Dexie from 'dexie';

const drinks = "Drinks"

class DrinksDB {
  private static instance: DrinksDB;
  private db: Dexie;

  private constructor(databaseName: string) {
    this.db = new Dexie(databaseName);
    if (!(drinks in this.db)) {
        this.db.version(1).stores({ Drinks: '&name, price' });
    }
  }

  static getInstance(databaseName: string): DrinksDB {
    if (!DrinksDB.instance) {
      DrinksDB.instance = new DrinksDB(databaseName);
    }
    return DrinksDB.instance;
  }

  async putDrinksRecord(name: string, price: number): Promise<void> {
    await this.db.table(drinks).put({ name: name, price: price });
  }

  async deleteDrinksRecord(name: string): Promise<void> {
    await this.db.table(drinks).delete(name);
  }

  async getDrinksRecord(name: string): Promise<any> {
    return await this.db.table(drinks).get(name);
  }

  async getAllDrinksRecord(): Promise<any> {
    return await this.db.table(drinks).toArray();
  }
}

// シングルトンインスタンスの作成
const drinkDB = DrinksDB.getInstance('salaryDB');

export default drinkDB;
