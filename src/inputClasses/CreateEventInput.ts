import { IsArray, IsDateString, IsInt, IsString } from 'class-validator';

class CreateEventInput {
  @IsInt()
  public infrastructureId: number;

  @IsInt()
  public nbMaxParticipants: number;

  @IsArray()
  public sports: string[];

  @IsString()
  public description: string;

  @IsDateString()
  public beginDate: string;

  @IsDateString()
  public endDate: string;
}

export default CreateEventInput;
