import { IsArray, IsDateString, isInt, IsInt, IsString } from 'class-validator';

class ParticipateToEventInput {
  @IsString()
  public userUuid: string;

  @IsInt()
  public eventId: number;
}

export default ParticipateToEventInput;
