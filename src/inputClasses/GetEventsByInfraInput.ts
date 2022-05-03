import { IsInt } from 'class-validator';

class GetEventsByInfraInput {
  @IsInt()
  public id: number;
}

export default GetEventsByInfraInput;
