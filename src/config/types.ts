const TYPES = {
  IUserRepository: Symbol.for('IUserRepository'),
  IUserService: Symbol.for('IUserService'),
  DB: Symbol.for('AppDataSource'),
  MigrationService: Symbol.for('MigrationService'),
  UserController: Symbol.for('UserController'),
};

export default TYPES;
