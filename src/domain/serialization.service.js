class SerializationService {
  serialize(data) {
    return JSON.stringify(data);
  }

  deserialize(data) {
    return JSON.parse(data);
  }
}

module.exports = SerializationService;
