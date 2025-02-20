import Database from "./database";

const AppDataSource = Database.getInstance().getDataSource();

export default AppDataSource;
