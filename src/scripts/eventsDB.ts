import Dexie from "dexie";

const events = "Events";

interface Drinks {
  name: string;
  price: number;
  value: number;
}

class EventsDB {
  private static instance: EventsDB;
  private db: Dexie;

  private constructor(databaseName: string) {
    this.db = new Dexie(databaseName);
    if (!(events in this.db)) {
      this.db.version(1).stores({
        Events: "&start, end, drinks, bookNomination, hallNomination",
      });
    }
  }

  static getInstance(databaseName: string): EventsDB {
    if (!EventsDB.instance) {
      EventsDB.instance = new EventsDB(databaseName);
    }
    return EventsDB.instance;
  }

  async addEventsRecord(
    start: Date,
    end: Date,
    drinks: Drinks[],
    bookNomination: number,
    hallNomination: number
  ): Promise<void> {
    await this.db
      .table(events)
      .add({
        start: start,
        end: end,
        drinks: drinks,
        bookNomination: bookNomination,
        hallNomination: hallNomination,
      });
  }

  async putEventsRecord(
    start: Date,
    end: Date,
    drinks: Drinks[],
    bookNomination: number,
    hallNomination: number
  ): Promise<void> {
    await this.db
      .table(events)
      .put({
        start: start,
        end: end,
        drinks: drinks,
        bookNomination: bookNomination,
        hallNomination: hallNomination,
      });
  }

  async deleteEventsRecord(start: Date): Promise<void> {
    await this.db.table(events).delete(start);
  }

  async getEventsRecord(start: Date): Promise<any> {
    return await this.db.table(events).get(start);
  }

  async getAllEventsRecord(): Promise<any> {
    return await this.db.table(events).toArray();
  }
}

// シングルトンインスタンスの作成
const eventDB = EventsDB.getInstance("eventDB");

export default eventDB;
