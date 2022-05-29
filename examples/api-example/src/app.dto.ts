import { ApiProperty } from '@nestjs/swagger';

export class ExampleResponseDto {
  @ApiProperty({
    required: true,
    readOnly: true,
    enum: ['success', 'failure'],
    type: String,
  })
  message = 'success';
  @ApiProperty({ required: true, type: Number })
  status = 200;
}
