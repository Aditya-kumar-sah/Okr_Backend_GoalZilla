import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate OKR from user prompt' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'User prompt to generate OKR',
        },
      },
      required: ['prompt'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'OKR generated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  generateOkr(@Body() userPrompt: { prompt: string }) {
    return this.aiService.generateOkr(userPrompt.prompt);
  }
}
