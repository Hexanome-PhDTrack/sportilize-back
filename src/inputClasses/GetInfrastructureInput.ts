import { IsInt } from 'class-validator';
class GetInfrastructureInput {
  @IsInt()
  public infrastructureId: number;
}

export default GetInfrastructureInput;
