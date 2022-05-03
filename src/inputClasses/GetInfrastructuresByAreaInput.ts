import { IsNumber, IsString } from 'class-validator';
class GetInfrastructuresbyAreaInput {
  @IsNumber()
  public lat: number;

  @IsNumber()
  public long: number;

  @IsNumber()
  public distanceMax: number; // meter
}

export default GetInfrastructuresbyAreaInput;
