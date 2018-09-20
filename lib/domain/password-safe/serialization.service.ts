export class SerializationService {
  serialize(data: any): string {
    return JSON.stringify(data);
  }

  deserialize(data: string): any {
    return JSON.parse(data);
  }
}
