import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExampleService } from './example.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('example')
@ApiTags('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un ejemplo' })
  @ApiResponse({ status: 201, description: 'El ejemplo ha sido creado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al crear el ejemplo' })
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.exampleService.create(createExampleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ejemplos' })
  @ApiResponse({ status: 200, description: 'Los ejemplos han sido obtenidos correctamente' })
  @ApiResponse({ status: 400, description: 'Error al obtener los ejemplos' })
  findAll() {
    return this.exampleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ejemplo por su ID' })
  @ApiResponse({ status: 200, description: 'El ejemplo ha sido obtenido correctamente' })
  @ApiResponse({ status: 400, description: 'Error al obtener el ejemplo' })
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ejemplo por su ID' })
  @ApiResponse({ status: 200, description: 'El ejemplo ha sido actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al actualizar el ejemplo' })
  update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.exampleService.update(+id, updateExampleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un ejemplo por su ID' })
  @ApiResponse({ status: 200, description: 'El ejemplo ha sido eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al eliminar el ejemplo' })
  remove(@Param('id') id: string) {
    return this.exampleService.remove(+id);
  }
}
