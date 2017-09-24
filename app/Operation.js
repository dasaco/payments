class Operation {
  constructor(date, userId, userType, type, operation) {
    this.date = date;
    this.user_id = userId;
    this.user_type = userType;
    this.type = type;
    this.operation = operation;
  }
}

module.exports = Operation;
