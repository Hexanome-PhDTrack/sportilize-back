import { IsArray, IsDateString, IsInt, IsString } from 'class-validator';

class CloseEventInput {
  @IsInt()
  public eventId: number;

  @IsDateString()
  public endDate: string;

  @IsString()
  public review: string;
}

export default CloseEventInput;
