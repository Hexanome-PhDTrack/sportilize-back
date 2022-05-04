import { IsArray, IsDateString, isInt, IsInt, IsString } from 'class-validator';

class ParticipateAndWithdrawToEventInput {
  @IsString()
  public userUuid: string;

  @IsInt()
  public eventId: number;
}

export default ParticipateAndWithdrawToEventInput;
